const suported = {
  '.txt': 'text',
  '.me': 'text',
  '.text': 'text',
  '.readme': 'text',
  '.doc': 'document',
  '.docx': 'document',
  '.pdf': 'document',
  '.html': 'document',
  '.bmp': 'image',
  '.git': 'image',
  '.ico': 'image',
  '.jif': 'image',
  '.jpeg': 'image',
  '.jpg': 'image',
  '.png': 'image',
  '.mp3': 'audio',
  '.mp4': 'video',
  '.mkv': 'video',
  '.ogg': 'video',
};

const getFileType = (ext) => suported[ext];

export default getFileType;
