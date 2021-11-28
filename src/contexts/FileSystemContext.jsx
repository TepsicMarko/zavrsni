import { createContext, useEffect, useState } from "react";
import { path as Path, fs } from "filer";

export const FileSystemContext = createContext();

export const FileSystemProvider = ({ children }) => {
  const mkdir = (path, name, i = 1) =>
    fs.mkdir(`${path}/${name}`, (err) => {
      console.log(err);
      if (
        err?.code === "EEXIST" &&
        (name === "New Folder" ||
          name.slice(0, name.indexOf("(") - 1) === "New Folder")
      ) {
        mkdir(
          path,
          (i > 1 ? name.slice(0, name.indexOf("(") - 1) : name) + ` (${i + 1})`,
          i + 1
        );
      }
    });

  const writeFile = (path, i = 1) => {
    exists(path)
      .then((exists) =>
        writeFile(
          (i > 1 ? path.slice(0, path.indexOf("(") - 1) : path) + ` (${i + 1})`,
          i + 1
        )
      )
      .catch((doesntExist) =>
        fs.writeFile(path, "", (err) => console.log(err))
      );
  };
  const link = (
    filePath,
    linkPath //hard coded for now
  ) => fs.link(filePath, "/C/users/admin", (err) => console.log(err));

  const readdir = (path) =>
    new Promise((resolve, reject) => {
      fs.readdir(path, { withFileTypes: true }, (err, files) =>
        err ? reject(err) : resolve(files)
      );
    });

  const exists = (path) =>
    new Promise((resolve, reject) => {
      fs.exists(path, (exists) => (exists ? resolve(true) : reject()));
    });

  const rmdir = (path) => fs.rmdir(path, (err) => console.log(err));

  const unlink = (path, name) =>
    fs.unlink(Path.join(path, name), (err) => console.log(err));

  const createFSO = (path, name, type) => {
    console.log(Path.join(path, name));
    if (type === "directory") {
      mkdir(path, name);
    } else if (type === "lnk") {
      link(Path.join(path, name));
    } else {
      writeFile(Path.join(path, name));
    }
  };

  const getFolder = (path, callback) => {
    readdir(path).then((dirContent) => callback(dirContent));
  };

  const updateFSO = (name, path) => {
    console.log(name, path);
    fs.rename(Path.join(path, name.old), Path.join(path, name.new), (err) =>
      console.log(err)
    );
  };

  const deleteFSO = (path, name, type) => {
    if (type === "directory") {
      rmdir(Path.join(path, name));
    } else {
      unlink(Path.addTrailing(path), name);
    }
  };

  const initilizeFileSystem = () => {
    console.log("initializing file system");
    mkdir("/", "C");
    mkdir("/C", "users");
    mkdir("/C/users", "admin");
    mkdir("/C/users/admin", "Desktop");
    mkdir("/C/users/admin", "Documents");
    mkdir("/C/users/admin", "Downloads");
    mkdir("/C/users/admin", "Pictures");
    mkdir("/C/users/admin", "Videos");
  };

  const watch = (path, callback) => {
    const watcher = fs.watch(path, (e) => callback());

    return watcher;
  };

  useEffect(() => {
    exists("/C/users/admin")
      .then((exists) => console.log("file system already initialized"))
      .catch((err) => initilizeFileSystem());
  }, []);

  return (
    <FileSystemContext.Provider
      value={{ createFSO, getFolder, updateFSO, deleteFSO, watch }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};
