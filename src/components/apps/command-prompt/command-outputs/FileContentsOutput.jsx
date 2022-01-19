import { useState, useEffect } from "react";
import formatCommandLineArguments from "../../../../utils/helpers/formatCommandLineArgumnets";
import { path as Path } from "filer";

const FileContentsOutput = ({
  command,
  currentPath,
  args,
  readFileContent,
}) => {
  const [commandOutput, setCommandOutput] = useState([]);
  const [filePaths] = useState(formatCommandLineArguments(...args));

  useEffect(async () => {
    const fileContents = await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          return await readFileContent(Path.join(currentPath, filePath));
        } catch (err) {
          return `cat: ${filePath}: No such file or directory`;
        }
      })
    );

    setCommandOutput(fileContents);
  }, []);

  return commandOutput.map((output, i) => (
    <div className='file-content'>
      {command === "type" && filePaths.length > 1 && <div>{filePaths[i]}:</div>}
      {output}
    </div>
  ));
};

export default FileContentsOutput;
