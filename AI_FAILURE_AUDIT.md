# AI FAILURE MODE AUDIT REPORT

## Phát hiện ảo giác kiến trúc, lỗ hổng bảo mật và suy giảm hiệu năng trong quá trình sinh mã tự động

> **Báo cáo kiểm toán kỹ thuật (Mandatory 15% Evaluation Deliverable)**: Phân tích 3 lỗi nghiêm trọng kinh điển do AI tạo ra trong phát triển giao diện hiện đại, đối chiếu bằng chứng nhận diện trên Chrome DevTools và đề xuất giải pháp tái cấu trúc (Engineering Refactor).

---

## 1. Vulnerability 01: Lạm dụng innerHTML & Hội chứng Div-Soup (XSS & AOM Collapse)

### 1.1. Ngữ cảnh & Mã nguồn lỗi do AI đề xuất

- **Prompt gửi AI**: _"Tạo component hiển thị thông tin thẻ kỹ sư kèm tiểu sử và danh sách kỹ năng từ props."_
- **Đoạn mã do AI sinh ra**:
  ```javascript
  export function LegacyDeveloperCard({ user }) {
    return `
      <div class="card">
        <div class="header">
          <img src="${user.avatarUrl}" />
          <div class="user-info">
            <div class="name">${user.fullName}</div>
            <div class="role">${user.bio}</div>
          </div>
        </div>
      </div>
    `;
    // Thường được chèn vào DOM thật bằng: container.innerHTML = LegacyDeveloperCard(data);
  }
  ```
