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

## Docker

You can build and run the project using Docker:

```bash
docker compose up --build
```

The API will be available on port `4000` and data will persist in the `./data` folder.
