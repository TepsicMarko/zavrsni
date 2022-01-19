import { path as Path } from "filer";
import getFileType from "./getFileType";

const openWithDefaultApp = (type, path, name, openApp) => {
  type = type.toLowerCase();

  if (type === "directory")
    openApp("File Explorer", {
      customPath: Path.join(path, name),
    });
  if (type === "file") {
    const fileType = getFileType(Path.extname(name));
    if (fileType === "text")
      openApp("Notepad", { path: Path.join(path, name) });
    if (fileType === "image")
      openApp("Photos", { path: Path.join(path, name) });
    if (fileType === "video")
      openApp("Movies And TV", { path: Path.join(path, name) });
  }
};

export default openWithDefaultApp;
