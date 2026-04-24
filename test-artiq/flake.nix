{
  inputs = {
    extrapkg.url =
      "git+https://git.m-labs.hk/M-Labs/artiq-extrapkg.git?ref=release-9";
    flake-utils.url = "github:numtide/flake-utils";
    ndscan-src = {
      url = "github:OxfordIonTrapGroup/ndscan";
      flake = false;
    };
    oitg-src = {
      url = "github:OxfordIonTrapGroup/oitg";
      flake = false;
    };
  };
  outputs = { self, extrapkg, flake-utils, ndscan-src, oitg-src }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = extrapkg.pkgs;
        artiq = extrapkg.packages.${system};
        py = pkgs.python3;

        oitg = py.pkgs.buildPythonPackage {
          pname = "oitg";
          version = "0.1.0";
          src = oitg-src;
          pyproject = true;
          postPatch = ''
            substituteInPlace pyproject.toml \
              --replace-warn \
                'requires = ["poetry-core>=1.0.0", "poetry-dynamic-versioning"]' \
                'requires = ["poetry-core>=1.0.0"]' \
              --replace-warn 'version = "0.1"' 'version = "0.1.0"'
          '';
          build-system = with py.pkgs; [ poetry-core ];
          dependencies = with py.pkgs; [ statsmodels scipy numpy h5py ];
          doCheck = false;
        };

        ndscan = py.pkgs.buildPythonPackage {
          pname = "ndscan";
          version = "0.4.0";
          src = ndscan-src;
          pyproject = true;
          build-system = with py.pkgs; [ hatchling ];
          dependencies = with py.pkgs; [
            artiq.artiq
            h5py
            numpy
            oitg
            pyqt6
            pyqtgraph
            qasync
          ];
          doCheck = false;
        };
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
            (py.withPackages (ps: [
              # List desired Python packages here.
              artiq.artiq
              ps.paramiko # needed if and only if flashing boards remotely (artiq_flash -H)
              artiq.flake8-artiq
              ndscan
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
