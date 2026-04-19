# Skip Unchanged Test Image Build

## Problem

The `build-test-master` CI job rebuilds and pushes the test Docker image on every commit, even when the image inputs have not changed. This wastes time.

## Solution

Use the Nix derivation hash as the Docker image tag. Nix computes this from all inputs (`flake.nix`, `flake.lock`, source files, pinned nixpkgs, etc.), so identical inputs produce identical hashes.

## CI Flow

### `build-test-master` job

1. `nix build .#docker --accept-flake-config`
   Builds the image. If the derivation has been built before, it loads from cache instantly.

2. Extract the hash from `outPath`
   `outPath` has the form `/nix/store/<hash>-docker-image`. Extract `<hash>`.

3. Check registry
   `docker manifest inspect $CI_REGISTRY_IMAGE/test-master:$hash`

4. Push only if missing
   If the manifest check fails, `docker load < result`, tag, and push.

### `pytest` job

- Reference the image via `$CI_REGISTRY_IMAGE/test-master:$ARTIQ_TEST_MASTER_HASH` (passed from `build-test-master`)

## Files Changed

- `.gitlab-ci.yml` — update `build-test-master` and `pytest` jobs
- `test-artiq/` — ensure `flake.lock` exists (required for reproducible hashing)

## Tags

- Only the hash tag is used. Branch/commit tags are no longer pushed.
