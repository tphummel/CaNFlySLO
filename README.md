# CaNFlySLO

## Development Quickstart (Mac OS)

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
node index.js
```

from host, browse https://cfs.local/api/customers

successful response:
```
[]
```
