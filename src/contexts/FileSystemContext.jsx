import { createContext, useEffect } from "react";
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

  const writeFile = (path, isNewFile, content = "", i = 1) => {
    if (isNewFile) {
      exists(path)
        .then((exists) =>
          writeFile(
            (i > 1 ? path.slice(0, path.indexOf("(") - 1) : path) +
              ` (${i + 1})`,
            i + 1
          )
        )
        .catch((doesntExist) =>
          fs.writeFile(path, content, (err) => console.log(err))
        );
    } else fs.writeFile(path, content, (err) => console.log(err));
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

  const readFile = (path) =>
    new Promise((resolve, reject) => {
      fs.readFile(path, "utf8", (err, content) =>
        err ? reject(err) : resolve(content)
      );
    });

  const exists = (path) =>
    new Promise((resolve, reject) => {
      fs.exists(path, (exists) => (exists ? resolve(true) : reject()));
    });

  const rmdir = (path) => fs.rmdir(path, (err) => console.log(err));

  const unlink = (path, name) =>
    fs.unlink(Path.join(path, name), (err) => console.log(err));

  const createFSO = (path, name, type, content) => {
    if (type === "directory") {
      mkdir(path, name);
    } else if (type === "lnk") {
      link(Path.join(path, name));
    } else {
      writeFile(Path.join(path, name), true, content);
    }
  };

  const getFolder = (path, callback) => {
    readdir(path).then((dirContent) => callback(dirContent));
  };

  const readFileContent = (path, callback) => {
    readFile(path).then((content) => callback(content));
  };

  const updateFSO = (name, path) => {
    console.log(name, path);
    fs.rename(Path.join(path, name.old), Path.join(path, name.new), (err) =>
      console.log(err)
    );
  };

  const saveFile = (path, name, content) => {
    writeFile(path, false, content);
  };

  const moveFSO = (currentPath, newPath) => {
    console.log(currentPath, newPath);
    fs.rename(currentPath, newPath, (err) => console.log(err));
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

  const findFSO = async (root, searchTerm, setSearchResults) => {
    const found = [];
    await findRecursive(root, searchTerm, found);
    setSearchResults(found);
  };

  const findRecursive = (root, searchTerm, found) => {
    let i = 0;
    return new Promise((resolve, reject) => {
      readdir(root).then(async (content) => {
        if (content.length > 0) {
          for (let fso of content) {
            if (fso.name == searchTerm) {
              console.log(`pushing found fso(${fso.name}) to found`);
              found.push({
                ...fso,
                path: Path.join(root, fso.name),
              });
              console.log(found);
            }
            fso.type === "DIRECTORY" &&
              (await findRecursive(
                Path.join(root, fso.name),
                searchTerm,
                found
              ));
            i === content.length - 1 && resolve(true);
            i += 1;
          }
        } else resolve(true);
      });
    });
  };

  useEffect(() => {
    exists("/C/users/admin")
      .then((exists) => console.log("file system already initialized"))
      .catch((err) => initilizeFileSystem());
  }, []);

  return (
    <FileSystemContext.Provider
      value={{
        createFSO,
        getFolder,
        updateFSO,
        saveFile,
        deleteFSO,
        readFileContent,
        watch,
        exists,
        findFSO,
        moveFSO,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};
