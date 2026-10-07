# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md SPEC-BKG-001 Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 08:34 UTC | test: 7 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 (AC นี้ตรวจ p95 ไม่ได้ตรวจกรอบ 30 วัน) | T-02 เสร็จ | `backend/app/slots/service.py`: `list_available_slots` จำกัดช่วงด้วย `DAYS_AHEAD=14`; `backend/app/slots/router.py`: `get_slots` คืน remaining | `test_AC_BKG_05` ผ่าน แต่ตรวจเพียง p95 ไม่ได้ตรวจช่วง 30 วัน | ช่องโหว่ (F-04) |
| FR-BKG-02 | AC-BKG-02 | T-04 พร้อมทำ | ยังไม่มีการตรวจคิวเดิมในวันเดียวกันใน `backend/app/booking/service.py` | ไม่มี test AC-BKG-02 | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 พร้อมทำ | `backend/app/booking/router.py`: `create_booking` คืน 409 เมื่อที่นั่งเต็ม แต่ยังไม่มีช่วงเวลาใกล้เคียง 3 ตัวเลือก | ไม่มี test AC-BKG-03 | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03 เสร็จ; T-06 รอ Q-02 | `backend/app/booking/service.py`: `create_booking` ตัดที่นั่งและบันทึก; `next_queue_no` สร้างเลขคิว; `backend/app/booking/router.py`: `create_booking` คืนผล API | `test_TC_BKG_01_1_booking_success`, `test_TC_BKG_01_2_minimum_capacity_is_zeroed`, `test_TC_BKG_01_3_booking_rejected_when_full` ผ่าน; การแสดง/รูปแบบเลขคิวยังไม่ตรวจเพราะ Q-02 | ช่องโหว่ (F-05) |
| FR-BKG-05 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มี API GET /bookings/{id}, คิวแจ้งเตือน หรือ retry | ไม่มี test AC-BKG-04 | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-02 เสร็จบางส่วน; T-10 พร้อมทำ | `backend/app/slots/service.py`: กรอง package_code; ยังไม่มีหน้าจอเปลี่ยนแพ็กเกจ | ไม่มี test ที่ตรวจ FR-BKG-06 | ช่องโหว่ (F-01) |
| NFR-PERF-01 | AC-BKG-05 | T-02 เสร็จ | `backend/app/slots/router.py`: `get_slots`; `backend/app/slots/service.py`: `list_available_slots` | `test_AC_BKG_05` ผ่าน แต่ยิงคำขอเรียงกัน ไม่ได้จำลองผู้ใช้พร้อมกัน 200 คน | ช่องโหว่ (F-08) |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task เฉพาะ | ไม่พบการตั้งค่า/บังคับ TLS ใน `backend/app/` หรือ `frontend/src/` | ไม่มี test TLS | ช่องโหว่ (F-06) |
| NFR-REL-02 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มีคิวแจ้งเตือนหรือกลไก retry | ไม่มี test AC-BKG-04 | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task เฉพาะสำหรับทดสอบผู้ใช้ 10 คน | `frontend/src/App.jsx` ยังเป็นหน้าโครงเริ่มต้น | มีเพียง `frontend/src/__tests__/setup.test.jsx` ทดสอบการแสดงหน้าโครง ไม่ได้ทดสอบ 8 ใน 10 คน/3 นาที | ช่องโหว่ (F-10) |
| CON-TECH-01 | ไม่มี AC | T-01 เสร็จ | `backend/app/config.py`: `DATABASE_URL` รับค่าจาก environment แต่ default เป็น SQLite; `backend/app/db/session.py`: สร้าง engine จาก URL | `test_T01_tables_created` ผ่านบน SQLite; ไม่มี test PostgreSQL | ช่องโหว่ (F-07) |
| DOM-PDPA-01 | AC-BKG-06 | T-01 เสร็จบางส่วน; T-08 พร้อมทำ | มี model `AuditLog` ใน `backend/app/db/models.py`; ยังไม่มี middleware/การเขียน audit log | `test_T01_tables_created` ตรวจเพียงว่ามีตาราง ไม่ได้ตรวจ audit log; ไม่มี test AC-BKG-06 | ยังไม่ถึง |
| IF-IDP-01 | ไม่มี AC | T-03 เสร็จ | `backend/app/auth/idp.py`: `get_verified_hn` ตรวจเพียง prefix จำลอง ไม่เรียกระบบยืนยันตัวตนจริง | `test_AC_BKG_01` ผ่านเฉพาะ token จำลอง; ไม่มี test การเชื่อม IDP | ช่องโหว่ (F-02) |
| IF-HIS-01 | ไม่มี AC | T-01 เสร็จบางส่วน; T-09 พร้อมทำ | `backend/app/db/models.py`: Booking เก็บ HN ไม่มี national_id; ไม่มี HIS lookup; `backend/app/booking/router.py`: request รับและ log national_id | `test_T01_no_national_id` ผ่านเฉพาะการไม่มีคอลัมน์; ไม่มี test HIS และการไม่ log เลขบัตร | ช่องโหว่ (F-03) |
| IF-NOT-01 | ไม่มี AC | T-07 พร้อมทำ | ยังไม่มี client/queue สำหรับระบบแจ้งเตือน | ไม่มี test การส่งแบบ asynchronous | ยังไม่ถึง |

