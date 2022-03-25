import { path as Path } from 'filer';
import mime from 'mime';

const mimeTypes = {
  text: 'Notepad',
  image: 'Photos',
  video: 'Movies And TV',
  'application/pdf': 'Chrome',
  'application/rtf': 'Notepad',
  'text/html': 'Chrome',
};

const openWithDefaultApp = (type, path, name, openApp) => {
  type = type.toLowerCase();

  if (type === 'directory')
    openApp('File Explorer', {
      customPath: Path.join(path, name),
    });
  if (type === 'file') {
    const filePath = Path.join(path, name);
    const mimeType = mime.lookup(name);
    const defaultApp = mimeTypes[mimeType] || mimeTypes[mimeType.split('/')[0]];

    defaultApp && openApp(defaultApp, { path: 'file:/' + filePath });
  }
};

export default openWithDefaultApp;
