import {prisma} from "../utils/prisma.js";
import { compareSync } from "bcrypt";
import {getMonthDateRange} from "../utils/monthDateRange.js";
import { success } from "zod";

export const paymentStats = async (req, res) => {
    try{
        const month = parseInt(req.query.month) - 1
        if(isNaN(month)){
            return res.status(400).json({
                message : "Month parameter not found ",
                success : false
            });
        }
        const {startDate, endDate} = getMonthDateRange(month);

        const orders = await prisma.orders.findMany({
            where : {
                created_at : {
                    gte : startDate,
                    lt : endDate
                },
            },
            include: {
        order_items: {
        include: {
            sub_order_items: true,
        },
        },
        payments: true,
    },
    });

    let totalOrders = 0;
    let totalSubOrders = 0;
    let totalPayments = 0;

    orders.forEach((order) => {
    order.order_items.forEach((item) => {
        totalOrders += item.price;
        item.sub_order_items.forEach((subItem) => {
        totalSubOrders += subItem.price;
        });
    });

    order.payments.forEach((payment) => {
        totalPayments += payment.amount;
    });
    });
        const totalRevenue = totalOrders + totalSubOrders;
    const pendingPayments = totalRevenue - totalPayments;

    return res.status(200).json({
      totalRevenue,
      totalPayments,
      pendingPayments,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch payment stats" });
  }
};

export const addPayment = async (req,res) => {
    try{
    const {orderId,amount,mode,reference} = req.body;
        const staffId = req.user.id;

        const paymentData = {
            amount,
            mode,
            reference,
            order_id : orderId,
            updated_by : staffId
        };

        if((mode === "BANK_TRANSFER" || mode === "MPESA" && !reference))
            return res.status(400).json({
        message : "Reference number must be provided",
        success : false
    });

    await prisma.payments.create({
        data : paymentData
    });
    return res.status(201).json({
        message : "Payment added succesfully", success : true
    });
    }
    catch(error){
        return res.status(500).json({
            message : "Failed to add payment", success : false
        });
    }
};

export const updatePayment = async () => {
    try{
        const {id} = req.params;
        const {amount,reference,mode} = req.body;
        
        const updateData = {
            updated_by_id : req.user.id
        };

        if(amount) updateData.amount = amount;
        if(reference) updateData.reference = reference;
        if(mode) updateData.mode = mode;

        const updated = await prisma.payments.update({
            where : {id},
            data : updateData
        });

        if(!updated)
            return res.status(404).json({
                message : "Payment not found", success : false
            });
        
        return res.status(200).json({
            message : "Payment updated succesfully", success : true
        });
    }
    catch (error) {
    return res
    .status(500)
    .json({ message: "Failed to update payment datails", success: false });
}
};

export const deletePayment = async (req, res) => {
try{
    const {id} = req.params;
    const {password} = req.body;
    const staffId = req.user.id;

    const staff = await prisma.staff.findUnique({
        where : {id : staffId},
        password : true
    });
    if(!password){
        return res.status(400).json({
            message : "Password is required", success : false
        });
    }
    if(!compareSync(password, staff.password))
        return res.status(400).json({
            message: "Password is invalid",
            success : false
    });

    const deleted = await prisma.payments.update({
    where: { id },
    data: {
        isDeleted: true,
        updated_by_id: staffId,
    },
    });

    if (!deleted)
    return res
        .status(404)
        .json({ message: "No payment found", success: false });

    return res
    .status(200)
    .json({ message: "Deleted successfully", success: true });
    
}
catch (error) {
    return res.status(500).json({
    message: "Failed to delete payment",
    success: false,
    });
}
};

export const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalPayments = await prisma.payments.count();

    const payments = await prisma.payments.findMany({
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      where: { isDeleted: false },
      select: {
        id: true,
        order: {
          select: {
            id: true,
            name: true,
          },
        },
        amount: true,
        mode: true,
        reference: true,
        updated_by: {
          select: {
            first_name: true,
            last_name: true
          }
        }
      },
    });

    if (!payments || payments.length === 0) {
      return res
        .status(404)
        .json({ message: "No payments found", success: false });
    }

    const totalPages = Math.ceil(totalPayments / limit);

    return res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      payments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get all payments",
      error: error.message,
      success: false,
    });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payments.findUnique({
      where: { id },
      select: {
        id: true,
        order: {
          select: {
            name: true,
          },
        },
        amount: true,
        mode: true,
        reference: true,
        updated_by: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });

    if (!payment)
    return res
        .status(404)
        .json({ message: "Payment not found", success: false });

    return res.status(200).json({ payment, success: true });
} catch (error) {
    return res
    .status(500)
    .json({ message: "Failed to get payment info", success: false });
}
};