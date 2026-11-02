"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { FileText } from "lucide-react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";

function usePdfDocument(url: string) {
  const [state, setState] = useState<{
    document: PDFDocumentProxy | null;
    slideRatio: number;
    error: boolean;
  }>({ document: null, slideRatio: 9 / 16, error: false });

  useEffect(() => {
    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | undefined;
    setState({ document: null, slideRatio: 9 / 16, error: false });

    async function load() {
      // Load only in the browser. The worker is bundled locally with the app,
      // so the viewer does not depend on a third-party script/CDN.
      // The minified distribution avoids PDF.js's internal webpack identifier
      // collisions with the webpack version bundled by Next.js 15.
      const pdfjs: typeof import("pdfjs-dist") = await import("pdfjs-dist/build/pdf.min.mjs");
      if (cancelled) return;
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      loadingTask = pdfjs.getDocument({ url, isEvalSupported: false });
      const document = await loadingTask.promise;
      const page = await document.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      if (!cancelled) {
        setState({ document, slideRatio: viewport.height / viewport.width, error: false });
      }
    }

    load().catch((error) => {
      if (!cancelled) {
        console.error("Unable to load deck PDF:", error);
        setState({ document: null, slideRatio: 9 / 16, error: true });
      }
    });
    return () => {
      cancelled = true;
      void loadingTask?.destroy();
    };
  }, [url]);

  return state;
}

function PdfSlide({
  document,
  pageNumber,
  title,
  rootRef,
  eager = false,
  onError,
}: {
  document: PDFDocumentProxy;
  pageNumber: number;
  title: string;
  rootRef?: RefObject<HTMLDivElement | null>;
  eager?: boolean;
  onError: () => void;
}) {
  const figureRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(eager);
  const [width, setWidth] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [rendered, setRendered] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    const resize = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    resize.observe(figure);
    const intersection = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          intersection.disconnect();
        }
      },
      { root: rootRef?.current || null, rootMargin: "100% 0px" }
    );
    intersection.observe(figure);
    return () => {
      resize.disconnect();
      intersection.disconnect();
    };
  }, [rootRef]);

  useEffect(() => {
    if (!visible || !width) return;
    let cancelled = false;
    let renderTask: RenderTask | undefined;
    setRendered(false);

    async function render() {
      const page = await document.getPage(pageNumber);
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;
      const original = page.getViewport({ scale: 1 });
      setAspectRatio(original.width / original.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({ scale: (width / original.width) * pixelRatio });
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      renderTask = page.render({ canvas, viewport });
      await renderTask.promise;
      if (cancelled) return;
      setRendered(true);
      const content = await page.getTextContent();
      if (!cancelled) {
        setText(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
      }
    }

    render().catch((error) => {
      if (!cancelled) {
        console.error(`Unable to render deck slide ${pageNumber}:`, error);
        onError();
      }
    });
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [document, pageNumber, visible, width, onError]);

  return (
    <figure
      ref={figureRef}
      aria-label={`Slide ${pageNumber} of ${document.numPages}: ${title}`}
      aria-busy={!rendered}
      data-page-number={pageNumber}
      data-rendered={rendered}
      className="relative w-full shrink-0 overflow-hidden rounded-lg bg-white"
      style={{ aspectRatio }}
    >
      {!rendered && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 motion-reduce:animate-none" />
      )}
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      <figcaption className="sr-only">{text || `Slide ${pageNumber}`}</figcaption>
    </figure>
  );
}

export function PdfCover({ url, title }: { url: string; title: string }) {
  const { document, error } = usePdfDocument(url);
  const [renderError, setRenderError] = useState(false);
  const onError = useCallback(() => setRenderError(true), []);
  if (error || renderError) {
    return (
      <div className="font-lato-regular flex h-full items-center justify-center gap-2 text-sm text-gray-300">
        <FileText aria-hidden="true" className="size-5" /> Preview unavailable
      </div>
    );
  }
  return document ? (
    <PdfSlide document={document} pageNumber={1} title={title} onError={onError} />
  ) : (
    <div
      aria-label="Loading deck cover"
      className="h-full w-full animate-pulse bg-white/10 motion-reduce:animate-none"
    />
  );
}

export function DeckPdfViewer({ url, title }: { url: string; title: string }) {
  const { document, slideRatio, error } = usePdfDocument(url);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [renderError, setRenderError] = useState(false);
  const onError = useCallback(() => setRenderError(true), []);

  useEffect(() => {
    const slides = slidesRef.current;
    if (!slides) return;
    const resize = new ResizeObserver(([entry]) => setSlideWidth(entry.contentRect.width));
    resize.observe(slides);
    return () => resize.disconnect();
  }, []);

  if (error || renderError) {
    return (
      <div
        role="status"
        className="font-lato-regular flex aspect-video flex-col items-center justify-center gap-4 rounded-2xl border border-white/20 bg-white/5 p-6 text-center"
      >
        <FileText aria-hidden="true" className="size-10 text-green-300" />
        <p>The deck preview could not be loaded.</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-300 underline underline-offset-4"
        >
          Open the PDF in a new tab
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#7e7e7e] p-3 sm:p-5">
      <p className="sr-only" id="deck-scroll-help">
        Scroll inside this viewer to read all slides. You can also focus it and use the arrow keys.
      </p>
      <div
        ref={scrollRef}
        role="region"
        aria-label={`${title} slides`}
        aria-describedby="deck-scroll-help"
        aria-busy={!document}
        tabIndex={0}
        data-lenis-prevent
        className="[scrollbar-width:thin] [scrollbar-color:#202020_#7e7e7e] overflow-y-auto overscroll-contain rounded-lg pr-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-300"
        // Three full slides plus the two 12px gaps, at any viewport width.
        style={
          slideWidth ? { height: slideWidth * slideRatio * 3 + 24 } : { aspectRatio: "16 / 27" }
        }
      >
        <div ref={slidesRef} className="flex flex-col gap-3">
          {document ? (
            Array.from({ length: document.numPages }, (_, index) => (
              <PdfSlide
                key={index + 1}
                document={document}
                pageNumber={index + 1}
                title={title}
                rootRef={scrollRef}
                eager={index < 3}
                onError={onError}
              />
            ))
          ) : (
            <>
              <span role="status" className="sr-only">
                Loading deck slides…
              </span>
              {[1, 2, 3].map((page) => (
                <div
                  key={page}
                  className="aspect-video w-full shrink-0 animate-pulse rounded-lg bg-gray-200 motion-reduce:animate-none"
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
