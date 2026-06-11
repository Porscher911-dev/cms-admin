const fs = require('fs');
const path = require('path');

const viJsonPath = path.join(__dirname, 'src', 'i18n', 'vi.json');
const enJsonPath = path.join(__dirname, 'src', 'i18n', 'en.json');

const viData = JSON.parse(fs.readFileSync(viJsonPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

const mappings = {
  common: {
    month: {vi: "tháng", en: "month"},
    save_updates: {vi: "Lưu cập nhật", en: "Save updates"},
    none: {vi: "Không có", en: "None"},
    not_yet: {vi: "Chưa có", en: "Not yet"},
    dismiss: {vi: "Bỏ qua", en: "Dismiss"}
  },
  projects: {
    validation_name_client: {vi: "Vui lòng nhập tên dự án và khách hàng!", en: "Please enter project name and client!"},
    team_members_comma: {vi: "Tên thành viên cách nhau bởi dấu phẩy", en: "Team members separated by comma"},
    priority_normal: {vi: "Bình thường", en: "Normal"},
    unassigned: {vi: "Chưa phân công", en: "Unassigned"},
    validation_task_title: {vi: "Vui lòng nhập tên task", en: "Please enter task title"},
    today: {vi: "Hôm nay", en: "Today"},
    task_title: {vi: "Tiêu đề công việc", en: "Task Title"},
    task_title_placeholder: {vi: "Nhập tiêu đề công việc...", en: "Enter task title..."},
    task_desc: {vi: "Mô tả", en: "Description"},
    task_desc_placeholder: {vi: "Nhập mô tả...", en: "Enter description..."},
    priority: {vi: "Độ ưu tiên", en: "Priority"},
    priority_high: {vi: "Cao", en: "High"},
    priority_low: {vi: "Thấp", en: "Low"},
    task_due_date: {vi: "Hạn chót", en: "Due Date"},
    task_due_placeholder: {vi: "Chọn ngày...", en: "Select date..."},
    assignee: {vi: "Người thực hiện", en: "Assignee"},
    unassigned_option: {vi: "Chưa giao", en: "Unassigned"},
    comment_added: {vi: "Đã thêm bình luận!", en: "Comment added!"},
    confirm_delete_comment: {vi: "Xác nhận xóa bình luận?", en: "Confirm delete comment?"},
    comment_deleted: {vi: "Đã xóa bình luận!", en: "Comment deleted!"},
    task_desc_placeholder_edit: {vi: "Sửa mô tả...", en: "Edit description..."},
    no_task_desc: {vi: "Không có mô tả", en: "No description"},
    comments: {vi: "Bình luận", en: "Comments"},
    delete_comment: {vi: "Xóa", en: "Delete"},
    no_comments: {vi: "Chưa có bình luận nào.", en: "No comments yet."},
    write_comment: {vi: "Viết bình luận...", en: "Write a comment..."},
    task_details: {vi: "Chi tiết công việc", en: "Task Details"},
    delete_task: {vi: "Xóa công việc", en: "Delete Task"},
    add_team_member: {vi: "Thêm thành viên", en: "Add Member"},
    validation_task_update_permission: {vi: "Không có quyền cập nhật", en: "No permission to update"},
    task_updated: {vi: "Đã cập nhật công việc", en: "Task updated"},
    task_added: {vi: "Đã thêm công việc", en: "Task added"},
    team_updated: {vi: "Đã cập nhật đội ngũ", en: "Team updated"},
    confirm_remove_member: {vi: "Xác nhận xóa thành viên?", en: "Confirm remove member?"},
    member_removed: {vi: "Đã xóa thành viên", en: "Member removed"},
    project_not_found: {vi: "Không tìm thấy dự án", en: "Project not found"},
    back_to_list: {vi: "Quay lại danh sách", en: "Back to list"},
    no_team_members: {vi: "Chưa có thành viên", en: "No team members"},
    confirm_delete_project: {vi: "Xác nhận xóa dự án?", en: "Confirm delete project?"},
    confirm_delete_task: {vi: "Xác nhận xóa công việc?", en: "Confirm delete task?"},
    task_deleted: {vi: "Đã xóa công việc", en: "Task deleted"}
  },
  calendar: {
    new_event: {vi: "Sự kiện mới", en: "New Event"},
    event_title: {vi: "Tiêu đề", en: "Title"},
    title_placeholder: {vi: "Nhập tiêu đề...", en: "Enter title..."},
    description_placeholder: {vi: "Nhập mô tả...", en: "Enter description..."},
    event_category: {vi: "Danh mục", en: "Category"},
    add_event: {vi: "Thêm sự kiện", en: "Add Event"},
    creator: {vi: "Người tạo", en: "Creator"},
    other_events: {vi: "Sự kiện khác", en: "Other events"},
    no_upcoming_events: {vi: "Không có sự kiện sắp tới", en: "No upcoming events"}
  },
  tasks: {
    comment_added: {vi: "Đã thêm bình luận", en: "Comment added"},
    detailed_description: {vi: "Mô tả chi tiết", en: "Detailed description"},
    deadline: {vi: "Hạn chót", en: "Deadline"},
    checklist: {vi: "Danh sách công việc", en: "Checklist"},
    progress_desc: {vi: "Tiến độ", en: "Progress"},
    manager: {vi: "Quản lý", en: "Manager"},
    client_unassigned: {vi: "Chưa gắn khách", en: "Client unassigned"},
    task: {vi: "Công việc", en: "Task"},
    completed_excl: {vi: "Hoàn thành!", en: "Completed!"},
    progress: {vi: "Tiến độ", en: "Progress"},
    executing: {vi: "Đang làm", en: "Executing"},
    reviewing: {vi: "Chờ duyệt", en: "Reviewing"},
    kanban_desc: {vi: "Bảng Kanban", en: "Kanban board"}
  },
  reports: {
    section_done_work: {vi: "Công việc đã hoàn thành", en: "Completed work"},
    section_issues: {vi: "Vấn đề vướng mắc", en: "Issues"},
    section_tomorrow_plan: {vi: "Kế hoạch ngày mai", en: "Tomorrow's plan"},
    section_notes: {vi: "Ghi chú", en: "Notes"},
    status_pending: {vi: "Chờ duyệt", en: "Pending"},
    report_sent: {vi: "Đã gửi báo cáo!", en: "Report sent!"},
    file_too_large: {vi: "File quá lớn", en: "File too large"},
    report_deleted: {vi: "Đã xóa báo cáo", en: "Report deleted"},
    status_approved: {vi: "Đã duyệt", en: "Approved"},
    report_approved: {vi: "Đã duyệt báo cáo", en: "Report approved"},
    status_replied: {vi: "Đã phản hồi", en: "Replied"},
    reply_sent: {vi: "Đã gửi phản hồi", en: "Reply sent"},
    error_empty_reply: {vi: "Vui lòng nhập nội dung phản hồi", en: "Please enter reply content"},
    title_manager: {vi: "Quản lý báo cáo", en: "Manage Reports"},
    subtitle_manager: {vi: "Duyệt và xem báo cáo của nhân viên", en: "Review employee reports"},
    search_placeholder: {vi: "Tìm kiếm...", en: "Search..."},
    no_data: {vi: "Không có dữ liệu", en: "No data"},
    no_data_desc: {vi: "Chưa có báo cáo nào.", en: "No reports found."}
  },
  settings: {
    appearance_saved: {vi: "Đã lưu giao diện", en: "Appearance saved"},
    color_invalid: {vi: "Mã màu không hợp lệ", en: "Invalid color"},
    avatar_selected: {vi: "Đã chọn ảnh", en: "Avatar selected"},
    profile_saved: {vi: "Đã lưu hồ sơ", en: "Profile saved"},
    profile_error: {vi: "Lỗi lưu hồ sơ", en: "Profile error"},
    password_empty_error: {vi: "Mật khẩu trống", en: "Password empty"},
    password_length_error: {vi: "Mật khẩu quá ngắn", en: "Password too short"},
    password_mismatch_error: {vi: "Mật khẩu không khớp", en: "Password mismatch"},
    old_password_error: {vi: "Mật khẩu cũ sai", en: "Wrong old password"},
    password_saved: {vi: "Đã đổi mật khẩu", en: "Password changed"},
    password_error: {vi: "Lỗi đổi mật khẩu", en: "Password error"},
    notifications_saved: {vi: "Đã lưu cài đặt thông báo", en: "Notifications saved"},
    notifications_error: {vi: "Lỗi lưu thông báo", en: "Notifications error"},
    profile_info: {vi: "Thông tin cá nhân", en: "Profile info"},
    delete_avatar: {vi: "Xóa ảnh đại diện", en: "Delete avatar"},
    username: {vi: "Tên người dùng", en: "Username"},
    save_changes: {vi: "Lưu thay đổi", en: "Save changes"},
    security_title: {vi: "Bảo mật", en: "Security"},
    notifications_title: {vi: "Thông báo", en: "Notifications"},
    email_notif: {vi: "Thông báo Email", en: "Email notif"},
    task_notif: {vi: "Thông báo Công việc", en: "Task notif"},
    report_notif: {vi: "Thông báo Báo cáo", en: "Report notif"},
    save_config: {vi: "Lưu cấu hình", en: "Save config"},
    mode_changed: {vi: "Đã đổi chế độ", en: "Mode changed"},
    mode_dark: {vi: "Chế độ tối", en: "Dark mode"},
    mode_light: {vi: "Chế độ sáng", en: "Light mode"},
    default_language_desc: {vi: "Ngôn ngữ mặc định", en: "Default language"},
    lang_vi: {vi: "Tiếng Việt", en: "Vietnamese"},
    lang_en: {vi: "English", en: "English"},
    brand_title: {vi: "Thương hiệu", en: "Branding"},
    brand_logo: {vi: "Logo công ty", en: "Brand logo"},
    brand_logo_desc: {vi: "Đường dẫn logo", en: "Logo URL"},
    brand_banner: {vi: "Banner công ty", en: "Brand banner"}
  },
  company: {
    error_empty_fields: {vi: "Vui lòng nhập đầy đủ", en: "Please fill all fields"},
    new_announcement_prefix: {vi: "Thông báo mới:", en: "New announcement:"},
    announcement_posted: {vi: "Đã đăng thông báo", en: "Announcement posted"},
    announcement_deleted: {vi: "Đã xóa thông báo", en: "Announcement deleted"},
    policies_updated: {vi: "Đã cập nhật nội quy", en: "Policies updated"},
    post_announcement_btn: {vi: "Đăng thông báo", en: "Post Announcement"},
    delete_announcement: {vi: "Xóa thông báo", en: "Delete"},
    create_announcement_title: {vi: "Tạo thông báo", en: "Create Announcement"},
    announcement_title_placeholder: {vi: "Tiêu đề...", en: "Title..."},
    announcement_content_placeholder: {vi: "Nội dung...", en: "Content..."},
    post_announcement: {vi: "Đăng tải", en: "Post"},
    add_dept: {vi: "Thêm phòng ban", en: "Add Department"},
    org_chart_updated: {vi: "Đã cập nhật sơ đồ", en: "Org chart updated"},
    markdown_support: {vi: "Hỗ trợ Markdown", en: "Markdown supported"}
  },
  workspace: {
    task_status_updated: {vi: "Đã cập nhật trạng thái", en: "Status updated"},
    error_empty_note: {vi: "Ghi chú trống", en: "Note empty"},
    note_updated: {vi: "Đã cập nhật ghi chú", en: "Note updated"},
    note_added: {vi: "Đã thêm ghi chú", en: "Note added"},
    note_deleted: {vi: "Đã xóa ghi chú", en: "Note deleted"},
    rating_needs_improvement: {vi: "Cần cải thiện", en: "Needs improvement"},
    rating_excellent: {vi: "Xuất sắc", en: "Excellent"},
    rating_good: {vi: "Tốt", en: "Good"},
    rating_average: {vi: "Khá", en: "Average"},
    subtitle_director: {vi: "Tổng quan giám đốc", en: "Director overview"},
    require_immediate: {vi: "Cần xử lý ngay", en: "Require immediate"},
    tasks_done: {vi: "Công việc hoàn thành", en: "Tasks done"},
    average_progress: {vi: "Tiến độ trung bình", en: "Average progress"},
    pinned: {vi: "Đã ghim", en: "Pinned"},
    priority_normal: {vi: "Bình thường", en: "Normal"},
    company_news: {vi: "Tin tức công ty", en: "Company news"},
    opening_news_list: {vi: "Danh sách tin tức", en: "News list"},
    view_details: {vi: "Xem chi tiết", en: "View details"},
    notes_board: {vi: "Bảng ghi chú", en: "Notes board"},
    policy_handbook_title: {vi: "Sổ tay nội quy", en: "Policy handbook"},
    employee_list: {vi: "Danh sách nhân viên", en: "Employee list"},
    no_employees_in_dept: {vi: "Chưa có nhân viên", en: "No employees"},
    create_new_note: {vi: "Tạo ghi chú mới", en: "Create new note"},
    note_title_placeholder: {vi: "Tiêu đề ghi chú...", en: "Note title..."},
    note_content_placeholder: {vi: "Nội dung...", en: "Content..."},
    color_label: {vi: "Màu sắc", en: "Color"},
    save_note: {vi: "Lưu ghi chú", en: "Save note"}
  },
  admin: {
    error_empty_fields: {vi: "Vui lòng nhập đầy đủ", en: "Please fill all fields"},
    account_created: {vi: "Đã tạo tài khoản", en: "Account created"},
    employee_name: {vi: "Tên nhân viên", en: "Employee name"},
    init_password: {vi: "Mật khẩu khởi tạo", en: "Init password"},
    init_password_desc: {vi: "Mật khẩu cấp lần đầu", en: "First time password"},
    create_btn: {vi: "Tạo tài khoản", en: "Create Account"},
    role_updated: {vi: "Đã cập nhật quyền", en: "Role updated"},
    access_denied_desc: {vi: "Không có quyền truy cập", en: "Access denied"},
    account_locked: {vi: "Đã khóa tài khoản", en: "Account locked"},
    account_unlocked: {vi: "Đã mở khóa tài khoản", en: "Account unlocked"},
    create_account_btn: {vi: "Tạo mới", en: "Create"},
    user_list: {vi: "Danh sách người dùng", en: "User list"},
    col_employee: {vi: "Nhân viên", en: "Employee"},
    status: {vi: "Trạng thái", en: "Status"},
    action: {vi: "Thao tác", en: "Action"},
    lock: {vi: "Khóa", en: "Lock"},
    delete_title: {vi: "Xóa tài khoản", en: "Delete account"},
    delete_confirm: {vi: "Xác nhận xóa?", en: "Confirm delete?"},
    account_deleted: {vi: "Đã xóa tài khoản", en: "Account deleted"}
  },
  notifications: {
    marked_as_read: {vi: "Đã đánh dấu đã đọc", en: "Marked as read"},
    marked_all_read: {vi: "Đã đọc tất cả", en: "Marked all as read"},
    deleted: {vi: "Đã xóa thông báo", en: "Notification deleted"},
    confirm_delete_all: {vi: "Xóa tất cả thông báo?", en: "Delete all notifications?"},
    deleted_all: {vi: "Đã xóa tất cả", en: "Deleted all"},
    mark_all_read_btn: {vi: "Đánh dấu đọc hết", en: "Mark all read"},
    delete_all_btn: {vi: "Xóa tất cả", en: "Delete all"},
    mark_as_read_title: {vi: "Đánh dấu đã đọc", en: "Mark as read"},
    delete_title: {vi: "Xóa thông báo", en: "Delete notification"}
  }
};

for (const [ns, keys] of Object.entries(mappings)) {
  for (const [k, v] of Object.entries(keys)) {
    if (viData[ns] && viData[ns][k] === ns + '.' + k) {
      viData[ns][k] = v.vi;
    }
    if (enData[ns] && enData[ns][k] === ns + '.' + k) {
      enData[ns][k] = v.en;
    }
  }
}

fs.writeFileSync(viJsonPath, JSON.stringify(viData, null, 2), 'utf8');
fs.writeFileSync(enJsonPath, JSON.stringify(enData, null, 2), 'utf8');
console.log('Fixed all translations!');
