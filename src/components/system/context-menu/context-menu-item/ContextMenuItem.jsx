import "./ContextMenuItem.css";
import { VscCircleFilled } from "react-icons/vsc";
import { MdArrowForwardIos } from "react-icons/md";
import { FiCheck } from "react-icons/fi";

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
      <div
        className={"cm-item-name" + (checkBox ? " cm-checkbox-name" : "")}
        style={{ fontWeight }}
      >
        {" "}
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
        <div className='flex-center cm-item-expand'>
          <MdArrowForwardIos />
        </div>
      )}
      {children && openSubmenu && <div className='submenu'>{children}</div>}
    </div>
  );
};

export default ContextMenuItem;
