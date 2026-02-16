#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║       update-photos.js — 照片自動同步腳本（Gallery + Plan） ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║                                                              ║
 * ║  功能：掃描 img/ 資料夾中 Gallery_ 和 Plan_ 開頭的圖片，     ║
 * ║        並自動更新 photos.js 中的照片清單。                    ║
 * ║                                                              ║
 * ║  使用方式：node update-photos.js                              ║
 * ║                                                              ║
 * ║  📋 兩種照片類型：                                            ║
 * ║                                                              ║
 * ║  ① 實穿照（Gallery）→ 進入日期相簿                           ║
 * ║     格式：Gallery_方案_YYMMDD_顏色.jpg                       ║
 * ║     範例：Gallery_Komon_250216_white1.jpg                     ║
 * ║                                                              ║
 * ║  ② 型錄照（Plan）→ 進入款式型錄相簿                          ║
 * ║     格式：Plan_方案_顏色.jpg                                  ║
 * ║     範例：Plan_Lace_white.jpg                                 ║
 * ║                                                              ║
 * ║  🗂️ 方案對應表（Gallery / Plan 共用）：                       ║
 * ║     Komon              → 小紋        Premium_Komon → 高級小紋 ║
 * ║     Lace               → 蕾絲                                 ║
 * ║     Nishaku_Sode       → 二尺袖                               ║
 * ║     Houmongi           → 訪問服      Premium_Houmongi → 高級  ║
 * ║     Kuro_Tomesode      → 黑留袖      Hakama / hakama → 袴    ║
 * ║     Standard_Furisode  → 精品振袖    Gold_Furisode → 金絲     ║
 * ║     Luxury_Furisode    → 高訂振袖                              ║
 * ║     Mens_Kimono / Mens → 男士和服    Mens_Samurai → 武士服    ║
 * ║     Couple / couple    → 情侶        Kids → 小孩              ║
 * ║                                                              ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, 'img');
const PHOTOS_JS = path.join(__dirname, 'photos.js');

// 支援的圖片副檔名
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);

function isImage(f) {
    return IMAGE_EXTS.has(path.extname(f).toLowerCase());
}

function main() {
    console.log('');
    console.log('🔍 開始掃描 img/ 資料夾...');
    console.log('');

    if (!fs.existsSync(IMG_DIR)) {
        console.error('❌ 找不到 img/ 資料夾:', IMG_DIR);
        process.exit(1);
    }

    var allFiles = fs.readdirSync(IMG_DIR);

    // 掃描 Gallery_ 照片（實穿照）
    var galleryFiles = allFiles
        .filter(function(f) { return (f.startsWith('Gallery_') || f.startsWith('Gallery ')) && isImage(f); })
        .sort();

    // 掃描 Plan_ 照片（型錄照）
    var planFiles = allFiles
        .filter(function(f) { return (f.startsWith('Plan_') || f.startsWith('Plan ')) && isImage(f); })
        .sort();

    console.log('📸 實穿照 (Gallery_): ' + galleryFiles.length + ' 張');
    console.log('📋 型錄照 (Plan_):    ' + planFiles.length + ' 張');
    console.log('   總計: ' + (galleryFiles.length + planFiles.length) + ' 張');

    // 產生 photos.js 內容
    var galleryEntries = galleryFiles.map(function(f) { return '    "' + f + '"'; }).join(',\n');
    var planEntries = planFiles.map(function(f) { return '    "' + f + '"'; }).join(',\n');

    var now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Tokyo' });
    var lines = [];
    lines.push('/**');
    lines.push(' * photos.js — 照片清單（自動產生）');
    lines.push(' * ⚠️ 此檔案由 update-photos.js 自動產生，請勿手動編輯！');
    lines.push(' *');
    lines.push(' * 更新方式：新增照片到 img/ 後，在終端機執行：');
    lines.push(' *   node update-photos.js');
    lines.push(' *');
    lines.push(' * 最後更新：' + now);
    lines.push(' * 實穿照 (Gallery_): ' + galleryFiles.length + ' 張');
    lines.push(' * 型錄照 (Plan_):    ' + planFiles.length + ' 張');
    lines.push(' */');
    lines.push('');
    lines.push('// ====== 實穿照（Gallery_方案_日期_顏色.jpg）======');
    lines.push('window.galleryFiles = [');
    lines.push(galleryEntries);
    lines.push('];');
    lines.push('');
    lines.push('// ====== 型錄照（Plan_方案_顏色.jpg）======');
    lines.push('window.planFiles = [');
    lines.push(planEntries);
    lines.push('];');
    lines.push('');

    fs.writeFileSync(PHOTOS_JS, lines.join('\n'), 'utf-8');

    // 統計
    console.log('');
    console.log('✅ photos.js 已更新！');
    console.log('');

    console.log('📊 實穿照 (Gallery) 各方案：');
    var galleryCats = {};
    galleryFiles.forEach(function(f) {
        var n = f.replace(/\s+/g, '_');
        var m = n.match(/^Gallery_(.+?)_\d{6,8}/);
        var cat = m ? m[1] : '未分類';
        galleryCats[cat] = (galleryCats[cat] || 0) + 1;
    });
    Object.entries(galleryCats).sort(function(a, b) { return b[1] - a[1]; }).forEach(function(pair) {
        console.log('   ' + pair[0] + ': ' + pair[1] + ' 張');
    });

    console.log('');
    console.log('📊 型錄照 (Plan) 各方案：');
    var planCats = {};
    planFiles.forEach(function(f) {
        var n = f.replace(/\s+/g, '_');
        var m = n.match(/^Plan_(.+?)_[a-z]/i);
        var cat = m ? m[1] : '未分類';
        planCats[cat] = (planCats[cat] || 0) + 1;
    });
    Object.entries(planCats).sort(function(a, b) { return b[1] - a[1]; }).forEach(function(pair) {
        console.log('   ' + pair[0] + ': ' + pair[1] + ' 張');
    });

    console.log('');
    console.log('   ─── 合計: ' + (galleryFiles.length + planFiles.length) + ' 張 ───');
    console.log('');
    console.log('💡 刷新網頁即可看到更新後的照片庫！');
    console.log('');
}

main();
