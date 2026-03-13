---
name: zalo-social-api
description: Đây là công cụ cho phép ứng dụng bên thứ ba truy cập dữ liệu người dùng và bạn bè trên hệ sinh thái Zalo thông qua giao thức HTTP (TLS 1.2 trở lên). Hệ thống sử dụng cơ chế xác thực OAuth 2.0 (với Access Token và OAuth Code) để đảm bảo bảo mật. Lập trình viên có thể tùy chỉnh dữ liệu tải về qua tham số fields và quản lý danh sách lớn bằng cơ chế phân trang (offset và limit).
---

# Tổng quan

**Always consult [developers.zalo.me/docs/social-api/tai-lieu/tong-quan](https://developers.zalo.me/docs/social-api/tai-lieu/tong-quan) for code examples and latest API.**

---

# Tài liệu

## Thông tin tên, ảnh đại diện

Dùng để truy xuất thông tin cơ bản của người dùng Zalo đã cấp quyền cho ứng dụng. Endpoint /me sẽ gửi về thông tin của người dùng ứng với access_token truyền vào.

Giới hạn truy xuất: Không giới hạn.
URL: https://graph.zalo.me/v2.0/me
Method: GET
Reponse Type: text/json

---

# Tham khảo

### Cơ chế hết hạn của User Refresh Token

https://developers.zalo.me/docs/social-api/tham-khao/co-che-het-han-cua-user-refresh-token

### Yêu cầu user cấp quyền cho Ứng dụng (User Access Token V4)

https://developers.zalo.me/docs/social-api/tham-khao/user-access-token-v4

### Một số lưu ý với User Access Token V4

https://developers.zalo.me/docs/social-api/tham-khao/mot-so-luu-y-voi-user-access-token-v4

### Cấu hình App Callback URL

https://developers.zalo.me/docs/social-api/tham-khao/cau-hinh-app-callback-url

### Mã lỗi

https://developers.zalo.me/docs/social-api/tham-khao/ma-loi

### Chính sách nền tảng của Zalo

https://developers.zalo.me/docs/social-api/tham-khao/chinh-sach-nen-tang-cua-zalo

### Demonstrating Proof-of-Possession

https://developers.zalo.me/docs/social-api/tham-khao/dpop