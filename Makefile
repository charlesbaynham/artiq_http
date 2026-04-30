.PHONY: install build test server

install:
	echo "Installing dependencies..."
	uv sync --extra dev
	cd frontend && npm install

dev: install
	echo "Launching dev servers..."
	exec ./dev.sh

build:
	echo "Building the test docker image..."
	cd test-artiq && nix build .#docker && docker load < result

test:
	echo "Running tests..."
	uv run pytest

serve: install build
	echo "Starting development server..."
	./dev.sh

docker: build
	echo "Running the docker containers..."
	docker compose up
