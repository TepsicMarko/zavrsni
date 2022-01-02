import ContextMenuItem from "../../../../system/context-menu/context-menu-item/ContextMenuItem";

const EditDropdownMenu = () => {
  return (
    <>
      <ContextMenuItem fontWeight='400' name='Undo' />
      <ContextMenuItem fontWeight='400' name='Cut' />
      <ContextMenuItem fontWeight='400' name='Copy' />
      <ContextMenuItem fontWeight='400' name='Paste' />
      <ContextMenuItem fontWeight='400' name='Delete' />
    </>
  );
};

export default EditDropdownMenu;
