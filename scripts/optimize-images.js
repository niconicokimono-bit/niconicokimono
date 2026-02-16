#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║        optimize-images.js — 圖片批次壓縮與格式統一工具          ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║                                                                  ║
 * ║  功能：                                                          ║
 * ║    • 將 img/ 內所有 JPG/PNG 縮至最大 1920px 寬度                 ║
 * ║    • 壓縮至目標檔案大小（預設 ~500KB），最低品質不低於 70        ║
 * ║    • 統一所有副檔名為小寫（.JPG→.jpg, .PNG→.png）              ║
 * ║    • 支援從 img-original/ 備份重新壓縮                          ║
 * ║    • 自動更新 app.js 和 photos.js 中的副檔名引用               ║
 * ║                                                                  ║
 * ║  使用方式：                                                      ║
 * ║    node scripts/optimize-images.js                 (壓縮 img/)   ║
 * ║    node scripts/optimize-images.js --from-backup   (從備份重壓)  ║
 * ║    node scripts/optimize-images.js --dry-run       (預覽不修改)  ║
 * ║                                                                  ║
 * ║  選項：                                                          ║
 * ║    --from-backup   從 img-original/ 讀取原始檔重新壓縮           ║
 * ║    --webp          轉換為 WebP 格式                              ║
 * ║    --update-refs   同步更新 app.js 中的圖片路徑副檔名            ║
 * ║    --max-width N   最大寬度（預設 1920）                         ║
 * ║    --target-kb N   目標檔案大小 KB（預設 500）                   ║
 * ║    --quality N     壓縮品質 1-100（預設 85）                     ║
 * ║    --min-quality N 最低品質下限（預設 70）                       ║
 * ║    --no-backup     不建立備份                                    ║
 * ║    --dry-run       僅預覽，不實際修改                            ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');

// ─── 命令列參數解析 ─────────────────────────────────
const args = process.argv.slice(2);
function getArg(name, defaultVal) {
    const idx = args.indexOf('--' + name);
    if (idx === -1) return defaultVal;
    if (typeof defaultVal === 'boolean') return true;
    return args[idx + 1] !== undefined ? args[idx + 1] : defaultVal;
}
const FROM_BACKUP   = args.includes('--from-backup');
const CONVERT_WEBP  = args.includes('--webp');
const UPDATE_REFS   = args.includes('--update-refs');
const DRY_RUN       = args.includes('--dry-run');
const NO_BACKUP     = args.includes('--no-backup');
const MAX_WIDTH     = parseInt(getArg('max-width', '1920'), 10);
const TARGET_KB     = parseInt(getArg('target-kb', '500'), 10);
const INIT_QUALITY  = parseInt(getArg('quality', '85'), 10);
const MIN_QUALITY   = parseInt(getArg('min-quality', '70'), 10);

// ─── 路徑設定 ───────────────────────────────────────
const ROOT_DIR    = path.join(__dirname, '..');
const IMG_DIR     = path.join(ROOT_DIR, 'img');
const BACKUP_DIR  = path.join(ROOT_DIR, 'img-original');
const APP_JS      = path.join(ROOT_DIR, 'app.js');
const PHOTOS_JS   = path.join(ROOT_DIR, 'photos.js');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png']);

