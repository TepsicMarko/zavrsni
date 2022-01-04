import "./ContextMenuItem.css";
import { VscCircleFilled } from "react-icons/vsc";
import { MdArrowForwardIos } from "react-icons/md";
const ContextMenuItem = ({
  name,
  openSubmenu,
  onClick,
  children,
  divider,
  radio,
  active,
  closeMenu,
  fontWeight,
  returnName,
}) => {
  const handleClick = (e) => {
    onClick(returnName ? name : e);
    closeMenu && closeMenu();
  };

  return (
    <div
      className='context-menu-item'
      onClick={children ? () => onClick(name) : handleClick}
    >
      <div className='cm-item-icon'>
        {radio && active && <VscCircleFilled />}
      </div>
      <div className='cm-item-name' style={{ fontWeight }}>
        {name}
      </div>
      {children && (
        <div className='flex-center cm-item-expand'>
          <MdArrowForwardIos />
        </div>
      )}
      {children && openSubmenu && <div className='submenu'>{children}</div>}
    </div>
  );
};

export default ContextMenuItem;
