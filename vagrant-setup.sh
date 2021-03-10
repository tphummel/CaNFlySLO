#!/usr/bin/env bash

set -o nounset
set -o errexit
set -o pipefail
IFS=$'\n\t'

main(){
  echo "hello!"

  sudo dnf install --assumeyes wget

  mkdir -p /home/vagrant/bin
  wget https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 -O /home/vagrant/bin/jq
  chmod u+x /home/vagrant/bin/jq
  chown -R vagrant:vagrant /home/vagrant/bin

  install_caddy
  install_nodejs
  install_sqlite3
  install_flywaydb
  install_litestream
  install_prometheus
  install_cockpit
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

  # needed for local ca actions
  sudo dnf --assumeyes install nss-tools

  # allow caddy to run as non-root and still bind port 80 and 443
  sudo setcap cap_net_bind_service=+ep /usr/bin/caddy

  sudo cp /vagrant/caddy.vagrant.service /etc/systemd/system/caddy.service
  sudo systemctl daemon-reload
  sudo systemctl enable --now caddy.service
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
  # wget https://sqlite.org/2021/sqlite-tools-linux-x86-3340100.zip -O /home/vagrant/sqlite-tools-linux-x86-3340100.zip
  # openssl dgst -sha3-256 /home/vagrant/sqlite-tools-linux-x86-3340100.zip
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
  tar -xf litestream-v0.3.2-linux-amd64.tar.gz -C /home/vagrant/bin/

  which litestream
  litestream version
}

install_cockpit(){
  echo "installing cockpit"

  sudo dnf --assumeyes install cockpit
  sudo systemctl enable --now cockpit.socket
}

install_prometheus(){
  wget https://github.com/prometheus/prometheus/releases/download/v2.25.0/prometheus-2.25.0.linux-amd64.tar.gz
  tar -xf prometheus-2.25.0.linux-amd64.tar.gz
  sudo mv /home/vagrant/prometheus-2.25.0.linux-amd64/prometheus /usr/local/bin/prometheus
  mkdir /home/vagrant/prometheus/

  which prometheus
  prometheus --version

  sudo cp /vagrant/prometheus.vagrant.service /etc/systemd/system/prometheus.service
  sudo chown root:root /etc/systemd/system/prometheus.service
  sudo chmod 0644 /etc/systemd/system/prometheus.service

  sudo systemctl daemon-reload
  sudo systemctl enable --now prometheus.service

  wget https://github.com/prometheus/node_exporter/releases/download/v1.1.2/node_exporter-1.1.2.linux-amd64.tar.gz
  tar xvfz node_exporter-1.1.2.linux-amd64.tar.gz
  sudo mv /home/vagrant/node_exporter-1.1.2.linux-amd64/node_exporter /usr/local/bin/node_exporter

  which node_exporter
  node_exporter --version

  sudo cp /vagrant/node_exporter.vagrant.service /etc/systemd/system/node_exporter.service
  sudo chown root:root /etc/systemd/system/node_exporter.service
  sudo chmod 0644 /etc/systemd/system/node_exporter.service

  sudo systemctl daemon-reload
  sudo systemctl enable --now node_exporter.service
}

main
