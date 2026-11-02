import type { CollectionConfig } from "payload";

export const ShortIndustryDecks: CollectionConfig = {
  slug: "short-industry-decks",
  labels: {
    singular: "Short Industry Deck",
    plural: "Short Industry Decks",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "author", "publishedDate", "updatedAt"],
    description: "Concise industry decks shown in the Article Hub and Short Industry Decks page.",
    preview: (data) => `/article/shortindustrydeck/${data.slug}`,
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Deck Title",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            (value || data?.title || "")
              .normalize("NFKD")
              .replace(/[\u0300-\u036f'’]/g, "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, ""),
        ],
      },
      admin: {
        description: "Used in the page URL. Generated from the title if left blank.",
      },
    },
    {
      name: "subtitle",
      type: "text",
      label: "Subtitle",
    },
    {
      name: "author",
      type: "text",
      required: true,
      defaultValue: "Knowledge Team",
    },
    {
      name: "pdf",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Deck PDF",
      filterOptions: { mimeType: { equals: "application/pdf" } },
      validate: async (value, { req }) => {
        if (!value) return "Please upload a deck PDF.";
        const media = await req.payload.findByID({
          collection: "media",
          id: typeof value === "object" ? value.id : value,
          depth: 0,
          req,
        });
        return media.mimeType === "application/pdf" || "The deck must be a PDF file.";
      },
      admin: {
        description: "Upload the complete PDF. Landscape (16:9) slides work best in the viewer.",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Cover Image",
      filterOptions: { mimeType: { contains: "image" } },
      admin: {
        description: "Optional thumbnail. If omitted, the first PDF slide is used automatically.",
      },
    },
    {
      name: "overview",
      type: "textarea",
      required: true,
      admin: {
        description: "Shown in the collapsible Overview panel below the deck viewer.",
      },
    },
    {
      name: "driveLink",
      type: "text",
      label: "Google Drive Link",
      validate: (value) => {
        if (!value) return true;
        try {
          const url = new URL(value);
          return (
            (url.protocol === "https:" &&
              ["drive.google.com", "docs.google.com"].includes(url.hostname)) ||
            "Enter an HTTPS Google Drive or Google Docs share link."
          );
        } catch {
          return "Enter a valid Google Drive share link.";
        }
      },
      admin: {
        description:
          'Public share link for the "View on Drive" button. Leave blank until available.',
      },
    },
    {
      name: "publishedDate",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar" },
    },
  ],
};
