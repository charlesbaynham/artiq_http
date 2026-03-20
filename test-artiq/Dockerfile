FROM mambaorg/micromamba:1.5.10

# Switch to root to install system dependencies
USER root

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    bzip2 \
    ca-certificates \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*

# Switch back to micromamba user
USER $MAMBA_USER

# Create ARTIQ environment using the ARTIQ channel
# Use micromamba with explicit channel order
RUN micromamba create -n artiq -y \
    -c https://conda.m-labs.hk \
    -c conda-forge \
    artiq python=3.10 pip \
    && micromamba clean -afy

# Set up environment activation
ENV PATH="/opt/conda/envs/artiq/bin:$PATH"

# Install oitg and ndscan via pip since they may not be in conda channels
RUN /opt/conda/envs/artiq/bin/pip install git+https://github.com/OxfordIonTrapGroup/oitg
RUN /opt/conda/envs/artiq/bin/pip install git+https://github.com/OxfordIonTrapGroup/ndscan

# Pin sipyco to the version we use currently
# TODO: be more robust / general
RUN /opt/conda/envs/artiq/bin/pip install git+https://github.com/m-labs/sipyco.git@96fcefbea490a9b42c862393860d2e586b05d744

# Force llvmlite back to 0.39 to avoid worker crashes
# This is necessary because pip might upgrade it during the git installs
RUN micromamba install -n artiq -y -c conda-forge llvmlite=0.39 && micromamba clean -afy

# Switch back to root for copying files
USER root

# Set up working directory
WORKDIR /artiq
COPY --chown=$MAMBA_USER:$MAMBA_USER repository ./repository
COPY --chown=$MAMBA_USER:$MAMBA_USER device_db.py .

# ARTIQ Master ports
EXPOSE 1066 1067 3250 3251

# Start the master with verbose logging and bind to all interfaces
# Must use exec form with micromamba run for proper signal handling
ENTRYPOINT ["micromamba", "run", "-n", "artiq", "artiq_master", "-r", "repository", "--bind", "*", "-vv"]
