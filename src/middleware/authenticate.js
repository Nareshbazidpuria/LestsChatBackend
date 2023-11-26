import jwt_decode from "jwt-decode";
import { responseMethod } from "../utils/common";
import { responseCode, responseMessage } from "../../config/constant";
import { getUserService } from "../controllers/user/service";
import { getAuthService } from "../controllers/auth/service";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return responseMethod(
        res,
        responseCode.UNAUTHORIZED,
        responseMessage.TOKEN_NOT_PROVIDED
      );
    }
    const credentials = jwt_decode(token);
    const user = await getUserService({ _id: credentials.userId });
    if (!user) {
      return responseMethod(
        res,
        responseCode.UNAUTHORIZED,
        responseMessage.INVALID_TOKEN
      );
    }
    const auth = await getAuthService({ userId: credentials.userId });
    if (!auth) {
      return responseMethod(
        res,
        responseCode.UNAUTHORIZED,
        responseMessage.AUTHENTICATION_FAILED
      );
    }
    req.auth = user;
    next();
  } catch (error) {
    console.log(error);
    return responseMethod(
      res,
      responseCode.INTERNAL_SERVER_ERROR,
      responseMessage.INTERNAL_SERVER_ERROR
    );
  }
};
