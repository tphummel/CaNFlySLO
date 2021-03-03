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
  echo "installing caddy"
}

install_nodejs(){
  echo "installing node.js"
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
