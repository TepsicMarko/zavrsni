import moment from "moment";

const commands = (
  terminal,
  currentPath,
  changePath,
  listFolderContents,
  endProcess
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
});

export default commands;
