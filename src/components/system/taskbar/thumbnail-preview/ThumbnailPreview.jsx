import './ThumbnailPreview.css';
import { useState, useEffect, useRef, cloneElement, useContext } from 'react';
import domtoimage from 'dom-to-image';
import { MdClose } from 'react-icons/md';
import { ThumbnailPreviewsContext } from '../../../../contexts/ThumbnailPreviewsContext';

const ThumbnailPreview = ({ process, endProcess }) => {
  const [thumbnails, setThubmnails] = useState({});
  const { thumbnailPreviews } = useContext(ThumbnailPreviewsContext);
  const animationRef = useRef(null);

  const animation = (elements) => {
    (thumbnailPreviews[process] || []).forEach(({ pid }, i) =>
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
    const elements = (thumbnailPreviews[process] || []).map(({ pid }) =>
      document.getElementById(pid)
    );
    animationRef.current = window.requestAnimationFrame(() => animation(elements));

    return () => window.cancelAnimationFrame(animationRef.current);
  }, [thumbnailPreviews[process]]);

  return (
    <div className='thumbnail-previews'>
      {(thumbnailPreviews[process] || []).map(({ appTitle, icon, pid }) => (
        <div className='thumbnail-preview'>
          <div className='thumbnail-title'>
            {cloneElement(icon, { width: '15px', height: '15px' })}
            {appTitle}
          </div>
          <div
            className='flex-center thumbnail-close'
            onClick={(e) => {
              e.stopPropagation();
              setThubmnails(({ [pid]: remove, ...rest }) => ({ ...rest }));
              endProcess(process, pid);
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
  );
};

export default ThumbnailPreview;
