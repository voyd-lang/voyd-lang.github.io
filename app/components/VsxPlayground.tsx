import { useRef } from "react";
import VoydEditor from "./VoydEditor";
import { compile, getWasmFn, getWasmInstance } from "voyd/browser";
import { render } from "voyd/vsx-dom/client";

export const VsxPlayground = ({ value }: { value: string }) => {
  const renderRef = useRef<HTMLDivElement>(null);

  const onPlay = async (code: string) => {
    const mod = await compile(code);
    const instance = getWasmInstance(mod);
    if (!renderRef.current) return;
    render(getWasmFn("main", instance) as unknown as any, renderRef.current, {
      instance,
    });
  };

  return (
    <div className="size-full flex space-x-6">
      <div className="h-full w-1/2">
        <VoydEditor
          value={value}
          onPlay={(c) => {
            if (c) onPlay(c);
          }}
        />
      </div>
      <div className="h-full border border-gray-500 rounded w-1/2">
        <div ref={renderRef}>
          <p className="p-8">Hit the play button in the editor to render</p>
        </div>
      </div>
    </div>
  );
};
