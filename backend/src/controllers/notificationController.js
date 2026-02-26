import {prisma} from "../utils/prisma.js";
import {addDays, differenceInDays, isBefore} from "date-fns";

export const getNotifications = async (req, res) => {
try{
    const id = req.user.id;
        const orders = await prisma.orders.findMany({
            where : {
                created_by_id : id,
                due_date :{
                    lte : addDays(new Date(), 5),
                },
                status : {
                    in : ["PENDING", "IN_PROGRESS"],
                },
            },
            select : {
                id : true,
                name : true,
                due_date : true
            },
        });

        const today = new Date();
        const notifications = orders.map((order) => {
        if (isBefore(order.due_date, today)) {
        // Overdue case
        const daysOverdue = differenceInDays(today, order.due_date);
        return {
            orderId: order.id,
            message: `Order ${order.name} is ${daysOverdue} day(s) overdue.`,
            overdue: true
        };
        } else {
        // Still upcoming
        return {
                orderId: order.id,
                message: `Order ${order.name} is due on ${order.due_date.toDateString()}.`,
                overdue: false
        };
        }
    });

    return res.status(200).json({
        success: true,
        count: notifications.length,
        notifications,
    });
}
catch (error) {
    return res.status(500).json({
      message: "",
      error: error.message,
      success: false,
    });
  }
};