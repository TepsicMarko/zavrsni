import './Chrome.css';
import Window from '../../system/window/Window';
import WindowContent from '../../system/window/window-content/WindowContent';
import ChromeNavbar from './navbar/ChromeNavbar';
import usePathHistory from '../../../hooks/usePathHistory';
import { useState, useEffect, useCallback, useContext } from 'react';
import { FileSystemContext } from '../../../contexts/FileSystemContext';

const Chrome = ({ icon, pid, path }) => {
  const [url, setUrl] = useState(path || '');
  const [previous, goBack, current, goForth, next, watchPath] = usePathHistory(url, true);
  const { readFileContent, readBlob } = useContext(FileSystemContext);
  const [iframeRef, setIframeRef] = useState(null);

  const isDomain = () => {
    const regex =
      /^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/;
    return regex.test(url);
  };

  const isLink = () => url.startsWith('http://') || url.startsWith('https://');
  const isFile = () => url.startsWith('file://');

  const replaceIframeUrl = (newUrl) => iframeRef.contentWindow.location.replace(newUrl);
  const refreshPage = async () => {
    iframeRef.contentWindow.location.reload();
    isFile() && (iframeRef.srcdoc = await readFileContent(path.replace('file:/', '')));
  };

  const disableIframe = () => iframeRef && (iframeRef.style.pointerEvents = 'none');
  const enableIframe = () => iframeRef && (iframeRef.style.pointerEvents = '');

  const onRefChange = useCallback((node) => setIframeRef(node), []);

  useEffect(async () => {
    if (iframeRef) {
      if (path && url === path) {
        path.endsWith('.pdf')
          ? (iframeRef.src = await readBlob(
              path.replace('file:/', ''),
              'application/pdf'
            ))
          : (iframeRef.srcdoc = await readFileContent(path.replace('file:/', '')));
      } else {
        watchPath(url);
        url && isLink()
          ? replaceIframeUrl(url)
          : isDomain()
          ? replaceIframeUrl('https://' + url)
          : isFile()
          ? (iframeRef.srcdoc = await readFileContent(url.replace('file:/', '')))
          : replaceIframeUrl(
              `https://www.google.com/search?q=${url}&igu=1&source=hp&ei=zkzXYY2CNcezsAf31KGQDQ&iflsig=ALs-wAMAAAAAYdda3rqyJHWgSOchQJ4uSF1wZkXhIyPy&ved=0ahUKEwiNof699531AhXHGewKHXdqCNIQ4dUDCAc&uact=5&oq=${url}&gs_lcp=Cgdnd3Mtd2l6EAMyBAgjECcyBAgjECcyBAgjECcyCwgAEIAEELEDEIMBMgQIABBDMgsIABCABBCxAxCDATILCAAQgAQQsQMQgwEyBQgAEMsBMgsIABCABBCxAxCDATIFCAAQywE6BwgjEOoCECc6BggjECcQEzoRCC4QgAQQsQMQgwEQxwEQrwE6CAgAELEDEIMBOggIABCABBCxAzoFCAAQgAQ6CggAELEDEIMBEENQhhBYzxlg_BtoAXAAeACAAXSIAY0EkgEDMS40mAEAoAEBsAEK&sclient=gws-wiz`
            );
      }
    }
  }, [url, iframeRef]);

  useEffect(() => {
    url !== current && setUrl(current);
  }, [current]);

  return (
    <Window
      process='Chrome'
      pid={pid}
      icon={icon}
      minWindowWidth='15rem'
      minWindowHeight='5rem'
      titleBar={{ color: 'white', backgroundColor: '#202124' }}
      disableIframe={disableIframe}
      enableIframe={enableIframe}
    >
      <WindowContent flex flexWrap flexDirection='column'>
        <ChromeNavbar
          previous={previous.length}
          goBack={goBack}
          url={url}
          setUrl={setUrl}
          goForth={goForth}
          next={next.length}
          refreshPage={refreshPage}
        />
        <iframe
          ref={onRefChange}
          className='google'
          referrerPolicy='no-referrer'
          style={{ backgroundColor: 'white' }}
        ></iframe>
      </WindowContent>
    </Window>
  );
};

export default Chrome;
