import "./FsoListItem.css";

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
      <div style={{ width: Name }}>{name}</div>
      <div style={{ width: DateModified }}>{dateModified}</div>
      <div style={{ width: Type }}>{type.toLowerCase()}</div>
      <div style={{ width: Size }}>{size}</div>
    </div>
  );
};

export default FsoListItem;
