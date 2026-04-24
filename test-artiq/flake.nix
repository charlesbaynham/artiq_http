{
  inputs = {
    extrapkg.url =
      "git+https://git.m-labs.hk/M-Labs/artiq-extrapkg.git?ref=release-9";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, extrapkg, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = extrapkg.pkgs;
        artiq = extrapkg.packages.${system};
        artiq-repo = pkgs.stdenv.mkDerivation {
          name = "artiq-repo";
          src = ./.;
          installPhase = ''
            mkdir -p $out/artiq
            cp -r repository $out/artiq/
            cp device_db.py $out/artiq/
          '';
        };

        artiqEnv = pkgs.buildEnv {
          name = "artiq-env";
          paths = [
            (pkgs.python3.withPackages (ps: [
              # List desired Python packages here.
              artiq.artiq
              ps.paramiko # needed if and only if flashing boards remotely (artiq_flash -H)
              artiq.flake8-artiq
            ]))
          ];
        };
      in {
        packages.default = artiqEnv;

        packages.docker = pkgs.dockerTools.buildImage {
          name = "artiq-test-master";
          tag = "latest";

          copyToRoot = pkgs.buildEnv {
            name = "image-root";
            paths = [ artiq-repo ];
          };

          config = {
            Cmd = [
              "${artiqEnv}/bin/artiq_master"
              "-r"
              "repository"
              "--bind"
              "*"
              "-vv"
            ];
            ExposedPorts = {
              "1066/tcp" = { };
              "1067/tcp" = { };
              "3250/tcp" = { };
              "3251/tcp" = { };
            };
            WorkingDir = "/artiq";
          };
        };
      });

  # This section configures additional settings to be able to use M-Labs binary caches
  nixConfig = { # work around https://github.com/NixOS/nix/issues/6771
    extra-trusted-public-keys =
      "nixbld.m-labs.hk-1:5aSRVA5b320xbNvu30tqxVPXpld73bhtOeH6uAjRyHc=";
    extra-substituters = "https://nixbld.m-labs.hk";
  };
}
