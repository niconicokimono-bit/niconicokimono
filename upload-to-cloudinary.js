#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║     upload-to-cloudinary.js — 批次上傳圖片到 Cloudinary     ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║                                                              ║
 * ║  功能：將 img/ 資料夾中的所有圖片上傳到 Cloudinary 雲端。    ║
 * ║        已上傳過的圖片不會重複上傳（根據檔名比對）。          ║
 * ║                                                              ║
 * ║  前置作業：                                                   ║
 * ║     1. 安裝依賴：npm install cloudinary                       ║
 * ║     2. 設定環境變數（任選一種方式）：                         ║
 * ║        a) 建立 .env 檔案：                                    ║
 * ║           CLOUDINARY_CLOUD_NAME=your_cloud_name               ║
 * ║           CLOUDINARY_API_KEY=your_api_key                     ║
 * ║           CLOUDINARY_API_SECRET=your_api_secret               ║
 * ║        b) 直接設定環境變數：                                  ║
 * ║           export CLOUDINARY_URL=cloudinary://key:secret@name  ║
 * ║                                                              ║
 * ║  使用方式：node upload-to-cloudinary.js                       ║
 * ║  強制重新上傳：node upload-to-cloudinary.js --force            ║
 * ║                                                              ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');

// ─── 設定 ───────────────────────────────────────────
const IMG_DIR = path.join(__dirname, 'img');
const UPLOAD_LOG = path.join(__dirname, '.cloudinary-uploaded.json');

// Cloudinary 上傳目標資料夾（與 cloudinary-config.js 中 baseFolder 一致）
const CLOUD_FOLDER = 'niconico-kyoto';

// 支援的圖片副檔名
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);
function isImage(f) {
    return IMAGE_EXTS.has(path.extname(f).toLowerCase());
}

// ─── 讀取 .env 檔案（簡易版，不依賴 dotenv）──────────
function loadEnv() {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        content.split('\n').forEach(function(line) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) return;
            const key = trimmed.slice(0, eqIndex).trim();
            const val = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
            if (!process.env[key]) process.env[key] = val;
        });
        console.log('📁 已讀取 .env 設定檔');
    }
}

