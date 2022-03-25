import ContextMenuItem from '../../../../system/context-menu/context-menu-item/ContextMenuItem';
import { useState } from 'react';

const ViewDropdownMenu = ({
  statusBarVisible,
  setStatusBarVisibility,
  zoom,
  setZoom,
  closeMenu,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState('');
  const handleMouseOver = (name) => {
    setOpenSubmenu(name);
  };

  const toggleTaskbarVisibility = () => setStatusBarVisibility(!statusBarVisible);

  const zoomIn = () => setZoom(zoom < 500 ? zoom + 10 : zoom);
  const zoomOut = () => setZoom(zoom > 10 ? zoom - 10 : zoom);
  const resetZoom = () => setZoom(100);

  return (
    <>
      <ContextMenuItem
        fontWeight='400'
        name='Zoom'
        openSubmenu={openSubmenu === 'Zoom'}
        hoverColor='#91c9f7'
        closeMenu={closeMenu}
        onMouseOver={handleMouseOver}
        reactiveSubmenu={false}
      >
        <ContextMenuItem
          fontWeight='400'
          name='Zoom In'
          onClick={zoomIn}
          closeMenu={closeMenu}
        />
        <ContextMenuItem
          fontWeight='400'
          name='Zoom Out'
          onClick={zoomOut}
          closeMenu={closeMenu}
        />
        <ContextMenuItem
          fontWeight='400'
          name='Restore Default Zoom'
          onClick={resetZoom}
          closeMenu={closeMenu}
        />
      </ContextMenuItem>
      <ContextMenuItem
        fontWeight='400'
        name='Status Bar'
        checkBox
        active={statusBarVisible}
        onClick={toggleTaskbarVisibility}
        hoverColor='#91c9f7'
        closeMenu={closeMenu}
        onMouseOver={handleMouseOver}
      />
    </>
  );
};

export default ViewDropdownMenu;
