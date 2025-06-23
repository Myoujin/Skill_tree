# Viadrina Data Science Skill Tree

Minimal prototype for tracking data science skills.

## Quick Start

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run server # starts API on :4000
npm run dev    # starts Vite dev server on :3000
```

To reach the frontend from other machines (e.g. when running on a VPS),
start the dev server with the `--host` flag or set `server.host` in
`vite.config.ts` so Vite listens on all interfaces:

```bash
npm run dev -- --host
```

## Docker

You can build and run the project using Docker:

```bash
docker compose up --build
```

The API will be available on port `4000` and the Vite dev server on port `3000`.
Persisted SQLite data will be stored in the `./data` folder.

### Runtime requirements

The server relies on OpenSSL at runtime and expects the `@prisma/client` package
to be present. The provided `Dockerfile` installs dependencies, builds the
project and generates the Prisma client with:

```Dockerfile
RUN npm run build && npm run build-server && npx prisma generate
```

If you run the application outside Docker, ensure OpenSSL is installed on your
system (e.g. `apt-get install openssl`) and run the above command so that the
`@prisma/client` runtime is generated and available.
