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

  ansible-galaxy install -r /vagrant/ansible/roles.yml
  ansible-playbook -i /vagrant/ansible/inventory/localhost /vagrant/ansible/centos8.yml
}

main
