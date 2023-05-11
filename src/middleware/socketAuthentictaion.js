import jwt_decode from "jwt-decode";
import { getUserService } from "../controllers/user/service";
import { getAuthService } from "../controllers/auth/service";

export const socketAuthentictaion = async (token) => {
  try {
    let authenticated = true;
    if (!token) authenticated = false;
    const credentials = jwt_decode(token);
    const user = await getUserService({ _id: credentials.userId });
    if (!user) authenticated = false;
    const auth = await getAuthService({ userId: credentials.userId });
    if (!auth) authenticated = false;
    return authenticated ? user : false;
  } catch (error) {
    console.log("Socket Authentication Failed:", error?.message);
    return false;
  }
};
