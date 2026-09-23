import { useEffect, useState } from 'react'
import { api } from '../api/client.js'

const packages = ['BASIC', 'PREMIUM']

function formatDate(date) {
  return date.toISOString().slice(0, 10)
}

// ให้ผู้รับบริการเลือกแพ็กเกจและช่วงเวลาที่ว่าง (FR-BKG-01, FR-BKG-06)
export default function SlotPicker({ client = api }) {
  const today = formatDate(new Date())
  const lastBookableDate = formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
  const [selectedDate, setSelectedDate] = useState(today)
  const [packageCode, setPackageCode] = useState(packages[0])
  const [slots, setSlots] = useState([])
  const [selectedSlotId, setSelectedSlotId] = useState('')

  useEffect(() => {
    let active = true
    client
      .getSlots({ dateFrom: selectedDate, packageCode })
      .then((availableSlots) => {
        if (active) {
          setSlots(availableSlots)
          setSelectedSlotId('')
        }
      })

    return () => {
      active = false
    }
  }, [client, packageCode, selectedDate])

  return (
    <section aria-labelledby="slot-picker-title" className="mt-6 rounded-lg border border-slate-200 p-5">
      <h2 id="slot-picker-title" className="text-xl font-semibold text-slate-900">
        เลือกแพ็กเกจและช่วงเวลาตรวจ
      </h2>

      <label className="mt-4 block font-medium text-slate-700" htmlFor="package">
        แพ็กเกจ
      </label>
      <select
        className="mt-1 w-full rounded border border-slate-300 p-2"
        id="package"
        value={packageCode}
        onChange={(event) => setPackageCode(event.target.value)}
      >
        {packages.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>

      <label className="mt-4 block font-medium text-slate-700" htmlFor="date">
        วันที่ตรวจ
      </label>
      <input
        className="mt-1 w-full rounded border border-slate-300 p-2"
        id="date"
        type="date"
        min={today}
        max={lastBookableDate}
        value={selectedDate}
        onChange={(event) => setSelectedDate(event.target.value)}
      />

      <h3 className="mt-5 font-medium text-slate-700">ช่วงเวลาที่ว่าง</h3>
      <div className="mt-2 grid gap-2">
        {slots.length === 0 ? (
          <p className="text-slate-600">ไม่มีช่วงเวลาที่ว่างสำหรับแพ็กเกจนี้</p>
        ) : (
          slots.map((slot) => (
            <label
              className="flex cursor-pointer items-center justify-between rounded border border-slate-200 p-3"
              key={slot.id}
            >
              <span>
                <input
                  className="mr-2"
                  type="radio"
                  name="slot"
                  value={slot.id}
                  checked={selectedSlotId === slot.id}
                  onChange={() => setSelectedSlotId(slot.id)}
                />
                {slot.slot_date} เวลา {slot.start_time}
              </span>
              <span className="text-sm text-slate-600">เหลือ {slot.remaining} ที่นั่ง</span>
            </label>
          ))
        )}
      </div>
    </section>
  )
}
