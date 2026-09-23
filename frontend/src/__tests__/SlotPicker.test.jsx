import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from '../App.jsx'
import { mockApi } from '../api/client.js'

test('แสดงช่วงเวลาและจำนวนที่นั่งคงเหลือของแพ็กเกจเริ่มต้น', async () => {
  render(<App client={mockApi} />)

  expect(await screen.findByText(/เวลา 09:00/)).toBeTruthy()
  expect(screen.getByText('เหลือ 2 ที่นั่ง')).toBeTruthy()
})

test('โหลดช่วงเวลาใหม่เมื่อเปลี่ยนแพ็กเกจ', async () => {
  render(<App client={mockApi} />)
  await screen.findByText(/เวลา 09:00/)

  fireEvent.change(screen.getByLabelText('แพ็กเกจ'), { target: { value: 'PREMIUM' } })

  await waitFor(() => expect(screen.getByText(/เวลา 10:00/)).toBeTruthy())
})

test('โหลดช่วงเวลาใหม่เมื่อเลือกวันจากปฏิทิน', async () => {
  render(<App client={mockApi} />)
  const datePicker = screen.getByLabelText('วันที่ตรวจ')

  fireEvent.change(datePicker, { target: { value: '2026-09-30' } })

  await waitFor(() => expect(screen.getByText(/2026-09-30 เวลา 09:00/)).toBeTruthy())
})
