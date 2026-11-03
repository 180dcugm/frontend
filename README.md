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
