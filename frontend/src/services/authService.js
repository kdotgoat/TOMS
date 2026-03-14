import api from "./api"

export async function login(data) {
    const res = await api.post('/auth/login', data)
    return res.data
}

export async function logout() {
    const res = await api.post('/auth/logout')
    return res.data
}

export async function getCurrentUser() {
    const res = await api.get('/auth/me')
    return res.data
}

export async function changePassword (data) {
    const res = await api.patch(`/auth/me`, data)
    return res.data
}