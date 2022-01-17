const commands = (currentPath, changePath, listFolderContents) => ({
  pwd: {
    description: "Print the full filename of the current working directory.",
    fn: () => currentPath,
  },
  chdir: {
    description: "Displays the name of or changes the current directory.",
    fn: (path, ...args) =>
      !path ? currentPath : changePath([path, ...args].join(" ")),
  },

  cd: {
    description: "Displays the name of or changes the current directory.",
    fn: (path, ...args) =>
      !path ? currentPath : changePath([path, ...args].join(" ")),
  },

  ls: {
    description: "list directory contents",
    fn: (path, ...args) =>
      !path
        ? listFolderContents("ls")
        : listFolderContents("ls", path, ...args),
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
