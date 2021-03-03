# https://app.vagrantup.com/centos/boxes/8
Vagrant.configure("2") do |config|
  config.vm.box = "centos/8"

  config.vm.provider "virtualbox" do |v|
    v.memory = 1024
    v.cpus = 2
    v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    v.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
  end

  config.ssh.forward_agent = true
  config.vm.synced_folder ".", "/project", type: "nfs"
  config.vm.provision "shell", path: "vagrant-setup.sh"

  config.vm.define "can-fly-slo" do |node|
    node.vm.network "forwarded_port", guest: 9090, host: 9090
    node.vm.network "forwarded_port", guest: 8080, host: 8080
    node.vm.network "forwarded_port", guest: 2019, host: 2019
    node.vm.network "private_network", ip: "192.168.13.4"
    node.vm.hostname = "cfs.dev"
  end
end
