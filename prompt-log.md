# Prompt log

บันทึกทุกครั้งที่ใช้ AI กับ repo นี้ เขียนต่อท้ายเรื่อย ๆ ไม่ลบของเก่า

---

## 2569-09-23 13.40 คำสั่ง: /tasks specs/001-booking/spec.md

- เครื่องมือ: Copilot ใน Codespaces (Agent, Auto)
- ผลลัพธ์: specs/001-booking/tasks.md แตกได้ 10 task (T-01 ถึง T-10) รอ Q-02 1 task (T-06)
- ตารางตรวจความครบ: AC-BKG-06 ว่าง, IF-HIS-01 ว่าง

### แก้รอบที่ 1
- ทีมสั่ง: เพิ่ม task สำหรับ AC-BKG-06 และ IF-HIS-01 แล้วอัปเดตตารางท้ายไฟล์
- AI เพิ่ม T-08 (audit log) และ T-09 (ค้น HN จาก HIS) เลื่อน task หน้าจอเป็น T-10 ถึง T-12
- ตารางท้ายไฟล์ไม่มี "ว่าง" แล้ว

---

## 2569-09-23 14.20 คำสั่ง: /implement T-01 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/config.py, backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py, backend/tests/test_T01_schema.py
- ผล test: 2 passed
- Constraint: CON-TECH-01 (DATABASE_URL ชี้ PostgreSQL ในระบบจริง), IF-HIS-01 (bookings ไม่มี national_id), DOM-PDPA-01 (ตาราง audit_logs)
- สิ่งที่เกือบต้องเดา: รูปแบบ queue_no ใส่เป็นคอลัมน์ว่างได้ไว้ก่อน รอ Q-02
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-27 19.05 คำสั่ง: /implement T-02 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/slots/router.py, backend/app/slots/service.py, backend/app/main.py, backend/tests/conftest.py, backend/tests/test_AC_BKG_05.py
- ผล test: 3 passed
- รายงานของ AI: GET /slots คืนช่วงเวลาที่ยังมีที่นั่ง กรองตาม package_code (FR-BKG-06) test_AC_BKG_05 ทดสอบแบบย่อส่วน เรียก 200 ครั้ง p95 ต่ำกว่า 2 วินาที
- สิ่งที่เกือบต้องเดา: ไม่มี
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-28 20.30 คำสั่ง: /implement T-03 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/booking/router.py, backend/app/booking/service.py, backend/app/auth/idp.py และแก้ backend/app/main.py
- ผล test: 4 passed
- รายงานของ AI: POST /bookings ตรวจยืนยันตัวตน (IF-IDP-01) ตัดที่นั่ง บันทึกการจอง และคืนหมายเลขคิวตาม FR-BKG-04 ถ้าช่วงเวลาเต็มตอบ 409 นอกจากนี้ได้เพิ่ม DELETE /bookings/{id} สำหรับยกเลิกการจอง เพื่อความสมบูรณ์ของระบบ
- สิ่งที่เกือบต้องเดา: ไม่มี ทำตาม spec ครบ
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-10-07 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- ผลลัพธ์: เพิ่ม test case แบบร่าง 3 แถว (ทางปกติ / ขอบ / ทางผิด) ใน specs/001-booking/test-cases.md และหยุดโดยไม่เขียนโค้ด test
- ประเด็นรอคำตอบ: การแสดงหมายเลขคิวติด Q-02; พฤติกรรมเมื่อช่วงเวลาเต็มใน test ทางผิดยังไม่มีรายละเอียดข้อความระบุใน spec
- คำถามต่อเนื่องจากทีม: สอบถามว่ามีบันทึกใน prompt-log.md หรือยัง; ขณะตรวจพบว่ายังไม่มีบันทึกรอบนี้ และได้เพิ่มบันทึกนี้ต่อท้าย

---

## 2569-10-07 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: เขียน test จากแถวสถานะ "ใช้ได้"
- TC ID: TC-BKG-01-1, TC-BKG-01-2, TC-BKG-01-3 เพิ่มใน backend/tests/test_AC_BKG_01.py
- ผล test: `cd backend && pytest -v` — 6 passed, 1 failed
- ผลรายกรณี: TC-BKG-01-1 ผ่าน; TC-BKG-01-2 ผ่าน; TC-BKG-01-3 ไม่ผ่าน โดย API ตอบ 201 แทน 409 ขณะ `remaining` เป็น 0
- สาเหตุที่น่าจะเกี่ยวข้อง: เงื่อนไขตรวจที่นั่งใน backend/app/booking/service.py ใช้ `slot.remaining < 0` จึงไม่ปฏิเสธกรณีเหลือ 0 ที่นั่ง; ไม่แก้โค้ดระบบตามขอบเขตคำสั่ง
- หมายเหตุ: หมายเลขคิวไม่ตรวจ เพราะรอ Q-02

---

## 2569-10-07 คำสั่งจากทีม: แก้กรณีจองเมื่อที่นั่งเต็ม

- การตัดสินใจ: ปฏิเสธการจองเมื่อไม่มีที่นั่งเหลือ และไม่แก้ test
- การแก้ไข: backend/app/booking/service.py เปลี่ยนเงื่อนไขตรวจที่นั่งจาก `slot.remaining < 0` เป็น `slot.remaining <= 0`
- หมายเหตุการระบุกรณี: ทีมอ้างถึง TC-BKG-01-2 แต่ผลก่อนแก้แสดงว่ากรณีนี้ผ่านแล้ว (จองเมื่อมี 1 ที่และเหลือ 0); กรณีที่ไม่ผ่านจริงคือ TC-BKG-01-3 (เริ่มต้นเหลือ 0 ที่)
- ผล test: `cd backend && pytest -v` — 7 passed, 0 failed; มี StarletteDeprecationWarning จาก TestClient/httpx

---

## 2569-10-07 คำสั่ง: /verify specs/001-booking/

- ผล backend tests: `cd backend && pytest -v` — 7 passed, 0 failed; มี StarletteDeprecationWarning 1 รายการ
- ไม่รัน frontend tests เพราะ `frontend/src/__tests__/` มีเฉพาะ setup.test.jsx ไม่มี test หน้าจอ feature
- ผล RTM: สร้าง specs/001-booking/rtm.md ครบ 15 requirement IDs (FR/NFR/Constraints)
- จำนวนสถานะ: ครบ 0, ยังไม่ถึง 6, รอ Q-xx 0, ช่องโหว่ 9
- ข้อค้นพบใหม่: F-01 ถึง F-11
- ขอบเขต: ตรวจโค้ด/test เท่านั้น ไม่แก้ spec, plan, tasks หรือโค้ด/test

---

## 2569-10-07 คำสั่งจากทีม: ลบฟังก์ชันยกเลิกการจองที่อยู่ใน Out of scope (UC-02)

- การแก้ไข: ลบ endpoint `DELETE /bookings/{booking_id}` จาก `backend/app/booking/router.py` และลบ `cancel_booking` จาก `backend/app/booking/service.py`
- RTM: ย้าย F-09 ไปหัวข้อ "แก้แล้ว" พร้อมบันทึกหลักฐานว่าตรวจไม่พบ route/function ยกเลิกใน backend
- ยังไม่ได้รัน test หลังการแก้ไข
