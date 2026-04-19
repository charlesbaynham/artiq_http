# Skip Unchanged Test Image Build — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use the Nix derivation hash as the Docker image tag so `build-test-master` skips the push when the image already exists in the registry, and `pytest` pulls the correct image by hash.

**Architecture:** The Nix flake already computes a content-addressed hash from all inputs (`flake.nix`, `flake.lock`, source files, pinned nixpkgs, etc.). We extract this hash from `.#docker.outPath`, tag the image with it, check the registry, and push only on miss. The hash is passed to `pytest` via a dotenv artifact so the `services:` block can reference the exact image.

**Tech Stack:** GitLab CI, Nix flakes, Docker

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `test-artiq/flake.lock` | Create | Pins flake inputs so the Nix hash is reproducible across runs |
| `.gitlab-ci.yml` | Modify | Update `build-test-master` and `pytest` jobs to use hash-based tagging |

---

### Task 1: Commit `test-artiq/flake.lock`

**Files:**
- Create: `test-artiq/flake.lock`

**Context:**
The `flake.lock` was auto-generated when `nix eval .#docker.outPath` ran during design exploration. It pins `nixpkgs`, `flake-utils`, and `artiq-extrapkg` to exact revisions, which is required for the derivation hash to be stable.

- [ ] **Step 1: Verify the lockfile exists and is valid**

Run:
```bash
cd test-artiq
ls -la flake.lock
```

Expected: File exists with non-zero size.

- [ ] **Step 2: Stage and commit**

```bash
git add test-artiq/flake.lock
git commit -m "chore: add flake.lock for reproducible Nix builds"
```

---

### Task 2: Update `build-test-master` job in `.gitlab-ci.yml`

**Files:**
- Modify: `.gitlab-ci.yml:49-72`

**Context:**
Replace the unconditional build/tag/push with a flow that:
1. Builds the image (fast cache hit if unchanged)
2. Extracts the Nix store hash from `outPath`
3. Checks the registry for that tag
4. Loads, tags, and pushes only if the tag is missing
5. Writes the hash to a dotenv artifact so `pytest` can use it

The hash extraction uses pure shell (`tr`, `tail`, `cut`) — no `jq` needed.

- [ ] **Step 1: Replace the `build-test-master` job**

Replace lines 49-72 with:

```yaml
# Build the test master image using Nix
build-test-master:
  stage: Prepare
  image: nixos/nix:latest
  services:
    - docker:dind
  variables:
    NIX_CONFIG: |
      experimental-features = nix-command flakes
      accept-flake-config = true
    DOCKER_DRIVER: overlay2
    DOCKER_TLS_CERTDIR: ""
    DOCKER_HOST: tcp://docker:2375
  before_script:
    - nix-env -iA nixpkgs.docker
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - cd test-artiq
    - nix build .#docker --accept-flake-config
    - |
      HASH=$(nix eval --json .#docker.outPath | tr '/' '\n' | tail -1 | cut -d'-' -f1)
      echo "ARTIQ_TEST_MASTER_HASH=$HASH" >> build.env
      echo "Image hash: $HASH"
    - |
      if docker manifest inspect $CI_REGISTRY_IMAGE/test-master:$ARTIQ_TEST_MASTER_HASH > /dev/null 2>&1; then
        echo "Image already in registry, skipping push"
      else
        docker load < result
        docker tag artiq-test-master:latest $CI_REGISTRY_IMAGE/test-master:$ARTIQ_TEST_MASTER_HASH
        docker push $CI_REGISTRY_IMAGE/test-master:$ARTIQ_TEST_MASTER_HASH
      fi
  tags:
    - docker
  needs: []
  artifacts:
    reports:
      dotenv: test-artiq/build.env
```

- [ ] **Step 2: Verify YAML syntax**

Run:
```bash
# If you have a YAML linter available
yamllint .gitlab-ci.yml || true
# Or at least check for obvious issues
git diff -- .gitlab-ci.yml
```

Expected: No syntax errors, `build-test-master` block is valid YAML.

- [ ] **Step 3: Commit**

```bash
git add .gitlab-ci.yml
git commit -m "ci: skip test-master build when image already in registry

Use Nix derivation hash as image tag. Only push if the tag is missing
from the registry. Passes the hash to pytest via dotenv artifact."
```

---

### Task 3: Update `pytest` job to use hash-tagged image

**Files:**
- Modify: `.gitlab-ci.yml:74-105`

**Context:**
`pytest` currently pulls `$CI_REGISTRY_IMAGE/test-master:$CI_COMMIT_REF_SLUG`. It must now pull by the Nix hash so it gets the exact image that `build-test-master` built (or verified exists). The dotenv artifact from `build-test-master` makes `ARTIQ_TEST_MASTER_HASH` available here, including in the `services:` block expansion.

- [ ] **Step 1: Update the service image reference**

Change line 78 from:
```yaml
    - name: $CI_REGISTRY_IMAGE/test-master:$CI_COMMIT_REF_SLUG
```

to:
```yaml
    - name: $CI_REGISTRY_IMAGE/test-master:$ARTIQ_TEST_MASTER_HASH
```

- [ ] **Step 2: Verify the change**

Run:
```bash
git diff -- .gitlab-ci.yml
```

Expected: Only line 78 changed; `pytest` still has `needs: ["build-test-master"]`.

- [ ] **Step 3: Commit**

```bash
git add .gitlab-ci.yml
git commit -m "ci: pull test-master image by Nix hash in pytest"
```

---

### Task 4: Local verification of hash extraction

**Files:**
- None (verification only)

**Context:**
Before pushing, confirm the hash extraction command works in your local Nix environment.

- [ ] **Step 1: Run the extraction command**

```bash
cd test-artiq
nix build .#docker --accept-flake-config
nix eval --json .#docker.outPath | tr '/' '\n' | tail -1 | cut -d'-' -f1
```

Expected: A 32-character alphanumeric string (e.g., `pcs86f07jzdpjcqnnpx7kn5aaak88q7w`).

- [ ] **Step 2: Confirm determinism**

Run the extraction command again without changing any files.

Expected: Same hash.

- [ ] **Step 3: Confirm sensitivity**

Touch a tracked file in `test-artiq/repository/` and re-run.

Expected: Different hash.

```bash
touch test-artiq/repository/some_file.py
nix eval --json .#docker.outPath | tr '/' '\n' | tail -1 | cut -d'-' -f1
# Should be different
git checkout -- test-artiq/repository/some_file.py  # clean up
```

---

## Spec Coverage Check

| Spec Requirement | Implementing Task |
|------------------|-------------------|
| Use Nix derivation hash as Docker image tag | Task 2 |
| Skip push when image already exists in registry | Task 2 |
| `pytest` uses hash-tagged image | Task 3 |
| Ensure `flake.lock` exists for reproducible hashing | Task 1 |
| Pass hash between jobs | Task 2 (dotenv artifact) |

## Placeholder Scan

- No "TBD", "TODO", or vague steps.
- No "add appropriate error handling" without specifics.
- No "similar to Task N" references.
- Exact file paths and line numbers included.
- Exact shell commands with expected output.

## Type / Consistency Check

- Variable name `ARTIQ_TEST_MASTER_HASH` used consistently in Task 2 (export) and Task 3 (consumption).
- `docker manifest inspect` exit code logic handles both success (image exists) and failure (image missing).
- `needs: ["build-test-master"]` preserved in `pytest` so dotenv artifact is available.
