import { success } from "zod";
import {prisma} from "../utils/prisma.js";

export const searchedOrders = async (req, res) => {
    try{
        const {query} = req.query;
        const cleanQuery = query?.trim();

        if(!cleanQuery){
            return res.status(400).json({
                message : "Missing search input",
                success : false
            });
        }
        const orders = await prisma.orders.findMany({
            where : {
                OR: [
                    {
                        phone_number : {
                            contains : cleanQuery,
                            mode: "insensitive"
                        },
                    },

                    {
                      name : {
                        contains : cleanQuery,
                        mode: "insensitive"
                      },  
                    },
                ],
            },

            orderBy : {
                created_at : "desc"
            },
            select : {
                id : true,
                name: true,
                type:true,
                status:true,
                delivery:true,
                    order_items : {
                        select : {
                            price:true,
                                sub_order_items : {
                                    select: {
                                        price:true,
                                    },
                            },
                        },
                    },
                    payments : {
                        select: {
                            amount : true
                        },
                    },
            },
        });

        if(!orders || orders.length === 0){
            return res.status(404).json({
                message : "No matching orders found",
                success  :false
            });
        }

        const cleanOrders = orders.map((order) => {
            const totalPrice = order.order_items.reduce((acc, item)=> {
                const subTotal = item.sub_order_items.reduce(
                    (subAcc,sub) => subAcc + sub.price, 0
                ); return acc + item.price + subTotal;
            }, 0);
            const totalPayments = order.payments.reduce(
    (acc, payment) => acc + payment.amount,
    0
);
            return {
        id: order.id,
        name: order.name,
        type: order.type,
        status: order.status,
        delivery: order.delivery,
        totalPrice,
        totalPayments,
            };
        });
        return res.status(200).json({
            orders : cleanOrders,
            success : true
        });
    }
    catch(error){
        return res.status(500).json({
            message : "Failed to get the orders",
            success : false,
        });
    }
};

export const filterOrders = async (req, res) => {
    try{
    const { type, status, delivery } = req.body;
    const page = req.query.page || 1
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (delivery) where.delivery = delivery;

    const totalOrders = await prisma.orders.count({ where });

    const orders = await prisma.orders.findMany({
    where,
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
    select: {
        id: true,
        name: true,
        type: true,
        status: true,
        delivery: true,
        order_items: {
        select: {
            price: true,
            sub_order_items: {
            select: {
                price: true,
            },
            },
        },
        },
    payments: {
        select: {
            amount: true,
        },
        },
    },
    });
    if (!orders || orders.length === 0) {
    return res.status(404).json({
        message: "No matching orders found",
        success: false,
    });
    }
    const cleanOrders = orders.map((order) => {
        const totalPrice = order.order_items.reduce((acc, item) => {
        const subTotal = item.sub_order_items.reduce(
            (subAcc, sub) => subAcc + sub.price,
            0
        );
        return acc + item.price + subTotal;
        }, 0);

        const totalPayments = order.payments.reduce(
        (acc, payment) => acc + payment.amount,
        0
        );

    return {
        id: order.id,
        name: order.name,
        type: order.type,
        status: order.status,
        delivery: order.delivery,
        totalPrice,
        totalPayments,
    };
    });
    const totalPages = Math.ceil(totalOrders / limit);

    return res.status(200).json({
        success: true,
        pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        },
        orders: cleanOrders,
    });
    }
    catch (error) {
    return res.status(500).json({
        message: "Failed to filter orders",
        error: error.message,
        success: false,
    });
    }
};