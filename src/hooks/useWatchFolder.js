import { useState, useEffect, useRef } from 'react';

const useWatchFolder = (path, watch, handleChange, setItemCount) => {
  const [folderContent, setFolderContent] = useState([]);
  const previusSort = useRef({ sortBy: '', order: 'ascending' });

  const sortFolderContent = (sortBy) => {
    const previousSortBy = previusSort.current.sortBy;
    const previousOrder = previusSort.current.order;

    if (previousSortBy === sortBy) {
      previusSort.current.order =
        previousOrder === 'ascending' ? 'descending' : 'ascending';
    }

    previusSort.current.sortBy = sortBy;

    setFolderContent((currFolderContent) => {
      const sortOrder = previusSort.current.order;
      // prettier-ignore
      return [
        ...currFolderContent.sort((fileA, fileB) =>
          typeof fileA[sortBy] === 'string'
            ? sortOrder === 'ascending'
              ? fileA[sortBy].localeCompare(fileB[sortBy])
              : fileB[sortBy].localeCompare(fileA[sortBy])
            : sortOrder === 'ascending'
              ? fileA[sortBy] - fileB[sortBy]
              : fileB[sortBy] - fileA[sortBy]
        ),
      ];
    });
  };

  useEffect(() => {
    handleChange(path, setFolderContent);

    const watcher = watch(path, () => handleChange(path, setFolderContent));

    return watcher.close;
  }, [path]);

  useEffect(() => {
    const nItems = folderContent.length;
    setItemCount &&
      setItemCount(nItems > 0 ? (nItems > 1 ? nItems + ' items' : '1 item') : '0 items');
  }, [folderContent.length]);

  return [folderContent, sortFolderContent];
};

export default useWatchFolder;
