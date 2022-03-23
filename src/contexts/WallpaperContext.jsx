import { createContext, useState } from 'react';
import windowsDefault from '../assets/windowsDefault.jpg';

export const WallpaperContext = createContext();

export const WallpaperProvider = ({ children }) => {
  const [wallpaper, setWallpaper] = useState(windowsDefault);

  return (
    <WallpaperContext.Provider
      value={{
        wallpaper,
        setWallpaper,
      }}
    >
      {children}
    </WallpaperContext.Provider>
  );
};
