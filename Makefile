.PHONY: migration help

migration: ## Create a new migration for sqlite
	touch sql/V$(shell date +"%s")__$(file).sql

help:
	@grep -E '^[a-zA-Z._-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
