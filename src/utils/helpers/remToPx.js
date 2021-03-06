const remToPx = (cssString) => {
  if (typeof cssString === "number") return cssString;
  return parseFloat(cssString) * 16;
};

export default remToPx;
