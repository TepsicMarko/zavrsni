import { path as Path } from "filer";

const useExternalFileDrop = (createFSO, createBlob) => {
  const handleExternalFileDrop = (e, dropzone) => {
    e.preventDefault();
    console.log(e.dataTransfer.files);

    if (e.dataTransfer.files.length === 1) {
      const file = e.dataTransfer.files[0];

      if (file.type.startsWith("text")) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const content = e.target.result;
          createFSO(dropzone, file.name, file.type, content);
        };

        reader.readAsText(file);
      }

      if (file.type.startsWith("image")) {
        const reader = new FileReader();

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
        console.log("reading video");
        const reader = new FileReader();

        reader.onload = (e) => {
          const buffer = e.target.result;
          createBlob(dropzone, file.name, buffer);
        };

        reader.readAsArrayBuffer(file);
      }
    }
  };

  return [handleExternalFileDrop];
};

export default useExternalFileDrop;
