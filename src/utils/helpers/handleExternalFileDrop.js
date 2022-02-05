import { path as Path } from "filer";

const handleExternalFileDrop = (
  files,
  dropzone,
  setProgress,
  createFSO,
  createBlob,
  fileReaderRef
) => {
  const handleProgress = ({ loaded, total }) => {
    setProgress(Math.round((loaded / total) * 100));
  };

  if (files.length === 1) {
    const file = files[0];
    const reader = new FileReader();
    fileReaderRef.current = reader;

    if (file.type.startsWith("text")) {
      reader.onprogress = handleProgress;

      reader.onload = (e) => {
        const content = e.target.result;
        createFSO(
          dropzone,
          Path.basename(file.name, Path.extname(file.name)),
          Path.extname(file.name).substring(1),
          content
        );
      };

      reader.readAsText(file);
    }

    if (file.type.startsWith("image")) {
      reader.onprogress = handleProgress;

      reader.onload = (e) => {
        const content = e.target.result;
        createFSO(
          dropzone,
          Path.basename(file.name, Path.extname(file.name)),
          Path.extname(file.name).substring(1),
          content
        );
      };

      reader.readAsDataURL(file);
    }

    if (file.type.startsWith("video")) {
      reader.onprogress = handleProgress;

      reader.onload = (e) => {
        const buffer = e.target.result;
        createBlob(dropzone, file.name, buffer);
      };

      reader.readAsArrayBuffer(file);
    }
  }
};

export default handleExternalFileDrop;
