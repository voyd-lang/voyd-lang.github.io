import { useEffect, useState } from "react";
import type { FC } from "react";
import { createHighlighter, type Highlighter, type LanguageInput } from "shiki";
import voydGrammar from "../../assets/voyd.tmLanguage.json";

let highlighterPromise: Promise<Highlighter> | null = null;
function loadHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: [
        "bash",
        "javascript",
        "typescript",
        "tsx",
        voydGrammar as unknown as LanguageInput,
      ],
    });
  }
  return highlighterPromise!;
}

interface Props {
  code: string;
  lang?: string;
}

const CodeBlock: FC<Props> = ({ code, lang = "voyd" }) => {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    loadHighlighter().then((h) => {
      const highlighted = h.codeToHtml(code.trim(), {
        lang,
        theme: "github-dark",
        transformers: [
          {
            pre(node) {
              this.addClassToHast(
                node,
                "not-prose size-full rounded p-4 overflow-x-scroll"
              );
            },
          },
        ],
      });
      setHtml(highlighted);
    });
  }, [code, lang]);

  function copy() {
    navigator.clipboard.writeText(code);
  }

  return (
    <div className="relative w-full">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <button
        onClick={copy}
        className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d]"
      >
        Copy
      </button>
    </div>
  );
};

export default CodeBlock;
