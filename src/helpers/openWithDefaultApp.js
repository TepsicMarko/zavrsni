import { path as Path } from "filer";

const openWithDefaultApp = (type, path, name, openApp) => {
  type === "directory"
    ? openApp("File Explorer", {
        customPath: Path.join(path, name),
      })
    : openApp("Notepad", { path: Path.join(path, name) });
};

export default openWithDefaultApp;
