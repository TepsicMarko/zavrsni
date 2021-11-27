import { createContext, useEffect, useState } from "react";
import { path as Path, fs } from "filer";

export const FileSystemContext = createContext();

export const FileSystemProvider = ({ children }) => {
  // FS.mkdir("/test", { recursive: true }, (err) => console.log(err));
  // console.log(FS.readdir("/", (err, data) => console.log(data)));
  // // Example 3: recursive watch on /data dir
  // var watcher = FS.watch("/", { recursive: true }, (err, file) =>
  //   console.log(err, file)
  // );
  // watcher.on("change", (event, fileName) => console.log(event, fileName));
  const [state, setState] = useState(0);

  const reRenderOnFileSystemChange = () => {
    console.log("called");
    setState(Math.random());
  };

  const mkdir = (path, name) =>
    new Promise((resolve, reject) => {
      fs.mkdir(`${path}/${name}`, { recursive: true }, (err) => {
        err ? reject(err) : resolve(true);
      });
    });

  const writeFile = (path) =>
    new Promise((resolve, reject) => {
      fs.writeFile(path, "", (err) => {
        err ? reject(err) : resolve(true);
      });
    });

  const readdir = (path) =>
    new Promise((resolve, reject) => {
      fs.readdir(path, { withFileTypes: true }, (err, files) =>
        err ? reject(err) : resolve(files)
      );
    });

  const rmdir = (path) =>
    new Promise((resolve, reject) => {
      fs.rmdir(path, (err) => (err ? reject(err) : resolve(true)));
    });

  const unlink = (path, name) =>
    new Promise((resolve, reject) => {
      fs.unlink(Path.join(path, name), (err) =>
        err ? reject(err) : resolve(true)
      );
    });

  const createFSO = (path, name, type) => {
    if (type === "folder") {
      mkdir(path, name);
    } else {
      writeFile(Path.join(path, name));
    }
  };

  const getFolder = (path, callback) => {
    readdir(path).then((dirContent) => callback(dirContent));
  };

  const deleteFSO = (path, name, type) => {
    console.log(path, name, type, Path.join(path, name));
    if (type === "directory") {
      rmdir(Path.join(path, name));
    } else {
      unlink(Path.addTrailing(path), name);
    }
  };

  const initilizeFileSystem = () => {
    mkdir("/", "C");
    mkdir("/C", "users");
    mkdir("/C/users", "admin");
    mkdir("/C/users/admin", "Desktop");
  };

  useEffect(() => {
    initilizeFileSystem();
    const watcher = fs.watch("/", { recursive: true }, (e) =>
      reRenderOnFileSystemChange()
    );

    // return watcher.close();
  }, []);

  return (
    <FileSystemContext.Provider
      value={{ createFSO, getFolder, deleteFSO }}
      // value={{ createFSO, getFolder, updateFSO, deleteFSO, fs }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};
