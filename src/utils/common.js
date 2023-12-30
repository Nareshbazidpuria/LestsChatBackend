export const responseMethod = (
  res,
  status,
  message,
  success = false,
  data = {}
) =>
  res?.status(status)?.send({
    success,
    status,
    message,
    data,
  });

export const capitalizeFirstLetter = (str = "") =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const errorMessageConverter = (msg) => {
  if (msg[0] === '"') {
    return msg
      .split(msg.slice(msg.indexOf('"'), msg.lastIndexOf('"') + 1))
      .join(
        capitalizeFirstLetter(
          msg.slice(msg.indexOf('"') + 1, msg.lastIndexOf('"'))
        )
      );
  }
};

export const validationErrorMessageConverter = (req, res, err) => {
  if (err?.details?.body?.length) {
    return responseMethod(
      res,
      err?.statusCode,
      errorMessageConverter(err?.details?.body[0]?.message)
    );
  } else if (err?.details?.query?.length) {
    return responseMethod(
      res,
      err?.statusCode,
      errorMessageConverter(err?.details?.query[0]?.message)
    );
  }
  return responseMethod(res, 400, "Validation error", false, {});
};

export const generateOtp = () => {
  let otp = parseInt(Math.random() * 1000000);
  return otp < 100000 ? generateOtp() : otp;
};

export const getDefaultPagination = (query) => {
  return {
    limit: parseInt(query?.limit || 10),
    sort: { [query?.sortBy || "createdAt"]: parseInt(query?.order || -1) },
    skip: parseInt(query?.limit || 10) * (parseInt(query?.page || 1) - 1),
  };
};

export const getSearchParams = (query) => {
  const search = { $or: [] };
  if (query?.name) {
    search.$or.push({ userName: { $regex: query.name, $options: "i" } });
    search.$or.push({ name: { $regex: query.name, $options: "i" } });
    // search.$or.push({ email: { $regex: query.name, $options: "i" } });
  }
  return search.$or.length ? search : {};
};
