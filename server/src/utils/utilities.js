import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_TYPE } from "./enums.js";

export const generateRandomKey = (size = 32) =>
  crypto.randomBytes(size).toString("base64");

export const signJWT = ({ id, maxAge }, key) => {
  const now = Date.now();
  const token = jwt.sign(
    {
      id,
      maxAge,
      signTime: now,
    },
    key,
    {
      expiresIn: maxAge,
      algorithm: 'RS512'
    }
  );
  return token;
};

export const verifyJWT = (token, key) => {
    const output = {
        outcome: JWT_TYPE.FAILED
    }
    try{
        const decoded = jwt.verify(token, key, {
            algorithms: 'RS512'
        });
        const { maxAge, signTime} = decoded;
        if(Date.now() <= signTime + maxAge){
            output.outcome = JWT_TYPE.SUCCESS
        }
    }catch{}
    return output;
}