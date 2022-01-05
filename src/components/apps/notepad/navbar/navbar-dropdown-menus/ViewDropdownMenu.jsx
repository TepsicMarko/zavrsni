import ContextMenuItem from "../../../../system/context-menu/context-menu-item/ContextMenuItem";
import { useState } from "react";

const ViewDropdownMenu = ({
  statusBarVisible,
  setStatusBarVisibility,
  zoom,
  setZoom,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState("");
  const handleClick = (name, e) => {
    e.stopPropagation();
    setOpenSubmenu(name);
  };

  const toggleTaskbarVisibility = () =>
    setStatusBarVisibility(!statusBarVisible);

  const zoomIn = () => setZoom(zoom < 500 ? zoom + 10 : zoom);
  const zoomOut = () => setZoom(zoom > 10 ? zoom - 10 : zoom);
  const resetZoom = () => setZoom(100);

  return (
    <>
      <ContextMenuItem
        fontWeight='400'
        name='Zoom'
        openSubmenu={openSubmenu === "Zoom"}
        onClick={handleClick}
        hoverColor='#91c9f7'
      >
        <ContextMenuItem fontWeight='400' name='Zoom In' onClick={zoomIn} />
        <ContextMenuItem fontWeight='400' name='Zoom Out' onClick={zoomOut} />
        <ContextMenuItem
          fontWeight='400'
          name='Restore Default Zoom'
          onClick={resetZoom}
        />
      </ContextMenuItem>
      <ContextMenuItem
        fontWeight='400'
        name='Status Bar'
        checkBox
        active={statusBarVisible}
        onClick={toggleTaskbarVisibility}
        hoverColor='#91c9f7'
      />
    </>
  );
};

export default ViewDropdownMenu;