function isImage(f) {
    return IMAGE_EXTS.has(path.extname(f).toLowerCase());
}

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// ─── 主程式 ─────────────────────────────────────────
async function main() {
    let sharp;
    try {
        sharp = require('sharp');
    } catch (e) {
        console.error('❌ 找不到 sharp 套件！請先執行：npm install sharp');
        process.exit(1);
    }

    const SOURCE_DIR = FROM_BACKUP ? BACKUP_DIR : IMG_DIR;
    const sourceLabel = FROM_BACKUP ? 'img-original/（從備份重壓）' : 'img/';

    console.log('');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║         🖼️  圖片批次優化工具                     ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');
    console.log('  📁 來源：     ' + sourceLabel);
    console.log('  📏 最大寬度： ' + MAX_WIDTH + 'px');
    console.log('  🎯 目標大小： ~' + TARGET_KB + 'KB');
    console.log('  🎨 壓縮品質： ' + INIT_QUALITY + '（最低 ' + MIN_QUALITY + '）');
    console.log('  📦 輸出格式： ' + (CONVERT_WEBP ? 'WebP' : '原格式（副檔名統一小寫）'));
    if (DRY_RUN) console.log('  ⚠️  預覽模式： 不會修改任何檔案');
    console.log('');

    // 掃描來源圖片
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error('❌ 找不到來源資料夾：' + SOURCE_DIR);
        if (FROM_BACKUP) {
            console.error('   提示：img-original/ 是由壓縮腳本自動產生的備份資料夾');
        }
        process.exit(1);
    }

    const allFiles = fs.readdirSync(SOURCE_DIR).filter(isImage).sort();
    if (allFiles.length === 0) {
        console.log('⚠️ 來源資料夾中沒有 JPG/PNG 圖片');
        return;
    }

    console.log('🔍 掃描到 ' + allFiles.length + ' 張圖片');

    let totalOriginalBytes = 0;
    allFiles.forEach(function(f) {
        totalOriginalBytes += fs.statSync(path.join(SOURCE_DIR, f)).size;
    });
    console.log('   來源總大小：' + formatBytes(totalOriginalBytes));
    console.log('');

    if (DRY_RUN) {
        console.log('── 預覽模式 ──');
        console.log('');
        const sorted = allFiles.map(function(f) {
            return { name: f, size: fs.statSync(path.join(SOURCE_DIR, f)).size };
        }).sort(function(a, b) { return b.size - a.size; });

        console.log('📊 最大的 15 張圖片：');
        sorted.slice(0, 15).forEach(function(f, i) {
            const base = f.name.replace(/\.[^.]+$/, '');
            const newExt = CONVERT_WEBP ? '.webp' : path.extname(f.name).toLowerCase();
            console.log('   ' + (i + 1) + '. ' + f.name + ' (' + formatBytes(f.size) + ') → ' + base + newExt);
        });
        console.log('');
        console.log('💡 移除 --dry-run 即可開始壓縮');
        return;
    }

    // 備份（僅從 img/ 壓縮時需要備份）
    if (!FROM_BACKUP && !NO_BACKUP) {
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
            console.log('📁 已建立備份資料夾：img-original/');
        }
    }

    // ─── 逐一處理圖片 ───────────────────────────────
    let processed = 0;
    let failed = 0;
    let totalNewBytes = 0;
    const renamedFiles = []; // { oldName, newName }

    for (let i = 0; i < allFiles.length; i++) {
        const filename = allFiles[i];
        const inputPath = path.join(SOURCE_DIR, filename);
        const ext = path.extname(filename);
        const extLower = ext.toLowerCase();
        const baseName = filename.slice(0, filename.length - ext.length);
        const newExt = CONVERT_WEBP ? '.webp' : extLower;
        const outputName = baseName + newExt;
        const outputPath = path.join(IMG_DIR, outputName);
        const oldPathInImg = path.join(IMG_DIR, filename);

        const progress = '[' + (i + 1) + '/' + allFiles.length + ']';
        const originalSize = fs.statSync(inputPath).size;

        try {
            process.stdout.write(progress + ' ' + filename + ' (' + formatBytes(originalSize) + ') → ');

            // 備份原檔（僅非 from-backup 模式）
            if (!FROM_BACKUP && !NO_BACKUP) {
                const backupPath = path.join(BACKUP_DIR, filename);
                if (!fs.existsSync(backupPath)) {
                    fs.copyFileSync(inputPath, backupPath);
                }
            }

            // 讀取並處理圖片
            const metadata = await sharp(inputPath).metadata();
            const needResize = metadata.width && metadata.width > MAX_WIDTH;
            const TARGET_BYTES = TARGET_KB * 1024;

            // 第一次壓縮（使用初始品質）
            let quality = INIT_QUALITY;
            let outputBuffer = await compressImage(sharp, inputPath, {
                needResize, maxWidth: MAX_WIDTH, quality, extLower, convertWebp: CONVERT_WEBP
            });

            // 如果超過目標大小，用二分法降低品質（但不低於 MIN_QUALITY）
            if (outputBuffer.length > TARGET_BYTES && quality > MIN_QUALITY) {
                let lo = MIN_QUALITY;
                let hi = quality;
                let bestBuffer = outputBuffer;
                let bestDiff = Math.abs(outputBuffer.length - TARGET_BYTES);

                for (let attempt = 0; attempt < 5; attempt++) {
                    const midQ = Math.floor((lo + hi) / 2);
                    if (midQ <= lo || midQ >= hi) break;

                    const buf = await compressImage(sharp, inputPath, {
                        needResize, maxWidth: MAX_WIDTH, quality: midQ, extLower, convertWebp: CONVERT_WEBP
                    });

                    const diff = Math.abs(buf.length - TARGET_BYTES);
                    if (diff < bestDiff) {
                        bestBuffer = buf;
                        bestDiff = diff;
                    }

                    if (buf.length <= TARGET_BYTES) {
                        lo = midQ + 1;
                    } else {
                        hi = midQ - 1;
                    }

                    // 已接近目標（±10%），提早結束
                    if (diff < TARGET_BYTES * 0.1) break;
                }
                outputBuffer = bestBuffer;
            }

            // ─── 寫入檔案 + 處理副檔名大小寫 ───────
            // macOS 是 case-insensitive 但 case-preserving
            // 所以 file.JPG 和 file.jpg 是「同一個檔案」
            // 需要先改臨時名再改目標名
            if (outputName !== filename) {
                // 副檔名有變（大小寫不同 或 轉 WebP）
                const tmpPath = outputPath + '.tmp';
                fs.writeFileSync(tmpPath, outputBuffer);

                // 刪除舊檔（如果存在且名稱不同）
                if (fs.existsSync(oldPathInImg)) {
                    fs.unlinkSync(oldPathInImg);
                }

                // 臨時檔改名為最終名稱
                fs.renameSync(tmpPath, outputPath);

                renamedFiles.push({ oldName: filename, newName: outputName });
            } else {
                // 檔名完全相同，直接覆蓋
                fs.writeFileSync(outputPath, outputBuffer);
            }

            const newSize = outputBuffer.length;
            totalNewBytes += newSize;
            const saved = Math.round((1 - newSize / originalSize) * 100);
            console.log(outputName + ' (' + formatBytes(newSize) + ') ↓' + saved + '%');
            processed++;

        } catch (err) {
            console.log('✗ 失敗: ' + err.message);
            failed++;
        }
    }

    // ─── 結果報告 ───────────────────────────────────
    console.log('');
    console.log('═'.repeat(55));
    console.log('');
    console.log('📊 壓縮結果：');
    console.log('   ✓ 成功處理：' + processed + ' 張');
    if (failed > 0) console.log('   ✗ 失敗：    ' + failed + ' 張');
    console.log('   📁 壓縮前：  ' + formatBytes(totalOriginalBytes));
    console.log('   📦 壓縮後：  ' + formatBytes(totalNewBytes));
    console.log('   📉 節省：    ' + formatBytes(totalOriginalBytes - totalNewBytes) + ' (' + Math.round((1 - totalNewBytes / totalOriginalBytes) * 100) + '%)');

    // ─── 自動更新副檔名引用 ─────────────────────────
    if (renamedFiles.length > 0) {
        console.log('');
        console.log('📝 已重新命名 ' + renamedFiles.length + ' 張圖片的副檔名');
        console.log('');
        console.log('🔄 正在更新程式碼引用...');
        updateCodeReferences(renamedFiles);
    }

    // 重新生成 photos.js
    console.log('');
    console.log('📋 重新生成照片清單...');
    regeneratePhotosJs();

    console.log('');
    console.log('✅ 全部完成！');
    console.log('');
}

