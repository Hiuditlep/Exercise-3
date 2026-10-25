# TASK DECOMPOSITION & WORK BREAKDOWN STRUCTURE (WBS)
## Môn học: Phát triển Ứng dụng Web — Lab 03: Modern React Architecture & State Integrity

---

## I. TỔNG QUAN KIẾN TRÚC & PHƯƠNG PHÁP TRIỂN KHAI
- **Nền tảng thực thi**: Kế thừa trực tiếp hệ thống Mini-React VDOM Engine (`mini-react.js`) và Reactive Engine (`reactive-engine.js`) đã xây dựng từ Lab 2.
- **Ràng buộc mã nguồn (Code Contracts)**:
  1. *Strict Zero Div-Soup*: 100% thẻ ngữ nghĩa thuần (`<article>`, `<header>`, `<hgroup>`, `<dl>`, `<ul>`, `<section>`), loại bỏ hoàn toàn thẻ `<div>` trong component hiển thị.
  2. *Single Source of Truth & Derived State*: Không sử dụng `useEffect` cho các tác vụ lọc/tìm kiếm/sắp xếp; tính toán trực tiếp on-the-fly trong luồng render.
  3. *Fault-Tolerant Finite State Machine*: Quản lý 4 trạng thái rời rạc (`IDLE`, `LOADING`, `SUCCESS`, `ERROR`), điều khiển hủy luồng bất đồng bộ qua `AbortController` và triệt tiêu Cumulative Layout Shift (0.00 CLS) bằng Skeleton Box cố định 220px.
  4. *Atomic Git Commits*: Mỗi tính năng/bước kỹ thuật tương ứng với 1 commit độc lập, thông điệp tuân thủ chặt chẽ Conventional Commits để phục vụ đối soát WBS Audit.

---

## II. MA TRẬN PHÂN RÃ CÔNG VIỆC (WORK BREAKDOWN STRUCTURE)

### 1. Sprint 1: Semantic Engineer & Pro-Gamer Profile Card (Exercise 1)
- **Mục tiêu**: Nâng cấp module Profile Card kế thừa từ Lab 2, thiết lập bộ khung ngữ nghĩa chuẩn AOM (Accessibility Object Model) và CSS Modules tương thích thiết bị di động 375px.
- **Các gói công việc cụ thể**:
  - [x] **Task 1.1**: Hiện thực component `DeveloperCard.js`.
    - Thay thế các khối layout `<div>` bằng semantic landmarks: `<article aria-labelledby="dev-heading">`, `<header>`, `<hgroup>`, `<dl>` cho metadata và `<ul>` cho danh sách kỹ năng.
    - Ép ràng buộc HTTPS-only media origins cho ảnh đại diện, chỉ định tường minh thuộc tính `width="64"` và `height="64"` để triệt tiêu hiện tượng giật giao diện (Zero CLS).
    - Cấu hình ES6 default parameters an toàn cho props (`fullName`, `role`, `avatarUrl`, `metrics`, `skills`).
    - **Atomic Commit 1**: `feat(ex1): implement semantic DeveloperCard and SkillBadge`
  - [x] **Task 1.2**: Xây dựng kiến trúc giao diện `developer-card.css`.
    - Định nghĩa CSS Custom Properties (`--card-bg`, `--accent`, `--border`, v.v.) quản lý theme.
    - Thiết lập hệ thống lưới `grid` cho danh mục thẻ `<dl>` thông số.
    - Định nghĩa media query `@media (max-width: 375px)` tối ưu hóa layout cho iPhone SE, triệt tiêu hoàn toàn lỗi tràn viền và thanh cuộn ngang (Zero horizontal scroll).
    - **Atomic Commit 2**: `style(ex1): add responsive 375px CSS module`

---

