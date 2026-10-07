# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from tests.conftest import AUTH


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


def test_TC_BKG_01_1_booking_success(client, db, make_slot):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then: บันทึกสำเร็จ; ที่นั่งว่างของช่วงนั้นเป็น 0
    from app.db.models import Booking

    assert res.status_code == 201
    assert db.query(Booking).count() == 1
    assert slot.remaining == 0
    # Then: แสดงหมายเลขคิว (รอ Q-02) — ยังไม่ตรวจจนกว่าจะได้คำตอบ Q-02


def test_TC_BKG_01_2_minimum_capacity_is_zeroed(client, db, make_slot):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. เหลือที่นั่งคงเหลือขั้นต่ำ 1 ที่ก่อนยืนยัน
    slot = make_slot(start="09:00", remaining=1)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then: บันทึกสำเร็จ; ที่นั่งว่างของช่วงนั้นลดจาก 1 เป็น 0 โดยไม่ติดลบ
    from app.db.models import Booking

    assert res.status_code == 201
    assert db.query(Booking).count() == 1
    assert slot.remaining == 0
    assert slot.remaining >= 0
    # Then: แสดงหมายเลขคิว (รอ Q-02) — ยังไม่ตรวจจนกว่าจะได้คำตอบ Q-02


def test_TC_BKG_01_3_booking_rejected_when_full(client, db, make_slot):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 0 ที่
    slot = make_slot(start="09:00", remaining=0)

    # When: ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then: ไม่บันทึกรายการจองใหม่; ไม่ลดที่นั่งต่ำกว่า 0
    from app.db.models import Booking

    assert res.status_code == 409
    assert db.query(Booking).count() == 0
    assert slot.remaining == 0
    assert slot.remaining >= 0
    # Then: แสดงผลปฏิเสธ/แจ้งว่าเต็ม; spec ไม่ได้บอกข้อความแบบเจาะจง
    # ไม่ตรวจข้อความแจ้งเตือน เพราะข้อความเฉพาะไม่ได้ระบุใน spec
