import Image from "@/components/elements/ReliableImage";
import Link from "next/link";
import { TelescopeBox } from "./TelescopeBox";
import { Quote } from "lucide-react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import Container from "@/components/layout/Container";
import { getMediaImage } from "@/lib/media-images";

export default function TelescopeDetail({
  article,
  allArticles,
  articleSlug,
}: {
  article: any;
  allArticles: any[];
  articleSlug: string;
}) {
  if (!article) return null;

  const cover = getMediaImage(article.image, "popup");

  // Get a random recommendation article different from current
  const recommendedArticle = allArticles?.find((a) => a.slug !== articleSlug);

  // Custom JSX converters for handling uploads/images in rich text
  const customJSXConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const tag = node.tag;
      const children = nodesToJSX({ nodes: node.children });

      const headingClasses = {
        h1: "font-avenir-black text-[28px] lg:text-[36px] mt-8 mb-4",
        h2: "font-avenir-black text-[24px] lg:text-[30px] mt-6 mb-3",
        h3: "font-avenir-black text-[20px] lg:text-[24px] mt-5 mb-2",
        h4: "font-avenir-black text-[18px] lg:text-[20px] mt-4 mb-2",
        h5: "font-avenir-black text-[16px] lg:text-[18px] mt-3 mb-2",
        h6: "font-avenir-black text-[14px] lg:text-[16px] mt-3 mb-2",
      };

      const className = headingClasses[tag as keyof typeof headingClasses] || "";

      switch (tag) {
        case "h1":
          return <h1 className={className}>{children}</h1>;
        case "h2":
          return <h2 className={className}>{children}</h2>;
        case "h3":
          return <h3 className={className}>{children}</h3>;
        case "h4":
          return <h4 className={className}>{children}</h4>;
        case "h5":
          return <h5 className={className}>{children}</h5>;
        case "h6":
          return <h6 className={className}>{children}</h6>;
        default:
          return <p>{children}</p>;
      }
    },
    upload: ({ node, nodesToJSX }) => {
      const uploadData = node.value;

      if (!uploadData) return null;

      // Get the image URL
      const image = getMediaImage(uploadData);
      let alt = "Article image";
      let caption = "";

      if (typeof uploadData === "object" && uploadData !== null) {
        // Get alt text and caption if available
        if ("alt" in uploadData && typeof uploadData.alt === "string") {
          alt = uploadData.alt;
        }
        if ("caption" in uploadData && typeof uploadData.caption === "string") {
          caption = uploadData.caption;
        }
      }

      if (!image) return null;

      return (
        <div className="my-4">
          <Image
            src={image.src}
            originalSrc={image.originalSrc}
            alt={alt}
            width={image.width || 1440}
            height={image.height || 810}
            sizes="(max-width: 1023px) 90vw, 700px"
            className="h-auto w-full rounded-lg"
          />
          {caption && <p className="mt-2 text-center text-sm text-gray-400 italic">{caption}</p>}
        </div>
      );
    },
    paragraph: ({ node, nodesToJSX }) => {
      return <p className="mb-4 last:mb-0">{nodesToJSX({ nodes: node.children })}</p>;
    },
    list: ({ node, nodesToJSX }) => {
      const tag = node.tag;
      const children = nodesToJSX({ nodes: node.children });

      const className =
        tag === "ol"
          ? "list-decimal list-inside mb-4 last:mb-0"
          : "list-disc list-inside mb-4 last:mb-0";
      return tag === "ol" ? (
        <ol className={className}>{children}</ol>
      ) : (
        <ul className={className}>{children}</ul>
      );
    },
    listitem: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children });

      return <li className="mb-1 last:mb-0">{children}</li>;
    },
    link: ({ node, nodesToJSX }) => {
      const fields = node.fields;
      return (
        <Link
          href={fields.url}
          className="text-blue-400 underline decoration-blue-400/50 transition-all duration-300 hover:text-blue-300 hover:decoration-blue-300"
          target={fields.newTab ? "_blank" : undefined}
        >
          {nodesToJSX({ nodes: node.children })}
        </Link>
      );
    },
    quote: ({ node, nodesToJSX }) => {
      return (
        <blockquote className="my-6 border-l-4 border-white/50 pl-4 text-gray-200 italic">
          {nodesToJSX({ nodes: node.children })}
        </blockquote>
      );
    },
  });

  // Serialize Lexical content to HTML or JSX
  const renderLexicalContent = (content: any) => {
    if (!content) return null;

    // If it's already a string, render it directly
    if (typeof content === "string") {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="prose prose-invert prose-strong:font-lato-bold prose-em:font-lato-light-italic max-w-none"
        />
      );
    }

    // If it's Lexical format, use RichText component with custom converters
    if (content?.root) {
      return (
        <div className="text-[16px] lg:text-[18px]">
          <RichText data={content} converters={customJSXConverters} />
        </div>
      );
    }

    return null;
  };

  return (
    <section className="mx-auto h-full min-h-screen w-full max-w-[2160px] bg-black py-0">
      <div className="font-lato-regular flex flex-col gap-[20px] px-[5%] py-[100px] text-gray-100 lg:px-[26%] lg:py-[120px]">
        {/* Title */}
        <h1 className="font-avenir-black text-center text-[32px] lg:text-[48px]">
          {article.title}
        </h1>

        {/* Author & Published Date */}
        <h2 className="text-center text-[14px] lg:text-[16px]">
          Author: {article.author ?? "-"} • Publish Date:{" "}
          {article.publishedDate
            ? new Date(article.publishedDate).toLocaleDateString("id-ID")
            : new Date(article.createdAt).toLocaleDateString("id-ID")}
        </h2>

        {/* Image */}
        {cover && (
          <div className="relative aspect-video overflow-hidden rounded-[20px]">
            <Image
              src={cover.src}
              originalSrc={cover.originalSrc}
              alt={article.title || "article image"}
              fill
              sizes="(max-width: 1023px) 90vw, 700px"
              className="object-cover"
            />
          </div>
        )}

        {/* Content - Lexical Rich Text with Quote styling */}
        {article.content && (
          <div className="font-lato-light-italic mt-[20px] border-l-4 border-white px-4 text-justify text-[16px] lg:text-[18px]">
            <Quote className="mb-2 rotate-180 text-white" />
            {renderLexicalContent(article.content)}
            <Quote className="mt-2 text-white" />
          </div>
        )}

        {/* Description - Lexical Rich Text */}
        {article.description && (
          <div className="font-lato-light text-justify text-[16px] lg:text-[18px]">
            {renderLexicalContent(article.description)}
          </div>
        )}

        {/* Recommendation section */}
        {recommendedArticle && (
          <div className="font-avenir-black mt-[20px] flex flex-col gap-[20px] text-[24px] lg:text-[32px]">
            Our Recommendation
            <TelescopeBox article={recommendedArticle} type="article" />
          </div>
        )}
      </div>
    </section>
  );
}
