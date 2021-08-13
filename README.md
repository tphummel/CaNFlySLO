# CaNFlySLO

> ✨The “CaNFlySLO” stack 🛫
> - Caddy
> - Node.js + Hotwire.dev
> - FlywayDB
> - SQLite
> - Litestream
> - (S3 compatible) Object Store
> 
> Single VM. No containers. Systemd managed. Cockpit, p8s, fluentbit. Ansible. Vagrant for local dev
> 
> &mdash; Tom Hummel (@tphummel) [April 22, 2021](https://twitter.com/tphummel/status/1385226694647107585)

## Development Quickstart (Mac OSX)

prerequisites: 

- [homebrew](https://brew.sh)
- [vagrant](https://vagrantup.sh)
- [virtualbox](https://www.virtualbox.org/)

```
git clone git@github.com:tphummel/CaNFlySLO.git
cd CaNFlySLO
brew install caddy
brew install nss

XDG_DATA_HOME=`pwd`/.caddy-data caddy trust
vagrant up

vagrant ssh
cd /vagrant
npm install

flyway -user= -password= -locations="filesystem:./sql" -url="jdbc:sqlite:app.sqlite3" migrate

npm run dev
```

from host, browse https://cfs.local/

or

```
curl -4 -v https:/cfs.local
```

### local tls certificate (dev)

You'll start getting tls warnings in your browser or `curl`.

from host:

```
XDG_DATA_HOME=`pwd`/.caddy-data caddy untrust
rm -rf .caddy-data
XDG_DATA_HOME=`pwd`/.caddy-data caddy trust

# not totally sure these are requierd
vagrant reload
vagrant ssh
sudo systemctl restart caddy
```

## k6 smoke test locally

Follow dev quickstart above, ensure the dev server is running.

```
brew install k6
k6 run k6/local-smoke.js
k6 run --vus 1 --duration 1m k6/local-e2e.js
```
