import { createContext, useState } from 'react';

export const ThumbnailPreviewsContext = createContext();

export const ThumbnailPreviewsProvider = ({ children }) => {
  const [thumbnailPreviews, setThumbnailPreviews] = useState({});

  const addThumbnailPreview = (appName, appTitle, icon, pid) => {
    setThumbnailPreviews((thumbnailPreviews) => ({
      ...thumbnailPreviews,
      [appName]: [...(thumbnailPreviews[appName] || []), { appTitle, icon, pid }],
    }));
  };

  const removeThumbnailPreview = (appName, pid) => {
    setThumbnailPreviews((thumbnailPreviews) => ({
      ...thumbnailPreviews,
      [appName]: thumbnailPreviews[appName].filter(
        (thumbnailPreview) => thumbnailPreview.pid !== pid
      ),
    }));
  };

  return (
    <ThumbnailPreviewsContext.Provider
      value={{ thumbnailPreviews, addThumbnailPreview, removeThumbnailPreview }}
    >
      {children}
    </ThumbnailPreviewsContext.Provider>
  );
};
