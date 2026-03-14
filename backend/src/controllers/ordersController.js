import {prisma} from '../utils/prisma.js'
import {compareSync}from 'bcrypt';


export const orderStats = async (req, res) => {
  try {
    const all = await prisma.orders.count();
    const completed = await prisma.orders.count({
      where: { status: "COMPLETED" },
    });
    const inProgress = await prisma.orders.count({
      where: { status: "IN_PROGRESS" },
    });
    const delivered = await prisma.orders.count({
      where: { delivery: "DELIVERED" },
    });
    const pendingDelivery = await prisma.orders.count({
      where: { delivery: "PENDING" },
    });

    return res.status(200).json({
      totalOrders: all,
      completed,
      inProgress,
      delivered,
      pendingDelivery,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get stats", success: false });
  }
};

// ===== Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalOrders = await prisma.orders.count();

    const orders = await prisma.orders.findMany({
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
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
          where: { isDeleted: false },
          select: {
            amount: true,
          },
        },
      },
    });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found", success: false });
    }

    // Shape the response: add totalPrice + totalPayments, drop itemized details
    const cleanOrders = orders.map((order) => {
      // Calculate total price from order_items + sub_order_items
      const totalPrice = order.order_items.reduce((acc, item) => {
        const subTotal = item.sub_order_items.reduce(
          (subAcc, sub) => subAcc + sub.price,
          0
        );
        return acc + item.price + subTotal;
      }, 0);

      // Calculate total payments
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
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders", success: false });
  }
};

// ===== Create New Order
export const newOrder = async (req, res) => {
  try {
    const { name, phoneNumber, type, orderItems, dueDate, additionalNotes } =
      req.body;

    const allClothingTypeIds = [
      ...orderItems.map((i) => i.clothingTypeId),
      ...orderItems.flatMap(
        (i) => i.subOrder?.map((s) => s.clothingTypeId) || []
      ),
    ];

    // Remove duplicates for validation
    const uniqueClothingTypeIds = [...new Set(allClothingTypeIds)];

    const existingTypes = await prisma.clothingType.findMany({
      where: { id: { in: uniqueClothingTypeIds } },
    });

    if (existingTypes.length !== uniqueClothingTypeIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "One or more clothingTypeIds in orderItems or subOrders are invalid",
      });
    }

    // Create the order
    const createdOrder = await prisma.orders.create({
      data: {
        name,
        phone_number: phoneNumber,
        type,
        additional_notes: additionalNotes || null,
        due_date: new Date(dueDate),
        created_by_id: req.user.id,
        order_items: {
          create: orderItems.map((item) => ({
            clothing_type_id: item.clothingTypeId,
            price: item.price,
            measurements: item.measurements,
            sub_order_items: {
              create:
                item.subOrder?.map((sub) => ({
                  clothing_type_id: sub.clothingTypeId,
                  price: sub.price,
                  measurements: sub.measurements,
                })) || [],
            },
          })),
        },
      },
      include: {
        order_items: {
          include: {
            sub_order_items: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Order created successfully",
      success: true,
      order: createdOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create order",
      success: false,
      error: error.message,
    });
  }
};

// ===== Get Order By Id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Order Id is missing", success: false });
    }

    const order = await prisma.orders.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone_number: true,
        type: true,
        status: true,
        delivery: true,
        due_date: true,
        order_items: {
          select: {
            id: true,
            clothing_type_id: true,
            price: true,
            measurements: true,
            sub_order_items: {
              select: {
                id: true,
                clothing_type_id: true,
                price: true,
                measurements: true,
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

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }

    const totalPrice = order.order_items.reduce((acc, orderItem) => {
      const subTotal = orderItem.sub_order_items.reduce(
        (subAcc, subOrderItem) => subAcc + subOrderItem.price,
        0
      );
      return acc + orderItem.price + subTotal;
    }, 0);

    const totalPayment = order.payments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );

    const { payments, ...orderData } = order;
    orderData.totalPrice = totalPrice;
    orderData.totalPayments = totalPayment;

    return res.status(200).json({ orderData, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get order",
      error: error.message,
      success: false,
    });
  }
};

