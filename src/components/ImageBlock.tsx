"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ImageBlockProps {
	node: any;
	alt: string;
	src: string;
}

type NonArticleUsageProps = Pick<ImageBlockProps, "node">;

type ArticleUsageProps = Pick<ImageBlockProps, "src" | "alt">;

const ImageBlock = (props: ArticleUsageProps | NonArticleUsageProps) => {
	let src: string;
	let alt: string;

	// Type guard to check if 'node' is present in props
	if ("node" in props) {
		// Props are of type NonArticleUsageProps
		src = props.node?.properties?.src;
		alt = props.node?.properties?.alt;
	} else {
		// Props are of type ArticleUsageProps
		src = props.src;
		alt = props.alt;
	}

	const width = 1000; // Example width for maintaining 1:1 aspect ratio
	const height = 1000; // Example height for maintaining 1:1 aspect ratio

	return (
		<>
			<div className="w-full relative mb-2">
				<Image
					src={src}
					alt={alt}
					layout="responsive"
					width={width}
					height={height}
					objectFit="contain" // Ensures the image fits within the container, maintaining its aspect ratio without cropping.
				/>
			</div>
			{alt && <div className="text-center text-[#666] text-sm">{alt}</div>}
		</>
	);
};

export default ImageBlock;
