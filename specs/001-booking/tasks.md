# Tasks: จองคิวตรวจสุขภาพ (Booking)

- Feature: จองคิวตรวจสุขภาพ (Booking)
- Spec ID: SPEC-BKG-001
- อ้างอิง: [plan.md](./plan.md)
- วันที่: 2569-09-23

มีทั้งหมด 16 tasks โดย 4 tasks ต้องรอคำตอบ Open Question Q-02 เรื่องรูปแบบและวิธีออกหมายเลขคิว
งานเรียงตามการพึ่งพา โดยหน้าจอเริ่มจาก API จำลองได้ และค่อยเชื่อมกับ API จริงในงานท้ายสุด

## รายการ tasks

### T-01 สร้างโมเดลและ migration ฐานข้อมูล
- รองรับ: CON-TECH-01, IF-HIS-01, FR-BKG-01, FR-BKG-02, FR-BKG-04, DOM-PDPA-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-03, T-05 และ T-09
- ไฟล์ที่แตะ: `backend/app/db/models.py`, `backend/app/db/session.py`, `backend/app/db/migrations/001_init.py`, `backend/tests/conftest.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง `slots`, `bookings` และ `audit_logs` ได้ และ `bookings` ไม่มีคอลัมน์ `national_id`
- สถานะ: เสร็จ รอทีมตรวจ

### T-02 เชื่อมการตรวจยืนยันตัวตนก่อนเรียก API
- รองรับ: IF-IDP-01, ASM-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-03, T-05 และ T-10
- ไฟล์ที่แตะ: `backend/app/auth/idp.py`, `backend/app/main.py`, `backend/tests/test_auth.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: endpoint ที่แตะข้อมูลผู้รับบริการเรียกผลยืนยันตัวตนจาก IDP ก่อนดำเนินการ และมี test กรณีไม่ผ่าน
- สถานะ: พร้อมทำ

### T-03 สร้างบริการและ API ค้นหาช่วงเวลาว่าง
- รองรับ: FR-BKG-01, FR-BKG-06, ASM-01, ASM-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04 และ T-11
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/slots/router.py`, `backend/app/main.py`, `backend/tests/test_slots.py`
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: `GET /slots` คืนช่วงเวลาภายใน 30 วันพร้อม `remaining` และคำนวณใหม่เมื่อเปลี่ยน `package_code`
- สถานะ: พร้อมทำ

### T-04 ทดสอบประสิทธิภาพการค้นหาช่วงเวลา
- รองรับ: NFR-PERF-01, FR-BKG-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: `backend/tests/test_AC_BKG_05.py`
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: การทดสอบยิง `GET /slots` แบบพร้อมกัน 200 ครั้งและรายงานค่า p95 เพื่อเทียบเกณฑ์ไม่เกิน 2 วินาที
- สถานะ: พร้อมทำ

### T-05 สร้างการจองและตัดที่นั่งแบบ transaction
- รองรับ: FR-BKG-04, CON-TECH-01, IF-IDP-01
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/app/main.py`, `backend/tests/test_AC_BKG_01.py`
- ต้องทำหลัง: T-01, T-02, T-03
- เสร็จเมื่อ: เมื่อคำตอบ Q-02 พร้อมแล้ว test ยืนยันการจองผ่าน ตรวจการบันทึก booking การออก `queue_no` และ `remaining` เป็น 0 ใน transaction เดียวกัน
- สถานะ: รอ Q-02

### T-06 ปฏิเสธการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02, ASM-02, IF-IDP-01
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/tests/test_AC_BKG_02.py`
- ต้องทำหลัง: T-05
- เสร็จเมื่อ: เมื่อคำตอบ Q-02 พร้อมแล้ว test จองซ้ำในวันเดียวกันถูกปฏิเสธและส่งหมายเลขคิวเดิมกลับ โดยไม่ตัดที่นั่งเพิ่ม
- สถานะ: รอ Q-02

### T-07 จัดการช่วงเวลาเต็มและค้นหาช่วงใกล้เคียง
- รองรับ: FR-BKG-03, ASM-05, ASM-07
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_AC_BKG_03.py`
- ต้องทำหลัง: T-03, T-05
- เสร็จเมื่อ: เมื่อช่วงเวลาถูกจองไปก่อน ระบบตอบ 409 พร้อมช่วงว่าง 3 ช่วงที่ใกล้ที่สุดจากวันเดียวกันและวันถัดไป และไม่สร้าง booking ซ้อน
- สถานะ: พร้อมทำ

### T-08 วางงานแจ้งเตือนและส่งซ้ำแบบ asynchronous
- รองรับ: FR-BKG-05, IF-NOT-01, NFR-REL-02, ASM-03
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: `backend/app/notify/queue.py`, `backend/app/booking/service.py`, `backend/tests/test_AC_BKG_04.py`
- ต้องทำหลัง: T-05
- เสร็จเมื่อ: เมื่อคิวแจ้งเตือนจำลองไม่ตอบสนอง test ยังพบ booking และ `queue_no` พร้อมงาน retry ที่กำหนดส่งภายใน 5 นาที
- สถานะ: พร้อมทำ

### T-09 บันทึก audit log ทุกการเข้าถึง booking
- รองรับ: DOM-PDPA-01, IF-IDP-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: `backend/app/audit/middleware.py`, `backend/app/main.py`, `backend/tests/test_AC_BKG_06.py`
- ต้องทำหลัง: T-01, T-02, T-05
- เสร็จเมื่อ: test เปิดดูข้อมูลการจองแล้วพบ log ที่มี `actor_id`, `accessed_at` และ `hn` และกำหนดการเก็บรักษาไม่น้อยกว่า 1 ปี
- สถานะ: พร้อมทำ

