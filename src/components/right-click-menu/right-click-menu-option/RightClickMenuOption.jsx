import "./RightClickMenuOption.css";
import { useState } from "react";

const RightClickMenuOption = ({ option, closeMenu }) => {
  const { handler, name, submenu } = option;
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const openSubmenu = () => {
    setIsSubmenuOpen(true);
  };

  const handleClick = (handler) => {
    handler();
    closeMenu();
  };

  return (
    <div
      className='rc-menu-option'
      onClick={submenu.length ? openSubmenu : handler}
    >
      {name}
      {submenu.length && isSubmenuOpen && (
        <div className='submenu' style={{ left: `calc(13rem - 10px)`, top: 0 }}>
          {submenu.map((submenuOpt) => (
            <div
              className='submenu-option'
              onClick={() => handleClick(submenuOpt.handler)}
            >
              {submenuOpt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightClickMenuOption;
