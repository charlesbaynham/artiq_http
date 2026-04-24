{
  description = "ARTIQ Test Master Environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    artiq-extrapkg = {
      url = "git+https://git.m-labs.hk/M-Labs/artiq-extrapkg.git?ref=release-9";
    };
  };

  outputs = { self, nixpkgs, flake-utils, artiq-extrapkg }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        artiq = artiq-extrapkg.packages.${system}.artiq;

        # Create a derivation for the ARTIQ repository files
        artiq-repo = pkgs.stdenv.mkDerivation {
          name = "artiq-repo";
          src = ./.;
          installPhase = ''
            mkdir -p $out/artiq
            cp -r repository $out/artiq/
            cp device_db.py $out/artiq/
          '';
        };
      in rec {
        packages.default = packages.docker;
        packages.docker = pkgs.dockerTools.buildImage {
          name = "artiq-test-master";
          tag = "latest";

          copyToRoot = pkgs.buildEnv {
            name = "image-root";
            paths = [ artiq artiq-repo ];
          };

          config = {
            Cmd = [ "artiq_master" "-r" "repository" "--bind" "*" "-vv" ];
            ExposedPorts = {
              "1066/tcp" = {};
              "1067/tcp" = {};
              "3250/tcp" = {};
              "3251/tcp" = {};
            };
            WorkingDir = "/artiq";
          };
        };

        devShells.default = pkgs.mkShell {
          packages = [ artiq pkgs.git pkgs.python313Packages.pip ];
          shellHook = ''
            VENV_DIR="$PWD/.artiq-venv"
            if [ ! -d "$VENV_DIR" ]; then
              echo "Creating Python venv..."
              python3 -m venv "$VENV_DIR"
              "$VENV_DIR/bin/pip" install --quiet git+https://github.com/OxfordIonTrapGroup/oitg.git
              "$VENV_DIR/bin/pip" install --quiet git+https://github.com/OxfordIonTrapGroup/ndscan.git
            fi
            export PATH="$VENV_DIR/bin:$PATH"
            export PYTHONPATH="$VENV_DIR/lib/python3.13/site-packages:$PYTHONPATH"
            echo "ARTIQ test environment ready."
            echo "Run: artiq_master -r repository --bind '*' -vv"
          '';
        };
      });

  nixConfig = {
    extra-trusted-public-keys = "nixbld.m-labs.hk-1:5aSRVA5b320xbNvu30tqxVPXpld73bhtOeH6uAjRyHc=";
    extra-substituters = "https://nixbld.m-labs.hk";
  };
}
