import axios from "axios";

const API_URL = "http://localhost:8080/api/item";

export async function fetchPaymentRecords(status) {
    if (status) {
        const res = await axios.get(`${API_URL}/payment-records/status/${status}`);
        return res.data;
    }
    const res = await axios.get(`${API_URL}/payment-records`);
    return res.data;
}

export async function updatePaymentRecord(id, status, paymentDate) {
    const res = await axios.put(`${API_URL}/payment-records/${id}`, {
        status,
        paymentDate,
    });
    return res.data;
}

export async function fetchItems() {
    const res = await axios.get(API_URL);
    return res.data;
}

export async function addItem(item) {
    const res = await axios.post(API_URL, item);
    return res.data;
}