import { useEffect, useState } from "react";
import type { FC } from "react";
import { getHighlighter, type Highlighter } from "shiki";
import onigWasm from "shiki/onig.wasm?url";
import voyGrammar from "../../assets/voyd.tmLanguage.json";

let highlighterPromise: Promise<Highlighter> | null = null;
function loadHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = (getHighlighter as any)({
      themes: ["github-dark"],
      langs: [
        "bash",
        "javascript",
        "typescript",
        {
          name: "voyd",
          scopeName: "source.voyd",
          grammar: voyGrammar,
        } as any,
      ],
      wasm: onigWasm,
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
      });
      setHtml(
        highlighted.replace(
          '<pre class="shiki"',
          '<pre class="shiki rounded-md p-6 overflow-x-auto shadow w-full"'
        )
      );
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
        className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
      >
        Copy
      </button>
    </div>
  );
};

export default CodeBlock;
