const commands = (currentPath, changePath, listFolderContents) => ({
  pwd: {
    description: "Displays the name of or changes the current directory.",
    fn: () => currentPath,
  },
  chdir: {
    description: "Displays the name of or changes the current directory.",
    fn: () => currentPath,
  },

  cd: {
    description: "Displays the name of or changes the current directory.",
    fn: (folder, ...args) =>
      !folder ? currentPath : changePath([folder, ...args].join(" ")),
  },

  ls: {
    description: "list directory contents",
    fn: (path, ...args) =>
      !path
        ? listFolderContents("ls")
        : listFolderContents("ls", [path, ...args].join(" ")),
  },
  dir: {
    description: "Displays a list of files and subdirectories in a directory.",
    fn: (path, ...args) =>
      !path
        ? listFolderContents("dir")
        : listFolderContents("dir", [path, ...args].join(" ")),
  },
});

export default commands;
