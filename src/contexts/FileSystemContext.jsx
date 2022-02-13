import { createContext, useEffect } from 'react';
import { path as Path, fs, Buffer } from 'filer';

export const FileSystemContext = createContext();

export const FileSystemProvider = ({ children }) => {
  const mkdir = (path, name, i = 1) =>
    new Promise((resolve, reject) => {
      fs.mkdir(`${path}/${name}`, (err) => {
        if (
          err?.code === 'EEXIST' &&
          (name === 'New Folder' || name.slice(0, name.indexOf('(') - 1) === 'New Folder')
        ) {
          resolve(
            mkdir(
              path,
              (i > 1 ? name.slice(0, name.indexOf('(') - 1) : name) + ` (${i + 1})`,
              i + 1
            )
          );
        } else resolve(name);
      });
    });

  const mkdirAsync = (path) =>
    new Promise((resolve, reject) => {
      fs.mkdir(path, (err) => (err ? reject(err) : resolve(true)));
    });

  const writeFileAsync = (paht) =>
    new Promise((resolve, reject) => {
      fs.writeFile(paht, '', (err) => (err ? reject(err) : resolve(true)));
    });

  const writeFile = (path, type, isNewFile, content = '', i = 1) =>
    new Promise((resolve, reject) => {
      if (isNewFile) {
        exists(`${path}.${type}`)
          .then((exists) =>
            resolve(
              writeFile(
                (i > 1 ? path.slice(0, path.indexOf('(') - 1) : path) + ` (${i + 1})`,
                type,
                isNewFile,
                content || '',
                i + 1
              )
            )
          )
          .catch((doesntExist) => {
            fs.writeFile(`${path}.${type}`, content, (err) => console.log(err));
            resolve(`${Path.basename(path)}.${type}`);
          });
      } else {
        fs.writeFile(`${path}.${type}`, content, (err) => console.log(err));
        resolve(`${Path.basename(path)}.${type}`);
      }
    });
  const link = (
    filePath,
    linkPath //hard coded for now
  ) => fs.link(filePath, '/C/users/admin', (err) => console.log(err));

  const readdir = (path) =>
    new Promise((resolve, reject) => {
      fs.readdir(path, { withFileTypes: true }, (err, files) =>
        err ? reject(err) : resolve(files)
      );
    });

  const readFile = (path) =>
    new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, content) => (err ? reject(err) : resolve(content)));
    });

  const readBinaryFile = (path) =>
    new Promise((resolve, reject) => {
      fs.readFile(path, (err, content) => (err ? reject(err) : resolve(content)));
    });

  const exists = (path) =>
    new Promise((resolve, reject) => {
      fs.exists(path, (exists) => (exists ? resolve(true) : reject()));
    });

  const rmdir = (path) =>
    new Promise((resolve, reject) =>
      fs.rmdir(path, (err) => (err ? reject(err) : resolve(true)))
    );

  const rmdirRecursive = (path) =>
    new Promise((resolve, reject) => {
      fs.readdir(path, { withFileTypes: true }, (err, files) => {
        if (err) reject(err);
        else {
          if (files.length) {
            Promise.all(
              files.map((file) => {
                if (file.isDirectory()) return rmdirRecursive(`${path}/${file.name}`);
                else fs.unlink(`${path}/${file.name}`, (err) => console.log(err));
              })
            ).then(() => fs.rmdir(path, (err) => (err ? reject(err) : resolve(true))));
          } else fs.rmdir(path, (err) => (err ? reject(err) : resolve(true)));
        }
      });
    });

  const unlink = (path, name) =>
    fs.unlink(Path.join(path, name), (err) => console.log(err));

  const createFSO = async (path, name, type, content, callback) => {
    if (type === 'directory') {
      const folderName = await mkdir(path, name);
      callback && callback(folderName);
    } else if (type === 'lnk') {
      link(Path.join(path, name));
    } else {
      const fileName = await writeFile(Path.join(path, name), type, true, content);
      callback && callback(fileName);
    }
  };

  const createBlob = (path, name, buffer) => {
    const FilerBuffer = Buffer.from(buffer);
    fs.writeFile(Path.join(path, name), FilerBuffer, (err) => {
      err && console.log(err);
    });
  };

  const getFolder = async (path, callback) => {
    const dirContent = await readdir(path);
    if (callback) callback(dirContent);
    else return dirContent;
  };

  const readFileContent = async (path, callback) => {
    const content = await readFile(path);
    if (callback) callback(content);
    else return content;
  };

  const readBlob = (path, callback) => {
    readBinaryFile(path).then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'video/mp4',
      });
      callback(window.URL.createObjectURL(blob));
    });
  };

  const renameFSO = (path, name) =>
    new Promise((resolve, reject) => {
      fs.rename(Path.join(path, name.old), Path.join(path, name.new), (err) =>
        err ? reject(err) : resolve(true)
      );
    });

  const saveFile = (path, content) => {
    writeFile(path, '', false, content);
  };

  const moveFSO = (currentPath, newPath) =>
    new Promise((resolve, reject) => {
      fs.rename(currentPath, newPath, (err) => (err ? reject(err) : resolve(true)));
    });

  const deleteFSO = (path, name, type, recusive = true) => {
    if (type === 'directory') {
      return recusive
        ? rmdirRecursive(Path.join(path, name))
        : rmdir(Path.join(path, name));
    } else {
      unlink(Path.addTrailing(path), name);
    }
  };

  const doesPathExist = (path) =>
    new Promise((resolve, reject) => {
      fs.exists(path, (exists) => (exists ? resolve(exists) : reject()));
    });

  const initilizeFileSystem = () => {
    console.log('initializing file system');
    mkdir('/', 'C');
    mkdir('/C', 'users');
    mkdir('/C/users', 'admin');
    mkdir('/C/users/admin', 'Desktop');
    mkdir('/C/users/admin', 'Documents');
    mkdir('/C/users/admin', 'Downloads');
    mkdir('/C/users/admin', 'Pictures');
    mkdir('/C/users/admin', 'Videos');
  };

  const watch = (path, callback) => {
    const watcher = fs.watch(path, (e) => callback());

    return watcher;
  };

  const findFSO = async (root, exactMatch, searchTerm, setSearchResults) => {
    const found = [];
    await findRecursive(root, exactMatch, searchTerm, found);
    if (!setSearchResults) return found;
    setSearchResults(found);
  };

  const findRecursive = (root, exactMatch, searchTerm, found) => {
    let i = 0;
    return new Promise((resolve, reject) => {
      readdir(root).then(async (content) => {
        if (content.length > 0) {
          for (let fso of content) {
            if (exactMatch) {
              if (fso.name == searchTerm) {
                found.push({
                  ...fso,
                  path: Path.join(root, fso.name),
                });
              }
            } else {
              if (fso.name.includes(searchTerm)) {
                found.push({
                  ...fso,
                  path: Path.join(root, fso.name),
                });
              }
            }

            fso.type === 'DIRECTORY' &&
              (await findRecursive(
                Path.join(root, fso.name),
                exactMatch,
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
    exists('/C/users/admin')
      .then((exists) => console.log('file system already initialized'))
      .catch((err) => initilizeFileSystem());
  }, []);

  return (
    <FileSystemContext.Provider
      value={{
        createFSO,
        createBlob,
        getFolder,
        renameFSO,
        saveFile,
        deleteFSO,
        readFileContent,
        readBlob,
        watch,
        exists,
        findFSO,
        moveFSO,
        doesPathExist,
        mkdirAsync,
        writeFileAsync,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};
