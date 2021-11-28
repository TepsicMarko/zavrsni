import { FileSystemContext } from "../contexts/FileSystemContext";
import { useState, useContext, useEffect } from "react";

const useWatchFolder = (initialPath) => {
  const [path, setPath] = useState(initialPath);
  const [folderContent, setFolderContent] = useState([]);
  const { watch, getFolder } = useContext(FileSystemContext);

  useEffect(() => {
    getFolder(path, setFolderContent);

    const watcher = watch(path, () => getFolder(path, setFolderContent));

    return watcher.close;
  }, [path]);

  return [folderContent, setPath];
};

export default useWatchFolder;
