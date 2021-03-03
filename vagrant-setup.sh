#!/usr/bin/env bash

set -o nounset
set -o errexit
set -o pipefail
IFS=$'\n\t'

main(){
  echo "hello!"
  install_caddy
  install_nodejs
  install_sqlite3
  install_flywaydb
  install_litestream
  echo "cleaning up!"
}

install_caddy(){
  # https://caddyserver.com/docs/install#fedora-redhat-centos
  echo "installing caddy"
  sudo dnf --assumeyes install 'dnf-command(copr)'
  sudo dnf --assumeyes copr enable @caddy/caddy
  sudo dnf --assumeyes install caddy
  which caddy
  caddy version
}

install_nodejs(){
  # https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-centos-8
  echo "installing node.js"
  sudo dnf --assumeyes module enable nodejs:14
  sudo dnf --assumeyes install nodejs
  which node
  node --version
}

install_sqlite3(){
  echo "installing sqlite3"

}

install_flywaydb(){
  echo "installing flyway db"

}

install_litestream(){
  echo "installing litestream"
}

main