// ─── 壓縮圖片（支援 JPG / PNG / WebP）──────────────
async function compressImage(sharp, inputPath, opts) {
    let pipeline = sharp(inputPath);
    if (opts.needResize) {
        pipeline = pipeline.resize({ width: opts.maxWidth, withoutEnlargement: true });
    }
    // 保留 ICC 色彩描述檔，避免壓縮後顏色偏移
    pipeline = pipeline.withMetadata();

    if (opts.convertWebp) {
        return pipeline.webp({ quality: opts.quality, effort: 4 }).toBuffer();
    } else if (opts.extLower === '.png') {
        return pipeline.png({ quality: opts.quality, compressionLevel: 9 }).toBuffer();
    } else {
        return pipeline.jpeg({ quality: opts.quality, progressive: true, mozjpeg: true }).toBuffer();
    }
}

// ─── 更新程式碼中的圖片路徑引用 ─────────────────────
function updateCodeReferences(renamedFiles) {
    if (!fs.existsSync(APP_JS)) return;

    let content = fs.readFileSync(APP_JS, 'utf-8');
    const originalContent = content;
    let replacements = 0;

    // 策略 1：精確替換每個已重新命名的檔案
    renamedFiles.forEach(function(r) {
        const patterns = [
            r.oldName,
            encodeURIComponent(r.oldName).replace(/%2F/g, '/'),
        ];
        patterns.forEach(function(oldPattern) {
            const newBase = r.newName.replace(/\.[^.]+$/, '');
            const newExt = path.extname(r.newName);
            const newPattern = oldPattern.replace(/\.[^.]+$/, newExt);
            while (content.indexOf(oldPattern) !== -1) {
                content = content.split(oldPattern).join(newPattern);
                replacements++;
            }
        });
    });

    // 策略 2：通用掃描 — 將 app.js 中所有 img/ 路徑的副檔名統一為小寫
    content = content.replace(/(img\/[^'")\s,]*)\.(JPG|JPEG|PNG)(?=['"\s\),])/g, function(match, base, ext) {
        replacements++;
        return base + '.' + ext.toLowerCase();
    });

    if (content !== originalContent) {
        fs.writeFileSync(APP_JS, content, 'utf-8');
        console.log('   ✓ app.js：更新 ' + replacements + ' 處引用');
    } else {
        console.log('   - app.js：無需更新');
    }
}

// ─── 重新生成 photos.js ─────────────────────────────
function regeneratePhotosJs() {
    const IMAGE_EXTS_ALL = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);
    function isImgFile(f) { return IMAGE_EXTS_ALL.has(path.extname(f).toLowerCase()); }

    const allFiles = fs.readdirSync(IMG_DIR);

    const galleryFiles = allFiles
        .filter(function(f) { return (f.startsWith('Gallery_') || f.startsWith('Gallery ')) && isImgFile(f); })
        .sort();

    const planFiles = allFiles
        .filter(function(f) { return (f.startsWith('Plan_') || f.startsWith('Plan ')) && isImgFile(f); })
        .sort();

    const galleryEntries = galleryFiles.map(function(f) { return '    "' + f + '"'; }).join(',\n');
    const planEntries = planFiles.map(function(f) { return '    "' + f + '"'; }).join(',\n');

    const now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Tokyo' });
    const lines = [
        '/**',
        ' * photos.js — 照片清單（自動產生）',
        ' * ⚠️ 此檔案由 optimize-images.js 自動產生，請勿手動編輯！',
        ' *',
        ' * 更新方式：新增照片到 img/ 後，在終端機執行：',
        ' *   node update-photos.js',
        ' *',
        ' * 最後更新：' + now,
        ' * 實穿照 (Gallery_): ' + galleryFiles.length + ' 張',
        ' * 型錄照 (Plan_):    ' + planFiles.length + ' 張',
        ' */',
        '',
        '// ====== 實穿照（Gallery_方案_日期_顏色.jpg）======',
        'window.galleryFiles = [',
        galleryEntries,
        '];',
        '',
        '// ====== 型錄照（Plan_方案_顏色.jpg）======',
        'window.planFiles = [',
        planEntries,
        '];',
        ''
    ];

    fs.writeFileSync(PHOTOS_JS, lines.join('\n'), 'utf-8');
    console.log('   ✓ photos.js：重新生成（Gallery: ' + galleryFiles.length + ', Plan: ' + planFiles.length + '）');
}

main().catch(function(err) {
    console.error('');
    console.error('❌ 發生錯誤:', err.message || err);
    process.exit(1);
});
