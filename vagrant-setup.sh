#!/usr/bin/env bash

set -o nounset
set -o errexit
set -o pipefail
IFS=$'\n\t'

main(){
  echo "hello!"

  sudo dnf install --assumeyes wget

  mkdir -p ~/bin
  wget https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 -O ~/bin/jq
  chmod u+x ~/bin/jq
  chown -R vagrant:vagrant ~/bin

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
  # echo "installing sqlite3"
  # wget https://sqlite.org/2021/sqlite-tools-linux-x86-3340100.zip -O ~/sqlite-tools-linux-x86-3340100.zip
  # openssl dgst -sha3-256 ~/sqlite-tools-linux-x86-3340100.zip
  # echo "should match: fc326726b5f5565636a526777bdc10de99bdeb19228055411ae5123116cc2cb2"
  # from https://sqlite.org/download.html
  # sha3sum explanation: https://sqlite.org/forum/info/34c57ee9b45390ea

  # preinstalled in centos 8
  which sqlite3
  sqlite3 -version
}

install_flywaydb(){
  echo "installing flyway db"
  wget -qO- https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/7.5.4/flyway-commandline-7.5.4-linux-x64.tar.gz | tar xvz && sudo ln -sf `pwd`/flyway-7.5.4/flyway /usr/local/bin

  which flyway
  flyway -v
}

install_litestream(){
  echo "installing litestream"

  wget https://github.com/benbjohnson/litestream/releases/download/v0.3.2/litestream-v0.3.2-linux-amd64.tar.gz
  tar -xf litestream-v0.3.2-linux-amd64.tar.gz -C ~/bin/

  which litestream
  litestream version
}

main
