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
    fn: (folder) => (!folder ? currentPath : changePath(folder)),
  },

  ls: {
    description: "list directory contents",
    fn: (path) =>
      !path ? listFolderContents(currentPath) : listFolderContents(path),
  },
  dir: {
    description: "Displays a list of files and subdirectories in a directory.",
    fn: (path) =>
      !path ? listFolderContents(currentPath) : listFolderContents(path),
  },
});

export default commands;
