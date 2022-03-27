import './QuickSearch.css';
import { cloneElement } from 'react';
import { appConfigurations } from '../../../../utils/constants/processConfigurations';
import { TiWeatherPartlySunny } from 'react-icons/ti';
import { IoNewspaperOutline } from 'react-icons/io5';
import { BsClock } from 'react-icons/bs';
import { AiOutlineInfoCircle, AiOutlineFile } from 'react-icons/ai';
import { VscGlobe } from 'react-icons/vsc';

const QuickSearch = ({
  isWindowsSearchOpen,
  closeWindowsSearch,
  startProcess,
  searchIn,
  setSearchIn,
  setSearchFor,
}) => {
  const openApp = (app) => {
    closeWindowsSearch();
    startProcess(app);
  };

  const startQuickSearch = (name) => {
    setSearchFor(name);
    setSearchIn('Web');
  };

  return (
    isWindowsSearchOpen && (
      <>
        {(searchIn === 'All' || searchIn === 'Apps') && (
          <div className='top-apps'>
            <strong>Top apps</strong>
            {['Command Prompt', 'File Explorer', 'Notepad', 'Movies And TV'].map(
              (app) => (
                <div className='flex-center top-app' onClick={() => openApp(app)}>
                  <div className='flex-center top-app-icon'>
                    {cloneElement(appConfigurations[app].icon, {
                      width: '30px',
                      height: '30px',
                      size: '30px',
                    })}
                  </div>
                  <div className='top-app-name'>{app}</div>
                </div>
              )
            )}
          </div>
        )}
        {searchIn === 'All' && (
          <div className='quick-searches'>
            <strong>Quick searches</strong>
            {[
              { icon: <TiWeatherPartlySunny />, topic: 'Weather' },
              { icon: <IoNewspaperOutline />, topic: 'Top News' },
              { icon: <BsClock />, topic: 'Today in history' },
              { icon: <AiOutlineInfoCircle />, topic: 'Coronavirus trends' },
            ].map((quickSearch, i) => (
              <div
                className='quick-search'
                onClick={() => startQuickSearch(quickSearch.topic)}
              >
                <div className='flex-center quick-search-icon'>
                  {cloneElement(quickSearch.icon, { size: '1.75rem' })}
                </div>
                <div className='quick-search-topic'>{quickSearch.topic}</div>
              </div>
            ))}
          </div>
        )}
        {searchIn === 'Files' && (
          <div className='start-searching-files'>
            <AiOutlineFile size='10rem' />
            <h1>Start typing to search for files</h1>
          </div>
        )}
        {searchIn === 'Web' && (
          <div className='start-searching-web'>
            <VscGlobe size='10rem' />
            <h1>Start typing to search web</h1>
          </div>
        )}
      </>
    )
  );
};

export default QuickSearch;
