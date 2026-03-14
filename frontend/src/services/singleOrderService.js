import api from "./api"

export async function addNewOrder (data) {
    const res = await api.post('/orders', data)
    return res.data
}

export async function getOrderById(orderId) {
    const res = await api.get(`/orders/${orderId}`)
    return res.data
}