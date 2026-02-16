# 預約表單設置說明

## 📧 郵件發送服務配置

預約表單支援兩種郵件發送服務，請選擇其中一種進行配置：

---

## 方案 1: Formspree（推薦，更簡單）⭐

### 設置步驟：

1. **註冊 Formspree 帳號**
   - 前往 https://formspree.io/
   - 點擊 "Sign Up" 註冊免費帳號

2. **創建新表單**
   - 登入後，點擊 "New Form"
   - 表單名稱可以填寫 "Niconico 預約表單"
   - 接收郵件地址填寫：`niconicokimonorental@gmail.com`

3. **獲取 Form ID**
   - 創建表單後，您會看到一個 Form ID（格式類似：`xrgkqjpn`）
   - 複製這個 Form ID

4. **配置到代碼中**
   - 打開 `app.js` 文件
   - 找到這一行：
     ```javascript
     const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';
     ```
   - 將 `YOUR_FORM_ID` 替換為您的實際 Form ID
   - 例如：`https://formspree.io/f/xrgkqjpn`

5. **完成！**
   - 保存文件後，表單就可以正常發送郵件了

### Formspree 免費版限制：
- 每月 50 封郵件
- 如需更多，可升級付費方案

---

## 方案 2: EmailJS（備選方案）

### 設置步驟：

1. **註冊 EmailJS 帳號**
   - 前往 https://www.emailjs.com/
   - 點擊 "Sign Up" 註冊免費帳號

2. **添加郵件服務**
   - 登入後，進入 "Email Services"
   - 選擇您的郵件服務商（Gmail、Outlook 等）
   - 按照指示連接您的郵件帳號

3. **創建郵件模板**
   - 進入 "Email Templates"
   - 點擊 "Create New Template"
   - 模板內容範例：
     ```
     主題：新預約 - {{from_name}}
     
     姓名：{{from_name}}
     預約日期：{{booking_date}}
     人數：{{booking_people}}
     聯絡電話：{{booking_phone}}
     備註：{{booking_message}}
     ```
   - 收件人設置為：`niconicokimonorental@gmail.com`
   - 保存模板並記下 Template ID

4. **獲取配置資訊**
   - Service ID：在 "Email Services" 中查看
   - Template ID：在 "Email Templates" 中查看
   - Public Key：在 "Account" > "General" 中查看

5. **配置到代碼中**
   - 打開 `app.js` 文件
   - 找到 EmailJS 配置部分（目前被註釋）
   - 取消註釋並填入您的配置：
     ```javascript
     window.emailjsConfig = {
         serviceId: 'YOUR_SERVICE_ID',      // 替換為您的 Service ID
         templateId: 'YOUR_TEMPLATE_ID',    // 替換為您的 Template ID
         publicKey: 'YOUR_PUBLIC_KEY'       // 替換為您的 Public Key
     };
     ```
   - 同時註釋掉 Formspree 的部分

6. **完成！**

### EmailJS 免費版限制：
- 每月 200 封郵件
- 如需更多，可升級付費方案

---

## 🎯 推薦使用 Formspree

- ✅ 設置更簡單
- ✅ 不需要連接郵件服務
- ✅ 免費版每月 50 封郵件（對小型業務足夠）
- ✅ 配置只需一個 Form ID

---

## 📝 郵件格式

無論使用哪種服務，您收到的郵件格式如下：

```
主題：【新預約】姓名 - 日期 (人數人)

姓名：XXX
預約日期：YYYY-MM-DD
人數：X
聯絡電話：XXX（或「未提供」）
備註：XXX（或「無」）
```

---

## 🔧 測試

配置完成後，請測試表單：

1. 打開網站
2. 點擊「點我預約」按鈕
3. 填寫測試資料
4. 提交表單
5. 檢查是否收到郵件
6. 確認成功訊息是否正確顯示

---

## ❓ 常見問題

**Q: 提交後沒有收到郵件？**
- 檢查配置是否正確
- 檢查垃圾郵件資料夾
- 查看瀏覽器 Console 是否有錯誤訊息

**Q: 如何切換到另一個服務？**
- 在 `app.js` 中註釋掉當前使用的服務
- 取消註釋另一個服務的配置
- 填入對應的配置資訊

**Q: 可以同時使用兩種服務嗎？**
- 可以，但需要修改代碼邏輯
- 建議只使用一種服務以避免混亂

