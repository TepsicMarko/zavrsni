import "./MoviesAndTv.css";
import { useState, useEffect, useContext } from "react";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import { FileSystemContext } from "../../../contexts/FileSystemContext";
import { BsVolumeUp } from "react-icons/bs";
import {
  MdOutlineForward30,
  MdReplay10,
  MdOutlineSubtitles,
} from "react-icons/md";
import { FiPlay } from "react-icons/fi";
import { AiOutlinePause } from "react-icons/ai";
import { CgMiniPlayer } from "react-icons/cg";
import { AiOutlineExpandAlt } from "react-icons/ai";

const MoviesAndTv = ({ path }) => {
  const [src, setSrc] = useState("");
  const { readBlob } = useContext(FileSystemContext);

  useEffect(() => {
    path && readBlob(path, (blobSrc) => setSrc(blobSrc));
  }, []);

  return (
    <Window
      app='Movies And Tv'
      displayAppName={false}
      minWindowWidth='9rem'
      minWindowHeight='10rem'
      titleBar={{ color: "white", backgroundColor: "black", overlay: true }}
    >
      <WindowContent backgroundColor='black' flex flexDirection='column'>
        <div className='video-container'>
          <video className='video' src={src}></video>
          <div className='flex-center video-controls'>
            <div className='video-controls-btn'>
              <BsVolumeUp color='white' size='1.5rem' />
            </div>
            <div className='video-controls-btn'>
              <MdOutlineSubtitles color='white' size='1.5rem' />
            </div>

            <div className='flex-center video-main-controls'>
              <MdReplay10 color='white' size='1.75rem' />
              <div className='video-controls-btn'>
                {true ? (
                  <FiPlay color='white' size='1.25rem' />
                ) : (
                  <AiOutlinePause color='white' size='1.5rem' />
                )}
              </div>
              <MdOutlineForward30 color='white' size='1.75rem' />
            </div>

            <div className='video-controls-btn'>
              <CgMiniPlayer color='white' size='1.5rem' />
            </div>
            <div className='video-controls-btn'>
              <AiOutlineExpandAlt color='white' size='1.5rem' />
            </div>
          </div>
          <div className='controls-overlay'></div>
        </div>
      </WindowContent>
    </Window>
  );
};

export default MoviesAndTv;
