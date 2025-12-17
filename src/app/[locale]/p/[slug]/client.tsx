"use client";

import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import CodeBlock from "@/components/CodeBlock";
import ImageBlock from "@/components/ImageBlock";
import HeadingBlock from "@/components/HeadingBlock";
import FrameBlock from "@/components/FrameBlock";
import { Typography } from "@/components/ui";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";
import Giscus from "@giscus/react";

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);

  if (locale === "zh-CN") {
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
    return date.toLocaleDateString("en-US", options);
  }
}

const Cover = styled.div`
  img {
    object-fit: cover;
    width: 100%;
    max-height: 40vh;
  }
  margin: 6px -10px 0 -10px;
`;

const CommentContainer = styled.div`
  padding: 0 12px;
`;

const StyledArticlePage = styled.div`
  padding: 0;
  overflow: hidden;

  @media (min-width: 1024px) {
    padding: 0 12px;
  }

  & section[itemProp="articleBody"] {
    font-family: "Bookerly", "Noto Serif SC";
  }
`;

const ArticlePage = ({ id, postProps, postContent, locale }: {
  id: string;
  postProps: any;
  postContent: string;
  locale: string;
}) => {
  const topRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when navigating to article
  useEffect(() => {
    // Find the scrollable parent container (KindleBezel content area)
    const findScrollableParent = (element: HTMLElement | null): HTMLElement | null => {
      if (!element) return null;
      const parent = element.parentElement;
      if (!parent) return null;
      
      const style = window.getComputedStyle(parent);
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
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

  if (!postProps) return null;

  return (
    <div ref={topRef}>
      <StyledArticlePage>
        <Cover>
          {typeof postProps.cover == "string" && (
            <>
              <ImageBlock alt="Cover" src={postProps.cover} />
              <meta itemProp="thumbnailUrl" content={postProps.cover} />
            </>
          )}
        </Cover>
        <Typography itemScope itemType="http://schema.org/Article">

          <h1 itemProp="headline">{postProps.title}</h1>
          <div className="text-[var(--eink-ink-muted)] text-sm mb-4">
            <time itemProp="datePublished" dateTime={postProps.date}>
              {formatDate(postProps.date, locale)}
            </time>
          </div>

          <section itemProp="articleBody">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code: CodeBlock,
                heading: HeadingBlock,
                img: ImageBlock,
                iframe: FrameBlock,
              }}
              children={postContent}
            ></ReactMarkdown>
          </section>
        </Typography>
      </StyledArticlePage>
      {/* {giscusConfig.enabled && (
        <CommentContainer>
          <Giscus
            repo={giscusConfig.config.repo}
            repoId={giscusConfig.config.repoId}
            category={giscusConfig.config.category}
            categoryId={giscusConfig.config.categoryId}
            mapping="pathname"
            strict="0"
            reactions-enabled="1"
            emit-metadata="0"
            input-position="bottom"
            // theme={
            // 	colorScheme === "dark"
            // 		? "noborder_dark"
            // 		: "noborder_light"
            // }
            lang={giscusConfig.config.lang}
            loading="lazy"
          ></Giscus>
        </CommentContainer>
      )} */}
    </div>
  );
};

export default ArticlePage;
