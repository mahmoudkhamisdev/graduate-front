import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/tokyo-night-dark.css"; // dark code theme

// Simple SVG icons for bullets, quotes, etc.
// You can replace these with Heroicons / react-icons / lucide-react if you prefer.
const BulletIcon = () => (
  <svg
    className="w-2 h-2 flex-shrink-0 text-blue-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 8 8"
  >
    <circle cx="4" cy="4" r="3" />
  </svg>
);

const QuoteIcon = () => (
  <svg
    className="w-4 h-4 flex-shrink-0 text-zinc-400 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4v14zM19 21h-4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4v14z" />
  </svg>
);

export default function MarkdownRenderer({ content }) {
  // Detect right-to-left for Arabic
  const isArabic = /[\u0600-\u06FF]/.test(content);
  const direction = isArabic ? "rtl" : "ltr";

  return (
    <div
      className="prose max-w-none dark:prose-invert text-base"
      dir={direction}
    >
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // === HEADINGS ===
          h1({ children }) {
            return (
              <h1 className="flex items-center text-3xl font-bold border-b border-zinc-700 pb-2 my-6">
                {/* You could insert a heading icon here if desired */}
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="flex items-center text-2xl font-semibold border-b border-zinc-700 pb-1 mt-8 mb-4">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-xl font-semibold mt-6 mb-2">{children}</h3>
            );
          },

          // === PARAGRAPHS (default) ===
          p({ children }) {
            return <p className="my-2">{children}</p>;
          },

          // === INLINE CODE ===
          code({ node, inline, className, children, ...props }) {
            if (inline) {
              return (
                <code className="bg-zinc-800 text-sm px-1 py-0.5 rounded text-zinc-100 font-mono">
                  {children}
                </code>
              );
            }
            // FALLBACK – block-level code is handled below
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },

          // === CODE BLOCKS ===
          pre({ node, children, ...props }) {
            return (
              <pre
                className="bg-zinc-900 border border-zinc-700 text-sm p-4 my-4 rounded-md overflow-auto relative"
                {...props}
              >
                {/* Copy icon/button can go here if desired */}
                <code className="font-mono">{children}</code>
              </pre>
            );
          },

          // === LINKS ===
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {children}
              </a>
            );
          },

          // === BLOCKQUOTE ===
          blockquote({ children }) {
            return (
              <div className="flex items-start bg-zinc-800 border-l-4 border-blue-500 pl-4 py-2 my-4 rounded-r-md">
                <QuoteIcon />
                <div className="italic text-zinc-300">{children}</div>
              </div>
            );
          },

          // === BULLET LISTS ===
          ul({ children }) {
            return <ul className="my-2 space-y-1">{children}</ul>;
          },
          // li({ children }) {
          //   return (
          //     <li className="flex items-start">
          //       <div className="mr-2 mt-[3px]">
          //         <BulletIcon />
          //       </div>
          //       <span>{children}</span>
          //     </li>
          //   );
          // },

          // === ORDERED LISTS ===
          ol({ children }) {
            return (
              <ol className="list-decimal pl-8 my-2 space-y-1">{children}</ol>
            );
          },

          // === TABLES ===
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="w-full border border-zinc-600 rounded-md">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-zinc-800">{children}</thead>;
          },
          tbody({ children }) {
            return <tbody>{children}</tbody>;
          },
          tr({ children }) {
            return (
              <tr className="border-b border-zinc-700 last:border-none">
                {children}
              </tr>
            );
          },
          th({ children }) {
            return (
              <th className="px-4 py-2 text-left text-zinc-100">{children}</th>
            );
          },
          td({ children }) {
            return <td className="px-4 py-2 text-zinc-200">{children}</td>;
          },

          // === HORIZONTAL RULE ===
          hr() {
            return <hr className="border-t border-zinc-700 my-6" />;
          },

          // === IMAGES (optional styling) ===
          img({ src, alt }) {
            return (
              <img src={src} alt={alt} className="max-w-full rounded-md my-4" />
            );
          },
        }}
      />
    </div>
  );
}
