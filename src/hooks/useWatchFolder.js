import { useState, useEffect } from 'react';

const useWatchFolder = (initialPath, watch, handleChange, setItemCount) => {
  const [path, setPath] = useState(initialPath);
  const [folderContent, setFolderContent] = useState([]);

  const sortFolderContent = (sortBy) => {
    setFolderContent((currFolderContent) =>
      currFolderContent.sort((fileA, fileB) =>
        typeof fileA[sortBy] === 'string'
          ? fileA[sortBy].localeCompare(fileB[sortBy])
          : fileA[sortBy] - fileB[sortBy]
      )
    );
  };

  useEffect(() => {
    handleChange(path, setFolderContent);

    const watcher = watch(path, () => handleChange(path, setFolderContent));
    watcher.on('rename', () => console.log('rename'));

    return watcher.close;
  }, [path]);

  useEffect(() => {
    const nItems = folderContent.length;
    setItemCount &&
      setItemCount(nItems > 0 ? (nItems > 1 ? nItems + ' items' : '1 item') : '0 items');
  }, [folderContent.length]);

  return [folderContent, setPath, sortFolderContent];
};

export default useWatchFolder;
