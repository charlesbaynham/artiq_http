FROM debian:bookworm-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    bzip2 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install micromamba
RUN curl -Ls https://micro.mamba.pm/api/micromamba/linux-64/latest | tar -xj bin/micromamba
ENV PATH="/bin:$PATH"
ENV MAMBA_ROOT_PREFIX="/opt/conda"

# Create ARTIQ environment
RUN micromamba create -n artiq -y \
    -c https://conda.m-labs.hk/artiq \
    -c conda-forge \
    artiq \
    python=3.10 \
    pip

# Install oitg and ndscan
RUN micromamba run -n artiq pip install git+https://github.com/OxfordIonTrapGroup/oitg
RUN micromamba run -n artiq pip install git+https://github.com/OxfordIonTrapGroup/ndscan

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
ENTRYPOINT ["micromamba", "run", "-n", "artiq", "artiq_master", "-r", "repository"]
