const useExternalFileDrop = (addToFileSystem) => {
  const handleExternalFileDrop = (e, dropzone) => {
    e.preventDefault();
    console.log(e.dataTransfer.files);

    if (e.dataTransfer.files.length === 1) {
      const file = e.dataTransfer.files[0];

      if (file.type.startsWith("text")) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const content = e.target.result;
          addToFileSystem(dropzone, file.name, file.type, content);
        };

        reader.readAsText(file);
      }
    }
  };

  return [handleExternalFileDrop];
};

export default useExternalFileDrop;
