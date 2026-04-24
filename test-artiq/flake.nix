{
  inputs.extrapkg.url =
    "git+https://git.m-labs.hk/M-Labs/artiq-extrapkg.git?ref=release-9";
  outputs = { self, extrapkg }:
    let
      pkgs = extrapkg.pkgs;
      artiq = extrapkg.packages.x86_64-linux;
      artiq-repo = pkgs.stdenv.mkDerivation {
        name = "artiq-repo";
        src = ./.;
        installPhase = ''
          mkdir -p $out/artiq
          cp -r repository $out/artiq/
          cp device_db.py $out/artiq/
        '';
      };
    in {
      # This section defines the new environment
      packages.x86_64-linux.default = pkgs.buildEnv {
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
            "1066/tcp" = { };
            "1067/tcp" = { };
            "3250/tcp" = { };
            "3251/tcp" = { };
          };
          WorkingDir = "/artiq";
        };
      };

    };
  # This section configures additional settings to be able to use M-Labs binary caches
  nixConfig = { # work around https://github.com/NixOS/nix/issues/6771
    extra-trusted-public-keys =
      "nixbld.m-labs.hk-1:5aSRVA5b320xbNvu30tqxVPXpld73bhtOeH6uAjRyHc=";
    extra-substituters = "https://nixbld.m-labs.hk";
  };
}
