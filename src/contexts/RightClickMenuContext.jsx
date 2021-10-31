import { createContext, useState } from "react";

export const RightClickMenuContext = createContext();

export const RightClickMenuProvider = ({ children }) => {
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [menuOptions, setMenuOptions] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderOptions = (position, options) => {
    setIsMenuOpen(true);
    setMenuPosition(position);
    setMenuOptions(options);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <RightClickMenuContext.Provider
      value={{
        menuPosition,
        menuOptions,
        isMenuOpen,
        closeMenu,
        renderOptions,
      }}
    >
      {children}
    </RightClickMenuContext.Provider>
  );
};
