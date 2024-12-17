import React from 'react';

const generateClauseNumber = (level, index) => {
    if (level === 0) return `${index + 1}. `; // Top-level: 1, 2, 3
    if (level === 1) return `(${String.fromCharCode(97 + index)}) `; // Nested: a, b, c
    if (level === 2) {
        const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi'];
        return `${romanNumerals[index]}.`; // Deeper: i, ii, iii
    }
    return `${index + 1}.`; // Fallback
};

// Counter class to maintain state
class ClauseCounter {
    constructor() {
        this.counters = new Map();
    }

    increment(level) {
        const current = this.counters.get(level) || 0;
        this.counters.set(level, current + 1);
        return current;
    }

    get(level) {
        return this.counters.get(level) || 0;
    }

    clone() {
        const newCounter = new ClauseCounter();
        this.counters.forEach((value, key) => {
            newCounter.counters.set(key, value);
        });
        return newCounter;
    }
}

const renderNode = (node, context = { 
    parentType: null, 
    color: null,
    level: 0,
    counter: new ClauseCounter(),
    index: 0,
    isFirstChild: false
}) => {
    const { type, children, text, color, ...attributes } = node;

    // Clone the counter to avoid shared state
    const counter = context.counter.clone();

    // Determine the current nesting level
    const currentLevel = type === 'clause' 
        ? (context.parentType === 'clause' ? context.level + 1 : 0)
        : context.level;

    // If this is a clause, get its number
    const clauseIndex = type === 'clause' ? counter.increment(currentLevel) : counter.get(currentLevel);

    // Merge colors the current node's color
    const mergedColor = color || context.color;

    // Handle text nodes with dynamic styling
    if (text) {
        // Add clause number prefix if this node is the first child of a clause
        const displayText = context.isFirstChild 
            ? `\n${generateClauseNumber(context.level, clauseIndex)}${text}`
            : text;

        if (displayText.includes("\n")) {
            const lines = displayText.split("\n");
            return (
                <>
                    {lines.map((line, i) => (
                        <React.Fragment key={i}>
                            <span
                                style={{
                                    whiteSpace: "pre-wrap",
                                    display: type === 'block' ? 'block' : "inline-block",
                                    backgroundColor: mergedColor || "transparent",
                                    color: mergedColor ? "white" : "inherit",
                                    fontWeight: attributes.bold ? "bold" : context.bold ? "bold" : "normal",
                                    fontStyle: attributes.italic ? "italic" : context.italic ? "italic" : "normal",
                                    textDecoration: attributes.underline ? "underline" : context.underline ? "underline" : "none",
                                    padding: mergedColor ? "2px 5px" : "0",
                                    borderRadius: mergedColor ? "4px" : "0",
                                    margin: mergedColor ? "0 4px" : "0",
                                }}
                            >
                                {line}
                            </span>
                            {i < lines.length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </>
            );
        }

        return (
            <span
                style={{
                    whiteSpace: "pre-wrap",
                    display: type === 'block' ? 'block' : "inline-block",
                    backgroundColor: mergedColor || "transparent",
                    color: mergedColor ? "white" : "inherit",
                    fontWeight: attributes.bold ? "bold" : context.bold ? "bold" : "normal",
                    fontStyle: attributes.italic ? "italic" : context.italic ? "italic" : "normal",
                    textDecoration: attributes.underline ? "underline" : context.underline ? "underline" : "none",
                    padding: mergedColor ? "2px 5px" : "0",
                    borderRadius: mergedColor ? "4px" : "0",
                    margin: mergedColor ? "0 4px" : "0",
                }}
            >
                {displayText}
            </span>
        );
    }

    // Handle nodes with children
    if (children) {
        // Special handling for clause type
        if (type === 'clause') {
            return children.map((child, i) =>
                renderNode(child, {
                    parentType: type,
                    color: mergedColor,
                    bold: attributes.bold,
                    italic: attributes.italic,
                    underline: attributes.underline,
                    level: currentLevel,
                    counter: counter,
                    index: i,
                    isFirstChild: i === 0
                })
            );
        }

        // Special handling for block and paragraph types
        if (type === 'block' || type === 'p') {
            return (
                <div 
                    style={{ 
                        display: type === 'block' ? 'block' : 'inline',
                        backgroundColor: mergedColor || "transparent",
                        color: mergedColor ? "white" : "inherit",
                    }}
                >
                    {children.map((child, index) => renderNode(child, {
                        parentType: type,
                        color: mergedColor,
                        bold: attributes.bold,
                        italic: attributes.italic,
                        underline: attributes.underline,
                        level: context.level,
                        counter: counter,
                        index: index,
                        isFirstChild: context.isFirstChild && index === 0
                    }))}
                </div>
            );
        }

        // Default rendering for other node types
        return React.createElement(
            type || "div",
            attributes,
            children.map((child, index) => renderNode(child, {
                parentType: type,
                color: mergedColor,
                bold: attributes.bold,
                italic: attributes.italic,
                underline: attributes.underline,
                level: context.level,
                counter: counter,
                index: index,
                isFirstChild: context.isFirstChild && index === 0
            }))
        );
    }

    // Default fallback (empty node)
    return null;
};

export default renderNode;