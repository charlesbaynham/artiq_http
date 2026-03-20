FROM debian:bookworm-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    bzip2 \
    ca-certificates \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*

# Install micromamba from GitHub releases (more reliable than micro.mamba.pm)
RUN curl -Ls https://github.com/mamba-org/micromamba-releases/releases/latest/download/micromamba-linux-64 -o /bin/micromamba && \
    chmod +x /bin/micromamba
ENV PATH="/bin:$PATH"
ENV MAMBA_ROOT_PREFIX="/opt/conda"
# Disable zstd repodata to support older conda channels
ENV MAMBA_NO_REPODATA_ZST=1

# Create ARTIQ environment with proper channel priority
# Note: conda-forge first for dependencies, then ARTIQ channel
RUN micromamba create -n artiq -y \
    --channel-priority flexible \
    -c conda-forge \
    -c https://conda.m-labs.hk/artiq \
    artiq \
    python=3.10 \
    pip

# Install oitg and ndscan
RUN micromamba run -n artiq pip install git+https://github.com/OxfordIonTrapGroup/oitg
RUN micromamba run -n artiq pip install git+https://github.com/OxfordIonTrapGroup/ndscan

# Pin sipyco to the version we use currently
# TODO: be more robust / general
RUN micromamba run -n artiq pip install git+https://github.com/m-labs/sipyco.git@96fcefbea490a9b42c862393860d2e586b05d744

# Force llvmlite back to 0.39 to avoid worker crashes
# This is necessary because pip might upgrade it during the git installs
RUN micromamba install -n artiq -y -c conda-forge llvmlite=0.39

# Set up working directory
WORKDIR /artiq
COPY repository ./repository
COPY device_db.py .

# ARTIQ Master ports
EXPOSE 1066 1067 3250 3251

# Start the master
# Start the master with verbose logging and bind to all interfaces
ENTRYPOINT ["micromamba", "run", "-n", "artiq", "artiq_master", "-r", "repository", "--bind", "*", "-vv"]
