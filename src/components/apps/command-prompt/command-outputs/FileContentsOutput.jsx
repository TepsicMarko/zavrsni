import { useState, useEffect } from "react";
import formatCommandLineArguments from "../../../../helpers/formatCommandLineArgumnets";
import { path as Path } from "filer";

const FileContentsOutput = ({ currentPath, args, readFileContent }) => {
  const [commandOutput, setCommandOutput] = useState([]);

  useEffect(async () => {
    const filePaths = formatCommandLineArguments(...args);

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

  return commandOutput.map((output) => (
    <div className='file-content'>{output}</div>
  ));
};

export default FileContentsOutput;
