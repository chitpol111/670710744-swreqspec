import SlotPicker from './pages/SlotPicker.jsx'
import { mockApi } from './api/client.js'

// แสดงหน้าจอเลือกแพ็กเกจและช่วงเวลาสำหรับการจอง (FR-BKG-01, FR-BKG-06)
export default function App({ client = mockApi }) {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-teal-800">ระบบจองคิวตรวจสุขภาพ</h1>
      <SlotPicker client={client} />
    </main>
  )
}
