import ContextMenuItem from "../../../../system/context-menu/context-menu-item/ContextMenuItem";
import { useState, useContext } from "react";
import { ProcessesContext } from "../../../../../contexts/ProcessesContext";
import { FileSystemContext } from "../../../../../contexts/FileSystemContext";
import { path as Path } from "filer";

const FileDropdownMenu = ({
  textContent,
  filePath,
  setFilePath,
  openUnsavedChangesDialog,
  resetNotepad,
}) => {
  const { startChildProcess, endProcess } = useContext(ProcessesContext);
  const { createFSO, saveFile, readFileContent } =
    useContext(FileSystemContext);

  const createFile = (path, name) => {
    createFSO(path, name, "txt", textContent);
    setFilePath(Path.join(path, name));
  };

  const openSelectedFile = (path, name) => {
    setFilePath(Path.join(path, name));
  };

  const saveChanges = () => {
    if (filePath) saveFile(filePath, textContent);
    else {
      saveAs();
    }
  };

  const saveAs = (e) => {
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

  const openFileSelection = () => {
    startChildProcess("Notepad", "File Explorer", {
      customPath: "/C/users/admin/Documents",
      mode: "r",
      parentProcess: "Notepad",
      endProcess,
      openFile: openSelectedFile,
      minWidth: "31rem",
      minHeight: "17rem",
    });
  };

  const isContentSame = (fileContent, handleSameContent) => {
    console.log(fileContent, textContent);
    if (fileContent === textContent) {
      handleSameContent();
    } else {
      openUnsavedChangesDialog(handleSameContent);
    }
  };

  const openFile = (e) => {
    if (filePath) {
      readFileContent(filePath, (fileContent) =>
        isContentSame(fileContent, openFileSelection)
      );
    } else {
      textContent
        ? openUnsavedChangesDialog(openFileSelection)
        : openFileSelection();
    }
  };

  const createBlankFile = () => {
    if (filePath) {
      readFileContent(filePath, (fileContent) =>
        isContentSame(fileContent, resetNotepad)
      );
    } else {
      textContent ? openUnsavedChangesDialog(resetNotepad) : resetNotepad();
    }
  };

  return (
    <>
      <ContextMenuItem
        fontWeight='400'
        name='New'
        hoverColor='#91c9f7'
        onClick={createBlankFile}
      />
      <ContextMenuItem
        fontWeight='400'
        name='New Window'
        hoverColor='#91c9f7'
      />
      <ContextMenuItem
        fontWeight='400'
        name='Open...'
        onClick={openFile}
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
        onClick={saveAs}
        hoverColor='#91c9f7'
      />
    </>
  );
};

export default FileDropdownMenu;
