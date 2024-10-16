{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      pkgs-aarch64 = import nixpkgs {
        system = "aarch64-linux";

        crossSystem = {
          config = "aarch64-unknown-linux-gnu";
        };
      };
    in
    {
      packages.aarch64-linux = {
        default = pkgs-aarch64.callPackage ./raspberrypi { };
      };
    };
}
