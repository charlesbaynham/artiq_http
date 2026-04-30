.PHONY: install build test server

install:
	echo "Installing dependencies..."
	uv sync --extra dev
	cd frontend && npm install

build:
	echo "Building the test docker image..."
	cd test-artiq && nix build .#docker && docker load < result

test:
	echo "Running tests..."
	uv run pytest

serve: install build
	echo "Starting development server..."
	./dev.sh
