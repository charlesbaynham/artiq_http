.PHONY: install build test server

install:
	uv sync --extra dev
	cd frontend && npm install

build:
	cd test-artiq && nix build .#docker && docker load < result

test:
	uv run pytest

server:
	./dev.sh
