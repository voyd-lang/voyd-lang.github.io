import type { Route } from "./+types/docs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import readme from "../../docs/README.md?raw";
import basics from "../../docs/basics.md?raw";
import CodeBlock from "../components/CodeBlock";
import { useEffect, useMemo, useState } from "react";

export const prerender = true;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Voyd Documentation" },
    { name: "description", content: "Documentation for the Voyd programming language." },
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

  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );
    const els = Array.from(document.querySelectorAll("h2, h3"));
    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, []);

  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const lang = match ? match[1] : "voyd";
      if (inline) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
      return (
        <CodeBlock
          code={String(children).replace(/\n$/, "")}
          lang={lang === "rust" ? "voyd" : lang}
        />
      );
    },
  };

  return (
    <main className="flex max-w-5xl mx-auto py-16 px-4 gap-8">
      <aside className="hidden md:block w-64 sticky top-20 h-max">
        <nav className="space-y-2 text-sm">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block hover:underline ${h.level === 3 ? "ml-4" : ""} ${
                active === h.id ? "text-indigo-600 font-medium" : "text-gray-400"
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </aside>
      <div className="flex-1 space-y-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
          components={components as any}
        >
          {readme}
        </ReactMarkdown>
        <hr className="my-8" />
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
          components={components as any}
        >
          {basics}
        </ReactMarkdown>
      </div>
    </main>
  );
}
