#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           sync-gallery.js — Gallery 照片自動同步腳本         ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║                                                              ║
 * ║  功能：掃描 img/ 資料夾中所有 Gallery_ 開頭的圖片檔，         ║
 * ║        並自動更新 app.js 中的 galleryFiles 陣列。             ║
 * ║                                                              ║
 * ║  使用方式：npm run sync-gallery                               ║
 * ║                                                              ║
 * ║  ✅ 照片更新只需 2 步：                                       ║
 * ║     1. 將照片命名為 Gallery_方案_日期_顏色.jpg                 ║
 * ║        放入 img/ 資料夾                                       ║
 * ║     2. 執行 npm run sync-gallery                              ║
 * ║     → app.js 會自動更新，網頁刷新後即可看到新照片              ║
 * ║                                                              ║
 * ║  📋 檔名格式：Gallery_方案_YYMMDD_顏色編號.副檔名             ║
 * ║                                                              ║
 * ║  🗂️ 方案對應表：                                              ║
 * ║     Komon              → 小紋        Premium_Komon → 高級小紋 ║
 * ║     Lace               → 蕾絲                                 ║
 * ║     Nishaku_Sode       → 二尺袖      (Nishaku 也可)           ║
 * ║     Houmongi           → 訪問服 ¥11,000                       ║
 * ║     Premium_Houmongi   → 高級訪問服 ¥16,500                   ║
 * ║     Kuro_Tomesode      → 黑留袖                               ║
 * ║     Hakama             → 袴                                    ║
 * ║     Standard_Furisode  → 精品振袖 ¥9,900                      ║
 * ║     Gold_Furisode      → 金絲振袖 ¥16,500                     ║
 * ║     Luxury_Furisode    → 高訂振袖 ¥27,500                     ║
 * ║     Mens_Kimono        → 男士和服    (Mens 也可)              ║
 * ║     Mens_Samurai       → 高級武士服                            ║
 * ║     Couple             → 情侶套餐                              ║
 * ║     Kids               → 小孩和服                              ║
 * ║                                                              ║
 * ║  🎨 顏色：white/beige/red/orange/yellow/green/blue/           ║
 * ║           purple/pink/black（其他自動歸為「其他」）            ║
 * ║                                                              ║
 * ║  範例：                                                       ║
 * ║     Gallery_Komon_250216_white1.jpg                           ║
 * ║     Gallery_Luxury_Furisode_260101_red2.JPG                   ║
 * ║     Gallery_Couple_260215_blue.jpg                            ║
 * ║     Gallery_Hakama_251001_purple1.jpg                         ║
 * ║                                                              ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '..', 'img');
const APP_JS = path.join(__dirname, '..', 'app.js');
const START_MARKER = '// __GALLERY_FILES_START__';
const END_MARKER = '// __GALLERY_FILES_END__';

// 支援的圖片副檔名
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);

function main() {
    // 1. 掃描 img/ 資料夾中所有 Gallery_ 開頭的圖片
    if (!fs.existsSync(IMG_DIR)) {
        console.error('❌ 找不到 img/ 資料夾:', IMG_DIR);
        process.exit(1);
    }

    const allFiles = fs.readdirSync(IMG_DIR);
    const galleryFiles = allFiles
        .filter(f => {
            if (!f.startsWith('Gallery_') && !f.startsWith('Gallery ')) return false;
            const ext = path.extname(f).toLowerCase();
            return IMAGE_EXTS.has(ext);
        })
        .sort(); // 按字母順序排列

    console.log(`📸 掃描到 ${galleryFiles.length} 張 Gallery_ 照片`);

    if (galleryFiles.length === 0) {
        console.warn('⚠️  img/ 中沒有找到任何 Gallery_ 開頭的照片');
    }

    // 2. 產生新的 galleryFiles 陣列程式碼
    const indent = '            '; // 12 spaces (matching app.js indentation)
    const entries = galleryFiles.map(f => `${indent}"${f}"`).join(',\n');
    const newArrayCode = `${START_MARKER}\n        const galleryFiles = [\n${entries}\n        ];\n        ${END_MARKER}`;

    // 3. 讀取 app.js 並替換
    if (!fs.existsSync(APP_JS)) {
        console.error('❌ 找不到 app.js:', APP_JS);
        process.exit(1);
    }

    let appContent = fs.readFileSync(APP_JS, 'utf-8');

    const startIdx = appContent.indexOf(START_MARKER);
    const endIdx = appContent.indexOf(END_MARKER);

    if (startIdx === -1 || endIdx === -1) {
        console.error('❌ 在 app.js 中找不到 __GALLERY_FILES_START__ / __GALLERY_FILES_END__ 標記');
        console.error('   請確認 app.js 中有以下兩行標記：');
        console.error('   ' + START_MARKER);
        console.error('   ' + END_MARKER);
        process.exit(1);
    }

    const before = appContent.substring(0, startIdx);
    const after = appContent.substring(endIdx + END_MARKER.length);
    const updatedContent = before + newArrayCode + after;

    fs.writeFileSync(APP_JS, updatedContent, 'utf-8');

    // 4. 統計並輸出結果
    const categories = {};
    galleryFiles.forEach(f => {
        // 提取方案類別
        const normalized = f.replace(/\s+/g, '_');
        const match = normalized.match(/^Gallery_(.+?)_\d{6,8}/);
        const category = match ? match[1] : '未分類';
        categories[category] = (categories[category] || 0) + 1;
    });

    console.log('✅ galleryFiles 已更新至 app.js');
    console.log('');
    console.log('📊 各方案照片數量：');
    Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count} 張`);
        });
    console.log(`   ──────────────`);
    console.log(`   總計: ${galleryFiles.length} 張`);
}

main();
