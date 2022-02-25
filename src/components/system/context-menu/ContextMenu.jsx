import './ContextMenu.css';
import { useContext, useState, useLayoutEffect } from 'react';
import { RightClickMenuContext } from '../../../contexts/RightClickMenuContext';
import { cloneElement } from 'react';
import useClickOutside from '../../../hooks/useClickOutside';

const ContextMenu = () => {
  const { menuPosition, menuOptions, isMenuOpen, closeMenu } =
    useContext(RightClickMenuContext);
  const menuRef = useClickOutside('mousedown', closeMenu);
  const [finalMenuPosition, setFInalMenuPosition] = useState(menuPosition);

  useLayoutEffect(() => {
    if (isMenuOpen) {
      const newMenuPosition = { ...menuPosition };
      const newIsMenuInCorner = { right: false, bottom: false };
      const maxWidh = menuRef.current.parentElement.offsetWidth;
      const maxHeight = menuRef.current.parentElement.offsetHeight;

      if (menuRef.current.offsetWidth + menuPosition.x > maxWidh) {
        newMenuPosition.x = maxWidh - menuRef.current.offsetWidth;
        newIsMenuInCorner.right = true;
      }

      if (menuRef.current.offsetHeight + menuPosition.y > maxHeight) {
        newMenuPosition.y = menuPosition.y - menuRef.current.offsetHeight;
        newIsMenuInCorner.bottom = true;
      }

      setFInalMenuPosition({ top: newMenuPosition.y, left: newMenuPosition.x });
    }
  }, [isMenuOpen]);

  return (
    isMenuOpen && (
      <div ref={menuRef} className='context-menu' style={finalMenuPosition}>
        {cloneElement(menuOptions, { closeMenu })}
      </div>
    )
  );
};

export default ContextMenu;
