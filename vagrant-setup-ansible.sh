#!/usr/bin/env bash

set -o nounset
set -o errexit
set -o pipefail
IFS=$'\n\t'

main(){
  sudo dnf makecache
  sudo dnf --assumeyes install epel-release
  sudo dnf makecache
  sudo dnf --assumeyes install ansible
  which ansible
  ansible --version

  ansible-playbook /vagrant/ansible/local.yml
}

main
