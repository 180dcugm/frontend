import { APIError, type CollectionConfig, type CollectionSlug } from 'payload'

// Upload fields that point at media. Payload deletes a file from storage before deleting its
// database row, so deleting media that a required field still uses fails at the database but
// leaves the record without its file. Checking here, before any file is touched, prevents that.
const mediaReferences: {
  collection: CollectionSlug
  fields: string[]
  singular: string
  plural: string
}[] = [
  {
    collection: 'partners',
    fields: ['logo', 'popup.background', 'caseStudy.background'],
    singular: 'partner',
    plural: 'partners',
  },
  { collection: 'hero', fields: ['newsImage'], singular: 'hero entry', plural: 'hero entries' },
  { collection: 'telescope', fields: ['image'], singular: 'Telescope article', plural: 'Telescope articles' },
]

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        const usages: string[] = []

        for (const { collection, fields, singular, plural } of mediaReferences) {
          const { totalDocs } = await req.payload.count({
            collection,
            where: { or: fields.map((field) => ({ [field]: { equals: id } })) },
            req,
          })
          if (totalDocs > 0) usages.push(`${totalDocs} ${totalDocs === 1 ? singular : plural}`)
        }

        if (usages.length > 0) {
          throw new APIError(
            `This file is still used by ${usages.join(', ')}. Replace it there before deleting.`,
            400,
            null,
            true
          )
        }
      },
    ],
  },
  upload: {
    imageSizes: [
      {
        // Partner popup background: rendered up to 680px wide, generated at 2x.
        name: 'popup',
        width: 1360,
        withoutEnlargement: true,
      },
      {
        // Partner logo: rendered in a 160px square, generated at 2x. "inside" scales without
        // cropping or padding, so wide logos keep their shape inside the square.
        name: 'logo',
        width: 320,
        height: 320,
        fit: 'inside',
        withoutEnlargement: true,
      },
    ],
  },
}
