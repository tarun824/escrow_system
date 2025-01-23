import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenPayload } from "../interfaces/token_payload";
function generateToken({ email, pass }: { email: String, pass: String }) {
    const privateKey = process.env.JWT_TOKEN ?? "Token";
    let newToken = jwt.sign({ email: email, password: pass, isValid: true }, privateKey);
    return newToken;
}

function verifyToken({ token }: { token: string }): TokenPayload | null {
    const privateKey = process.env.JWT_TOKEN ?? "Token";
    try {
        const decodeedValue = jwt.verify(token, privateKey) as JwtPayload;
        return {
            email: decodeedValue.email,
            password: decodeedValue.password,
            isValid: decodeedValue.isValid
        } as TokenPayload;
    } catch (_) {
        return null;
    }

}
function makeTokenInvalid({ email, pass }: { email: String, pass: String }) {
    const privateKey = process.env.JWT_TOKEN ?? "Token";
    let newToken = jwt.sign({ email: email, password: pass, isValid: false }, privateKey);
    return newToken;
}


export { generateToken, verifyToken, makeTokenInvalid };
