import ContextMenuItem from "../../../../system/context-menu/context-menu-item/ContextMenuItem";

const FileDropdownMenu = () => {
  return (
    <>
      <ContextMenuItem fontWeight='400' name='New' />
      <ContextMenuItem fontWeight='400' name='New Window' />
      <ContextMenuItem fontWeight='400' name='Open...' />
      <ContextMenuItem fontWeight='400' name='Save' />
      <ContextMenuItem fontWeight='400' name='Save As...' />
      <ContextMenuItem fontWeight='400' name='Exit' />
    </>
  );
};

export default FileDropdownMenu;
