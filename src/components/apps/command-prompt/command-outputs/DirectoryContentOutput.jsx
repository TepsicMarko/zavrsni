import "./CommandOutputs.css";
import moment from "moment";

const DirectoryContentOutput = ({ command, folderName, folderContent }) => {
  return (
    <>
      <div className='folder-name'>
        {typeof folderContent !== "string" &&
          folderName &&
          (command === "dir" ? `Directory of ${folderName}` : folderName + ":")}
      </div>
      {typeof folderContent !== "string" ? (
        folderContent.map((fso) => (
          <div key={fso.node} className='fso-info'>
            <span className='modified-date'>
              {moment(fso.mtime).format("MM/DD/yy")}
            </span>
            <span className='modified-time'>
              {moment(fso.mtime).format("hh:mm A")}
            </span>
            <span
              className='file-type'
              style={{
                textAlign: fso.type !== "DIRECTORY" ? "right" : "left",
              }}
            >
              {fso.type === "DIRECTORY"
                ? "<" + fso.type.substring(0, 3) + ">"
                : fso.size}
            </span>
            <span>{command === "ls" ? `"${fso.name}"` : fso.name}</span>
          </div>
        ))
      ) : (
        <div className='fso-info'>{folderContent}</div>
      )}
    </>
  );
};

export default DirectoryContentOutput;
