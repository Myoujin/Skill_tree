#!/bin/sh
set -e

DB_FILE=/app/data/db.sqlite
if [ ! -f "$DB_FILE" ]; then
  npx prisma db push
  node dist-server/prisma/seed.js
fi

exec node dist-server/server/index.js
