import ContextMenuItem from "../../../../system/context-menu/context-menu-item/ContextMenuItem";
import { useState } from "react";

const ViewDropdownMenu = () => {
  const [openSubmenu, setOpenSubmenu] = useState("");
  const handleClick = (name) => setOpenSubmenu(name);

  return (
    <>
      <ContextMenuItem
        fontWeight='400'
        name='Zoom'
        openSubmenu={openSubmenu === "Zoom"}
        onClick={handleClick}
      >
        <ContextMenuItem fontWeight='400' name='Zoom In' />
        <ContextMenuItem fontWeight='400' name='Zoom Out' />
        <ContextMenuItem fontWeight='400' name='Restore Default Zoom' />
      </ContextMenuItem>
      <ContextMenuItem fontWeight='400' name='Status Bar' />
    </>
  );
};

export default ViewDropdownMenu;
