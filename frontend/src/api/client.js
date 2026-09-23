// จุดเดียวที่หน้าจอใช้เรียก API หลังบ้าน (ตามสัญญา API ใน plan.md ข้อ 4)
// ตอน test ให้ส่ง client จำลองเข้าไปในหน้าจอแทน ไม่ต้องรันหลังบ้านจริง
// เรียกผ่าน /api (ดู proxy ใน vite.config.js) หลังบ้านต้องรันอยู่ที่ port 8000
const BASE = import.meta.env.VITE_API_BASE ?? '/api'

export const api = {
  async getSlots({ dateFrom, packageCode }) {
    const q = new URLSearchParams({ date_from: dateFrom, package_code: packageCode })
    const res = await fetch(`${BASE}/slots?${q}`)
    return res.json()
  },
  async createBooking({ slotId }) {
    const res = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slotId }),
    })
    return { status: res.status, body: await res.json() }
  },
}

// API จำลองสำหรับหน้าจอและ test ของ T-11 (FR-BKG-01, FR-BKG-06)
export const mockApi = {
  async getSlots({ dateFrom, packageCode }) {
    const slots = {
      BASIC: [{ id: 'basic-0900', slot_date: dateFrom, start_time: '09:00', remaining: 2 }],
      PREMIUM: [{ id: 'premium-1000', slot_date: dateFrom, start_time: '10:00', remaining: 1 }],
    }
    return slots[packageCode] ?? []
  },
}
