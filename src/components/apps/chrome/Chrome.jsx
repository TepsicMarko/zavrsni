import './Chrome.css';
import Window from '../../system/window/Window';
import WindowContent from '../../system/window/window-content/WindowContent';
import ChromeNavbar from './navbar/ChromeNavbar';
import usePathHistory from '../../../hooks/usePathHistory';
import { useState, useEffect, useRef, useContext } from 'react';
import { FileSystemContext } from '../../../contexts/FileSystemContext';

const Chrome = ({ icon, pid, path }) => {
  const [url, setUrl] = useState(path || '');
  const [previous, goBack, current, goForth, next, watchPath] = usePathHistory(url, true);
  const { readFileContent } = useContext(FileSystemContext);
  const iframeRef = useRef(null);

  const isDomain = () => {
    const regex =
      /^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/;
    return regex.test(url);
  };

  const isLink = () => url.startsWith('http://') || url.startsWith('https://');

  const replaceIframeUrl = (newUrl) =>
    iframeRef.current.contentWindow.location.replace(newUrl);
  const refreshPage = () => iframeRef.current.contentWindow.location.reload();

  useEffect(async () => {
    console.log(path, path);
    if (path && url === path) {
      iframeRef.current.src = await readFileContent(path);
      console.log(await readFileContent(path));
    } else {
      watchPath(url);
      url && isLink()
        ? replaceIframeUrl(url)
        : isDomain()
        ? replaceIframeUrl('https://' + url)
        : replaceIframeUrl(
            `https://www.google.com/search?q=${url}&igu=1&source=hp&ei=zkzXYY2CNcezsAf31KGQDQ&iflsig=ALs-wAMAAAAAYdda3rqyJHWgSOchQJ4uSF1wZkXhIyPy&ved=0ahUKEwiNof699531AhXHGewKHXdqCNIQ4dUDCAc&uact=5&oq=${url}&gs_lcp=Cgdnd3Mtd2l6EAMyBAgjECcyBAgjECcyBAgjECcyCwgAEIAEELEDEIMBMgQIABBDMgsIABCABBCxAxCDATILCAAQgAQQsQMQgwEyBQgAEMsBMgsIABCABBCxAxCDATIFCAAQywE6BwgjEOoCECc6BggjECcQEzoRCC4QgAQQsQMQgwEQxwEQrwE6CAgAELEDEIMBOggIABCABBCxAzoFCAAQgAQ6CggAELEDEIMBEENQhhBYzxlg_BtoAXAAeACAAXSIAY0EkgEDMS40mAEAoAEBsAEK&sclient=gws-wiz`
          );
    }
  }, [url]);

  useEffect(() => {
    url !== current && setUrl(current);
  }, [current]);

  const disableIframe = () => (iframeRef.current.style.pointerEvents = 'none');
  const enableIframe = () => (iframeRef.current.style.pointerEvents = '');

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
      <WindowContent flex flexDirection='column'>
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
          ref={iframeRef}
          className='google'
          referrerPolicy='no-referrer'
          sandbox='allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts'
          src='https://www.google.com/webhp?igu=1'
          style={{ backgroundColor: 'white' }}
        ></iframe>
      </WindowContent>
    </Window>
  );
};

export default Chrome;
