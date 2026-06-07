export interface Announcement {
  id: string
  title: string
  content: string
  date: string
  author: string
  isPinned?: boolean
  isUrgent?: boolean
}

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "A1",
    title: "Thông báo nghỉ lễ Quốc khánh 2/9",
    content: "Công ty MREX sẽ nghỉ lễ Quốc khánh từ ngày 01/09/2026 đến hết ngày 04/09/2026. Chúc toàn thể nhân viên một kỳ nghỉ vui vẻ bên gia đình.",
    date: "25/08/2026",
    author: "Ban Giám Đốc",
    isPinned: true,
  },
  {
    id: "A2",
    title: "Triển khai chiến dịch Mùa Hè - Yêu cầu các phòng ban tập trung",
    content: "Chiến dịch Mùa Hè của khách hàng TechCorp chuẩn bị kick-off. Đề nghị phòng Thiết kế và Nội dung gấp rút hoàn thiện các KPI đã giao.",
    date: "10/08/2026",
    author: "Ban Giám Đốc",
    isUrgent: true,
  },
  {
    id: "A3",
    title: "Quy định mới về thời gian làm việc khối Back Office",
    content: "Từ tháng 9, khối Back Office sẽ áp dụng khung giờ làm việc linh hoạt. Cụ thể có thể linh động đi muộn tối đa 30 phút nhưng phải làm bù vào buổi chiều.",
    date: "05/08/2026",
    author: "Phòng Nhân Sự",
  }
]

export const MOCK_POLICIES = `
# NỘI QUY CÔNG TY MREX

## 1. Thời gian làm việc
- Sáng: 08:30 - 12:00
- Chiều: 13:30 - 18:00
- Ngày làm việc: Từ Thứ 2 đến Thứ 6 và sáng Thứ 7.

## 2. Tác phong công sở
- Trang phục lịch sự, gọn gàng.
- Đeo thẻ nhân viên trong giờ làm việc.
- Không sử dụng tài nguyên công ty cho mục đích cá nhân.

## 3. Chính sách bảo mật
- Tuyệt đối không tiết lộ thông tin chiến dịch của khách hàng ra bên ngoài.
- Không sao chép database của công ty.
`

export const MOCK_DEPARTMENTS = [
  { id: '1', name: "Phòng Kinh Doanh", desc: "Sales & Account", employees: "Nguyễn Văn A, Trần Thị B" },
  { id: '2', name: "Phòng Thiết Kế", desc: "Design & UI/UX", employees: "Lê Văn C" },
  { id: '3', name: "Phòng Live Stream", desc: "Media & Production", employees: "Phạm D, Ngô E" }
]
