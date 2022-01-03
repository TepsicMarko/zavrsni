import ContextMenuItem from "../../../../system/context-menu/context-menu-item/ContextMenuItem";
import { useState, useContext } from "react";
import { ProcessesContext } from "../../../../../contexts/ProcessesContext";
import { FileSystemContext } from "../../../../../contexts/FileSystemContext";

const FileDropdownMenu = ({ textContent }) => {
  const { startChildProcess, endProcess } = useContext(ProcessesContext);
  const { createFSO } = useContext(FileSystemContext);

  const createFile = (path, name) => {
    createFSO(path, name, "file", textContent);
  };

  const openFileExplorer = (e) => {
    console.log("opening file explorer");
    startChildProcess("Notepad", "File Explorer", {
      customPath: "/C/users/admin/Documents",
      mode: "w",
      parentProcess: "Notepad",
      endProcess,
      createFile,
    });
  };

  return (
    <>
      <ContextMenuItem fontWeight='400' name='New' />
      <ContextMenuItem fontWeight='400' name='New Window' />
      <ContextMenuItem fontWeight='400' name='Open...' />
      <ContextMenuItem fontWeight='400' name='Save' />
      <ContextMenuItem
        fontWeight='400'
        name='Save As...'
        onClick={openFileExplorer}
      />
      <ContextMenuItem fontWeight='400' name='Exit' />
    </>
  );
};

export default FileDropdownMenu;