### 2. Sprint 2: Interactive Scientist & Pioneer Directory (Exercise 2)
- **Mục tiêu**: Xây dựng bộ điều hướng dữ liệu khoa học tương tác cao dựa trên luồng dữ liệu một chiều (Unidirectional Data Flow), Derived State và cơ chế Reconciliation.
- **Các gói công việc cụ thể**:
  - [x] **Task 2.1**: Thiết lập cấu trúc dữ liệu thực thể chuẩn hóa.
    - Định nghĩa mảng dữ liệu `SMART_PEOPLE` gán Stable ID duy nhất (`sp-1`, `sp-2`, ...) đảm bảo tính bất biến của key khi diffing VDOM.
    - Khởi tạo trạng thái độc lập qua `useState` trong `reactive-engine.js`: `people`, `query`, `minIq`, `sortBy`.
    - **Atomic Commit 3**: `feat(ex2): normalize smartPeople schema with stable IDs`
  - [x] **Task 2.2**: Thiết lập đường ống tính toán dẫn xuất (Derived State Pipeline).
    - Triệt tiêu hoàn toàn `useEffect` cho việc lọc danh sách; tính toán `visible` trực tiếp trong chu kỳ render để đảm bảo 1 keystroke chỉ tạo đúng 1 render pass duy nhất.
    - Hiện thực logic tìm kiếm tên không phân biệt hoa thường (`toLowerCase().includes()`).
    - Đảm bảo tính an toàn kiểu số cho bộ lọc IQ thông qua thuộc tính chuẩn `e.target.valueAsNumber`.
    - Hiện thực cơ chế sắp xếp bất biến thông qua phương thức hiện đại ECMAScript 2023 `Array.prototype.toSorted()`.
    - **Atomic Commit 4**: `feat(ex2): add search, IQ filter & toSorted`
  - [x] **Task 2.3**: Xây dựng giao tiếp khả năng tiếp cận (Accessibility) và thao tác CRUD cơ bản.
    - Liên kết chặt chẽ `<label htmlFor>` với từng trường `<input id>` để người dùng trình đọc màn hình dễ dàng điều hướng.
    - Hiện thực hàm xóa bất biến `handleDelete` thông qua mảng lọc `.filter(p => p.id !== id)`.
    - Cung cấp tính năng khôi phục toàn vẹn dữ liệu `handleReset`.
    - Xuất số lượng kết quả tìm kiếm theo thời gian thực bằng thẻ `<output role="status" aria-live="polite">`.
    - **Atomic Commit 5**: `feat(ex2): add delete/reset & live status`

---

### 3. Sprint 3: KRAFTON PUBG Vietnam Series Live Telemetry (Exercise 3)
- **Mục tiêu**: Xây dựng trạm radar dữ liệu Esports trực tiếp chống chịu lỗi (Fault-Tolerant), kiểm soát kết nối bất đồng bộ và chống rò rỉ bộ nhớ.
- **Các gói công việc cụ thể**:
  - [x] **Task 3.1**: Hiện thực FSM 4 trạng thái và quản lý luồng hủy `AbortController`.
    - Quản lý trạng thái giao diện theo mô hình FSM rời rạc (`IDLE`, `LOADING`, `SUCCESS`, `ERROR`).
    - Tích hợp `AbortController` để hủy bỏ tức thì request vệ tinh đang bay (in-flight request) khi người dùng chuyển đội tuyển (Switch squad) liên tục, ngăn ngừa triệt để Race Condition.
    - Xây dựng lớp bảo vệ an toàn (Safe AbortError Guard) bỏ qua các ngoại lệ `AbortError`, tránh phát sinh thông báo lỗi giả mạo trên UI.
    - **Atomic Commit 6**: `feat(ex3): implement PUBG VN 4-state telemetry & AbortController`
  - [x] **Task 3.2**: Hiện thực Skeleton Loader, Accessible Error Alert và cơ chế Retry.
    - Thiết kế khung Skeleton màu xanh Blue-Zone có animation nhấp nháy (`pulseBlueZone`) với chiều cao cố định đúng `220px` nhằm bảo đảm chỉ số CLS tuyệt đối bằng 0.00.
    - Xóa bỏ triệt để hành vi chặn luồng của `window.alert()`; thay thế bằng hộp cảnh báo ngữ nghĩa `<section role="alert">`.
    - Thiết lập nút phục hồi kết nối "Reconnect Satellite (Retry)" kích hoạt lại tiến trình lấy dữ liệu.
    - **Atomic Commit 7**: `feat(ex3): add skeleton UI & retry alert`

---

## III. BẢNG ĐỐI SOÁT LỊCH SỬ GIT LOG (ATOMIC COMMITS CHECKLIST)

| STT | Commit Message Chuẩn Hóa | Phân Vùng File Liên Quan | Trạng Thái |
| :---: | :--- | :--- | :---: |
| 1 | `feat(ex1): implement semantic DeveloperCard and SkillBadge` | `DeveloperCard.js` | Hoàn thành |
| 2 | `style(ex1): add responsive 375px CSS module` | `developer-card.css` | Hoàn thành |
| 3 | `feat(ex2): normalize smartPeople schema with stable IDs` | `ScientistDirectory.js` | Hoàn thành |
| 4 | `feat(ex2): add search, IQ filter & toSorted` | `ScientistDirectory.js` | Hoàn thành |
| 5 | `feat(ex2): add delete/reset & live status` | `ScientistDirectory.js` | Hoàn thành |
| 6 | `feat(ex3): implement PUBG VN 4-state telemetry & AbortController` | `PubgMatchTelemetry.js` | Hoàn thành |
| 7 | `feat(ex3): add skeleton UI & retry alert` | `PubgMatchTelemetry.js`, `developer-card.css` | Hoàn thành |
| 8 | `chore: assemble all exercises into lab3-runner` | `lab3-runner.js`, `index.html` | Hoàn thành |