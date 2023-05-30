FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

RUN apt-get update \
    && apt install -y \
    # Utilities
    bash-completion \
    # Docker requirements
    apt-transport-https ca-certificates gnupg2 lsb-release \
    # Install docker gpg key
    && curl -fsSL https://download.docker.com/linux/$(lsb_release -is | tr '[:upper:]' '[:lower:]')/gpg | apt-key add - 2>/dev/null \
    # Add docker to apt sources
    && echo "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/$(lsb_release -is | tr '[:upper:]' '[:lower:]') $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list \
    && apt-get update \
    # Install Docker
    && apt-get install -y docker-ce-cli docker-compose-plugin
