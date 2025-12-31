"use client";

import Image from "next/image";
import Link from "next/link";
import type { IPost } from "@/types/index";

interface BookCoverProps {
  book: IPost;
  locale: string;
}

export default function BookCover({ book, locale }: BookCoverProps) {
  const title = book.frontmatter.title || book.defaultTitle;
  const cover = book.frontmatter.cover;
  const slug = book.slug;

  return (
    <Link
      href={`/${locale}/review/${slug}`}
      className="block"
    >
      <div
        className="w-full relative overflow-hidden border"
        style={{
          aspectRatio: "2/3",
          borderColor: "var(--eink-ink-muted)",
          backgroundColor: cover ? "transparent" : "var(--eink-paper-secondary)",
        }}
      >
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <h3
              className="text-center font-serif text-sm line-clamp-4"
              style={{ color: "var(--eink-ink)" }}
            >
              {title}
            </h3>
          </div>
        )}
      </div>
    </Link>
  );
}
