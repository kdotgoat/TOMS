import api from "./api"


export async function getAllOrders (page) {
    const res = await api.get(`/orders?page=${page}`)
    return res.data
}

export async function updateOrder(orderId, data) {
    const res = await api.patch(`/orders/${orderId}`, data)
    return res.data
}

export async function deleteOrder(orderId, password) {
    const res = await api.delete(`/orders/${orderId}`, {
        data: { password }
    })
    return res.data
}

export async function addOrderItem(orderId, itemData) {
    const res = await api.post(`/orders/${orderId}/items`, itemData)
    return res.data
}

export async function updateOrderItem(orderId, itemId, itemData) {
    const res = await api.patch(`/orders/${orderId}/items/${itemId}`, itemData)
    return res.data
}

export async function deleteOrderItem(orderId, itemId) {
    const res = await api.delete(`/orders/${orderId}/items/${itemId}`)
    return res.data
}

export async function addSubOrderItem(orderId, itemId, subOrderData) {
    const res = await api.post(`orders/${orderId}/items/${itemId}/suborders`, subOrderData)
    return res.data
}

export async function updateSubOrderItem(orderId, itemId, subOrderId, subOrderData) {
    const res = await api.patch(`/orders/${orderId}/items/${itemId}/subOrders/${subOrderId}`, subOrderData)
    return res.data
}

export async function deleteSubOrderItem(orderId, itemId, subOrderId) {
    const res = await api.delete(`/orders/${orderId}/items/${itemId}/subOrders/${subOrderId}`)
    return res.data
}

export async function getOrder(orderId) {
    const res = await api.get(`/orders/${orderId}`)
    return res.data
}

export async function searchOrders(query) {
    const res = await api.get(`/search?query=${query}`)
    return res.data
}
