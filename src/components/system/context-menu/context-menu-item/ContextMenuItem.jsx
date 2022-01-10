import "./ContextMenuItem.css";
import { VscCircleFilled } from "react-icons/vsc";
import { MdArrowForwardIos } from "react-icons/md";
import { FiCheck } from "react-icons/fi";
import { useState, cloneElement } from "react";

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
  checkBox,
  hoverColor,
}) => {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseEnter = () => setIsMouseOver(true);
  const handleMouseLeve = () => setIsMouseOver(false);

  const handleClick = (e) => {
    onClick(returnName ? name : e);
    closeMenu && closeMenu();
  };

  return (
    <div
      className='context-menu-item'
      onClick={children ? (e) => onClick(name, e) : handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeve}
    >
      <div
        className={"cm-item-name"}
        style={{ fontWeight, backgroundColor: isMouseOver ? hoverColor : "" }}
      >
        <div
          className={
            "cm-item-icon" +
            (checkBox
              ? ` flex-center cm-checkbox${active ? "-checked " : ""}`
              : "")
          }
        >
          {checkBox && <FiCheck />}
          {radio && active && <VscCircleFilled />}
        </div>
        {name}
      </div>
      {children && (
        <div
          className='flex-center cm-item-expand'
          style={{ backgroundColor: isMouseOver ? hoverColor : "" }}
        >
          <MdArrowForwardIos />
        </div>
      )}
      {children && openSubmenu ? (
        <div className='submenu'>
          {children.length
            ? children.map((child) => cloneElement(child, { hoverColor }))
            : cloneElement(children, { hoverColor })}
        </div>
      ) : null}
    </div>
  );
};

export default ContextMenuItem;