### T-10 สร้างการค้นหา HN จาก HIS
- รองรับ: IF-HIS-01, IF-IDP-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-05
- ไฟล์ที่แตะ: `backend/app/his/client.py`, `backend/app/patient/router.py`, `backend/app/main.py`, `backend/tests/test_patient_lookup.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: `GET /patients/lookup` ส่งเลขบัตรต่อให้ HIS เพื่อคืน `hn` และไม่มีเลขบัตรถูกเขียนลง booking หรือ log
- สถานะ: พร้อมทำ

### T-11 สร้างหน้าจอเลือกแพ็กเกจและช่วงเวลา
- รองรับ: FR-BKG-01, FR-BKG-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-12 และ T-14
- ไฟล์ที่แตะ: `frontend/src/pages/SlotPicker.jsx`, `frontend/src/App.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/SlotPicker.test.jsx`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าจอด้วย API จำลองแสดงช่วงเวลาและที่นั่งคงเหลือ และโหลดรายการใหม่เมื่อเปลี่ยนแพ็กเกจ
- สถานะ: เสร็จ รอทีมตรวจ

### T-12 สร้างหน้าจอยืนยันและแสดงทางเลือกเมื่อเต็ม
- รองรับ: FR-BKG-03
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/App.jsx`, `frontend/src/__tests__/AC-BKG-03.test.jsx`
- ต้องทำหลัง: T-11
- เสร็จเมื่อ: เมื่อ API จำลองตอบ 409 หน้าจอแสดงข้อความ “ช่วงเวลาเต็ม” และปุ่มช่วงเวลาใกล้เคียง 3 ตัวเลือก
- สถานะ: พร้อมทำ

### T-13 สร้างหน้าจอผลการจองและหมายเลขคิว
- รองรับ: FR-BKG-04, FR-BKG-05, IF-NOT-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-14
- ไฟล์ที่แตะ: `frontend/src/pages/BookingResult.jsx`, `frontend/src/App.jsx`, `frontend/src/__tests__/BookingResult.test.jsx`
- ต้องทำหลัง: T-12
- เสร็จเมื่อ: เมื่อคำตอบ Q-02 พร้อมแล้ว หน้าจอด้วย API จำลองแสดง `queue_no` ได้แม้สถานะการส่งข้อความล้มเหลว
- สถานะ: รอ Q-02

### T-14 เชื่อมหน้าจอกับ API จริง
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04, FR-BKG-05, IF-IDP-01
- ตรวจด้วย: AC-BKG-01, AC-BKG-03, AC-BKG-04
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/App.jsx`, `frontend/src/pages/SlotPicker.jsx`, `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/pages/BookingResult.jsx`, `frontend/src/__tests__/integration.test.jsx`
- ต้องทำหลัง: T-03, T-05, T-07, T-08, T-11, T-12, T-13
- เสร็จเมื่อ: หน้าจอเรียก `/slots` และ `/bookings` จริง แสดงผลสำเร็จ 409 และ booking ที่ส่งข้อความไม่สำเร็จตามสัญญา API
- สถานะ: รอ Q-02

### T-15 เปิดใช้ TLS 1.2 ขึ้นไปสำหรับการรับส่งข้อมูล
- รองรับ: NFR-SEC-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของการ deploy ตาม `NFR-SEC-01`
- ไฟล์ที่แตะ: `backend/app/config.py`, `backend/app/main.py`, `frontend/vite.config.js`, `backend/tests/test_transport_security.py`
- ต้องทำหลัง: T-02, T-14
- เสร็จเมื่อ: configuration และ test ระบุว่าการเชื่อมต่อข้อมูลการจองต้องใช้ TLS 1.2 ขึ้นไป
- สถานะ: พร้อมทำ

### T-16 ประเมิน usability ตามเกณฑ์ผู้ใช้ใหม่
- รองรับ: NFR-USE-01, ASM-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นการตรวจ NFR-USE-01
- ไฟล์ที่แตะ: `frontend/tests/usability/NFR-USE-01.md`, `frontend/tests/usability/test-plan.md`
- ต้องทำหลัง: T-14
- เสร็จเมื่อ: แผนทดสอบกับอาสาสมัครที่ไม่เคยใช้ระบบ 10 คนบันทึกผลสำเร็จอย่างน้อย 8 คนภายใน 3 นาทีโดยไม่ขอความช่วยเหลือ
- สถานะ: พร้อมทำ

## ตารางตรวจความครบของ Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-05, T-14 |
| AC-BKG-02 | T-06 |
| AC-BKG-03 | T-07, T-12, T-14 |
| AC-BKG-04 | T-08, T-14 |
| AC-BKG-05 | T-04 |
| AC-BKG-06 | T-09 |

## ตารางตรวจความครบของ Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01, T-05 |
| DOM-PDPA-01 | T-01, T-09 |
| IF-IDP-01 | T-02, T-05, T-09, T-10, T-14 |
| IF-HIS-01 | T-01, T-10 |
| IF-NOT-01 | T-08, T-13, T-14 |

## สิ่งที่ยังไม่ทำ

- Q-02: หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร (เช่น `A001`) ต้องถามเจ้าหน้าที่เวชระเบียน
- งานที่รอ Q-02: T-05 การออกหมายเลขคิวในการจอง, T-06 การแสดงหมายเลขคิวเดิมเมื่อจองซ้ำ, T-13 การแสดงผลหมายเลขคิว และ T-14 การเชื่อมผลหมายเลขคิวกับหน้าจอจริง
