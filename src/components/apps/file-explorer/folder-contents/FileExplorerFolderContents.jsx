import "./FileExplorerFolderContents.css";
import ColumnHeading from "./column-heading/ColumnHeading";
import FsoListItem from "./fso-list-item/FsoListItem";
import { useState, useEffect, useContext } from "react";
import useWatchFolder from "../../../../hooks/useWatchFolder";
import moment from "moment";
import { FileSystemContext } from "../../../../contexts/FileSystemContext";

const FileExplorerFolderContents = ({ changePath, path }) => {
  const { watch, getFolder } = useContext(FileSystemContext);
  const [folderContent, setWatcherPath] = useWatchFolder(
    path,
    watch,
    getFolder
  );
  const [columnHeadingsWidth, setColumnHeadingsWidth] = useState({
    Name: "4.5rem",
    "Date Modified": "4.5rem",
    Type: "4.5rem",
    Size: "4.5rem",
  });

  const setColumnHeadingWidth = (name, width) => {
    setColumnHeadingsWidth({ ...columnHeadingsWidth, [name]: width });
  };

  useEffect(() => {
    setWatcherPath(path);
  }, [path]);

  return (
    <div className='fx-folder-contents'>
      <div className='column-headings'>
        {Object.keys(columnHeadingsWidth).map((columnHeading) => (
          <ColumnHeading
            name={columnHeading}
            width={columnHeadingsWidth[columnHeading]}
            setColumnHeadingWidth={setColumnHeadingWidth}
          />
        ))}
      </div>
      <div className='fso-list'>
        {folderContent.map((fso) => {
          return (
            <FsoListItem
              name={fso.name}
              dateModified={moment(fso.ctime).format("DD/MM/YYYY hh:mm a")}
              type={fso.type}
              size={fso.size}
              columnHeadingsWidth={columnHeadingsWidth}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FileExplorerFolderContents;
