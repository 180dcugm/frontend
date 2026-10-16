import type { CollectionConfig } from "payload";

export const Partners: CollectionConfig = {
  slug: "partners",
  admin: {
    useAsTitle: "name",
    description: "Partners shown in the Our Partners section of the services page",
    defaultColumns: ["name", "category", "isRecent", "updatedAt"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Partner Name",
    },
    {
      name: "category",
      type: "select",
      required: true,
      label: "Category",
      options: [
        { label: "Case Collaboration", value: "case-collaboration" },
        { label: "Event Collaboration", value: "event-collaboration" },
        { label: "Media Partner", value: "media-partner" },
      ],
      admin: {
        description: "Decides which filter tab the partner appears under.",
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Logo",
      filterOptions: {
        mimeType: { contains: "image" },
      },
      admin: {
        description:
          "Shown on the partner card in the grid. Square logos work best, at least 320×320px.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      // Shown in the popup, and on the carousel card for recent partners, where it can't be left
      // empty. `required` would make the column NOT NULL for every partner.
      validate: (value, { data }) =>
        !(data as { isRecent?: boolean } | undefined)?.isRecent ||
        Boolean(value?.trim()) ||
        "A description is required for recent partners.",
      admin: {
        description:
          "Short description of the partner. Shown in the popup, and on the carousel card for recent partners.",
      },
    },
    {
      name: "isRecent",
      type: "checkbox",
      label: "Recent partner",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Shows this partner in the Recent Partners carousel, with its case study.",
      },
    },
    {
      // Fields inside a conditional group are only validated while the condition holds, and their
      // columns stay nullable, so `required` here applies to recent partners only.
      name: "caseStudy",
      type: "group",
      label: "Case Study",
      admin: {
        condition: (data) => Boolean(data?.isRecent),
        description: "Shown on this partner's card in the Recent Partners carousel.",
      },
      fields: [
        {
          name: "nps",
          type: "number",
          required: true,
          min: 0,
          max: 100,
          label: "NPS (%)",
          admin: {
            description: "Whole percentage, e.g. 100 is shown as \"NPS of 100%\".",
          },
        },
        {
          name: "challenge",
          type: "textarea",
          required: true,
          label: "What challenges did the partner face?",
        },
        {
          name: "solution",
          type: "textarea",
          required: true,
          label: "What solution did we offer?",
        },
        {
          name: "impact",
          type: "textarea",
          required: true,
          label: "Impact that we delivered",
        },
        {
          name: "background",
          type: "upload",
          relationTo: "media",
          label: "Card Background",
          filterOptions: {
            mimeType: { contains: "image" },
          },
          admin: {
            description: "Photo behind this partner's card in the carousel. At least 1360px wide.",
          },
        },
      ],
    },
    {
      name: "popup",
      type: "group",
      label: "Popup",
      admin: {
        description: "Content shown when a visitor clicks this partner.",
      },
      fields: [
        {
          name: "background",
          type: "upload",
          relationTo: "media",
          label: "Background",
          filterOptions: {
            mimeType: { contains: "image" },
          },
          admin: {
            description:
              "Custom background for this partner's popup. Every partner should have one. At least 1360px wide.",
          },
        },
      ],
    },
  ],
  timestamps: true,
};
