# Windows 10 clone

Windows 10 clone is a web app built with React that tries to replicate core features, behavior and design of Windows 10 as closely as possible in the browser.

This project is my highschool final paper, and it was inspired by a [portfolio based on Linux](https://vivek9patel.github.io/)

<br>

## System Features

<br>

### Desktop

- Grid layout that's responsive to browser size
- Sort desktop icons by name, size, type and date modified
- Create files and folders with context menu at the location in the grid in which the context menu was opened
- Drag and drop of desktop icons
- Drag and drop of multiple desktop icons selected with rectange selection
- Automatic rearrangement of icons if the dragged icon, or group of icons is dropped onto an occupied position in desktop grid
- Drag and drop files from your PC to the desktop+
- Paste copied files with context menu or keyboard shortcuts

<br>

### Desktop Icon

- Represents File System entry under /Desktop folder
- Open, open with, extract, download, set as background, cut, copy, delete, rename with context menu
- Cut, copy, delete with keyboard shortcuts

<br>

### Taskbar

- Resizable and draggable
- Shows date and country
- #### Start Menu
  - Lists all apps alphabetically
  - Provides shortcuts for /Documents and /Pictures folders
- #### Windows Search
  - Navbar for switching between search areas (all, apps, files, web)
  - Empty search string screen for every search area
  - Best match and relevant search results section for each search area
  - Selected search result information and actions section for each search area
- #### Taskbar icon
  - Represents a pinned app
  - Opens app on click
  - Shows app State (opened, closed, minimized, in focus)
- #### Thumbnail preview
  - Shows a preview of open app or app instances
  - Shows the window title of open app or app instances
  - close app or app instance

<br>

### Window

- Resizable and draggable
- Open, close, minimize, maximize, focus
- Saves last position and size
- Window title displays app's icon and name or custom title
- Optional status bar

<br>

### Dialogs

- Uses window with limited window controls (no minimize, maximize and resize)
- #### Unsaved Changes
  - Opened by apps that modify files
  - Specifies the unsaved file
  - Options to save or discards changes, or cancel the action that opened it
- #### File Transfer
  - Opened when drag and dropping files from users PC to the web app
  - Specifies the drop location and file count
  - Shows transfer progress
  - End transfer (only closes the dialog, but doesn't actually stop file transfer)
- #### Message Dialog
  - Showed when a warning or a error occurs
  - Can provide options for handling the message

<br>

### Context Menu

- Showed where the user pressed right click
- Specific to the part of the app in which it was opened
- Supports submenus

<br>

### File system

- Uses [filerjs](https://github.com/filerjs/filer) which saves to IndexedDb
- Create, read, update, delete
- Default folder structure

```
C
└─ Users
   └─ Public
      └─ Desktop
      └─ Documents
      └─ Downloads
      └─ Pictures
      └─ Videos
```

<br>

### Processes

- Apps can have multiple instances
- Apps can have child processes
- App instances can be opened and closed independently
- Each process has a focus level that determines it's z-index on the desktop

<br></br>

<br>

## Apps & Features

<br>

### File Explorer

- #### Address Bar
  - Back, forth and up navigation
  - Displays current location
  - Navigation via changing address bar url
  - Search current folder and all its children via the search bar
- #### Navigation Pane
  - Displays file system tree
  - When navigating to nested folders, all parent folders expand
  - Add, rename, expand or collapse, and delete folders with context menu
- #### Folder Contents
  - Shows all items inside a folder
  - Resizable column headings allow for layout adjustment
  - Open, open with, extract, download, set as background, cut, copy, delete, rename files with context menu
  - Cut, copy, delete, paste files with keyboard shortcuts
  - On double click open files with default app or navigate to folders
  - Select multiple files or folders with selection rectangle
- #### Status Bar
  - Shows number of items in a directory

<br>

### Notepad

- File name displayed in window title bar
- Create, read, update and delete files
- Basic text manipulation: undo, redo, cut, copy, paste, delete
- Zoom text in/out
- Status bar displays number of lines and characters

<br>

### Chrome

- Navigation via back and forth buttons, or the url bar
- Uses iframe for showing google search results
- Iframe is in sync with url bar
- Open html and pdf files from the file system using the url bar and prefixing the file path with 'file:/'

<br>

### Task Manager

- Shows all running apps
- End selected app

<br>

### Photos

- Zoom image in or out with buttons
- Pan and zoom implemented via [panzoom](https://github.com/timmywil/panzoom)
- Delete open image
- FullScreen mode

<br>

### Movies And TV

- Play and pause video
- Skip forward, skip backward and skip to a certain point of the video
- Shows played and total time
- Adjust audio volume and mute
- Fullscreen mode
- Miniplayer mode

<br>

### Command Prompt

- Terminal UI and command history comes from [react console emulator](https://github.com/linuswillner/react-console-emulator), but I implemented all the commands
- Support basic windows commands and their linux alternatives like: mk/mkdir, cd/chdir, ls/dir, rm/rmdir, move/move...
- Can manipulate the file system and processes
