import './ThumbnailPreview.css';
import { useState, useEffect, useRef, cloneElement } from 'react';
import domtoimage from 'dom-to-image';

const ThumbnailPreview = ({ processes, name }) => {
  const [thumbnails, setThubmnails] = useState({});
  const animationRef = useRef(null);

  const animation = (elements) => {
    Object.keys(processes).forEach((id, i) =>
      domtoimage.toPng(elements[i]).then((imgUrl) => {
        setThubmnails((thumbnails) => ({ ...thumbnails, [id]: imgUrl }));
      })
    );
    animationRef.current = window.requestAnimationFrame(() => animation(elements));
  };

  useEffect(() => {
    const elements = Object.keys(processes).map((id) => document.getElementById(id));
    animationRef.current = window.requestAnimationFrame(() => animation(elements));

    return () => window.cancelAnimationFrame(animationRef.current);
  }, []);

  return Object.keys(thumbnails).length ? (
    <div className='thumbnail-previews'>
      {Object.entries(processes).map(([id, process]) => (
        <div className='thumbnail-preview'>
          <div className='thumbnail-title'>
            {cloneElement(process.icon, { width: '15px', height: '15px' })}
            {name}
          </div>
          <div className='flex-center thumbnail-content'>
            <img src={thumbnails[id]} />
          </div>
        </div>
      ))}
    </div>
  ) : null;
};

export default ThumbnailPreview;
