import { path as Path } from "filer";
import getFileType from "./getFileType";

const getFolderContent = async (dirReader) => {
  let results = await readEntriesPromise(dirReader);

  const folderContent = await Promise.all(
    results.map(async (result) =>
      result.isFile
        ? result
        : [result, ...(await getFolderContent(result.createReader()))]
    )
  );

  return folderContent.flat();
};

const readEntriesPromise = async (dirReader) =>
  await new Promise((resolve, reject) =>
    dirReader.readEntries(resolve, reject)
  );

const handleExternalFileDrop = async (
  entries,
  dropzone,
  setProgress,
  createFSO,
  createBlob,
  fileReaderRef,
  setFileCount,
  isCalledInFolder,
  customProgress
) => {
  const reader = new FileReader();
  fileReaderRef.current = reader;

  const handleProgress = ({ loaded, total }) => {
    customProgress && console.log(customProgress, entries[0].isFile);
    isCalledInFolder || customProgress
      ? setProgress(
          Math.round((customProgress.loaded / customProgress.total) * 100)
        )
      : setProgress(Math.round((loaded / total) * 100));
  };

  if (entries.length === 1) {
    const entry = entries[0];

    if (entry.isFile) {
      const fileType = getFileType(Path.extname(entry.name));

      return await new Promise((resolve, reject) => {
        if (!fileType) {
          entry.file((file) => {
            reader.onprogress = handleProgress;

            reader.onload = (e) => {
              const content = e.target.result;
              createFSO(
                dropzone,
                Path.basename(entry.name, Path.extname(entry.name)),
                Path.extname(entry.name).substring(1),
                content
              );
              resolve();
            };

            reader.readAsText(file);
          });
        }

        if (fileType === "text")
          entry.file((file) => {
            reader.onprogress = handleProgress;

            reader.onload = (e) => {
              const content = e.target.result;
              createFSO(
                dropzone,
                Path.basename(entry.name, Path.extname(entry.name)),
                Path.extname(entry.name).substring(1),
                content
              );
              resolve();
            };

            reader.readAsText(file);
          });

        if (fileType === "image")
          entry.file((file) => {
            reader.onprogress = handleProgress;

            reader.onload = (e) => {
              const content = e.target.result;
              createFSO(
                dropzone,
                Path.basename(entry.name, Path.extname(entry.name)),
                Path.extname(entry.name).substring(1),
                content
              );
              resolve();
            };

            reader.readAsDataURL(file);
          });

        if (fileType === "video")
          entry.file((file) => {
            reader.onprogress = handleProgress;

            reader.onload = (e) => {
              const buffer = e.target.result;
              createBlob(dropzone, entry.name, buffer);
              resolve();
            };

            reader.readAsArrayBuffer(file);
          });
      });
    }

    if (entry.isDirectory) {
      const dirReader = entry.createReader();

      createFSO(dropzone, entry.fullPath, "directory", "");
      handleProgress({});

      if (!isCalledInFolder) {
        const folderContent = await getFolderContent(dirReader);

        setFileCount(folderContent.length);
        handleProgress({}, { loaded: 0, total: folderContent.length });

        for (let [i, item] of folderContent.entries()) {
          await handleExternalFileDrop(
            [item],
            item.isFile
              ? Path.join(dropzone, Path.dirname(item.fullPath))
              : dropzone,
            setProgress,
            createFSO,
            createBlob,
            setFileCount,
            fileReaderRef,
            true,
            { loaded: i, total: folderContent.length }
          );
        }
      }
    }
  }

  if (entries.length > 1) {
    for (let [i, entry] of entries.entries()) {
      await handleExternalFileDrop(
        [entry],
        dropzone,
        setProgress,
        createFSO,
        createBlob,
        setFileCount,
        fileReaderRef,
        true,
        { loaded: i, total: entries.length - 1 }
      );
    }
  }
};

export default handleExternalFileDrop;
