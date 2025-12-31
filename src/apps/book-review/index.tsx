"use client";

import { useEffect, useRef, ReactNode, useMemo } from "react";
import { useAtom } from "jotai";
import { readerSettingsAtom } from "@/system/atoms/readerSettings";
import ImageBlock from "@/components/ImageBlock";
import { Typography } from "@/components/ui";
import GiscusComments from "@/components/GiscusComments";
import AppToolbar from "@/system/components/AppToolbar";
import "katex/dist/katex.min.css";

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);

  if (locale === "zh") {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year} 年 ${month} 月 ${day} 日`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en", options);
  }
}

// Font family mapping
const fontFamilyMap: Record<string, string> = {
  bookerly: "'Bookerly', 'Noto Serif SC', Georgia, serif",
  "amazon-ember": "'Amazon Ember', 'Noto Sans SC', sans-serif",
  "noto-serif": "'Noto Serif SC', Georgia, serif",
  system: "system-ui, -apple-system, sans-serif",
};

interface BookReviewAppProps {
  id: string;
  bookProps: any;
  reviewContent: ReactNode;
  locale: string;
}

export default function BookReviewApp({
  id,
  bookProps,
  reviewContent,
  locale,
}: BookReviewAppProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const [settings] = useAtom(readerSettingsAtom);

  // Reset scroll position when navigating to review
  useEffect(() => {
    // Find the scrollable parent container (KindleBezel content area)
    const findScrollableParent = (
      element: HTMLElement | null
    ): HTMLElement | null => {
      if (!element) return null;
      const parent = element.parentElement;
      if (!parent) return null;

      const style = window.getComputedStyle(parent);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        return parent;
      }
      return findScrollableParent(parent);
    };

    if (topRef.current) {
      const scrollableParent = findScrollableParent(topRef.current);
      if (scrollableParent) {
        scrollableParent.scrollTop = 0;
      }
    }
    // Also reset window scroll for mobile view
    window.scrollTo(0, 0);
  }, [id]);

  // Compute reader styles based on settings
  const readerStyles = useMemo(() => ({
    fontSize: `${settings.fontSize}px`,
    fontFamily: fontFamilyMap[settings.fontFamily] || fontFamilyMap.bookerly,
    lineHeight: settings.lineHeight,
    paddingLeft: `${settings.marginHorizontal}px`,
    paddingRight: `${settings.marginHorizontal}px`,
  }), [settings]);

  if (!bookProps) return null;

  return (
    <>
      <AppToolbar
        type="reader"
        title={bookProps?.title || ""}
        onMenuClick={() => console.log("Menu clicked")}
      />
      <div ref={topRef}>
        <div className="overflow-hidden p-0">
          <div className="mt-1.5 -mx-2.5 [&_img]:object-cover [&_img]:w-full [&_img]:max-h-[40vh]">
            {typeof bookProps.cover == "string" && (
              <>
                <ImageBlock alt="Cover" src={bookProps.cover} />
                <meta itemProp="thumbnailUrl" content={bookProps.cover} />
              </>
            )}
          </div>
          <div style={{ paddingLeft: readerStyles.paddingLeft, paddingRight: readerStyles.paddingRight }}>
            <Typography itemScope itemType="http://schema.org/Review">
              <h1 itemProp="name">{bookProps.title}</h1>
              <div className="text-[var(--eink-ink-muted)] text-sm mb-4">
                <time itemProp="datePublished" dateTime={bookProps.createAt}>
                  {formatDate(bookProps.createAt, locale)}
                </time>
              </div>

              <section
                itemProp="reviewBody"
                style={{
                  fontSize: readerStyles.fontSize,
                  fontFamily: readerStyles.fontFamily,
                  lineHeight: readerStyles.lineHeight,
                }}
              >
                {reviewContent}
              </section>
            </Typography>

            <GiscusComments locale={locale} />
          </div>
        </div>
      </div>
    </>
  );
}
