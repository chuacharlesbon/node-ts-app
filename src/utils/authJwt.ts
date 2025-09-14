import jwt from 'jsonwebtoken';
import { JwtUser, User } from "../app-schema/chat/UserModel";
import { JWT_SECRET } from "../config/config";

// Generate a JWT token
export const authGenerateUserToken = (user: User, expiresIn = 43200) => {
    const token = jwt.sign({ user }, (JWT_SECRET), {
        expiresIn: expiresIn, // The token expires in 12 hour default
    });
    return token;
};

// Generate a temporary JWT token
export const authGenerateTempUserToken = (user: User) => {
    const token = jwt.sign({ user }, (JWT_SECRET), {
        expiresIn: '30m', // The token expires in 30 minutes
    });
    return token;
};

// Verify a JWT token
export const authVerifyUserToken = (token: string): JwtUser => {
    token = token.slice(7, token.length);
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUser;
    return decoded;
};

// Verify a JWT token
export const authVerifyRawUserToken = (token: string): JwtUser => {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUser;
    return decoded;
};