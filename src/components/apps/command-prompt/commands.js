import moment from "moment";

const commands = (
  terminal,
  currentPath,
  changePath,
  listFolderContents,
  endProcess,
  createNewFolders,
  deleteFolders,
  createNewFiles,
  readFiles
) => ({
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

  date: {
    description: "print or set the system date and time",
    fn: () => moment().format("ddd MMM DD HH:mm:ss YYYY "),
  },

  echo: {
    description: "Echo the STRING(s) to standard output.",
    fn: (...args) => args.map((arg, i) => (i === 0 ? arg : ` ${arg}`)).join(""),
  },

  cls: {
    description: "clears the screen",
    fn: () => console.clear(terminal.current.clearStdout()),
  },

  exit: {
    description:
      "Quits the CMD.EXE program (command interpreter) or the current batch file.",
    fn: () => endProcess("Command Prompt"),
  },

  mkdir: {
    description: "Create the DIRECTORY(ies), if they do not already exist.",
    fn: (...args) =>
      args.length
        ? createNewFolders("mkdir", ...args)
        : "mkdir: missing operand",
  },
  md: {
    description: "Creates a directory.",
    fn: (...args) =>
      args.length
        ? createNewFolders("md", ...args)
        : "The syntax of the command is incorrect.",
  },

  rm: {
    description: "remove files or directories",
    fn: (flag, ...args) =>
      flag
        ? flag === "-rf"
          ? args.length
            ? deleteFolders("rm", true, ...args)
            : "rm: missing operand"
          : deleteFolders("rm", false, ...[flag, ...args])
        : "rm: missing operand",
  },
  rmdir: {
    description: "Removes (deletes) a directory",
    fn: (...args) =>
      args.length
        ? deleteFolders("rmdir", false, ...args)
        : "The syntax of the command is incorrect.",
  },

  touch: {
    description: "Creates an empty file.",
    fn: (...args) => (args.length ? createNewFiles(...args) : ""),
  },

  cat: {
    description: " Concatenate FILE(s) to standard output.",
    fn: (...args) => (args ? readFiles(...args) : ""),
  },
});

export default commands;
