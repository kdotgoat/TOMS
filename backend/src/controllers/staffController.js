import {prisma} from '../utils/prisma.js';
import bcrypt from 'bcrypt';


export const createNewStaff = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, role } = req.body;

    const existingStaff = await prisma.staff.findUnique({
      where: { phone_number: phoneNumber },
      select: { phone_number: true },
    });

    if (existingStaff) {
      return res
        .status(409)
        .json({ message: "Staff already exists", success: false });
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(phoneNumber, salt);

    await prisma.staff.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        password: hashedPassword,
        role: role ? role : null,
      },
    });

    return res
      .status(201)
      .json({ message: "Staff created successfully", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to add new staff", success: false });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const staff = await prisma.staff.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        role: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    if (!staff || staff.length <= 0)
      return res.status(404).json({ message: "No staff found", success: true });

    return res.status(200).json({ staff, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get staff", success: false });
  }
};

export const getStaffById = async (req, res) => {
  try {
    let id;

    if (req.user.role === "ADMIN") {
      // Admins must pass the ID as a param
      if (!req.params.id) {
        return res.status(400).json({
          message: "Admin must provide a staff ID",
          success: false,
        });
      }
      id = req.params.id;
    } else {
      // Non-admins can only fetch their own data
      id = req.user.id;
    }

    const staff = await prisma.staff.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        role: true,
        created_at: true,
      },
    });

    if (!staff)
      return res
        .status(404)
        .json({ message: "Staff not found", success: false });

    return res.status(200).json({ staff, success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get staff",
      error: error.message,
      success: false,
    });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, role } = req.body;

    const updateData = {};

    if (phoneNumber) updateData.phone_number = phoneNumber;
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (role) updateData.role = role;

    const updatedStaff = await prisma.staff.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Staff updated successfully",
      staff: updatedStaff,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update staff",
      error: error.message,
      success: false,
    });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params; // staff to delete
    const { password } = req.body; // admin's password for confirmation
    const { id: staffId } = req.user;

    // Checks if  password is provided
    if (!password) {
      return res.status(400).json({
        message: "Password required to confirm deletion",
        success: false,
      });
    }

    // It Validate admin's password
    const adminUser = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { password: true },
    });

    if (!adminUser) {
      return res.status(404).json({
        message: "Admin user not found",
        success: false,
      });
    }

    const isPasswordValid = compareSync(password, adminUser.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        message: "Invalid password. Deletion not authorized",
        success: false,
      });
    }

    await prisma.staff.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Staff deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete staff",
      success: false,
    });
  }
};