ผล backend tests: `cd backend && pytest -v` — 7 passed, 0 failed (มี StarletteDeprecationWarning จาก TestClient/httpx)  
ไม่รัน `npm test`: ใน `frontend/src/__tests__/` มีเพียง setup.test.jsx ไม่มี test หน้าจอ feature เพิ่มเติมตามเกณฑ์การรันของ /verify.

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `backend/app/slots/router.py`: GET /slots (`get_slots`) | FR-BKG-01, FR-BKG-06 | บางส่วน | คืนช่วงเวลาและ remaining กรอง package แต่ช่วงวันที่จริงถูกจำกัด 14 วัน ไม่ใช่ 30 วัน (F-04) |
| `backend/app/slots/service.py`: `list_available_slots` | FR-BKG-01, FR-BKG-06 | ไม่ตรงทั้งหมด | `DAYS_AHEAD=14` ขัดกับ 30 วัน; กรองเฉพาะช่วงที่ remaining > 0 |
| `backend/app/booking/router.py`: POST /bookings (`create_booking`) | FR-BKG-02, FR-BKG-03, FR-BKG-04, IF-IDP-01, IF-HIS-01 | บางส่วน | จองและคืน 409 เมื่อเต็ม; ยังไม่ตรวจคิวซ้ำ/ไม่เสนอ 3 ตัวเลือก; auth เป็น mock; รับ national_id แล้ว log; คืน queue_no ที่ยังติด Q-02 (F-02, F-03, F-05) |
| `backend/app/booking/service.py`: `next_queue_no` | FR-BKG-04 | ไม่ตรง | กำหนดรูปแบบ `A001` และเริ่มนับใหม่รายวัน ทั้งที่ Q-02 ยังไม่ตอบและตัวอย่าง A001 เป็นเพียงตัวอย่าง (F-05) |
| `backend/app/booking/service.py`: `create_booking` | FR-BKG-04 | ตรงบางส่วน | ตรวจที่นั่ง `<= 0`, ลด remaining, บันทึก Booking; การออกเลขคิวยังเดาคำตอบ Q-02 |
| `backend/app/auth/idp.py`: `get_verified_hn` | IF-IDP-01 | ไม่ตรงสำหรับระบบจริง | ตรวจ prefix token จำลองและนำ suffix มาเป็น HN; ไม่มีการรับผลจากระบบ IDP จริง (F-02) |
| `backend/app/db/models.py`: `Booking`, `AuditLog`, `Slot` | FR-BKG-01, FR-BKG-04, IF-HIS-01, DOM-PDPA-01 | บางส่วน | Booking ไม่มีคอลัมน์ national_id และมี HN; มี schema audit log แต่ไม่มีโค้ดเขียน log; `queue_no` รองรับ null ตาม Q-02 |
| `backend/app/config.py`, `backend/app/db/session.py`: `DATABASE_URL`, `engine` | CON-TECH-01 | ขึ้นกับ environment | ถ้าไม่ตั้ง DATABASE_URL จะใช้ SQLite; ไม่มีการบังคับ PostgreSQL ในโค้ด แม้รองรับการกำหนด PostgreSQL ผ่าน environment (F-07) |
| `backend/app/main.py`: `lifespan`, router registration | T-02, T-03 | บางส่วน | สร้าง schema ตอนเริ่มและลงทะเบียน routers; ไม่มี audit middleware |
| `frontend/src/App.jsx`: `App` | ไม่มี | ยังไม่เป็น feature UI | แสดงเพียงข้อความโครงเริ่มต้น; ไม่มี SlotPicker, ConfirmBooking หรือ BookingResult |
| `frontend/src/api/client.js`: `api.getSlots`, `api.createBooking` | FR-BKG-01, FR-BKG-03, FR-BKG-04 | บางส่วน | client เรียก GET /slots และ POST /bookings; ไม่มีส่วนแสดงผลหรือจัดการผลการจองในหน้า |
| `backend/tests/test_AC_BKG_01.py`: `test_AC_BKG_01` | AC-BKG-01 / FR-BKG-04 | อ่อน | assert เฉพาะ HTTP 201 ไม่ตรวจ Booking หรือ remaining; TC tests เพิ่มเติมตรวจข้อมูลการบันทึกและที่นั่งแล้ว (F-11) |
| `backend/tests/test_AC_BKG_05.py`: `test_AC_BKG_05` | AC-BKG-05 / NFR-PERF-01 | อ่อน | 200 requests เป็นการเรียกเรียงกัน ไม่ใช่ผู้ใช้พร้อมกัน 200 คน จึงไม่ยืนยัน load condition ตาม NFR (F-08) |
| `backend/tests/test_T01_schema.py`: `test_T01_tables_created`, `test_T01_no_national_id` | CON-TECH-01, DOM-PDPA-01, IF-HIS-01 | บางส่วน | ทดสอบ schema ใน SQLite; ตรวจการไม่มีคอลัมน์ national_id แต่ไม่ตรวจ PostgreSQL, audit event หรือการไหลผ่าน HIS |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-01 | FR ไม่มี AC | `spec.md`: FR-BKG-06; `tasks.md`: T-10 | FR-BKG-06 | FR-BKG-06 ไม่มี AC ตาม traceability และใน plan ระบุว่ายังไม่มี AC ทำให้ไม่มีเกณฑ์ยอมรับตรงสำหรับการเปลี่ยนแพ็กเกจ | |
| F-02 | ละเมิด Constraint | `backend/app/auth/idp.py`: `get_verified_hn` | IF-IDP-01 | การยืนยันตัวตนใช้ prefix จำลองและไม่ได้ตรวจผลจากระบบ IDP; ใช้ได้เฉพาะ mock ไม่ยืนยันข้อกำหนดระบบจริง | |
| F-03 | ละเมิด Constraint | `backend/app/booking/router.py`: `BookingRequest`, `create_booking` | IF-HIS-01 | national_id รับเข้ามาใน POST /bookings และถูกเขียนลง log; แผนกำหนดให้เลขบัตรใช้กับ HIS lookup และไม่เก็บในข้อมูลการจอง การ log ทำให้เลขบัตรถูกเก็บนอกตารางโดยไม่จำเป็น | |
| F-04 | ตัวเลขไม่ตรง spec | `backend/app/slots/service.py`: `DAYS_AHEAD` | FR-BKG-01 | โค้ดใช้ 14 วัน ขณะที่ spec กำหนดช่วงเวลาภายใน 30 วันข้างหน้า | |
| F-05 | เดา Q-02 | `backend/app/booking/service.py`: `next_queue_no` | Q-02, FR-BKG-04 | โค้ดกำหนดรูปแบบ A001 และรีเซ็ตนับรายวัน ทั้งรูปแบบและวิธีรีเซ็ตยังเป็น Open Question; A001 เป็นเพียงตัวอย่างในคำถาม | |
| F-06 | test อ่อน | `backend/app/` และ `frontend/src/` | NFR-SEC-01 | ไม่พบการตั้งค่า/บังคับ TLS 1.2 ขึ้นไปในโค้ด และไม่มี task หรือ test ยืนยันการเข้ารหัสขณะรับส่ง; อาจต้องตรวจการตั้งค่าชั้น deployment เพิ่ม | |
| F-07 | ละเมิด Constraint | `backend/app/config.py`: `DATABASE_URL` | CON-TECH-01 | หากไม่กำหนด DATABASE_URL ระบบใช้ SQLite โดยปริยาย ไม่บังคับ PostgreSQL; tests ทั้งหมดก็ใช้ SQLite จึงยังไม่มีหลักฐานยืนยันการตั้งค่าใช้งานจริงเป็น PostgreSQL | |
| F-08 | test อ่อน | `backend/tests/test_AC_BKG_05.py`: `test_AC_BKG_05` | AC-BKG-05, NFR-PERF-01 | วัด p95 จากคำขอ 200 ครั้งแบบเรียงกัน ไม่ได้จำลองผู้ใช้พร้อมกัน 200 คนตาม NFR-PERF-01 | |
| F-10 | test อ่อน | `frontend/src/App.jsx`; ไม่มี task/test usability | NFR-USE-01 | หน้าจอยังเป็นโครงเริ่มต้นและไม่มีการทดสอบผู้ใช้ใหม่ 10 คนให้ 8 คนทำสำเร็จภายใน 3 นาที; ไม่มี task รองรับเกณฑ์นี้ | |
| F-11 | test อ่อน | `backend/tests/test_AC_BKG_01.py`: `test_AC_BKG_01` | AC-BKG-01 | test ที่ชื่ออ้าง AC ตรวจเพียง status 201 ไม่ตรวจข้อมูล Booking/remaining; TC-BKG-01-1/2 เสริมการตรวจข้อมูลเหล่านี้แล้ว แต่ test AC พื้นฐานเพียงตัวเดียวยังไม่ตรวจผลจริง | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| F-09 | ลบ endpoint `DELETE /bookings/{booking_id}` และฟังก์ชัน `cancel_booking` ออกจาก backend | ค้น `backend/app/` แล้วไม่พบ route หรือฟังก์ชันยกเลิกการจองเหลืออยู่ |
