import {FC, useState, useEffect, useRef, SetStateAction, ReactNode, ChangeEvent} from "react";

import { highlight } from "../../hooks/useHighlight";

import { ICode } from "../../types/components/types";

import css from "./CodeEditor.module.css";

const CodeEditor: FC<ICode> = ({ id, language, value, onChange }) => {
    const [code, setCode] = useState<SetStateAction<ReactNode | string>>("");

    useEffect(() => {
        const isCancelled = { current: false };

        highlight(value, language, isCancelled)
            .then(newCode => {
                setCode(newCode);
            })
            .catch(console.error);

        return () => {
            isCancelled.current = true;
        };
    }, [value, language]);

    const codeRef = useRef(null);
    const textRef = useRef(null);

    return (
        <pre id={id} className="refractor" style={{ position: "relative" }}>
          <code ref={codeRef} className={`language-${language}`}>
            {code}
              <textarea
                  className={css.textarea}
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  ref={textRef}
                  value={value}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>): void => onChange(event.currentTarget.value)}
              />
          </code>
    </pre>
    );
};

export default CodeEditor;
