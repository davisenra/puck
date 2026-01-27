FROM oven/bun AS build

ARG VERSION=1.0.0
ARG VCS_REF=unknown
ARG BUILD_DATE
ARG MAINTAINER

LABEL \
    org.opencontainers.image.title="Puck API" \
    org.opencontainers.image.description="Coffee brewing management API" \
    org.opencontainers.image.version=$VERSION \
    org.opencontainers.image.created=$BUILD_DATE \
    org.opencontainers.image.revision=$VCS_REF \
    org.opencontainers.image.vendor="Puck" \
    org.opencontainers.image.maintainer=$MAINTAINER

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/

RUN bun install

COPY apps/api ./apps/api

RUN bun build --compile --minify-whitespace --minify-syntax --outfile ./server ./apps/api/src/index.ts

FROM gcr.io/distroless/base

ARG VERSION=1.0.0
ARG VCS_REF=unknown
ARG BUILD_DATE
ARG MAINTAINER

LABEL \
    org.opencontainers.image.title="Puck API" \
    org.opencontainers.image.version=$VERSION \
    org.opencontainers.image.created=$BUILD_DATE \
    org.opencontainers.image.revision=$VCS_REF

WORKDIR /app

COPY --from=build /app/server ./server
COPY --from=build /app/apps/api/migrations ./migrations

ENV NODE_ENV=production
ENV PORT=3000
ENV MIGRATIONS_PATH=/app/migrations

EXPOSE 3000

CMD ["./server"]
