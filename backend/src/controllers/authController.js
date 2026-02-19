import { prisma } from '../utils/prisma.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';
import { NODE_ENV,JWT_SECRET } from '../config.js';

export const registerStaff = async (req, res) => {
  try {
    const { phoneNumber, firstname, lastname } = req.body;

    const existingStaff = await prisma.staff.findUnique({
    where: { phone_number: phoneNumber },
    });

    if (existingStaff) {
    return res.status(409).json({
        message: "Staff already exists",
        success: false,
    });
    }

    const staffData = {
    phone_number: phoneNumber,
    first_name: firstname,
    last_name: lastname,
    role: "STAFF",
    password: await bcrypt.hash(phoneNumber, 10),
    };

    await prisma.staff.create({ data: staffData });

    return res.status(201).json({
    message: "Staff created successfully",
    success: true,
    });

} catch (error) {
    return res.status(500).json({
    message: "Failed to register",
    success: false,
    });
}
};


 export const login = async (req, res) => {
    try{
    const {phoneNumber, password} = req.body;
    const existingStaff = await prisma.staff.findUnique({
        where : {phone_number : phoneNumber}
    });

    if(!existingStaff || !(await bcrypt.compare(password, existingStaff.password))){
        return res.status(400).json({message: "Invalid phone number or password", success : false});
    }
    
    const token = generateToken(existingStaff.id, res);
    return res.status(200)
    .json({
        message : "Login succesful",
        success : true,
        token,
        staff : {
            id: existingStaff.id,
            phone_number: existingStaff.phone_number,
            first_name: existingStaff.first_name,
            last_name: existingStaff.last_name,
            role: existingStaff.role
        },
    })
    }
    catch(error){
        return res.status(500).json({
            message : "Login failed, something went wrong!",
            success : false
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try{
        const {id}  = req.user;

        const currentStaff = await prisma.staff.findUnique({
            where : {id},
            select : {
                id : true,
                phone_number : true,
                first_name: true,
                last_name:true,
                role:true,
            },
        });

        if(!currentStaff) {
            return res.status(404).json({
                message : "Staff not found",
                success: false
            });
        }
        
        return res.status(200).json({
            message : currentStaff,
            success : true
        });

    }
    catch(error){
        return res.status(500).json({
            message :"Failed to get user",
            success : false
        });
    }
};

export const logout = async (req, res) => {
try{
    res.cookie("jwt", "" ,{
        httpOnly: true,
        secure : NODE_ENV,
        sameSite : "Strict",
        expires : new Date(0),
    });

        return res.status(200).json({
            message : "Logged out succesfully",
            success : true
        });
}
catch(error){
    return res.status(500).json({
        message : "Logged out failed!",
        success : false
    });
}
};

export const updatePassword = async (req, res) => {
   try{
    const {currentPassword, newPassword} = req.body;
    const {id} = req.user;

    const staff = await prisma.staff.findUnique({
        where : {id}
    });

    if(!staff) {
        return res.status(404).json({
            message : "Staff not found",
            success : true
        });
    }
    const isMatch = await bcrypt.compare(
        currentPassword,
        staff.password
    );

    if(!isMatch){
        return res.status(400).json({
            message : "Current password is incorrect",
            success : false
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.staff.update({
        where : {id},
        data : {password : hashedPassword}
    });

    return res.status(200).json({
        message : "Password updated succesfully",
        success : true
    });
   }
   catch (error){
    return res.status(500).json({
        message : "Failed to update password",
        success : false
    });
   }

};
