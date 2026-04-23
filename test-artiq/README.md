# Local ARTIQ Test Environment

This directory contains a Docker-based ARTIQ master setup for local testing and development. It provides a safe alternative to connecting to a real ARTIQ master by mimicking the structure of an external ARTIQ experiment repository.

## Features

- **ARTIQ Master**: Running with basic services (notify, control, logging, broadcast).
- **ndscan**: Installed and ready for use with experiments.
- **Example Experiments**: Located in the `repository/` directory.

## Getting Started

1. **Start the environment**:
   ```bash
   docker compose up -d
   ```

2. **Wait for the master to initialize**.

3. **Verify connectivity**:
   ```bash
   # From the project root
   uv run sipyco_rpctool 127.0.0.1 3251 list-targets
   ```

4. **Interact with the master**:
   The master is available on the standard ARTIQ ports:
   - Notify: 3250
   - Control: 3251
   - Logging: 1066
   - Broadcast: 1067

## Repository Structure

- `Dockerfile`: Debian-based image with `micromamba` and ARTIQ environment.
- `docker-compose.yml`: Orchestration for the master.
- `device_db.py`: A minimal device database.
- `repository/`: Contains experiments that are automatically scanned by the master.

## Troubleshooting

- **Check logs**: `docker compose logs artiq-master`
- **Rebuild**: `docker compose up -d --build`
- **Binding**: The master is configured to bind to all interfaces (`--bind *`).
- **ndscan parameters**: Ensure `setattr_param` calls include the description before defaults.
