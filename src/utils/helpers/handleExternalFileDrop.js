import { path as Path } from "filer";
import getFileType from "./getFileType";

const handleExternalFileDrop = (
  entries,
  dropzone,
  setProgress,
  createFSO,
  createBlob,
  fileReaderRef
) => {
  const reader = new FileReader();
  fileReaderRef.current = reader;
  const handleProgress = ({ loaded, total }) => {
    setProgress(Math.round((loaded / total) * 100));
  };

  console.log(entries);

  if (entries.length === 1) {
    const entry = entries[0];
    console.log(entry, "test");

    if (entry.isFile) {
      const fileType = getFileType(Path.extname(entry.name));

      if (fileType === "text") {
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
          };

          reader.readAsText(file);
        });
      }

      if (fileType === "image") {
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
          };

          reader.readAsDataURL(file);
        });
      }

      if (fileType === "video") {
        entry.file((file) => {
          reader.onprogress = handleProgress;

          reader.onload = (e) => {
            const buffer = e.target.result;
            createBlob(dropzone, entry.name, buffer);
          };

          reader.readAsArrayBuffer(file);
        });
      }
    }

    if (entry.isDirectory) {
      const dirReader = entry.createReader();

      createFSO(dropzone, entry.name, "directory", "");

      const getEntries = () => {
        dirReader.readEntries((results) => {
          if (results.length) {
            results.forEach((result) =>
              handleExternalFileDrop(
                [result],
                Path.join(dropzone, entry.name),
                setProgress,
                createFSO,
                createBlob,
                fileReaderRef
              )
            );
          }
        });
      };
      getEntries();
    }
  }

  if (entries.length > 1) {
    // to do
  }
};

export default handleExternalFileDrop;