// ===== Update Order
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ message: "Missing order ID", success: false });

    const updateData = {
      updated_by_id: req.user.id,
    };

    if (data.name) updateData.name = data.name;
    if (data.phoneNumber) updateData.phone_number = data.phoneNumber;
    if (data.type) updateData.type = data.type;
    if (data.status) updateData.status = data.status;
    if (data.delivery) updateData.delivery = data.delivery;
    if (data.additionalNotes)
      updateData.additional_notes = data.additionalNotes;
    if (data.dueDate) {
      const dueDate = new Date(data.dueDate);

      if (dueDate < new Date()) {
        return res.status(400).json({
          message: "Due date must be be in the future",
          success: false,
        });
      }
      updateData.due_date = dueDate;
    }

    const updated = await prisma.orders.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Order updated successfully",
      order: updated,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order",
      error: error.message,
      success: false,
    });
  }
};

// ===== Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const staffId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required", success: false });
    }

    if (!id)
      return res
        .status(400)
        .json({ message: "Missing order ID", success: false });

    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { password: true },
    });

    if (!staff || !compareSync(password, staff.password)) {
      return res
        .status(400)
        .json({ message: "Invalid password", success: false });
    }

    await prisma.orders.delete({
      where: { id },
    });

    return res
      .status(200)
      .json({ message: "Order deleted successfully", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete order", success: false });
  }
};

// ===== Update Order Item
export const updateOrderItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const { ...data } = req.body;

    if (!id || !itemId)
      return res
        .status(400)
        .json({ message: "Missing order ID or item ID", success: false });

    const updateData = {};

    if (data.price) updateData.price = data.price;
    if (data.measurements) updateData.measurements = data.measurements;
    if (data.clothingTypeId) {
      const measurementFields = await prisma.clothingType.findUnique({
        where: { id: data.clothingTypeId },
        select: {
          measurements: true,
        },
      });

      if (!measurementFields) {
        return res.status(404).json({
          message: "Invalid mearsurement fields for selected cloth",
          success: false,
        });
      }

      updateData.clothing_type_id = data.clothingTypeId;
    }

    await prisma.orderItems.update({
      where: { id: itemId },
      data: updateData
    });

    await prisma.orders.update({
      where: { id },
      data: { updated_by_id: req.user.id },
    });

    return res
      .status(200)
      .json({ message: "Update successful", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update order item", success: false });
  }
};

// ===== Delete Order Item
export const deleteOrderItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    if (!id || !itemId)
      return res
        .status(400)
        .json({ message: "Missing order ID or item ID", success: false });

    await prisma.orders.update({
      where: { id },
      data: {
        updated_by_id: req.user.id,
      },
    });

    await prisma.orderItems.delete({
      where: { id: itemId },
    });

    return res
      .status(200)
      .json({ message: "Deleted successfully", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete order item", success: false });
  }
};

