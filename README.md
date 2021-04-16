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

flyway -user= -password= -locations="filesystem:./sql" -url="jdbc:sqlite:app.sqlite3" migrate

npm run dev
```

from host, browse https://cfs.local/api/customers

successful response:
```
[]
```

## k6 smoke test locally

Follow dev quickstart above, ensure the dev server is running.

```
brew install k6
k6 run k6/local-smoke.js
```
