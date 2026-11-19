# Repositori IT 180dc ugm

## How to Run

- NPM

  ```
      npm run dev
  ```

- Yarn

  ```
      yarn run dev
  ```

## Design

https://www.figma.com/design/xt7c7TejHyzyCQZinaBwKv/180DC-Website-24%2F25?node-id=370-168&t=fowoo8giWNB7BfEF-0

## Short Industry Decks

Manage decks in Payload under **Collections → Short Industry Decks**. Each entry accepts a PDF,
title, subtitle, author, publication date, collapsible overview, optional cover image, and Google
Drive share link. Without a cover image, the first PDF slide becomes the thumbnail. Add the Drive
share link to enable **View on Drive**.

For an existing deployment, apply the migrations and import the supplied first deck once:

```sh
npx payload migrate
npx payload run scripts/seed-short-industry-decks.ts
```

The importer uploads the bundled EdTech PDF and cover through the configured Payload storage
(local media or S3). Re-running it preserves editorial changes. You can also supply the EdTech
deck's Drive share link as its final argument to add or update that link.

Pages: `/article`, `/article/shortindustrydeck`, and
`/article/shortindustrydeck/indonesias-edtech-industry`. Publication changes appear within 60 seconds.

To publish the SID #1 release in Payload's Hero collection (using the deck's existing thumbnail):

```sh
npx payload run scripts/set-sid-release-hero.ts
```

This updates the latest Hero entry in the configured database. To update a live CMS through its
Payload REST API, set `PAYLOAD_API_URL`, `PAYLOAD_ADMIN_EMAIL`, and `PAYLOAD_ADMIN_PASSWORD` in
the environment before running the command. The announcement stays editable in Payload.

The build also runs this update in `once` mode, using the deployment's own Payload connection.
It replaces the recruitment announcement with SID #1 and records completion in Payload's key-value
store. Later builds preserve subsequent CMS edits and unrelated campaigns. If the deck or thumbnail
has not been imported yet, publication is deferred until a later build.

## Eighty consulting preview

The chatbot includes a separate Consulting section with the five consulting/BCC starter questions
from the IT × PVP meeting. Knowledge Team materials are still being prepared, so consulting
requests return a clearly labelled preview response instead of using the organization FAQ knowledge
base. A small footer link points to the store for further resources. General and consulting
conversation histories are kept separate for 30 minutes.

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
