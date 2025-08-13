import type { Route } from "./+types/docs";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import readme from "../../docs/README.md?raw";
import basics from "../../docs/basics.md?raw";
import CodeBlock from "../components/CodeBlock";
import { useEffect, useMemo, useRef } from "react";

export const prerender = true;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Voyd Documentation" },
    {
      name: "description",
      content: "Documentation for the Voyd programming language.",
    },
  ];
}

export default function Docs() {
  const headings = useMemo(() => {
    const all = [readme, basics].join("\n");
    const regex = /^(##+)\s+(.*)$/gm;
    const out: { id: string; text: string; level: number }[] = [];
    let m: RegExpExecArray | null;
    while ((m = regex.exec(all))) {
      const level = m[1].length;
      const text = m[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      out.push({ id, text, level });
    }
    return out;
  }, []);

  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const nav = navRef.current;
            if (!nav) return;
            nav.querySelectorAll("a").forEach((a) => {
              if (a.getAttribute("href") === `#${id}`) {
                a.classList.add("text-[#58a6ff]", "font-medium");
              } else {
                a.classList.remove("text-[#58a6ff]", "font-medium");
              }
            });
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );
    const els = Array.from(document.querySelectorAll("h2, h3"));
    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, []);

  const components: Components = {
    code({ className, children }) {
      const match = /language-(\w+)/.exec(className || "");
      const lang = match ? match[1] : "voyd";

      return (
        <CodeBlock
          code={String(children).replace(/\n$/, "")}
          lang={lang === "rust" ? "voyd" : lang}
        />
      );
    },
    pre({ node: _node, ...props }) {
      return <pre className="not-prose" {...props} />;
    },
  };

  return (
    <main className="flex w-full max-w-6xl mx-auto py-16 px-4 gap-8">
      <aside className="hidden md:block w-64 flex-shrink-0 sticky top-20 h-max">
        <nav ref={navRef} className="space-y-2 text-sm">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block hover:underline ${h.level === 3 ? "ml-4" : ""} text-[#8b949e]`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0 max-w-3xl space-y-8 prose prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
          components={components}
        >
          {readme}
        </ReactMarkdown>
        <hr className="my-8" />
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
          components={components}
        >
          {basics}
        </ReactMarkdown>
      </div>
    </main>
  );
}
