import { RibbonSettingsGroup, GroupSetting } from "./FileExplorerRibbon";
import { BsPinAngleFill } from "react-icons/bs";
import { FaCopy, FaFileImport, FaFolderPlus } from "react-icons/fa";
import { IoClipboardSharp } from "react-icons/io5";
import { IoIosCut } from "react-icons/io";
import { MdFileCopy } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { BiRename } from "react-icons/bi";
import { GiFiles } from "react-icons/gi";
import {
  BsFileEarmarkCheckFill,
  BsFileEarmarkFill,
  BsGrid,
  BsGridFill,
} from "react-icons/bs";

const HomeRibbon = ({ isActive }) =>
  isActive && (
    <div>
      <RibbonSettingsGroup groupName='Clipboard'>
        <GroupSetting
          icon={BsPinAngleFill}
          name={["Pin to Quick", <br />, "access"]}
        />
        <GroupSetting icon={FaCopy} name='Copy' />
        <GroupSetting icon={IoClipboardSharp} name='Paste' />
        <GroupSetting icon={IoIosCut} name='Cut' />
      </RibbonSettingsGroup>

      <RibbonSettingsGroup groupName='Organise'>
        <GroupSetting icon={FaFileImport} name={["Move", <br />, "to"]} />
        <GroupSetting icon={MdFileCopy} name={["Copy", <br />, "to"]} />
        <GroupSetting icon={AiOutlineClose} name='Delete' />
        <GroupSetting icon={BiRename} name='Rename' />
      </RibbonSettingsGroup>

      <RibbonSettingsGroup groupName='New'>
        <GroupSetting icon={FaFolderPlus} name={["New", <br />, "Folder"]} />
        <GroupSetting icon={GiFiles} name='New item' />
      </RibbonSettingsGroup>

      <RibbonSettingsGroup groupName='Open'>
        <GroupSetting icon={BsFileEarmarkCheckFill} name='Properties' />
        <GroupSetting icon={BsFileEarmarkFill} name='Open' />
      </RibbonSettingsGroup>

      <RibbonSettingsGroup groupName='Select'>
        <GroupSetting icon={BsGridFill} name='Select all' />
        <GroupSetting icon={BsGrid} name='Select none' />
      </RibbonSettingsGroup>
    </div>
  );

export default HomeRibbon;
