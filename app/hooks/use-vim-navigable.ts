import {
  useCallback,
  useRef,
  useState,
  KeyboardEvent,
  ForwardedRef,
} from "react";

interface NodeOffsetResult {
  node: Node;
  offset: number;
}

export const useVimNavigable = <T extends HTMLElement>(
  options: { ref?: ForwardedRef<T> | null } = {}
) => {
  const [visualAnchor, setVisualAnchor] = useState<number | null>(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const ref = useRef<HTMLElement>(null);

  const elementRef = ref || options.ref;

  const findNodeAndOffset = useCallback(
    (pos: number): NodeOffsetResult => {
      if (!elementRef.current) {
        throw new Error("Element reference is null");
      }

      let currentOffset = 0;
      const walk = document.createTreeWalker(
        elementRef.current,
        NodeFilter.SHOW_TEXT,
        null
      );

      let currentNode = walk.nextNode();
      while (currentNode) {
        const nodeLength = currentNode.textContent?.length || 0;
        if (currentOffset + nodeLength > pos) {
          return { node: currentNode, offset: pos - currentOffset };
        }
        currentOffset += nodeLength;
        currentNode = walk.nextNode();
      }

      // Fallback to last text node if position is beyond text length
      const walker = document.createTreeWalker(
        elementRef.current,
        NodeFilter.SHOW_TEXT,
        null
      );

      let lastTextNode: Node | null = null;
      let node: Node | null;
      while ((node = walker.nextNode())) {
        lastTextNode = node;
      }

      return {
        node: lastTextNode || elementRef.current,
        offset: lastTextNode ? (lastTextNode.textContent?.length || 0) - 1 : 0,
      };
    },
    [elementRef]
  );

  const getTextContent = useCallback(() => {
    if (!elementRef.current) return "";
    return elementRef.current.textContent || "";
  }, [elementRef]);

  const moveSelection = useCallback(
    (newPosition: number) => {
      if (!elementRef.current) return;

      const textContent = getTextContent();
      const textLength = textContent.length;

      // Ensure position is within bounds
      const boundedPosition = Math.max(
        0,
        Math.min(newPosition, textLength - 1)
      );

      const range = document.createRange();
      const selection = window.getSelection();

      // Function to find text node and offset for a given position
      const findNodeAndOffset = (
        pos: number
      ): { node: Node; offset: number } => {
        let currentOffset = 0;
        const walk = document.createTreeWalker(
          elementRef.current!,
          NodeFilter.SHOW_TEXT,
          null
        );

        let currentNode = walk.nextNode();
        while (currentNode) {
          const nodeLength = currentNode.textContent?.length || 0;
          if (currentOffset + nodeLength > pos) {
            return { node: currentNode, offset: pos - currentOffset };
          }
          currentOffset += nodeLength;
          currentNode = walk.nextNode();
        }

        // Fallback to element itself if no text nodes found
        if (!elementRef.current) {
          throw new Error("Element reference is null");
        }

        // Try to find the last text node
        const walker = document.createTreeWalker(
          elementRef.current,
          NodeFilter.SHOW_TEXT,
          null
        );
        let lastTextNode: Node | null = null;
        let fallbackNode: Node | null;

        while ((fallbackNode = walker.nextNode())) {
          lastTextNode = fallbackNode;
        }

        return {
          node: lastTextNode || elementRef.current,
          offset: lastTextNode
            ? (lastTextNode.textContent?.length || 0) - 1
            : 0,
        };
      };

      if (typeof visualAnchor === "number") {
        const start = Math.min(visualAnchor, boundedPosition);
        const end = Math.max(visualAnchor, boundedPosition);

        const startPos = findNodeAndOffset(start);
        const endPos = findNodeAndOffset(end);

        range.setStart(startPos.node, startPos.offset);
        range.setEnd(endPos.node, endPos.offset + 1);
      } else {
        // Normal mode - single character selection
        const pos = findNodeAndOffset(boundedPosition);
        range.setStart(pos.node, pos.offset);
        range.setEnd(pos.node, pos.offset + 1);
      }

      selection?.removeAllRanges();
      selection?.addRange(range);

      setSelectionStart(boundedPosition);
    },
    [visualAnchor, getTextContent, elementRef]
  );

  const handleFocus = useCallback(() => {
    moveSelection(0);
    setVisualAnchor(null);
    setSelectionStart(0);
  }, [moveSelection]);

  const moveForwardWord = useCallback(() => {
    const textContent = getTextContent();
    let pos = selectionStart;

    // Skip current word if we're at the start of one
    while (pos < textContent.length && /\w/.test(textContent[pos])) {
      pos++;
    }

    // Skip non-word characters
    while (pos < textContent.length && !/\w/.test(textContent[pos])) {
      pos++;
    }

    // If we found the start of a new word, move there
    if (pos < textContent.length) {
      moveSelection(pos);
    } else {
      moveSelection(textContent.length - 1);
    }
  }, [selectionStart, moveSelection, getTextContent]);

  const moveBackwardWord = useCallback(() => {
    const textContent = getTextContent();
    let pos = selectionStart;

    // Move back from current position
    pos--;

    // Skip non-word characters backwards
    while (pos >= 0 && !/\w/.test(textContent[pos])) {
      pos--;
    }

    // Skip word characters backwards
    while (pos >= 0 && /\w/.test(textContent[pos])) {
      pos--;
    }

    // Move to start of the word we found
    moveSelection(Math.min(pos + 1, textContent.length - 1));
  }, [selectionStart, moveSelection, getTextContent]);

  const getLineInfo = useCallback(() => {
    if (!elementRef.current) return null;

    const selection = window.getSelection();
    if (!selection?.rangeCount) return null;

    const currentRange = selection.getRangeAt(0);
    // Use the end point of the current selection for position reference
    const currentRect =
      typeof visualAnchor === "number"
        ? currentRange.getClientRects()[
            currentRange.getClientRects().length - 1
          ]
        : currentRange.getBoundingClientRect();

    // Get all possible character positions
    const positions: { top: number; left: number; index: number }[] = [];
    const text = getTextContent();

    // Map each character position to its coordinates
    for (let i = 0; i < text.length; i++) {
      const range = document.createRange();
      const pos = findNodeAndOffset(i);
      range.setStart(pos.node, pos.offset);
      range.setEnd(pos.node, pos.offset + 1);
      const rect = range.getBoundingClientRect();
      positions.push({ top: rect.top, left: rect.left, index: i });
    }

    // Group positions by line (same top coordinate = same line)
    const lines = positions.reduce((acc, pos) => {
      const lineIndex = acc.findIndex(
        (line) => Math.abs(line[0].top - pos.top) < 2
      );
      if (lineIndex === -1) {
        acc.push([pos]);
      } else {
        acc[lineIndex].push(pos);
      }
      return acc;
    }, [] as (typeof positions)[]);

    // Find current line
    const currentLineIndex = lines.findIndex(
      (line) => Math.abs(line[0].top - currentRect.top) < 2
    );

    return {
      lines,
      currentLineIndex,
      currentLeft: currentRect.left,
    };
  }, [findNodeAndOffset, getTextContent, visualAnchor, elementRef]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (document.activeElement !== elementRef.current) return;

      const key = e.key.toLowerCase();
      const content = getTextContent();

      switch (key) {
        case "w":
          e.preventDefault();
          moveForwardWord();
          return;
        case "b":
          e.preventDefault();
          moveBackwardWord();
          return;
        case "h":
          e.preventDefault();
          if (selectionStart > 0) {
            moveSelection(selectionStart - 1);
          }
          return;
        case "l":
          e.preventDefault();
          if (selectionStart < content.length - 1) {
            moveSelection(selectionStart + 1);
          }
          return;
        case "v":
          e.preventDefault();
          setVisualAnchor((prev) =>
            typeof prev === "number" ? null : selectionStart
          );
          return;
        case "escape":
          e.preventDefault();
          setSelectionStart(visualAnchor ?? selectionStart);
          setVisualAnchor(null);
          return;
        case "j": {
          e.preventDefault();
          const info = getLineInfo();
          if (!info) return;

          const { lines, currentLineIndex, currentLeft } = info;

          if (currentLineIndex < lines.length - 1) {
            const nextLine = lines[currentLineIndex + 1];
            const targetPos = nextLine.reduce((closest, pos) =>
              Math.abs(pos.left - currentLeft) <
              Math.abs(closest.left - currentLeft)
                ? pos
                : closest
            );
            moveSelection(targetPos.index);
          } else {
            // Handle moving to next element
            const allFocusable = Array.from(
              document.querySelectorAll('[tabindex="0"]')
            );
            const currentIndex = allFocusable.indexOf(elementRef.current!);
            if (currentIndex < allFocusable.length - 1) {
              (allFocusable[currentIndex + 1] as HTMLElement).focus();
            }
          }
          return;
        }
        case "k": {
          e.preventDefault();
          const info = getLineInfo();
          if (!info) return;

          const { lines, currentLineIndex, currentLeft } = info;

          if (currentLineIndex > 0) {
            const prevLine = lines[currentLineIndex - 1];
            const targetPos = prevLine.reduce((closest, pos) =>
              Math.abs(pos.left - currentLeft) <
              Math.abs(closest.left - currentLeft)
                ? pos
                : closest
            );
            moveSelection(targetPos.index);
          } else {
            // Handle moving to previous element
            const allFocusable = Array.from(
              document.querySelectorAll('[tabindex="0"]')
            );
            const currentIndex = allFocusable.indexOf(elementRef.current!);
            if (currentIndex > 0) {
              (allFocusable[currentIndex - 1] as HTMLElement).focus();
            }
          }
          return;
        }
      }
    },
    [
      selectionStart,
      moveForwardWord,
      moveBackwardWord,
      moveSelection,
      getTextContent,
      getLineInfo,
      elementRef,
      visualAnchor,
    ]
  );

  return {
    elementRef,
    isVisualMode: typeof visualAnchor === "number",
    handleKeyDown,
    handleFocus,
  };
};
