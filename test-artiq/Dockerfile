FROM mambaorg/micromamba:latest

USER root
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

USER micromamba

# Create the environment and install ARTIQ
RUN micromamba create -n artiq -y -c m-labs -c conda-forge \
    artiq \
    python=3.10 \
    pip

# Install ndscan
RUN micromamba run -n artiq pip install git+https://github.com/OxfordIonTrapGroup/ndscan

WORKDIR /home/micromamba/artiq

# Copy repository files (to be added)
COPY --chown=micromamba:micromamba repository ./repository
COPY --chown=micromamba:micromamba device_db.py .

# Expose ARTIQ master ports
# 1065: notify
# 1066: controller manager (standard)
# 1068: master (standard)
EXPOSE 1065 1066 1068

# Start the master
ENTRYPOINT ["micromamba", "run", "-n", "artiq", "artiq_master", "-B", "0.0.0.0", "-r", "repository"]
