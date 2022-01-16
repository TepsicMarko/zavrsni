import "./CommandOutputs.css";
import moment from "moment";

const DirectoryContentOutput = ({ folderContent }) => {
  return (
    <>
      {folderContent.map((fso) => (
        <div key={fso.node} className='fso-info'>
          <span className='modified-date'>
            {moment(fso.mtime).format("MM/DD/yy")}
          </span>
          <span className='modified-time'>
            {moment(fso.mtime).format("hh:mm A")}
          </span>
          <span
            className='file-type'
            style={{ textAlign: fso.type !== "DIRECTORY" ? "right" : "left" }}
          >
            {fso.type === "DIRECTORY"
              ? "<" + fso.type.substring(0, 3) + ">"
              : fso.size}
          </span>
          <span>{fso.name}</span>
        </div>
      ))}
    </>
  );
};

export default DirectoryContentOutput;
