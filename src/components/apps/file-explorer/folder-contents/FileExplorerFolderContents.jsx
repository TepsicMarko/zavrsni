import "./FileExplorerFolderContents.css";
import ColumnHeading from "./column-heading/ColumnHeading";

const FileExplorerFolderContents = ({ changePath, folderContent, path }) => {
  const renderFolderContents = () => {
    let returnArr = [];
    for (let fso in folderContent) {
      returnArr.push({ name: fso, ...folderContent[fso] });
    }
    return returnArr.map((fso) => (
      <div className='fso-list-item'>{fso.name}</div>
    ));
  };

  return (
    <div className='fx-folder-contents'>
      <div className='column-headings'>
        <ColumnHeading name='Name' />
        <ColumnHeading name='Date modified test' />
        <ColumnHeading name='Type' />
        <ColumnHeading name='Size' />
      </div>
      <div className='fso-list'>{renderFolderContents()}</div>
    </div>
  );
};

export default FileExplorerFolderContents;
