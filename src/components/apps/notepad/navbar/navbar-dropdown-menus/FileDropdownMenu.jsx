import ContextMenuItem from "../../../../system/context-menu/context-menu-item/ContextMenuItem";
import { useState, useContext } from "react";
import { ProcessesContext } from "../../../../../contexts/ProcessesContext";
import { FileSystemContext } from "../../../../../contexts/FileSystemContext";
import { path as Path } from "filer";

const FileDropdownMenu = ({ textContent, filePath, setFilePath }) => {
  const { startChildProcess, endProcess } = useContext(ProcessesContext);
  const { createFSO, saveFile } = useContext(FileSystemContext);

  const createFile = (path, name) => {
    createFSO(path, name, "file", textContent);
    setFilePath(Path.join(path, name));
  };

  const openFile = (path, name) => {
    setFilePath(Path.join(path, name));
  };

  const saveChanges = () => saveFile(filePath, textContent);

  const SaveAs = (e) => {
    startChildProcess("Notepad", "File Explorer", {
      customPath: "/C/users/admin/Documents",
      mode: "w",
      parentProcess: "Notepad",
      endProcess,
      createFile,
      minWidth: "31rem",
      minHeight: "17rem",
    });
  };

  const openFileSelection = (e) => {
    console.log("Opening file selection");
    startChildProcess("Notepad", "File Explorer", {
      customPath: "/C/users/admin/Documents",
      mode: "r",
      parentProcess: "Notepad",
      endProcess,
      openFile,
      minWidth: "31rem",
      minHeight: "17rem",
    });
  };

  const exit = () => endProcess("Notepad");

  return (
    <>
      <ContextMenuItem fontWeight='400' name='New' hoverColor='#91c9f7' />
      <ContextMenuItem
        fontWeight='400'
        name='New Window'
        hoverColor='#91c9f7'
      />
      <ContextMenuItem
        fontWeight='400'
        name='Open...'
        onClick={openFileSelection}
        hoverColor='#91c9f7'
      />
      <ContextMenuItem
        fontWeight='400'
        name='Save'
        onClick={saveChanges}
        hoverColor='#91c9f7'
      />
      <ContextMenuItem
        fontWeight='400'
        name='Save As...'
        onClick={SaveAs}
        hoverColor='#91c9f7'
      />
      <ContextMenuItem
        fontWeight='400'
        name='Exit'
        onClick={exit}
        hoverColor='#91c9f7'
      />
    </>
  );
};

export default FileDropdownMenu;
