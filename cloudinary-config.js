// ╔══════════════════════════════════════════════════════════════╗
// ║            ☁️ Cloudinary 雲端圖床設定                        ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                              ║
// ║  ✅ 啟用步驟：                                               ║
// ║     1. 到 https://cloudinary.com 註冊免費帳號                ║
// ║     2. 取得你的 Cloud Name（控制台首頁可看到）               ║
// ║     3. 將下方 cloudName 改為你的值                           ║
// ║     4. 執行 node upload-to-cloudinary.js 批次上傳圖片        ║
// ║     5. 將 enabled 改為 true                                  ║
// ║                                                              ║
// ║  💡 啟用後所有圖片將自動：                                   ║
// ║     • 從 Cloudinary CDN 加載（全球加速）                     ║
// ║     • 根據瀏覽器自動轉 WebP / AVIF 格式                     ║
// ║     • 根據螢幕解析度自動調整尺寸（srcset）                   ║
// ║     • 自動優化壓縮品質（肉眼無損）                           ║
// ║                                                              ║
// ║  ⚠️ 停用 Cloudinary 只需將 enabled 改回 false，             ║
// ║     網站會自動回退到本地 img/ 資料夾                         ║
// ║                                                              ║
// ╚══════════════════════════════════════════════════════════════╝

window.CLOUDINARY_CONFIG = {

    // ─── 基本設定 ───────────────────────────────────────
    cloudName: 'YOUR_CLOUD_NAME',       // ← 替換為你的 Cloudinary Cloud Name
    baseFolder: 'niconico-kyoto',       // 上傳到 Cloudinary 的資料夾名稱
    enabled: false,                     // 設為 true 啟用 Cloudinary

    // ─── 進階設定（通常不需要修改）─────────────────────
    defaultQuality: 'auto',             // 品質：auto（推薦）/ auto:best / auto:good / 80
    defaultFormat: 'auto',              // 格式：auto（推薦，自動 WebP/AVIF）/ webp / avif
    breakpoints: [400, 800, 1200, 1920], // 響應式斷點寬度（px）
    defaultSizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
};
