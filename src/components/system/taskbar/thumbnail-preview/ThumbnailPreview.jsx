import './ThumbnailPreview.css';
import { useState, useEffect, useRef, cloneElement, useContext } from 'react';
import domtoimage from 'dom-to-image';
import { MdClose } from 'react-icons/md';
import { ThumbnailPreviewsContext } from '../../../../contexts/ThumbnailPreviewsContext';

const ThumbnailPreview = ({
  name,
  endProcess,
  focusProcess,
  wasThumbnailShown,
  setWasThumbnailShown,
}) => {
  const [thumbnails, setThubmnails] = useState({});
  const { thumbnailPreviews } = useContext(ThumbnailPreviewsContext);
  const animationRef = useRef(null);
  const timeoutIdRef = useRef(null);

  const animation = (elements) => {
    (thumbnailPreviews[name] || []).forEach(({ pid }, i) =>
      domtoimage
        .toPng(elements[i], {
          style: {
            transform: 'translate(0,0)',
            opacity: '1',
          },
        })
        .then((imgUrl) => {
          setThubmnails((thumbnails) => ({ ...thumbnails, [pid]: imgUrl }));
        })
        .catch((err) => console.log(err))
    );
    animationRef.current = window.requestAnimationFrame(() => animation(elements));
  };
  useEffect(() => {
    const elements = (thumbnailPreviews[name] || []).map(({ pid }) =>
      document.getElementById(pid)
    );

    timeoutIdRef.current = setTimeout(
      () =>
        (animationRef.current = window.requestAnimationFrame(() => animation(elements))),
      wasThumbnailShown ? 0 : 250
    );

    return () => {
      window.cancelAnimationFrame(animationRef.current);
      clearTimeout(timeoutIdRef.current);
    };
  }, [thumbnailPreviews]);

  useEffect(() => {
    Object.keys(thumbnails || {}).length &&
      !wasThumbnailShown &&
      setWasThumbnailShown(() => true);
  }, [thumbnails]);

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
