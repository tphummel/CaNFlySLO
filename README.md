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

flyway -user= -password= -locations="filesystem:./sql" -url="jdbc:sqlite:tad.sqlite3" migrate

npm run dev
```

from host, browse https://cfs.local/api/customers

successful response:
```
[]
```
