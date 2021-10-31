import { createContext, useState } from "react";

export const FileSystemContext = createContext();

export const FileSystemProvider = ({ children }) => {
  const [state, setState] = useState({
    C: {
      users: {
        default: {
          "3D Objects": {},
          Desktop: {
            test: {
              name: "test",
              data: [
                {
                  "test.txt": {
                    name: "test.txt",
                    location: "C:\\users\\default\\desktop\\test",
                    content: "another test",
                  },
                },
              ],
            },
            "index.html": {
              name: "index.html",
              location: "C:\\users\\default\\desktop",
              content: "just a simple test",
            },
          },
          Documents: {},
          Downloads: {},
          Music: {},
          Pictures: {},
          Videos: {},
        },
      },
    },
  });

  const create = (fileType, fileName, fileLocation) => {
    console.log(
      fileType,
      fileName,
      fileLocation,
      `temp.${fileLocation}${fileName} = 10`
    );
    const temp = { ...state };
    if (fileType === "Folder") {
      console.log(
        `temp.${fileLocation}${`['${fileName}']`} = { name: '${fileName}', location: '${fileLocation}', data: []}`
      );
      eval(
        `temp.${fileLocation}${`['${fileName}']`} = { name: '${fileName}', location: '${fileLocation}', data: []}`
      );
    }
    if (fileType === "File") {
      eval(
        `temp.${fileLocation}.${`['${fileName}']`} = { location: '${fileLocation}', name: '${fileName}'}`
      );
    }
    setState(temp);
  };

  return (
    <FileSystemContext.Provider value={{ fs: state, create }}>
      {children}
    </FileSystemContext.Provider>
  );
};
