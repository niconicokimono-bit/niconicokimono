# 圖片優化使用說明

## 🎯 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 執行圖片優化（按順序執行）

```bash
# 步驟 1: 優化現有圖片（品質 92）
npm run optimize-images

# 步驟 2: 轉換為 WebP/AVIF 格式
npm run convert-to-webp

# 步驟 3: 生成響應式圖片版本（可選，用於 srcset）
npm run generate-responsive
```

### 3. 構建專案
```bash
npm run build
```

## 📋 腳本詳細說明

### `npm run optimize-images`
- **功能**：優化現有的 JPG/PNG 圖片
- **品質**：92（高畫質）
- **產出**：優化後的原始格式圖片
- **時間**：視圖片數量而定（通常每張 1-3 秒）

### `npm run convert-to-webp`
- **功能**：將所有 JPG/PNG 轉換為 WebP 和 AVIF
- **品質**：92（高畫質）
- **產出**：`.webp` 和 `.avif` 檔案（保留原始檔案）
- **時間**：視圖片數量而定

### `npm run generate-responsive`
- **功能**：生成響應式圖片版本
- **尺寸**：
  - `_small`: 400px（手機）
  - `_medium`: 800px（平板）
  - `_large`: 1200px（桌面）
  - `_xlarge`: 1920px（大螢幕/Retina）
- **產出**：多種尺寸的圖片版本
- **時間**：視圖片數量而定

## 🖼️ 在代碼中使用

### 使用工具函數生成響應式圖片

在 `app.js` 中，您可以使用以下函數：

```javascript
// 完整響應式圖片（包含 picture 標籤，支援 WebP/AVIF）
const imageHTML = generateResponsiveImage('img/茶室體驗封面.jpg', '茶室體驗', {
    sizes: '(max-width: 640px) 100vw, 100vw',
    className: 'hero-image',
    style: 'width: 100%; height: 100vh; object-fit: cover;',
    loading: 'lazy'
});

// 簡單響應式圖片（僅 srcset，保持原始 img 標籤結構）
const simpleImageHTML = generateSimpleResponsiveImg('img/茶室體驗1.jpg', '茶室體驗1', {
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    className: 'gallery-image',
    style: 'width: 100%; height: 100%; object-fit: cover;',
    loading: 'lazy',
    onclick: 'openLightbox(...)',
    onmouseover: 'this.style.transform="scale(1.05)"',
    onmouseout: 'this.style.transform="scale(1)"'
});
```

## ⚙️ 品質設定

所有腳本都使用 **品質 92**，確保高畫質輸出。

如需調整，請修改以下文件中的 `QUALITY` 常數：
- `scripts/optimize-images.js`
- `scripts/convert-to-webp.js`
- `scripts/generate-responsive.js`

**建議**：不要低於 90，以保證關鍵攝影作品的畫質。

## 📦 部署

### Vercel
- 已配置 `vercel.json`
- 圖片資源自動快取 1 年
- 直接推送代碼即可自動部署

### Netlify
- 已配置 `netlify.toml`
- 圖片資源自動快取 1 年
- 設置構建命令為空，發布目錄為根目錄

## ⚠️ 重要提示

1. **首次運行**：轉換大量圖片可能需要 10-30 分鐘
2. **檔案大小**：WebP/AVIF 版本會自動生成，原始檔案保留
3. **瀏覽器支援**：現代瀏覽器會自動選擇最佳格式（AVIF > WebP > 原始格式）
4. **回退機制**：不支援的瀏覽器會自動回退到原始格式

## 🔍 檢查結果

執行腳本後，您應該會看到：
- 原始圖片：`img/茶室體驗封面.jpg`
- WebP 版本：`img/茶室體驗封面.webp`
- AVIF 版本：`img/茶室體驗封面.avif`（如果支援）
- 響應式版本：`img/茶室體驗封面_small.jpg`, `_medium.jpg`, `_large.jpg`, `_xlarge.jpg`

## 🛠️ 故障排除

### 錯誤：找不到模組 'sharp'
```bash
npm install sharp
```

### 錯誤：找不到模組 'imagemin'
```bash
npm install
```

### AVIF 轉換失敗
這是正常的，如果系統不支援 AVIF，腳本會自動跳過並繼續處理其他格式。

### 圖片轉換很慢
- 這是正常的，高畫質轉換需要時間
- 可以分批處理圖片
- 建議在開發環境中運行，而不是在部署時運行
