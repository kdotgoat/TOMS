import {JWT_SECRET} from '../config.js';
import jwt from "jsonwebtoken";
import { prisma } from '../utils/prisma.js';

export const isAuthenticated = async (req,res,next)=>{
try{
    let token;

    if(req.cookies?.jwt){
        token = req.cookies.jwt;
    }
    if(!token){
    return res.status(401).json({
        message : "Not authorized",
        success: false
    });
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    const staff = await prisma.staff.findUnique({
        where : { 
            id: decoded.id
        },
        select : {
            id : true,
            role: true,
            phone_number: true,
            first_name : true,
            last_name: true
        },
    });

    if(!staff){
        return res.status(401).json({
            message: "Not authorized, Staff not found! ",
            success: false,
        });
    }
    req.user = staff;
    next();
}
catch (error ){
    return res.status(401).json({
        message: 'Not authorized , invalid token',
        success: false ,
    });
}
};
export const adminOnly = (req, res, next) => {
if (req.user.role !== "ADMIN") {
    return res.status(403).json({
    message: "Access denied. This function is for Admins only.",
    success: false,
    });
}

next();
};
