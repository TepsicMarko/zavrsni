import { RibbonSettingsGroup, GroupSetting } from "./FileExplorerRibbon";
import { RiLayoutLeftFill, RiLayoutRightFill } from "react-icons/ri";
import { BsFillGrid3X3GapFill, BsSquareFill } from "react-icons/bs";
import { FaThList, FaSortAmountDownAlt, FaCheck } from "react-icons/fa";
import { FcAddColumn } from "react-icons/fc";
import { IoGrid } from "react-icons/io5";
import { BiHide } from "react-icons/bi";
import { AiOutlineGroup, AiOutlineColumnWidth } from "react-icons/ai";
import useToggle from "../../../../hooks/useToggle";

const Checkbox = ({ checked }) => {
  const [isChecked, toggleChecked] = useToggle(checked);

  return (
    <div onClick={toggleChecked} className='flex-center checkbox'>
      {isChecked && <FaCheck size='0.5rem' />}
    </div>
  );
};

const ViewRibbon = ({ isActive }) =>
  isActive && (
    <div>
      <RibbonSettingsGroup groupName='Panes'>
        <GroupSetting
          icon={RiLayoutLeftFill}
          name={["Navigation", <br />, "pane"]}
        />
        <div className='subgroup'>
          <GroupSetting icon={RiLayoutRightFill} name='Preview pane' />
          <GroupSetting icon={RiLayoutRightFill} name='Details pane' />
        </div>
      </RibbonSettingsGroup>

      <RibbonSettingsGroup groupName='Layout'>
        <div className='subgroup'>
          <GroupSetting icon={BsSquareFill} name='Extra large icons' />
          <GroupSetting icon={IoGrid} name='Medium icons' />
          <GroupSetting icon={FaThList} name='List' />
        </div>
        <div className='subgroup'>
          <GroupSetting icon={BsSquareFill} name='Large icons' />
          <GroupSetting icon={BsFillGrid3X3GapFill} name='Small icons' />
          <GroupSetting icon={FaThList} name='Details' />
        </div>
      </RibbonSettingsGroup>

      <RibbonSettingsGroup groupName='Current view'>
        <GroupSetting
          icon={FaSortAmountDownAlt}
          name={["Sort", <br />, "by"]}
        />
        <div className='subgroup'>
          <GroupSetting icon={AiOutlineGroup} name='Group by' />
          <GroupSetting icon={FcAddColumn} name='Add columns' />
          <GroupSetting
            icon={AiOutlineColumnWidth}
            name='Size all columns to fit'
          />
        </div>
      </RibbonSettingsGroup>

      <RibbonSettingsGroup groupName='Show/hide'>
        <div className='subgroup'>
          <GroupSetting icon={<Checkbox />} name='Item check boxes' />
          <GroupSetting icon={<Checkbox />} name='File name extensions' />
          <GroupSetting icon={<Checkbox checked />} name='Hidden items' />
        </div>
        <GroupSetting icon={BiHide} name={["Hide selected", <br />, "items"]} />
      </RibbonSettingsGroup>
    </div>
  );

export default ViewRibbon;
