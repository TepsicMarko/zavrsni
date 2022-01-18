import "./CommandOutputs.css";
import moment from "moment";
import { useState, useEffect } from "react";
import { path as Path } from "filer";

const DirectoryContentOutput = ({
  currentPath,
  command,
  path,
  args,
  getFolder,
}) => {
  const [commandOutput, setCommandOutput] = useState([]);

  useEffect(async () => {
    if (command === "dir") {
      if (path) {
        const toManyArgs = path.slice(path.lastIndexOf('"')).includes(" ");
        if (toManyArgs) setCommandOutput([{ err: "To many arguments" }]);
      }

      try {
        const folderContent = await getFolder(
          Path.join(currentPath, path ? path.replaceAll('"', "") : "")
        );

        setCommandOutput([
          {
            folderName: Path.join(
              currentPath,
              path ? path.replaceAll('"', "") : ""
            ),
            content: folderContent,
          },
        ]);
      } catch (err) {
        console.log(err);
        setCommandOutput([{ err: "Folder not found" }]);
      }
    } else {
      if (path) {
        args = [path, ...args];
        let folderPaths = [];

        for (let i = 0; i < args.length; i++) {
          if (args[i].includes('"')) {
            let folderPath = "";
            for (let j = i; j < args.length; j++) {
              folderPath += " " + args[j];
              if (args[j].includes('"') && j !== i) {
                i = j - 1;
                break;
              }
            }

            folderPaths.push(folderPath.replaceAll('"', "").trim());
            i++;
          } else {
            folderPaths.push(args[i]);
          }
        }

        let foldersContent = await Promise.all(
          folderPaths.map(async (folderPath) => {
            try {
              return {
                folderName: Path.basename(folderPath),
                content: await getFolder(Path.join(currentPath, folderPath)),
              };
            } catch (err) {
              return {
                err: `ls: cannot access ${folderPath}: No such file or directory`,
              };
            }
          })
        );

        setCommandOutput(foldersContent);
      } else {
        const folderContent = await getFolder(currentPath);
        setCommandOutput([{ folderName: "", content: folderContent }]);
      }
    }
  }, []);

  return commandOutput.map(({ folderName, content, err }) => (
    <>
      <div className='folder-name'>
        {content &&
          folderName &&
          (command === "dir" ? `Directory of ${folderName}` : folderName + ":")}
      </div>
      {content &&
        content.map((fso) => (
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
            <span>
              {command === "ls" && fso.name.includes(" ")
                ? `"${fso.name}"`
                : fso.name}
            </span>
          </div>
        ))}
      {err && <div className='fso-info'>{err}</div>}
    </>
  ));
};

export default DirectoryContentOutput;
