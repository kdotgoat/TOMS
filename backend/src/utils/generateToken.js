import jwt from "jsonwebtoken";


export const generateToken = (userId, res) => {
    const payload = {id : userId};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN || "2h",
    });

    res.cookie ("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 2000*60*60,
    });

    return token;

};