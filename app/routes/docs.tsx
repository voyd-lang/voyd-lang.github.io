import type { Route } from "./+types/docs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import readme from "../../docs/README.md?raw";
import basics from "../../docs/basics.md?raw";

export const prerender = true;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Voyd Documentation" },
    { name: "description", content: "Documentation for the Voyd programming language." },
  ];
}

export default function Docs() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 space-y-8">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
      <hr className="my-8" />
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{basics}</ReactMarkdown>
    </main>
  );
}
