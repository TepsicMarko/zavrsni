import mime from 'mime-types';
import { path as Path } from 'filer';

const getFileUrl = (path, name, type, readBlob, readFileContent) =>
  new Promise(async (resolve, reject) => {
    if (type === 'file') {
      if (mime.lookup(name).startsWith('text')) {
        let blob = new Blob([await readFileContent(Path.join(path, name))], {
          type: mime.lookup(name),
        });
        resolve(URL.createObjectURL(blob));
      } else {
        resolve(await readBlob(Path.join(path, name), mime.lookup(name)));
      }
    }
    resolve(null);
  });

const downloadFile = async (path, name, type, readBlob, readFileContent) => {
  if (type === 'file') {
    const a = document.getElementById('file-download');
    a.href = await getFileUrl(path, name, type, readBlob, readFileContent);
    a.download = name;
    a.click();
    a.href = '';
  }
};

export default downloadFile;
