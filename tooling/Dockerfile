FROM base
ARG USER_UID=1000
ARG USER_GID=1000
# The below is an almost-certainly overengineered way to get UIDs/GIDs to align
# with user.
USER root
RUN ORIG_UID=$(id -u ubuntu) && \
    ORIG_GID=$(id -g ubuntu) && \
    groupmod -g ${USER_GID} ubuntu \
    && usermod -u ${USER_UID} -g ${USER_GID} ubuntu
RUN ORIG_UID=$(id -u ubuntu) && \
    ORIG_GID=$(id -g ubuntu) && \
    echo "ORIG_UID is ${ORIG_UID}" \
    && find / \( -path /proc -o -path /sys -o -path /dev \) -prune -o -type d -mindepth 1 -maxdepth 2 -type d \
    | while read -r dir; \
    do\
    files=$(find "$dir" \( -path /proc -o -path /sys -o -path /dev \) -prune -o -type f -user "${ORIG_UID}" | wc -l);\
    dirs=$(find "$dir" \( -path /proc -o -path /sys -o -path /dev \) -prune -o -type d -user "${ORIG_UID}" | wc -l);\
    if [ "$files" -gt 0 ] || [ "$dirs" -gt 0 ]; then \
    printf "%s: %d files, %d dirs\n" "$dir" "$(find "${dir}" -type f -user ${ORIG_UID} | wc -l)" "$(find "${dir}" -type d -user ${ORIG_UID} | wc -l)";\
    fi; done && echo "starting chown uid" \
    && find / \( -path /proc -o -path /sys -o -path /dev \) -prune -o -user ${ORIG_UID} -exec chown -h ${USER_UID} {} +
RUN ORIG_UID=$(id -u ubuntu) && \
    ORIG_GID=$(id -g ubuntu) && \
    echo "ORIG_GID is ${ORIG_GID}" \
    && find / \( -path /proc -o -path /sys -o -path /dev \) -prune -o -type d -mindepth 1 -maxdepth 2 -type d \
    | while read -r dir; \
    do\
    files=$(find "$dir" \( -path /proc -o -path /sys -o -path /dev \) -prune -o -type f -group "${ORIG_GID}" | wc -l);\
    dirs=$(find "$dir" \( -path /proc -o -path /sys -o -path /dev \) -prune -o -type d -group "${ORIG_GID}" | wc -l);\
    if [ "$files" -gt 0 ] || [ "$dirs" -gt 0 ]; then \
    printf "%s: %d files, %d dirs\n" "$dir" "$(find "${dir}" -type f -group $"{ORIG_GID}" | wc -l)" "$(find "${dir}" -type d  -group $"{ORIG_GID}" | wc -l)";\
    fi; done && echo "starting chown gid" \
    && find / \( -path /proc -o -path /sys -o -path /dev \) -prune -o -group ${ORIG_GID} -exec chgrp -h ${USER_GID} {} +


USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    librsvg2-bin \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libgbm1 \
    libnss3 \
    libxss1 \
    libasound2t64 \
    && rm -rf /var/lib/apt/lists/*
    # && wget -q "https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb" \
    # && apt-get install -y --no-install-recommends ./google-chrome-stable_current_amd64.deb \
    # && rm google-chrome-stable_current_amd64.deb \


RUN mkdir /workdir
RUN chown ubuntu:ubuntu /workdir
WORKDIR /workdir

# This takes a while, keep it early
USER ubuntu
COPY package*.json /workdir/
RUN pwd && npm ci

USER root
RUN npx playwright install-deps chromium

USER ubuntu
RUN npx playwright install chromium

COPY --chown=ubuntu:ubuntu . /workdir
USER ubuntu
ENV CHROME_PATH=/usr/bin/chromium-browser
ENV CHROMEDRIVER_PATH=/usr/bin/chromium-chromedriver
ENV CI=true
RUN echo "allow-scripts=true" > .npmrc \
    && echo "strict-allow-scripts=false" >> .npmrc
RUN npm config set allow-scripts true \
    && npm install-scripts approve --all \
    && npm ci --foreground-scripts
