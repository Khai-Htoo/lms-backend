export const successRes = (msg = "", result = null) => {
  return {
    success: true,
    msg,
    result,
  };
};

export const errorRes = (msg = "") => {
  return {
    success: false,
    msg,
  };
};