// ===== Update Sub Order Item
export const updateSubOrderItems = async (req, res) => {
  try {
    const { id, itemId, subOrderId } = req.params;
    const { ...data } = req.body;

    if (!id || !itemId || !subOrderId)
      return res.status(400).json({
        message: "Missing order, item, or sub order IDs",
        success: false,
      });

    const updateData = {};

    if (data.clothingTypeId !== undefined)
      updateData.clothing_type_id = data.clothingTypeId;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.measurements !== undefined)
      updateData.measurements = data.measurements;

    await prisma.orders.update({
      where: { id },
      data: {
        updated_by_id: req.user.id,
      },
    });

    await prisma.subOrderItems.update({
      where: { id: subOrderId },
      data: updateData,
    });

    return res
      .status(200)
      .json({ message: "Suborder update successful", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to updated sub order items", success: false });
  }
};

// ===== Delete Sub Order Item
export const deleteSubOrderItem = async (req, res) => {
  try {
    const { id, itemId, subOrderId } = req.params;

    if (!id || !itemId || !subOrderId)
      return res.status(400).json({
        message: "Missing order, item, or sub order IDs",
        success: false,
      });

    await prisma.orders.update({
      where: { id },
      data: { updated_by_id: req.user.id },
    });

    await prisma.subOrderItems.delete({
      where: { id: subOrderId },
    });

    return res
      .status(200)
      .json({ message: "Deleted successfully", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete sub order item", success: false });
  }
};

export const getPaymentsByOrderId = async (req, res) => {
  try {
    const { id } = req.params;

    const payments = await prisma.payments.findMany({
      where: { order_id: id },
      select: {
        id: true,
        amount: true,
        reference: true,
        mode: true,
        updated_at: true,
        updated_by: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: { updated_at: "desc" },
    });

    if (!payments || payments.length <= 0)
      return res
        .status(404)
        .json({ message: "No payments for this order", success: false });

    return res.status(200).json({ payments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get payment details", success: false });
  }
};

// ===== Add New Order Item
export const addOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { clothingTypeId, price, measurements, subOrder } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Order ID is required", success: false });
    }

    // Verify order exists
    const orderExists = await prisma.orders.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!orderExists) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }

    // Validate clothing type IDs
    const allClothingTypeIds = [
      clothingTypeId,
      ...(subOrder?.map((sub) => sub.clothingTypeId) || []),
    ];

    // Remove duplicates for validation
    const uniqueClothingTypeIds = [...new Set(allClothingTypeIds)];

    const existingTypes = await prisma.clothingType.findMany({
      where: { id: { in: uniqueClothingTypeIds } },
    });

    if (existingTypes.length !== uniqueClothingTypeIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "One or more clothingTypeIds in orderItems or subOrders are invalid",
      });
    }

    // Create the order item with sub-orders
    const newOrderItem = await prisma.orderItems.create({
      data: {
        order_id: id,
        clothing_type_id: clothingTypeId,
        price,
        measurements,
        sub_order_items: {
          create:
            subOrder?.map((sub) => ({
              clothing_type_id: sub.clothingTypeId,
              price: sub.price,
              measurements: sub.measurements,
            })) || [],
        },
      },
      include: {
        sub_order_items: true,
      },
    });

    // Update order's updated_by_id
    await prisma.orders.update({
      where: { id },
      data: { updated_by_id: req.user.id },
    });

    return res.status(201).json({
      message: "Order item added successfully",
      success: true,
      orderItem: newOrderItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add order item",
      success: false,
      error: error.message,
    });
  }
};

// ===== Add New Sub-Order Item
export const addSubOrderItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const { clothingTypeId, price, measurements } = req.body;

    if (!id || !itemId)
      return res.status(400).json({
        message: "Missing order ID or item ID",
        success: false,
      });

    // Verify order item exists
    const orderItem = await prisma.orderItems.findFirst({
      where: {
        id: itemId,
        order_id: id,
      },
      select: { id: true },
    });

    if (!orderItem) {
      return res.status(404).json({
        message: "Order item not found",
        success: false,
      });
    }

    // Validate clothing type exists
    const measurementFields = await prisma.clothingType.findUnique({
      where: { id: clothingTypeId },
      select: {
        measurements: true,
      },
    });

    if (!measurementFields) {
      return res.status(404).json({
        message: "Invalid measurement fields for selected cloth",
        success: false,
      });
    }

    // Create the sub-order item
    const newSubOrderItem = await prisma.subOrderItems.create({
      data: {
        order_item_id: itemId,
        clothing_type_id: clothingTypeId,
        price,
        measurements,
      },
    });

    // Update order's updated_by_id
    await prisma.orders.update({
      where: { id },
      data: { updated_by_id: req.user.id },
    });

    return res.status(201).json({
      message: "Sub-order item added successfully",
      success: true,
      subOrderItem: newSubOrderItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add sub-order item",
      success: false,
    });
  }
};
