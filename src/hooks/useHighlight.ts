import { createElement, Fragment, ReactNode } from "react";
import refractor from "refractor/core";

import { randId } from "../utils/helpers";
import {parseAST} from "../utils/parse-ast";

import { CancelRef } from "../types/hooks/types";

const addLine = (output: ReactNode, index: number) =>
    createElement(
        Fragment,
        { key: randId() },
        createElement("span", { className: "line", key: randId() }, `${index}.`),
        createElement("span", { className: "content", key: randId() }, output)
    );

export const highlight = async (
    code: string,
    language: string,
    isCancelled: CancelRef
): Promise<ReactNode[] | null> => {
    if (!refractor.registered(language)) {
        try {
            const lang = await import(`refractor/lang/${language}`);
            refractor.register(lang);
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    const lines = code.split("\n");
    return Promise.all(
        lines.map(async (trimmedLine, idx) => {
            const line = trimmedLine + (idx === lines.length - 1 ? "" : "\n");
            if (isCancelled.current) {
                return line;
            }
            if (isCancelled.current) {
                return line;
            }
            const ast = refractor.highlight(line, language);

            return await parseAST(ast, isCancelled);
        })
    ).then(highlightedLines =>
        highlightedLines.map((element, index) => addLine(element, index))
    );
};
