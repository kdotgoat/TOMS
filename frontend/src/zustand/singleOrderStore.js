import { create } from "zustand";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/api";

const updateRecursive = (items, itemId, updater) => {
  return items.map((item, index) => {
    if (item.id === itemId) {
      return updater(item, index); // pass index
    }

    if (item.subOrder?.length) {
      return {
        ...item,
        subOrder: updateRecursive(item.subOrder, itemId, updater),
      };
    }

    return item;
  });
};

export const useSingleOrderStore = create((set, get) => ({
  order: {
    id: "",
    name: "",
    phoneNumber: "",
    type: "",
    status: "",
    delivery: "",
    dueDate: "",
    totalPrice: 0,
    totalPayments: 0,
    items: [],
  },
  loading: false,
  error: null,
  message: null,

  newOrder: () => {
    set(() => ({
      order: {
        id: "new",
        name: "",
        phoneNumber: "",
        type: "",
        status: "",
        delivery: "",
        dueDate: "",
        totalPrice: 0,
        totalPayments: 0,
        items: [],
      },
      loading: false,
      error: null,
      message: null,
    }));
  },

  orderDetailChange: (key, value) =>
    set((state) => ({
      order: { ...state.order, [key]: value },
    })),

  addItem: (parentId = null) =>
  set((state) => {
    const makeNewItem = (parentIndex = null, subIndex = null) => ({
      id: parentIndex !== null
        ? `new-sub-${parentIndex}-${subIndex ?? 0}` // unique for subOrders
        : `new-${state.order.items.length}`,         // unique for top-level
      clothingTypeId: "",
      price: 0,
      measurements: {},
      subOrder: [],
    });

    if (!parentId) {
      // top-level item
      const newItem = makeNewItem();
      return {
        order: {
          ...state.order,
          items: [...state.order.items, newItem],
        },
      };
    }

    // subOrder
    return {
      order: {
        ...state.order,
        items: updateRecursive(state.order.items, parentId, (item, parentIndex) => {
          const newSubItem = makeNewItem(parentIndex, item.subOrder.length);
          return {
            ...item,
            subOrder: [...item.subOrder, newSubItem],
          };
        }),
      },
    };
  }),

  updateItem: (itemId, key, value) =>
    set((state) => ({
      order: {
        ...state.order,
        items: updateRecursive(state.order.items, itemId, (item) => ({
          ...item,
          [key]: value,
        })),
      },
    })),

  updateMeasurement: (itemId, key, value) =>
    set((state) => ({
      order: {
        ...state.order,
        items: updateRecursive(state.order.items, itemId, (item) => ({
          ...item,
          measurements: {
            ...item.measurements,
            [key]: value,
          },
        })),
      },
    })),

  setOrder: (order) => {
    set({
      order: {
        id: order.id,
        name: order.name,
        phoneNumber: order.phone_number,
        type: order.type,
        status: order.status,
        delivery: order.delivery,
        dueDate: order.due_date,
        totalPrice: order.totalPrice,
        totalPayments: order.totalPayments,
        items: (order.order_items ?? []).map((orderItem) => ({
          id: orderItem.id,
          clothingTypeId: orderItem.clothing_type_id,
          price: orderItem.price,
          measurements: orderItem.measurements,
          subOrder: (orderItem.sub_order_items ?? []).map((subOrder) =>  ({
            id: subOrder.id,
            clothingTypeId: subOrder.clothing_type_id,
            price: subOrder.price,
            measurements: subOrder.measurements
          }))
        }))
      }
    })
  },


  // ===== API: Update Order
  updateOrder: async (orderId, data) => {
    set({ loading: true, error: null });
    const [res, error] = await apiPatch(`/orders/${orderId}`, data);
    if (error) return set({ loading: false, error });

    set({ loading: false, message: res.message, order: res.order });
  },
}));
