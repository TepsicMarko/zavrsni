import "./FileExplorerFolderContents.css";
import ColumnHeading from "./column-heading/ColumnHeading";
import FsoListItem from "./fso-list-item/FsoListItem";
import { useState } from "react";

const FileExplorerFolderContents = ({ changePath, folderContent, path }) => {
  const [columnHeadingsWidth, setColumnHeadingsWidth] = useState({
    Name: "4.5rem",
    "Date Modified": "4.5rem",
    Type: "4.5rem",
    Size: "4.5rem",
  });

  const setColumnHeadingWidth = (name, width) => {
    setColumnHeadingsWidth({ ...columnHeadingsWidth, [name]: width });
  };

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
        {Object.keys(folderContent).map((fso) => {
          const { dateModified, type, size } = folderContent[fso];
          return (
            <FsoListItem
              name={fso}
              dateModified={dateModified}
              type={type}
              size={size}
              columnHeadingsWidth={columnHeadingsWidth}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FileExplorerFolderContents;