// ─── 主程式 ─────────────────────────────────────────
async function main() {
    console.log('');
    console.log('☁️  Cloudinary 批次上傳工具');
    console.log('═'.repeat(50));
    console.log('');

    // 讀取 .env
    loadEnv();

    // 檢查 cloudinary 套件
    let cloudinary;
    try {
        cloudinary = require('cloudinary').v2;
    } catch (e) {
        console.error('❌ 找不到 cloudinary 套件！請先執行：');
        console.error('   npm install cloudinary');
        console.error('');
        process.exit(1);
    }

    // 設定 Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (process.env.CLOUDINARY_URL) {
        // CLOUDINARY_URL 格式會被 SDK 自動解析
        console.log('✓ 使用 CLOUDINARY_URL 環境變數');
    } else if (cloudName && apiKey && apiSecret) {
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true
        });
        console.log('✓ 使用獨立環境變數設定');
    } else {
        console.error('❌ 缺少 Cloudinary 認證資訊！');
        console.error('');
        console.error('   請建立 .env 檔案並填入以下資訊：');
        console.error('   CLOUDINARY_CLOUD_NAME=your_cloud_name');
        console.error('   CLOUDINARY_API_KEY=your_api_key');
        console.error('   CLOUDINARY_API_SECRET=your_api_secret');
        console.error('');
        console.error('   或者設定 CLOUDINARY_URL 環境變數：');
        console.error('   export CLOUDINARY_URL=cloudinary://key:secret@cloud_name');
        console.error('');
        process.exit(1);
    }

    console.log('   Cloud Name:', cloudinary.config().cloud_name);
    console.log('   上傳資料夾:', CLOUD_FOLDER);
    console.log('');

    // 掃描 img/ 資料夾
    if (!fs.existsSync(IMG_DIR)) {
        console.error('❌ 找不到 img/ 資料夾:', IMG_DIR);
        process.exit(1);
    }

    const allImages = fs.readdirSync(IMG_DIR)
        .filter(isImage)
        .sort();

    console.log('🔍 掃描到 ' + allImages.length + ' 張圖片');

    // 讀取上傳記錄
    let uploaded = {};
    if (fs.existsSync(UPLOAD_LOG)) {
        try {
            uploaded = JSON.parse(fs.readFileSync(UPLOAD_LOG, 'utf-8'));
        } catch (e) {
            uploaded = {};
        }
    }

    const forceMode = process.argv.includes('--force');
    if (forceMode) {
        console.log('⚡ 強制模式：所有圖片將重新上傳');
        uploaded = {};
    }

    // 過濾出需要上傳的檔案
    const toUpload = allImages.filter(function(f) {
        if (uploaded[f]) {
            return false;
        }
        return true;
    });

    const skipped = allImages.length - toUpload.length;
    if (skipped > 0) {
        console.log('⏭️  跳過 ' + skipped + ' 張已上傳的圖片');
    }

    if (toUpload.length === 0) {
        console.log('');
        console.log('✅ 所有圖片都已上傳，無需操作！');
        console.log('');
        console.log('💡 若要強制重新上傳：node upload-to-cloudinary.js --force');
        console.log('');
        return;
    }

    console.log('📤 準備上傳 ' + toUpload.length + ' 張圖片...');
    console.log('');

    // 逐一上傳
    let success = 0;
    let failed = 0;
    const errors = [];

    for (let i = 0; i < toUpload.length; i++) {
        const filename = toUpload[i];
        const filePath = path.join(IMG_DIR, filename);
        const publicId = CLOUD_FOLDER + '/' + filename;
        const progress = '[' + (i + 1) + '/' + toUpload.length + ']';

        try {
            process.stdout.write(progress + ' 上傳: ' + filename + '... ');

            const result = await cloudinary.uploader.upload(filePath, {
                public_id: publicId,
                resource_type: 'image',
                overwrite: true,
                invalidate: true,
                // 不要在上傳時做格式轉換，讓 delivery URL 的 f_auto 來處理
                format: null,
                // 保留原始品質
                quality: 'auto:best'
            });

            uploaded[filename] = {
                publicId: result.public_id,
                url: result.secure_url,
                format: result.format,
                width: result.width,
                height: result.height,
                bytes: result.bytes,
                uploadedAt: new Date().toISOString()
            };

            const sizeMB = (result.bytes / 1024 / 1024).toFixed(2);
            console.log('✓ (' + result.width + 'x' + result.height + ', ' + sizeMB + ' MB)');
            success++;

            // 每 10 張存一次記錄（防止中斷遺失進度）
            if (success % 10 === 0) {
                fs.writeFileSync(UPLOAD_LOG, JSON.stringify(uploaded, null, 2), 'utf-8');
            }
        } catch (err) {
            console.log('✗ 失敗');
            errors.push({ file: filename, error: err.message || String(err) });
            failed++;
        }
    }

    // 儲存最終上傳記錄
    fs.writeFileSync(UPLOAD_LOG, JSON.stringify(uploaded, null, 2), 'utf-8');

    // 結果報告
    console.log('');
    console.log('═'.repeat(50));
    console.log('📊 上傳結果：');
    console.log('   ✓ 成功: ' + success + ' 張');
    if (failed > 0) {
        console.log('   ✗ 失敗: ' + failed + ' 張');
    }
    console.log('   ⏭️  跳過: ' + skipped + ' 張（已上傳）');
    console.log('   📁 總計: ' + allImages.length + ' 張');
    console.log('');

    if (errors.length > 0) {
        console.log('⚠️ 失敗的檔案：');
        errors.forEach(function(e) {
            console.log('   ' + e.file + ': ' + e.error);
        });
        console.log('');
    }

    console.log('✅ 上傳完成！');
    console.log('');
    console.log('📝 下一步：');
    console.log('   1. 打開 cloudinary-config.js');
    console.log('   2. 將 cloudName 改為: \'' + (cloudinary.config().cloud_name || 'YOUR_CLOUD_NAME') + '\'');
    console.log('   3. 將 enabled 改為: true');
    console.log('   4. 刷新網頁，所有圖片將從 Cloudinary CDN 載入');
    console.log('');
    console.log('💡 上傳記錄已存至 .cloudinary-uploaded.json');
    console.log('   下次執行時會自動跳過已上傳的圖片');
    console.log('');
}

main().catch(function(err) {
    console.error('❌ 上傳過程發生錯誤:', err);
    process.exit(1);
});
