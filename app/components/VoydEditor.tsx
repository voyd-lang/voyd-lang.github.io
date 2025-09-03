import { useMemo, useState } from "react";
import { shikiToMonaco } from "@shikijs/monaco";
import { highlighter } from "./CodeBlock";
import { Editor } from "@monaco-editor/react";

export interface VoydEditorProps {
  value?: string;
  placeholder?: string;
  height?: string | number;
  className?: string;
  onChange?: (code: string | undefined) => void;
  onPlay?: (code: string | undefined) => void;
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

  // Initialize modern-monaco (manual mode) and create the editor

  const play = useMemo(
    () => () => {
      onPlay?.(code);
    },
    [onPlay, code]
  );

  return (
    <div className={"relative w-full " + (className ?? "")}>
      <Editor
        className="size-full"
        height={height}
        defaultLanguage="voyd"
        defaultValue={value}
        options={{
          minimap: { enabled: false },
        }}
        onMount={(_, monaco) => {
          monaco.languages.register({ id: "voyd" });
          shikiToMonaco(highlighter, monaco as any);
        }}
        onChange={(v) => {
          if (v) setCode(v);
          if (onChange) onChange(v);
        }}
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
