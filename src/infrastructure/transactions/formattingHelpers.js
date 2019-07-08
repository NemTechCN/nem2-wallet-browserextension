export const formatDate = (d) => {
  let date = d.getDate();
  let month = d.getMonth() + 1;
  const year = d.getFullYear();
  let hours = d.getHours();
  let minutes = d.getMinutes();
  if (date < 10) date = `0${date}`;
  if (month < 10) month = `0${month}`;
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  return `${year.toString().substring(2)}/${month}/${date} ${hours}:${minutes}`;
};

export const tinyAddress = address =>
  // eslint-disable-next-line implicit-arrow-linebreak
  `${address.substring(0, 13).toLowerCase()}...${address.substring(42).toLowerCase()}`;
