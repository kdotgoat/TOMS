import api from "./api";

export async function fetchStaff() {
  const res = await api.get('/staff/getAllStaff')
  return res.data
}

export async function createStaff(staffData) {
  const res = await api.post("/staff", staffData);
  return res.data;
}

export async function updateStaff(staffId, staffData) {
  const res = await api.patch(`/staff/${staffId}`, staffData);
  return res.data;
}

export async function deleteStaff(staffId, password) {
  const res = await api.delete(`/staff/${staffId}`, {
    data: { password },
  });
  return res.data;
}
