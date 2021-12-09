import "./FileExplorerRibbon.css";
import HomeRibbon from "./HomeRibbon";
import ShareRibbon from "./ShareRibbon";
import ViewRibbon from "./ViewRibbon";
import { memo } from "react";

const FileExplorerRibbon = ({ activeTab }) => {
  return (
    <div className='fx-ribbon'>
      <HomeRibbon isActive={activeTab === "Home"} />
      <ShareRibbon isActive={activeTab === "Share"} />
      <ViewRibbon isActive={activeTab === "View"} />
    </div>
  );
};

export default memo(FileExplorerRibbon);

export const GroupSetting = ({ icon, name }) => (
  <div className='flex-center group-setting'>
    {typeof icon === "function" ? icon({ size: "1.5rem" }) : icon}
    <div className='group-setting-name'>{name}</div>
  </div>
);

export const RibbonSettingsGroup = ({ groupName, children }) => (
  <div className='ribbon-settings-group'>
    <div className='group-settings'>{children}</div>
    <div className='group-name'>{groupName}</div>
  </div>
);
