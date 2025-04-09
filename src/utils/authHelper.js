export const getCookie = (name) => {
  const regex = new RegExp("(^| )" + name + "=([^;]+)");
  const result = regex.exec(document.cookie);
  return result ? result[2] : null;
};
