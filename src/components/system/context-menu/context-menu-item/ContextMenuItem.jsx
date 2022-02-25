import './ContextMenuItem.css';
import { VscCircleFilled } from 'react-icons/vsc';
import { MdArrowForwardIos } from 'react-icons/md';
import { FiCheck } from 'react-icons/fi';
import { useState, cloneElement, useRef, useLayoutEffect } from 'react';

const ContextMenuItem = ({
  name,
  openSubmenu,
  onClick = () => undefined,
  onMouseOver,
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
  const [submenuPosition, setSubmenuPosition] = useState({ left: '', bottom: '' });
  const submenuRef = useRef(null);

  const handleMouseEnter = () => setIsMouseOver(true);
  const handleMouseLeve = () => setIsMouseOver(false);

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(returnName ? name : e);
    closeMenu && closeMenu();
  };

  useLayoutEffect(() => {
    if (openSubmenu && onMouseOver) {
      const newSubmenuPosition = { ...submenuPosition };
      const menu = submenuRef.current.parentElement.parentElement;
      const maxWidth = menu.parentElement.offsetWidth;
      const maxHeight = menu.parentElement.offsetHeight;
      const menuPosition = menu.getBoundingClientRect();

      if (menuPosition.right + menu.offsetWidth >= maxWidth) {
        newSubmenuPosition.left = '-13rem';
      }

      if (menuPosition.bottom + menu.offsetHeight >= maxHeight) {
        newSubmenuPosition.top =
          -submenuRef.current.offsetHeight +
          submenuRef.current.parentElement.offsetHeight +
          3.9;
      }

      setSubmenuPosition(newSubmenuPosition);
    }
  }, [openSubmenu]);

  return (
    <div
      className='context-menu-item'
      onClick={children ? (e) => onClick(name, e) : handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeve}
      onMouseOver={onMouseOver ? () => onMouseOver(name) : undefined}
    >
      <div
        className={'cm-item-name'}
        style={{ fontWeight, backgroundColor: isMouseOver ? hoverColor : '' }}
      >
        <div
          className={
            'cm-item-icon' +
            (checkBox ? ` flex-center cm-checkbox${active ? '-checked ' : ''}` : '')
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
          style={{ backgroundColor: isMouseOver ? hoverColor : '' }}
        >
          <MdArrowForwardIos />
        </div>
      )}
      {children ? (
        <div
          ref={submenuRef}
          className={'submenu ' + (openSubmenu ? 'open-submenu' : '')}
          style={submenuPosition}
        >
          {children.length
            ? children.map((child) => cloneElement(child, { hoverColor }))
            : cloneElement(children, { hoverColor })}
        </div>
      ) : null}
    </div>
  );
};

export default ContextMenuItem;
