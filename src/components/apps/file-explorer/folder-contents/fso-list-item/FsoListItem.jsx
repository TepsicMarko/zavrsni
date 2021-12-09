import "./FsoListItem.css";
import { memo } from "react";

const FsoListItem = ({
  name,
  dateModified,
  type,
  size,
  columnHeadingsWidth,
}) => {
  const {
    Name,
    ["Date Modified"]: DateModified,
    Size,
    Type,
  } = columnHeadingsWidth;
  return (
    <div className='fso-list-item'>
      <div style={{ minWidth: Name, maxWidth: Name }}>{name}</div>
      <div style={{ minWidth: DateModified, maxWidth: DateModified }}>
        {dateModified}
      </div>
      <div style={{ minWidth: Type, minWidth: Type }}>{type.toLowerCase()}</div>
      <div style={{ minWidth: Size, minWidth: Size }}>{size}</div>
    </div>
  );
};

export default memo(FsoListItem);
