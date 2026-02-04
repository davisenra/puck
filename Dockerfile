FROM oven/bun:1.3-debian AS build

ARG VERSION=1.0.0
ARG VCS_REF=unknown
ARG BUILD_DATE
ARG MAINTAINER

LABEL \
    org.opencontainers.image.title="Puck" \
    org.opencontainers.image.description="Coffee brewing management app" \
    org.opencontainers.image.version=$VERSION \
    org.opencontainers.image.created=$BUILD_DATE \
    org.opencontainers.image.revision=$VCS_REF \
    org.opencontainers.image.vendor="Puck" \
    org.opencontainers.image.maintainer=$MAINTAINER

WORKDIR /app

COPY . .

RUN bun install

RUN bun run build:api
RUN bun run build:web

RUN cp -r packages/web/dist packages/api/public

FROM gcr.io/distroless/base

ARG VERSION=1.0.0
ARG VCS_REF=unknown
ARG BUILD_DATE
ARG MAINTAINER

LABEL \
    org.opencontainers.image.title="Puck" \
    org.opencontainers.image.description="Coffee brewing management app" \
    org.opencontainers.image.version=$VERSION \
    org.opencontainers.image.created=$BUILD_DATE \
    org.opencontainers.image.revision=$VCS_REF

WORKDIR /app

COPY --from=build /app/packages/api/dist/server ./server
COPY --from=build /app/packages/api/migrations ./migrations
COPY --from=build /app/packages/api/public ./public

ENV NODE_ENV=production
ENV PORT=3000
ENV MIGRATIONS_PATH=/app/migrations
ENV VITE_API_URL=

EXPOSE 3000

CMD ["./server"]
