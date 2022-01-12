import "./TitleBar.css";
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeClose,
} from "react-icons/vsc";

import { memo } from "react";

const TitleBar = ({
  icon,
  name,
  backgroundColor,
  color,
  maximiseWindow,
  closeWindow,
  minimiseWindow,
  handleDragStart,
  handleDrag,
  handleDragEnd,
  parentProcess,
  overlay,
}) => {
  return (
    <div
      draggable
      className='title-bar'
      style={{
        backgroundColor: overlay ? "transparent" : backgroundColor,
        color,
        position: overlay ? "absolute" : "",
      }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div className='flex-center aplication-icon'>{icon}</div>
      <div className='aplication-name'>{name}</div>
      <div className='window-controls' style={ {backgroundColor}}>
        {!parentProcess && (
          <>
            <div className='flex-center' onClick={minimiseWindow}>
              <VscChromeMinimize color={color} size='0.85rem' />
            </div>
            <div className='flex-center' onClick={maximiseWindow}>
              <VscChromeMaximize color={color} size='0.9rem' />
            </div>
          </>
        )}
        <div
          className='flex-center'
          style={{
            maxWidth: parentProcess ? "41px" : "",
          }}
          onClick={closeWindow}
        >
          <VscChromeClose color={color} size='0.85rem' />
        </div>
      </div>
    </div>
  );
};

export default memo(TitleBar);
