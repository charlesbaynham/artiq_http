.PHONY: install build test server dev mock

install:
	echo "Installing dependencies..."
	uv sync --extra dev
	cd frontend && npm install

dev: install build
	echo "Launching dev servers..."
	exec ./dev.sh

mock: install
	echo "Launching dev servers in mock mode..."
	exec ./dev.sh --mock

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
