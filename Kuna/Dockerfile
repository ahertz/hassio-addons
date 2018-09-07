ARG BUILD_FROM=hassioaddons/base:2.1.2
FROM $BUILD_FROM

ENV CONFIG_DIR=/data

WORKDIR /kuna
COPY rootfs /kuna

RUN apk add --no-cache \
    nodejs=8.11.4-r0 \
    npm=8.11.4-r0
RUN npm install
RUN npm run build

RUN chmod a+x /kuna/usr/bin/run.sh

# Run the service
CMD ["/kuna/usr/bin/run.sh"]

LABEL \
    io.hass.name="Kuna" \
    io.hass.description="HASSIO addon to pull images and status information from Kuna cameras" \
    io.hass.arch="${BUILD_ARCH}" \
    io.hass.type="addon" \
    io.hass.version=${BUILD_VERSION} \
    maintainer="Chris" \
    org.label-schema.description="HASSIO addon to pull images and status information from Kuna cameras" \
    org.label-schema.build-date=${BUILD_DATE} \
    org.label-schema.name="Kuna" \
    org.label-schema.schema-version="1.0" \
    org.label-schema.url="https://addons.community" \
    org.label-schema.usage="https://github.com/HITChris/hassio-addons/blob/master/README.md" \
    org.label-schema.vcs-ref=${BUILD_REF} \
    org.label-schema.vcs-url="https://github.com/HITChris/hassio-addons/" \
    org.label-schema.vendor="Community Hass.io Addons"