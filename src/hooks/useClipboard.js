const useClipboard = () => {
  const executeClipboardComand = async (command, element) => {
    const triggerInputChange = () => {
      const event = new ClipboardEvent("input", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      element.current.dispatchEvent(event);
    };

    if (navigator.clipboard) {
      switch (command) {
        case "copy":
          {
            const selection = window.getSelection();
            await navigator.clipboard.writeText(selection.toString());
          }
          break;

        case "paste":
          {
            const selection = window.getSelection();
            selection.deleteFromDocument();
            const text = await navigator.clipboard.readText();
            const position = selection.anchorOffset;
            const selectionNode = window
              .getSelection()
              .getRangeAt(0).startContainer;

            if (!element.current.childNodes.length) {
              element.current.innerHTML = text;
            } else {
              [...element.current.childNodes].map((node) => {
                if (
                  node.nodeName === "#text" &&
                  node.isSameNode(selectionNode)
                ) {
                  node.textContent = [
                    node.textContent.slice(0, position),
                    text,
                    node.textContent.slice(position),
                  ].join("");
                } else {
                  const nodeContent = node.innerHTML;

                  (node.isSameNode(selectionNode) ||
                    node.isSameNode(selectionNode.parentNode)) &&
                    (node.innerHTML = [
                      nodeContent.slice(0, position),
                      text,
                      nodeContent.slice(position),
                    ].join(""));
                }
              });
            }

            triggerInputChange();
          }
          break;
        case "cut":
          {
            const selection = window.getSelection();
            await navigator.clipboard.writeText(selection.toString());
            selection.deleteFromDocument();
            triggerInputChange();
          }
          break;
        case "delete":
          {
            const selection = window.getSelection();
            selection.deleteFromDocument();
            triggerInputChange();
          }
          break;
      }
    } else alert("clipboard not available");
  };

  return { executeClipboardComand };
};

export default useClipboard;
