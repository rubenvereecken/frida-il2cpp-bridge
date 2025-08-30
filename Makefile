MAKEFLAGS += --no-builtin-rules
.SUFFIXES:

# UNITY_DIRS := $(wildcard unity/*/)
UNITY_DIRS := unity/2022.3.62f1

# TODO remove unnecessary after new multi-package build system
dist: node_modules $(shell find packages) tsconfig.json
	@ ./node_modules/.bin/tspc
	@ touch -m dist

node_modules:
	@ npm i
	@ touch -m node_modules

test: test/main.py test/agent.js dist build/host
	@ node --experimental-strip-types test/index.ts

build/host: test/host.c
	@ mkdir -p build
	@ gcc -o "$(@)" "$<"

$(UNITY_DIRS):
	make -C "$@" assembly

assembly: $(UNITY_DIRS);

clean:
	@ rm -r dist

.DEFAULT_GOAL := dist
.PHONY: clean test assembly $(UNITY_DIRS)
