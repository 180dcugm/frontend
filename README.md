# Repositori IT 180dc ugm

## How to Run

This project uses **pnpm** (see `pnpm-lock.yaml`). Set up a local database first, as described in
[Local development](#local-development), then:

```
pnpm install --frozen-lockfile
pnpm dev
```

## Local development

The site embeds Payload CMS, so `pnpm dev` connects to a Postgres database. Use a local one.

> **Never put the production `POSTGRES_URL` in your `.env`.** In development Payload runs in
> _push mode_: on startup it changes the database schema to match your branch. Additive changes
> (new tables, new columns) are applied without asking, so running your branch against
> production changes production. Vercel Preview uses the production database too.

### 1. Start a local Postgres (Docker)

```
docker run -d --name 180dc-payload-db \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=payload \
  -p 127.0.0.1:5432:5432 \
  -v 180dc-payload-db:/var/lib/postgresql/data \
  --restart unless-stopped \
  postgres:17
```

It listens on `127.0.0.1` only and keeps its data in the `180dc-payload-db` volume.

- Stop / start: `docker stop 180dc-payload-db` / `docker start 180dc-payload-db`
- Reset to empty: `docker rm -f 180dc-payload-db && docker volume rm 180dc-payload-db`, then run
  the command above again

### 2. Create your `.env`

```
cp .env.example .env
```

Fill in `PAYLOAD_SECRET` (any random string, e.g. `openssl rand -hex 32`) and the dev Supabase
project's `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ask IT). Leave
`POSTGRES_URL` pointing at `127.0.0.1`. Before every `pnpm dev`, it is worth checking:

```
grep POSTGRES_URL .env
```

`PAYLOAD_LOCAL_UPLOADS=true` stores uploads in `./media` (gitignored) instead of the production
bucket.

### 3. Run it

```
pnpm dev
```

The first request creates the tables in your local database. Open
[localhost:3000/admin](http://localhost:3000/admin) and create your first (local-only) admin user.

- Regenerate Payload types after changing a collection: `pnpm payload generate:types`
- Production schema changes go through Payload migrations, never through `pnpm dev`

## Design

https://www.figma.com/design/xt7c7TejHyzyCQZinaBwKv/180DC-Website-24%2F25?node-id=370-168&t=fowoo8giWNB7BfEF-0

## Folder Structure

```
- public: file public (including fonts, img)
- src
    - app : Contain all pages
    - components : all components (layouts, button, navbar, page modules, etc)
    - config : link link config
```

## Notes

- kalo branch mu udah di merge, jangan lupa juga buat hapus branch mu dari github (biar rapi hehe :>)
