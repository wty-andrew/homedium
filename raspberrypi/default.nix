{ pkgs ? import <nixpkgs> }:
pkgs.buildGoModule {
  pname = "homedium-rpi";
  version = "0.0.0";
  src = ./.;
  vendorHash = null;
}
