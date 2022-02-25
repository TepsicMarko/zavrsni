import './ContextMenu.css';
import { useContext } from 'react';
import { RightClickMenuContext } from '../../../contexts/RightClickMenuContext';
import { cloneElement } from 'react';
import useClickOutside from '../../../hooks/useClickOutside';

const ContextMenu = () => {
  const { menuPosition, menuOptions, isMenuOpen, closeMenu } =
    useContext(RightClickMenuContext);
  const menuRef = useClickOutside('mousedown', closeMenu);

  return (
    isMenuOpen && (
      <div
        ref={menuRef}
        className='context-menu'
        style={{ top: menuPosition.y, left: menuPosition.x }}
      >
        {cloneElement(menuOptions, { closeMenu })}
      </div>
    )
  );
};

export default ContextMenu;
