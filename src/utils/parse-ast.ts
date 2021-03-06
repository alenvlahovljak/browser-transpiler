import { createElement, ReactNode } from "react";
import { RefractorNode } from "refractor";

import { CancelRef } from "../types/hooks/types";

const extractTextFromElement = (element: RefractorNode): string => {
    if (element.type === "text") {
        return element.value;
    }
    return element.children.map(extractTextFromElement).join("");
};

function mapChild(
    child: RefractorNode,
    index: number,
    depth: number,
    isCancelled: CancelRef
): ReactNode {
    if (isCancelled.current) {
        return null;
    }

    if (child.type === "text") {
        return child.value;
    }

    const key = `${extractTextFromElement(child)}-${index}`;

    const className =
        child.properties && Array.isArray(child.properties.className)
            ? child.properties.className.join(" ")
            : child.properties.className;

    return createElement(
        child.tagName,
        {key, ...child.properties, className},
        child.children && child.children.map(mapWithDepth(depth + 1, isCancelled))
    );
}

function mapWithDepth(depth: number, isCancelled: CancelRef) {
    return function mapChildrenWithDepth(child: RefractorNode, index: number) {
        return mapChild(child, index, depth, isCancelled);
    };
}

export const parseAST = (ast: RefractorNode[], isCancelled: CancelRef) =>
    Promise.resolve(ast.map(mapWithDepth(0, isCancelled)));
