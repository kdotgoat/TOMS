import api from "./api"

export async function fetchPaymentStats (month) {
    const res = await api.get(`/payments/stats?month=${month}`)
    return res.data
}

export async function fetchPayments (page) {
    const res = await api.get(`/payments?page=${page}`)
    return res.data
}