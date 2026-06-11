const fs = require('fs');
const path = require('path');

const viJsonPath = path.join(__dirname, 'src', 'i18n', 'vi.json');
const enJsonPath = path.join(__dirname, 'src', 'i18n', 'en.json');

const viData = JSON.parse(fs.readFileSync(viJsonPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

const translations = {
  attendance: {
    today_attendance: { vi: "Chấm công hôm nay", en: "Today's Attendance" },
    create_leave_btn: { vi: "Tạo Đơn Xin Nghỉ", en: "Create Leave Request" },
    reason_col: { vi: "Lý do", en: "Reason" },
    status_col: { vi: "Trạng thái", en: "Status" },
    checkin: { vi: "Check In", en: "Check In" },
    checkout: { vi: "Check Out", en: "Check Out" },
    attendance_log: { vi: "Nhật ký Chấm công", en: "Attendance Log" },
    active: { vi: "Hoạt động", en: "Active" },
    action_type: { vi: "Loại hành động", en: "Action Type" },
    time_col: { vi: "Thời gian", en: "Time" },
    date_col: { vi: "Ngày", en: "Date" },
    ip_isp_col: { vi: "IP / Nhà mạng", en: "IP / ISP" },
    location_col: { vi: "Định vị", en: "Location" },
    no_logs_today: { vi: "Chưa có ghi nhận chấm công nào trong hôm nay.", en: "No attendance logs today." },
    annual_leave: { vi: "Nghỉ phép năm", en: "Annual Leave" },
    checkout_success: { vi: "Check Out thành công!", en: "Check Out successful!" },
    checkin_success: { vi: "Check In thành công!", en: "Check In successful!" },
    error_empty_fields: { vi: "Vui lòng nhập đầy đủ thông tin!", en: "Please fill all fields!" },
    notif_new_leave: { vi: "{user} vừa gửi đơn xin {type}", en: "{user} submitted a {type} request" },
    leave_request_sent: { vi: "Đã gửi đơn xin nghỉ phép thành công!", en: "Leave request sent successfully!" },
    attendance_completed: { vi: "Đã Hoàn Thành Chấm Công", en: "Attendance Completed" },
    checkout_wait: { vi: "Check Out (Chờ {cooldown}s)", en: "Check Out (Wait {cooldown}s)" },
    status_approved: { vi: "Đã duyệt", en: "Approved" },
    status_rejected: { vi: "Từ chối", en: "Rejected" },
    status_pending: { vi: "Chờ duyệt", en: "Pending" },
    create_leave_modal_title: { vi: "Tạo Đơn Xin Nghỉ Phép", en: "Create Leave Request" },
    leave_type_label: { vi: "Loại nghỉ phép", en: "Leave Type" },
    annual_leave_paid: { vi: "Nghỉ phép năm (Có lương)", en: "Annual Leave (Paid)" },
    personal_leave_unpaid: { vi: "Nghỉ việc riêng (Không lương)", en: "Personal Leave (Unpaid)" },
    sick_leave: { vi: "Nghỉ ốm", en: "Sick Leave" },
    detailed_reason: { vi: "Lý do chi tiết", en: "Detailed Reason" },
    submit_btn: { vi: "Gửi Đơn", en: "Submit Request" },
    reminder_title: { vi: "Nhắc nhở Chấm công", en: "Attendance Reminder" },
    reminder_subtitle: { vi: "Đừng quên chấm công nhé", en: "Don't forget to check in" },
    check_in_now: { vi: "Check-in ngay", en: "Check-in Now" }
  },
  approvals: {
    proposal_list: { vi: "Danh sách Đề xuất", en: "Proposal List" },
    col_id: { vi: "Mã Đơn", en: "ID" },
    col_creator: { vi: "Người nộp", en: "Applicant" },
    col_type: { vi: "Loại", en: "Type" },
    col_time: { vi: "Thời gian", en: "Time" },
    col_reason: { vi: "Lý do", en: "Reason" },
    col_status: { vi: "Trạng thái", en: "Status" },
    col_action: { vi: "Thao tác", en: "Action" },
    type_annual_leave: { vi: "Nghỉ phép năm", en: "Annual Leave" },
    status_pending: { vi: "Chờ duyệt", en: "Pending" },
    type_sick_leave: { vi: "Nghỉ ốm", en: "Sick Leave" },
    status_approved: { vi: "Đã duyệt", en: "Approved" },
    processed: { vi: "Đã xử lý", en: "Processed" },
    type_advance_salary: { vi: "Tạm ứng", en: "Advance Salary" },
    type_wfh: { vi: "Work From Home", en: "Work From Home" },
    status_rejected: { vi: "Từ chối", en: "Rejected" },
    type_personal_leave: { vi: "Nghỉ việc riêng", en: "Personal Leave" },
    type_other: { vi: "Đề xuất khác", en: "Other Proposal" },
    error_empty_reason: { vi: "Vui lòng nhập lý do!", en: "Please enter a reason!" },
    error_empty_date: { vi: "Vui lòng chọn ngày!", en: "Please select a date!" },
    proposal_sent: { vi: "Đã gửi đề xuất thành công!", en: "Proposal sent successfully!" },
    create_proposal: { vi: "Tạo Đề Xuất", en: "Create Proposal" },
    proposal_type: { vi: "Loại đề xuất", en: "Proposal Type" },
    from_date: { vi: "Từ ngày", en: "From Date" },
    to_date: { vi: "Đến ngày", en: "To Date" },
    reason_placeholder: { vi: "Nhập chi tiết...", en: "Enter details..." },
    send_proposal: { vi: "Gửi Đề Xuất", en: "Send Proposal" },
    error_no_approve_permission: { vi: "Không có quyền duyệt!", en: "No permission to approve!" },
    approved_request: { vi: "Đã duyệt đơn", en: "Approved request" },
    error_no_reject_permission: { vi: "Không có quyền từ chối!", en: "No permission to reject!" },
    rejected_request: { vi: "Đã từ chối đơn", en: "Rejected request" },
    proposal_deleted: { vi: "Đã xóa đề xuất!", en: "Proposal deleted!" },
    waiting_superior: { vi: "Chờ cấp trên duyệt", en: "Waiting for superior" },
    no_permission: { vi: "Không có quyền", en: "No permission" },
    no_proposals: { vi: "Không có đề xuất nào.", en: "No proposals." },
    delete_title: { vi: "Xóa đề xuất", en: "Delete Proposal" },
    delete_confirm: { vi: "Bạn có chắc chắn muốn xóa đề xuất này?", en: "Are you sure you want to delete this proposal?" }
  }
};

for (const [namespace, keys] of Object.entries(translations)) {
  for (const [key, values] of Object.entries(keys)) {
    if (viData[namespace]) viData[namespace][key] = values.vi;
    if (enData[namespace]) enData[namespace][key] = values.en;
  }
}

// Clean up false positives
const falsePositives = ['req', 'config', 'c', 'data', 'ann', 'projectToEdit', 'project', 'roles', 'lead', 'note', 'audioCtx', 'ctx'];
for (const fp of falsePositives) {
  delete viData[fp];
  delete enData[fp];
}

fs.writeFileSync(viJsonPath, JSON.stringify(viData, null, 2), 'utf8');
fs.writeFileSync(enJsonPath, JSON.stringify(enData, null, 2), 'utf8');

console.log("Translations updated!");
