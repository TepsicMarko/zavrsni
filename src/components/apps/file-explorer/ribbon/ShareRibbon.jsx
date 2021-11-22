import { RibbonSettingsGroup, GroupSetting } from "./FileExplorerRibbon";
import { MdEmail, MdSecurity } from "react-icons/md";
import { BsDisc } from "react-icons/bs";
import { FcLock } from "react-icons/fc";
import {
  RiShareForwardBoxFill,
  RiFolderZipFill,
  RiPrinterFill,
  RiPrinterCloudFill,
} from "react-icons/ri";

const ShareRibbon = ({ isActive }) =>
  isActive && (
    <div>
      <RibbonSettingsGroup groupName='Send'>
        <GroupSetting icon={RiShareForwardBoxFill} name='Share' />
        <GroupSetting icon={MdEmail} name='Email' />
        <GroupSetting icon={RiFolderZipFill} name='Zip' />
        <div className='subgroup'>
          <GroupSetting icon={BsDisc} name='Burn to disc' />
          <GroupSetting icon={RiPrinterFill} name='Print' />
          <GroupSetting icon={RiPrinterCloudFill} name='Fax' />
        </div>
      </RibbonSettingsGroup>

      <RibbonSettingsGroup groupName='Security'>
        <GroupSetting icon={FcLock} name={["Remove", <br />, "access"]} />
        <GroupSetting
          icon={MdSecurity}
          name={["Advanced", <br />, "security"]}
        />
      </RibbonSettingsGroup>
    </div>
  );

export default ShareRibbon;
