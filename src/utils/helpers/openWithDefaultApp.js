import { path as Path } from 'filer';
import getFileType from './getFileType';

const openWithDefaultApp = (type, path, name, openApp) => {
  type = type.toLowerCase();

  if (type === 'directory')
    openApp('File Explorer', {
      customPath: Path.join(path, name),
    });
  if (type === 'file') {
    const filePath = Path.join(path, name);
    const fileType = getFileType(Path.extname(filePath));
    const fileExt = Path.extname(filePath);

    if (fileType === 'text') openApp('Notepad', { path: filePath });
    if (fileType === 'image') openApp('Photos', { path: filePath });
    if (fileType === 'video') openApp('Movies And TV', { path: filePath });
    if (fileType === 'document') {
      if (fileExt === '.html' || fileExt === '.pdf')
        openApp('Chrome', { path: filePath });
      // if (fileExt === ".doc" || fileExt === ".docx")
      //   openApp("Microsoft Word", { path: filePath });
    }
  }
};

export default openWithDefaultApp;
