import { useState, useEffect } from "react";

const useWatchFolder = (initialPath, watch, handleChange, setItemCount) => {
  const [path, setPath] = useState(initialPath);
  const [folderContent, setFolderContent] = useState([]);

  useEffect(() => {
    handleChange(path, setFolderContent);

    const watcher = watch(path, () => handleChange(path, setFolderContent));
    watcher.on("rename", () => console.log("rename"));

    return watcher.close;
  }, [path]);

  useEffect(() => {
    const nItems = folderContent.length;
    setItemCount &&
      setItemCount(
        nItems > 0 ? (nItems > 1 ? nItems + " items" : "1 item") : "0 items"
      );
  }, [folderContent.length]);

  return [folderContent, setPath];
};

export default useWatchFolder;
