const isInSelection = (el, selection) => {
  el.offsetBottom = el.offsetTop + el.offsetHeight;
  el.offsetRight = el.offsetLeft + el.offsetWidth;
  selection.offsetBottom = selection.offsetTop + selection.offsetHeight;
  selection.offsetRight = selection.offsetLeft + selection.offsetWidth;

  return !(
    el.offsetBottom < selection.offsetTop ||
    el.offsetTop > selection.offsetBottom ||
    el.offsetRight < selection.offsetLeft ||
    el.offsetLeft > selection.offsetRight
  );
};

export default isInSelection;
