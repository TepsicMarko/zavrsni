import { createContext, useEffect, useState } from "react";
import { path as Path, fs } from "filer";

export const FileSystemContext = createContext();

export const FileSystemProvider = ({ children }) => {
  const mkdir = (path, name) =>
    fs.mkdir(`${path}/${name}`, (err) => console.log(err));

  const writeFile = (path) => fs.writeFile(path, "", (err) => console.log(err));

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

  const rmdir = (path) => fs.rmdir(path, (err) => console.log(err));

  const unlink = (path, name) =>
    fs.unlink(Path.join(path, name), (err) => console.log(err));

  const createFSO = (path, name, type) => {
    console.log(Path.join(path, name));
    if (type === "folder") {
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

  const deleteFSO = (path, name, type) => {
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

  const watch = (path, callback) => {
    const watcher = fs.watch(path, { recursive: true }, (e) => callback());

    return watcher;
  };

  useEffect(() => initilizeFileSystem(), []);

  return (
    <FileSystemContext.Provider
      value={{ createFSO, getFolder, deleteFSO, watch }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};
