# 組件化架構說明

## 📁 文件結構

```
niconico-kyoto/
├── index.html              # 主 HTML 文件（已簡化）
├── style.css               # 所有 CSS 樣式
├── app.js                  # 應用程式主邏輯（從 index.html 提取）
├── components-loader.js    # 組件加載器
└── components/             # 組件目錄
    ├── navbar.html         # 導航欄組件
    └── fixed-widgets.html  # 固定按鈕組件
```

## 🔧 組件加載器使用方式

### 基本用法

組件加載器會在頁面載入時自動載入以下組件：
- `navbar.html` - 導航欄（載入到 `#app` 的開頭）
- `fixed-widgets.html` - 固定按鈕（載入到 `body` 的結尾）

### 手動載入組件

如果需要手動載入組件，可以使用以下方式：

```javascript
// 載入單個組件
await componentLoader.loadComponent('navbar', '#app', 'afterbegin');

// 批量載入組件
await componentLoader.loadComponents([
    { name: 'navbar', target: '#app', position: 'afterbegin' },
    { name: 'fixed-widgets', target: 'body', position: 'beforeend' }
]);
```

### 參數說明

- `componentName`: 組件名稱（不包含 `.html` 擴展名）
- `targetSelector`: 目標選擇器，組件將被插入到該元素中
- `position`: 插入位置
  - `'beforebegin'`: 在目標元素之前
  - `'afterbegin'`: 在目標元素內部，開頭
  - `'beforeend'`: 在目標元素內部，結尾（預設）
  - `'afterend'`: 在目標元素之後

## 📝 如何添加新組件

1. 在 `components/` 資料夾中創建新的 HTML 文件，例如 `footer.html`
2. 將組件的 HTML 代碼放入該文件（不需要 `<!DOCTYPE>` 或 `<html>` 標籤）
3. 在 `components-loader.js` 的 `DOMContentLoaded` 事件中添加載入邏輯：

```javascript
document.addEventListener('DOMContentLoaded', async () => {
    await componentLoader.loadComponent('navbar', '#app', 'afterbegin');
    await componentLoader.loadComponent('footer', '#app', 'beforeend');
    await componentLoader.loadComponent('fixed-widgets', 'body', 'beforeend');
});
```

## 🚀 載入順序

1. `components-loader.js` - 組件加載器（必須最先載入）
2. `app.js` - 應用程式主邏輯（在組件載入後執行）

## ⚠️ 注意事項

1. **組件緩存**: 組件加載器會自動緩存已載入的組件，避免重複請求
2. **異步載入**: 組件載入是異步的，確保在組件載入完成後再執行相關邏輯
3. **路徑問題**: 組件文件路徑相對於 `index.html`，確保路徑正確
4. **瀏覽器兼容性**: 使用 `fetch()` API，需要現代瀏覽器支持

## 🔄 清除緩存

如果需要清除組件緩存（例如在開發時強制重新載入）：

```javascript
componentLoader.clearCache();
```

## 📦 已提取的組件

- ✅ **Navbar** (`components/navbar.html`) - 導航欄，包含 Logo、主選單、社交媒體圖標
- ✅ **Fixed Widgets** (`components/fixed-widgets.html`) - 固定按鈕組，包含聯絡我們和 Top 按鈕

## 🎯 未來擴展建議

可以進一步提取以下組件：
- Footer 組件
- Hero Section 組件
- FAQ 組件
- 價格表組件
- 等等...

每個組件都應該是獨立的、可重用的 HTML 片段。

