import "./FileExplorerRibbon.css";
import HomeRibbon from "./HomeRibbon";
import ShareRibbon from "./ShareRibbon";

const FileExplorerRibbon = ({ activeTab }) => {
  return (
    <div className='fx-ribbon'>
      <HomeRibbon isActive={activeTab === "Home"} />
      <ShareRibbon isActive={activeTab === "Share"} />
    </div>
  );
};

export default FileExplorerRibbon;

export const GroupSetting = ({ icon, name }) => (
  <div className='flex-center group-setting'>
    {icon({ size: "1.5rem" })}
    <div className='group-setting-name'>{name}</div>
  </div>
);

export const RibbonSettingsGroup = ({ groupName, children }) => (
  <div className='ribbon-settings-group'>
    <div className='group-settings'>{children}</div>
    <div className='group-name'>{groupName}</div>
  </div>
);
