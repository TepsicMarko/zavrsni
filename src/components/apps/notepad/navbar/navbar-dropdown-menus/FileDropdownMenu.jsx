import ContextMenuItem from '../../../../system/context-menu/context-menu-item/ContextMenuItem';
import { useState, useContext } from 'react';
import { ProcessesContext } from '../../../../../contexts/ProcessesContext';
import { FileSystemContext } from '../../../../../contexts/FileSystemContext';
import { path as Path } from 'filer';

const FileDropdownMenu = ({
  textContent,
  filePath,
  setFilePath,
  openUnsavedChangesDialog,
  resetNotepad,
  pid,
  addToGrid,
}) => {
  const { startProcess, startChildProcess, endProcess } = useContext(ProcessesContext);
  const { createFSO, saveFile, readFileContent } = useContext(FileSystemContext);

  const createFile = (path, name, type) => {
    createFSO(path, name, type, textContent);
    setFilePath(Path.join(path, name + type));
    if (path === '/C/users/admin/Desktop')
      addToGrid([name + type, undefined], { row: 1, column: 1 });
  };

  const openSelectedFile = (path, name, type) => {
    console.log(path, name);
    setFilePath(Path.join(path, name + type));
  };

  const saveChanges = () => {
    if (filePath)
      saveFile(filePath.replace(/\.[^/.]+$/, ''), Path.extname(filePath), textContent);
    else saveAs();
  };

  const saveAs = (e) => {
    startChildProcess('Notepad', pid, 'File Explorer', {
      customPath: '/C/users/admin/Documents',
      mode: 'w',
      parentProcess: 'Notepad',
      endProcess,
      handleSave: createFile,
      minWidth: '31rem',
      minHeight: '17rem',
      ppid: pid,
    });
  };

  const openFileSelection = () => {
    startChildProcess('Notepad', pid, 'File Explorer', {
      customPath: '/C/users/admin/Documents',
      mode: 'r',
      parentProcess: 'Notepad',
      endProcess,
      openFile: openSelectedFile,
      minWidth: '31rem',
      minHeight: '17rem',
      ppid: pid,
    });
  };

  const openFile = async (e) => {
    if (filePath) {
      const fileContent = await readFileContent(filePath);

      fileContent === textContent
        ? openFileSelection()
        : openUnsavedChangesDialog({ openFileSelection });
    } else {
      textContent ? openUnsavedChangesDialog({ openFileSelection }) : openFileSelection();
    }
  };

  const createBlankFile = async () => {
    if (filePath) {
      const fileContent = await readFileContent(filePath);

      fileContent === textContent
        ? resetNotepad()
        : openUnsavedChangesDialog({ resetNotepad });
    } else {
      textContent ? openUnsavedChangesDialog(resetNotepad) : resetNotepad();
    }
  };

  const openNotepad = () => startProcess('Notepad');

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
        onClick={openNotepad}
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
