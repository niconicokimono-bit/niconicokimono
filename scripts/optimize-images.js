#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║        optimize-images.js — 圖片批次壓縮與 WebP 轉換工具        ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║                                                                  ║
 * ║  功能：                                                          ║
 * ║    • 將 img/ 內所有 JPG/PNG 縮至最大 1920px 寬度                 ║
 * ║    • 壓縮至目標檔案大小（預設 ~500KB）                           ║
 * ║    • 可選擇直接轉換為 WebP 格式（體積更小 30-50%）               ║
 * ║    • 原始檔自動備份到 img-original/                              ║
 * ║                                                                  ║
 * ║  使用方式：                                                      ║
 * ║    node scripts/optimize-images.js                 (壓縮不轉檔)  ║
 * ║    node scripts/optimize-images.js --webp          (轉為 WebP)   ║
 * ║    node scripts/optimize-images.js --webp --update-refs          ║
 * ║                                              (轉 WebP + 更新引用)║
 * ║    node scripts/optimize-images.js --dry-run       (預覽不修改)  ║
 * ║                                                                  ║
 * ║  選項：                                                          ║
 * ║    --webp          轉換為 WebP 格式                              ║
 * ║    --update-refs   同步更新 app.js 中的圖片路徑副檔名            ║
 * ║    --max-width N   最大寬度（預設 1920）                         ║
 * ║    --target-kb N   目標檔案大小 KB（預設 500）                   ║
 * ║    --quality N     壓縮品質 1-100（預設 82）                     ║
 * ║    --no-backup     不建立備份                                    ║
 * ║    --dry-run       僅預覽，不實際修改                            ║
 * ║                                                                  ║
 * ║  需要：npm install sharp（已在 devDependencies）                 ║
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
const CONVERT_WEBP  = args.includes('--webp');
const UPDATE_REFS   = args.includes('--update-refs');
const DRY_RUN       = args.includes('--dry-run');
const NO_BACKUP     = args.includes('--no-backup');
const MAX_WIDTH     = parseInt(getArg('max-width', '1920'), 10);
const TARGET_KB     = parseInt(getArg('target-kb', '500'), 10);
const INIT_QUALITY  = parseInt(getArg('quality', '82'), 10);

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
        console.error('❌ 找不到 sharp 套件！請先執行：');
        console.error('   npm install sharp');
        process.exit(1);
    }

    console.log('');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║         🖼️  圖片批次優化工具                     ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');
    console.log('  📁 來源：     img/');
    console.log('  📏 最大寬度： ' + MAX_WIDTH + 'px');
    console.log('  🎯 目標大小： ~' + TARGET_KB + 'KB');
    console.log('  🎨 初始品質： ' + INIT_QUALITY);
    console.log('  📦 輸出格式： ' + (CONVERT_WEBP ? 'WebP' : '原格式（JPG/PNG 壓縮）'));
    console.log('  📝 更新引用： ' + (UPDATE_REFS ? '是' : '否'));
    console.log('  💾 備份原檔： ' + (NO_BACKUP ? '否' : 'img-original/'));
    if (DRY_RUN) console.log('  ⚠️  預覽模式：  不會修改任何檔案');
    console.log('');

    // 掃描圖片
    if (!fs.existsSync(IMG_DIR)) {
        console.error('❌ 找不到 img/ 資料夾');
        process.exit(1);
    }

    const allFiles = fs.readdirSync(IMG_DIR).filter(isImage).sort();
    if (allFiles.length === 0) {
        console.log('⚠️ img/ 中沒有 JPG/PNG 圖片');
        return;
    }

    console.log('🔍 掃描到 ' + allFiles.length + ' 張圖片');

    // 計算原始大小
    let totalOriginalBytes = 0;
    allFiles.forEach(function(f) {
        totalOriginalBytes += fs.statSync(path.join(IMG_DIR, f)).size;
    });
    console.log('   原始總大小：' + formatBytes(totalOriginalBytes));
    console.log('');

    if (DRY_RUN) {
        console.log('── 預覽模式：以下為預計操作 ──');
        console.log('');
        // 預覽前 10 大檔案
        const sorted = allFiles.map(function(f) {
            return { name: f, size: fs.statSync(path.join(IMG_DIR, f)).size };
        }).sort(function(a, b) { return b.size - a.size; });

        console.log('📊 最大的 15 張圖片：');
        sorted.slice(0, 15).forEach(function(f, i) {
            const ext = CONVERT_WEBP ? '.webp' : path.extname(f.name);
            const base = f.name.replace(/\.[^.]+$/, '');
            console.log('   ' + (i + 1) + '. ' + f.name + ' (' + formatBytes(f.size) + ') → ' + base + ext + ' (~' + TARGET_KB + 'KB)');
        });
        console.log('');
        const estSize = allFiles.length * TARGET_KB * 1024;
        console.log('📉 預估壓縮後：' + formatBytes(estSize) + '（節省 ' + Math.round((1 - estSize / totalOriginalBytes) * 100) + '%）');
        console.log('');
        console.log('💡 移除 --dry-run 即可開始壓縮');
        return;
    }

    // 建立備份資料夾
    if (!NO_BACKUP) {
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
            console.log('📁 已建立備份資料夾：img-original/');
        } else {
            console.log('📁 備份資料夾已存在：img-original/');
        }
    }

    // 逐一處理圖片
    let processed = 0;
    let failed = 0;
    let totalNewBytes = 0;
    const renamedFiles = []; // { oldName, newName }

    for (let i = 0; i < allFiles.length; i++) {
        const filename = allFiles[i];
        const inputPath = path.join(IMG_DIR, filename);
        const ext = path.extname(filename).toLowerCase();
        const baseName = filename.replace(/\.[^.]+$/, '');
        const newExt = CONVERT_WEBP ? '.webp' : ext;
        const outputName = baseName + newExt;
        const outputPath = path.join(IMG_DIR, outputName);

        const progress = '[' + (i + 1) + '/' + allFiles.length + ']';
        const originalSize = fs.statSync(inputPath).size;

        try {
            process.stdout.write(progress + ' ' + filename + ' (' + formatBytes(originalSize) + ') → ');

            // 備份原檔
            if (!NO_BACKUP) {
                const backupPath = path.join(BACKUP_DIR, filename);
                if (!fs.existsSync(backupPath)) {
                    fs.copyFileSync(inputPath, backupPath);
                }
            }

            // 讀取圖片基本資訊
            const metadata = await sharp(inputPath).metadata();
            const needResize = metadata.width && metadata.width > MAX_WIDTH;

            // 動態品質調整：大檔案用較低品質以達到目標大小
            let quality = INIT_QUALITY;
            const TARGET_BYTES = TARGET_KB * 1024;

            // 第一次壓縮
            let pipeline = sharp(inputPath);
            if (needResize) {
                pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
            }

            let outputBuffer;
            if (CONVERT_WEBP) {
                outputBuffer = await pipeline.webp({ quality: quality, effort: 4 }).toBuffer();
            } else if (ext === '.png') {
                outputBuffer = await pipeline.png({ quality: quality, compressionLevel: 9 }).toBuffer();
            } else {
                outputBuffer = await pipeline.jpeg({ quality: quality, progressive: true, mozjpeg: true }).toBuffer();
            }

            // 如果超過目標大小，逐步降低品質（二分法）
            if (outputBuffer.length > TARGET_BYTES && quality > 30) {
                let lo = 20, hi = quality;
                let bestBuffer = outputBuffer;

                for (let attempt = 0; attempt < 5; attempt++) {
                    const midQ = Math.floor((lo + hi) / 2);
                    let p2 = sharp(inputPath);
                    if (needResize) {
                        p2 = p2.resize({ width: MAX_WIDTH, withoutEnlargement: true });
                    }

                    let buf;
                    if (CONVERT_WEBP) {
                        buf = await p2.webp({ quality: midQ, effort: 4 }).toBuffer();
                    } else if (ext === '.png') {
                        buf = await p2.png({ quality: midQ, compressionLevel: 9 }).toBuffer();
                    } else {
                        buf = await p2.jpeg({ quality: midQ, progressive: true, mozjpeg: true }).toBuffer();
                    }

                    if (buf.length <= TARGET_BYTES) {
                        bestBuffer = buf;
                        lo = midQ + 1;
                    } else {
                        hi = midQ - 1;
                        bestBuffer = buf;
                    }

                    if (Math.abs(buf.length - TARGET_BYTES) < TARGET_BYTES * 0.1) {
                        bestBuffer = buf;
                        break;
                    }
                }
                outputBuffer = bestBuffer;
            }

            // 寫入結果
            if (CONVERT_WEBP && outputName !== filename) {
                // WebP 模式：寫入新檔，刪除舊檔
                fs.writeFileSync(outputPath, outputBuffer);
                if (fs.existsSync(inputPath) && outputName !== filename) {
                    fs.unlinkSync(inputPath);
                }
                renamedFiles.push({ oldName: filename, newName: outputName });
            } else {
                // 原格式模式：覆蓋原檔
                fs.writeFileSync(inputPath, outputBuffer);
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

    console.log('');
    console.log('═'.repeat(55));
    console.log('');
    console.log('📊 壓縮結果：');
    console.log('   ✓ 成功處理：' + processed + ' 張');
    if (failed > 0) console.log('   ✗ 失敗：    ' + failed + ' 張');
    console.log('   📁 壓縮前：  ' + formatBytes(totalOriginalBytes));
    console.log('   📦 壓縮後：  ' + formatBytes(totalNewBytes));
    console.log('   📉 節省：    ' + formatBytes(totalOriginalBytes - totalNewBytes) + ' (' + Math.round((1 - totalNewBytes / totalOriginalBytes) * 100) + '%)');
    if (!NO_BACKUP) {
        console.log('   💾 原檔備份：img-original/');
    }

    // WebP 模式：更新程式碼引用
    if (CONVERT_WEBP && renamedFiles.length > 0) {
        console.log('');
        console.log('📝 已重新命名 ' + renamedFiles.length + ' 張圖片為 .webp');

        if (UPDATE_REFS) {
            console.log('');
            console.log('🔄 正在更新程式碼引用...');
            updateCodeReferences(renamedFiles);
        } else {
            console.log('');
            console.log('⚠️  程式碼中的圖片路徑尚未更新！');
            console.log('   請執行以下命令自動更新：');
            console.log('   node scripts/optimize-images.js --webp --update-refs');
            console.log('');
            console.log('   或手動將 app.js 中的 .JPG / .jpg / .PNG / .png 替換為 .webp');
        }
    }

    // 提醒執行 update-photos.js
    if (CONVERT_WEBP) {
        console.log('');
        console.log('💡 下一步：執行 node update-photos.js 更新照片清單');
    }

    console.log('');
}

// ─── 更新程式碼中的圖片路徑引用 ─────────────────────
function updateCodeReferences(renamedFiles) {
    const filesToUpdate = [APP_JS];

    // 建立 oldName → newName 映射
    const renameMap = {};
    renamedFiles.forEach(function(r) {
        renameMap[r.oldName] = r.newName;
    });

    filesToUpdate.forEach(function(filePath) {
        if (!fs.existsSync(filePath)) return;

        let content = fs.readFileSync(filePath, 'utf-8');
        const originalContent = content;
        let replacements = 0;

        // 策略 1：精確替換已知的重新命名檔案
        renamedFiles.forEach(function(r) {
            // 替換各種可能的引用格式
            const patterns = [
                r.oldName,                                              // 完整檔名
                encodeURIComponent(r.oldName).replace(/%2F/g, '/'),    // URL 編碼版本
            ];
            patterns.forEach(function(oldPattern) {
                const newPattern = oldPattern.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                if (content.indexOf(oldPattern) !== -1) {
                    content = content.split(oldPattern).join(newPattern);
                    replacements++;
                }
            });
        });

        // 策略 2：通用替換 img/ 路徑中的副檔名
        // 匹配 img/ 開頭、非引號結尾的圖片路徑中的 .jpg/.JPG/.png/.PNG
        content = content.replace(/(img\/[^'")\s]*)\.(jpg|jpeg|png|JPG|JPEG|PNG)(?=['"\s\)])/g, function(match, base, ext) {
            replacements++;
            return base + '.webp';
        });

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log('   ✓ ' + path.basename(filePath) + '：更新 ' + replacements + ' 處引用');
        } else {
            console.log('   - ' + path.basename(filePath) + '：無需更新');
        }
    });

    // 重新生成 photos.js（呼叫 update-photos.js 的邏輯）
    regeneratePhotosJs();
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
        ' * ⚠️ 此檔案由 optimize-images.js 自動重新產生',
        ' * 最後更新：' + now,
        ' * 實穿照 (Gallery_): ' + galleryFiles.length + ' 張',
        ' * 型錄照 (Plan_):    ' + planFiles.length + ' 張',
        ' */',
        '',
        '// ====== 實穿照（Gallery_方案_日期_顏色.ext）======',
        'window.galleryFiles = [',
        galleryEntries,
        '];',
        '',
        '// ====== 型錄照（Plan_方案_顏色.ext）======',
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
