import './ThumbnailPreview.css';
import { useState, useEffect, useRef, cloneElement, useContext } from 'react';
import domtoimage from 'dom-to-image';
import { MdClose } from 'react-icons/md';
import { ThumbnailPreviewsContext } from '../../../../contexts/ThumbnailPreviewsContext';

const ThumbnailPreview = ({ name, endProcess, focusProcess }) => {
  const [thumbnails, setThubmnails] = useState({});
  const { thumbnailPreviews } = useContext(ThumbnailPreviewsContext);
  const animationRef = useRef(null);

  const animation = (elements) => {
    (thumbnailPreviews[name] || []).forEach(({ pid }, i) =>
      domtoimage
        .toPng(elements[i], {
          style: {
            left: '0',
            right: '0',
            bottom: '0',
            top: '0',
            visibility: 'visible',
          },
        })
        .then((imgUrl) => {
          setThubmnails((thumbnails) => ({ ...thumbnails, [pid]: imgUrl }));
        })
    );
    animationRef.current = window.requestAnimationFrame(() => animation(elements));
  };

  useEffect(() => {
    const elements = (thumbnailPreviews[name] || []).map(({ pid }) =>
      document.getElementById(pid)
    );
    animationRef.current = window.requestAnimationFrame(() => animation(elements));

    return () => window.cancelAnimationFrame(animationRef.current);
  }, [thumbnailPreviews[name]]);

  return Object.keys(thumbnails).length ? (
    <div className='thumbnail-previews'>
      {(thumbnailPreviews[name] || []).map(({ appTitle, icon, pid }) => (
        <div className='thumbnail-preview' onClick={() => focusProcess(name, pid)}>
          <div className='thumbnail-title'>
            {cloneElement(icon, { width: '15px', height: '15px' })}
            {appTitle}
          </div>
          <div
            className='flex-center thumbnail-close'
            onClick={(e) => {
              e.stopPropagation();
              setThubmnails(({ [pid]: remove, ...rest }) => ({ ...rest }));
              endProcess(name, pid);
            }}
          >
            <MdClose color='white' />
          </div>
          <div className='flex-center thumbnail-content'>
            <img src={thumbnails[pid]} />
          </div>
        </div>
      ))}
    </div>
  ) : null;
};

export default ThumbnailPreview;
