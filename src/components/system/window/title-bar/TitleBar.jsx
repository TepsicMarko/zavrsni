import "./TitleBar.css";
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeClose,
} from "react-icons/vsc";

import { memo } from "react";

const TitleBar = ({
  icon,
  title,
  backgroundColor,
  color,
  maximiseWindow,
  closeWindow,
  minimiseWindow,
  handleDragStart,
  handleDrag,
  handleDragEnd,
  limitedWindowControls,
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
      <div className='aplication-name'>{title}</div>
      <div className='window-controls' style={{ backgroundColor }}>
        {!limitedWindowControls && (
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
            maxWidth: limitedWindowControls ? "41px" : "",
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
