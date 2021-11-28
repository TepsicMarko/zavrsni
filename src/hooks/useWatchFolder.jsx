import { useState, useEffect } from "react";

const useWatchFolder = (initialPath, watch, handleChange) => {
  const [path, setPath] = useState(initialPath);
  const [folderContent, setFolderContent] = useState([]);

  useEffect(() => {
    handleChange(path, setFolderContent);

    const watcher = watch(path, () => handleChange(path, setFolderContent));

    return watcher.close;
  }, [path]);

  return [folderContent, setPath];
};

export default useWatchFolder;
