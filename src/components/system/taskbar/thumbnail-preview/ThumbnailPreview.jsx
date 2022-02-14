import './ThumbnailPreview.css';
import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

const ThumbnailPreview = ({ id, icon, name }) => {
  const [thumbnail, setThumbnail] = useState();

  useEffect(() => {
    html2canvas(document.getElementById(id)).then((image) => setThumbnail(image));
  }, []);

  return (
    <div className='thumbnail-preview'>
      <div className='thumbnail-title'>
        <div className='thumbnail-title-icon'>{icon}</div>
        <div className='thumbnail-title-text'>{name}</div>
      </div>
      <div className='thumbnail-content'>{thumbnail}</div>
    </div>
  );
};

export default ThumbnailPreview;
