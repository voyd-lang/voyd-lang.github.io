import { useCallback, useMemo, useRef, useState } from "react";
import { Editor, type OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";
import { loadWASM } from "onigasm";
import voydGrammar from "../../assets/voyd.tmLanguage.json";

// Vite-friendly way to get the oniguruma wasm URL
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - vite adds the ?url suffix type
import onigWasmUrl from "onigasm/lib/onigasm.wasm?url";

export interface VoydEditorProps {
  value?: string;
  placeholder?: string;
  height?: string | number;
  className?: string;
  onChange?: (code: string) => void;
  onPlay?: (code: string) => void;
}

const VOYD_LANGUAGE_ID = "voyd";
const VOYD_SCOPE = "source.voyd";

let registryInstance: Registry | null = null;
let tmInitPromise: Promise<Registry> | null = null;

async function ensureTmGrammars(monaco: typeof Monaco): Promise<Registry> {
  if (!tmInitPromise) {
    tmInitPromise = (async () => {
      // Load the Oniguruma WASM engine
      const wasm = await fetch(onigWasmUrl).then((r) => r.arrayBuffer());
      await loadWASM(wasm);

      // Register the custom language with Monaco
      monaco.languages.register({ id: VOYD_LANGUAGE_ID });

      // Setup TextMate registry using our bundled grammar
      registryInstance = new Registry({
        getGrammarDefinition: async (_scopeName: string) => {
          return { format: "json", content: voydGrammar as any } as const;
        },
      });

      return registryInstance;
    })();
  }
  return tmInitPromise;
}

export default function VoydEditor({
  value = "",
  placeholder,
  height = 320,
  className,
  onChange,
  onPlay,
}: VoydEditorProps) {
  const [code, setCode] = useState(value);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  // Avoid SSR hydration mismatches: render a lightweight fallback on the server
  if (typeof window === "undefined") {
    return (
      <div className={"relative w-full " + (className ?? "")}> 
        <pre className="not-prose size-full rounded p-4 overflow-x-auto bg-[#0e1116] text-[#c9d1d9]" style={{ height }}>
          {code}
        </pre>
      </div>
    );
  }

  const handleChange = useCallback(
    (val?: string) => {
      const next = val ?? "";
      setCode(next);
      onChange?.(next);
    },
    [onChange]
  );

  const beforeMount = useCallback((monaco: typeof Monaco) => {
    // Ensure our language is known before model creation
    monaco.languages.register({ id: VOYD_LANGUAGE_ID });
  }, []);

  const onMount: OnMount = useCallback(async (editor, monaco) => {
    editorRef.current = editor;

    const registry = await ensureTmGrammars(monaco);

    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, VOYD_LANGUAGE_ID);
    }

    // Use a dark theme for better contrast
    monaco.editor.setTheme("vs-dark");

    // Wire TM grammars with editor instance so tokens map to theme
    const grammars = new Map<string, string>();
    grammars.set(VOYD_LANGUAGE_ID, VOYD_SCOPE);
    await wireTmGrammars(monaco, registry, grammars, editor);
  }, []);

  const play = useCallback(() => {
    onPlay?.(editorRef.current?.getValue() ?? code);
  }, [onPlay, code]);

  const options = useMemo<Monaco.editor.IStandaloneEditorConstructionOptions>(
    () => ({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      quickSuggestions: false,
      placeholder,
    }),
    [placeholder]
  );

  return (
    <div className={"relative w-full " + (className ?? "")}> 
      <Editor
        value={code}
        defaultLanguage={VOYD_LANGUAGE_ID}
        beforeMount={beforeMount}
        onMount={onMount}
        onChange={handleChange}
        height={height}
        theme="vs-dark"
        options={options}
      />
      <button
        type="button"
        onClick={play}
        className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d]"
        aria-label="Play"
        title="Play"
      >
        ▶︎ Play
      </button>
    </div>
  );
}
