import ContextMenuItem from "../../../../system/context-menu/context-menu-item/ContextMenuItem";

const FormatDropdownMenu = ({ wordWrap, setWordWrap }) => {
  const toggleWordWrap = () => {
    setWordWrap(!wordWrap);
  };

  return (
    <>
      <ContextMenuItem
        fontWeight='400'
        name='Word Wrap'
        onClick={toggleWordWrap}
        checkBox
        active={wordWrap}
        hoverColor='#91c9f7'
      />
      {/* <ContextMenuItem fontWeight='400' name='Font' /> */}
    </>
  );
};

export default FormatDropdownMenu;
