"use client";

import React, { useEffect } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
	jsx,
	javascript,
	bash,
	sass,
	scss,
	typescript,
} from "react-syntax-highlighter/dist/cjs/languages/prism";

interface CodeBlockProps {
	node?: any;
	inline?: boolean;
	className?: string;
	children?: React.ReactNode;
	[key: string]: any;
}

const CodeBlock = ({ node, inline, className, children, ...props }: CodeBlockProps) => {
	useEffect(() => {
		SyntaxHighlighter.registerLanguage("jsx", jsx);
		SyntaxHighlighter.registerLanguage("javascript", javascript);
		SyntaxHighlighter.registerLanguage("js", javascript);
		SyntaxHighlighter.registerLanguage("typescript", typescript);
		SyntaxHighlighter.registerLanguage("ts", typescript);
		SyntaxHighlighter.registerLanguage("bash", bash);
		SyntaxHighlighter.registerLanguage("sass", sass);
		SyntaxHighlighter.registerLanguage("scss", scss);
	}, []);

	// Extracting the language - support both MDX and react-markdown formats
	let language: string | null = null;
	
	// MDX format: className is passed directly as a prop
	if (typeof className === "string" && className.startsWith("language-")) {
		language = className.replace("language-", "");
	} 
	// React-markdown format: className is in node.properties
	else if (node?.properties?.className) {
		const nodeClassName = node.properties.className;
		const match = Array.isArray(nodeClassName) 
			? nodeClassName.find((cn: string) => cn.startsWith("language-"))
			: typeof nodeClassName === "string" && nodeClassName.startsWith("language-") 
				? nodeClassName 
				: null;
		language = match ? match.replace("language-", "") : null;
	}

	// Check if this is inline code
	const isInline = inline || (!language && typeof children === "string" && !children.includes("\n"));

	if (isInline) {
		return <code className={className} {...props}>{children}</code>;
	}

	// Ensure children is a string for syntax highlighter
	const codeString = typeof children === "string" 
		? children 
		: Array.isArray(children) 
			? children.join("") 
			: String(children || "");

	return (
		<figure className="max-h-[90vh] overflow-auto max-md:w-screen max-md:relative max-md:left-1/2 max-md:right-1/2 max-md:-ml-[50vw] max-md:-mr-[50vw] [&_pre]:max-md:!rounded-none">
			<SyntaxHighlighter language={language || "text"} style={atomDark}>
				{codeString.replace(/\n$/, "")}
			</SyntaxHighlighter>
		</figure>
	);
};

export default CodeBlock;
