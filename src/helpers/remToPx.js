const remToPx = (cssString) => {
  if (typeof cssString === "number") return cssString;
  return parseInt(cssString) * 16;
};

export default remToPx;
