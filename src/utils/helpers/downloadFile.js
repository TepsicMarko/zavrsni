import mime from 'mime-types';
import { path as Path } from 'filer';
import jszip from 'jszip';

const getFileUrl = (path, name, type, readBlob, readFileContent) =>
  new Promise(async (resolve, reject) => {
    if (mime.lookup(name).startsWith('text')) {
      let blob = new Blob([await readFileContent(Path.join(path, name))], {
        type: mime.lookup(name),
      });
      resolve(URL.createObjectURL(blob));
    } else {
      resolve(await readBlob(Path.join(path, name), mime.lookup(name)));
    }
  });

const readDirRecursive = (parentFolder, readdir, readBlob, path) =>
  new Promise(async (resolve, reject) => {
    const folderContent = await readdir(path);
    const files = folderContent.filter((fso) => fso.isFile());
    const folders = folderContent.filter((fso) => fso.isDirectory());

    for (let file of files) {
      const fileArrayBuffer = await readBlob(
        Path.join(path, file.name),
        mime.lookup(file.name),
        true
      );
      parentFolder.file(file.name, fileArrayBuffer);
    }

    for (let folder of folders) {
      await readDirRecursive(
        parentFolder.folder(folder.name),
        readdir,
        readBlob,
        Path.join(path, folder.name)
      );
    }

    resolve(true);
  });

const downloadFile = (path, name, type, readdir, readBlob, readFileContent) =>
  new Promise(async (resolve, reject) => {
    const a = document.getElementById('file-download');

    if (type === 'file') {
      a.href = await getFileUrl(path, name, type, readBlob, readFileContent);
      a.download = name;
    } else {
      const zip = new jszip();
      const root = zip.folder(name);

      await readDirRecursive(root, readdir, readBlob, Path.join(path, name));

      const base64 = await zip.generateAsync({ type: 'base64' });
      a.href = 'data:application/zip;base64,' + base64;
    }

    a.click();
    a.href = '';
    resolve();
  });

export default downloadFile;
