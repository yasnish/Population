export const getRandomColorCode = () => {
  const color = ((Math.random() * 0xffffff) | 0).toString(16);
  return '#' + ('000000' + color).slice(-6);
};
