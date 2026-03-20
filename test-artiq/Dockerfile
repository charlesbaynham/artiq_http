FROM debian:bookworm-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    bzip2 \
    ca-certificates \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*

# Install mamba from conda-forge (reliable source)
RUN curl -Ls https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh -o /tmp/miniforge.sh && \
    bash /tmp/miniforge.sh -b -p /opt/conda && \
    rm /tmp/miniforge.sh
ENV PATH="/opt/conda/bin:$PATH"

# Create ARTIQ environment with proper channel priority
# Note: conda-forge first for dependencies, then ARTIQ channel
RUN mamba create -n artiq -y \
    --channel-priority flexible \
    -c conda-forge \
    -c https://conda.m-labs.hk/artiq \
    artiq \
    python=3.10 \
    pip

# Install oitg and ndscan
RUN mamba run -n artiq pip install git+https://github.com/OxfordIonTrapGroup/oitg
RUN mamba run -n artiq pip install git+https://github.com/OxfordIonTrapGroup/ndscan

# Pin sipyco to the version we use currently
# TODO: be more robust / general
RUN mamba run -n artiq pip install git+https://github.com/m-labs/sipyco.git@96fcefbea490a9b42c862393860d2e586b05d744

# Force llvmlite back to 0.39 to avoid worker crashes
# This is necessary because pip might upgrade it during the git installs
RUN mamba install -n artiq -y -c conda-forge llvmlite=0.39

# Set up working directory
WORKDIR /artiq
COPY repository ./repository
COPY device_db.py .

# ARTIQ Master ports
EXPOSE 1066 1067 3250 3251

# Start the master
# Start the master with verbose logging and bind to all interfaces
ENTRYPOINT ["mamba", "run", "-n", "artiq", "artiq_master", "-r", "repository", "--bind", "*", "-vv"]
