/**
 * 圖片格式轉換腳本
 * 將 JPG/PNG 轉換為 WebP 和 AVIF 格式
 * 品質設定為 90 以上以保證高畫質
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMG_DIR = path.join(__dirname, '../img');
const QUALITY = 92; // 高畫質設定

// 支援的原始格式
const SOURCE_FORMATS = ['.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG'];

/**
 * 遞迴讀取目錄中的所有圖片
 */
function getAllImages(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            getAllImages(filePath, fileList);
        } else {
            const ext = path.extname(file);
            if (SOURCE_FORMATS.includes(ext)) {
                fileList.push(filePath);
            }
        }
    });
    
    return fileList;
}

/**
 * 轉換單張圖片為 WebP 和 AVIF
 */
async function convertImage(imagePath) {
    const ext = path.extname(imagePath);
    const baseName = path.basename(imagePath, ext);
    const dir = path.dirname(imagePath);
    
    try {
        // 轉換為 WebP
        const webpPath = path.join(dir, `${baseName}.webp`);
        await sharp(imagePath)
            .webp({ quality: QUALITY, effort: 6 })
            .toFile(webpPath);
        console.log(`✓ 已轉換: ${path.relative(IMG_DIR, webpPath)}`);
        
        // 轉換為 AVIF（如果支援）
        try {
            const avifPath = path.join(dir, `${baseName}.avif`);
            await sharp(imagePath)
                .avif({ quality: QUALITY, effort: 4 })
                .toFile(avifPath);
            console.log(`✓ 已轉換: ${path.relative(IMG_DIR, avifPath)}`);
        } catch (avifError) {
            console.warn(`⚠ AVIF 轉換失敗 (可能不支援): ${path.relative(IMG_DIR, imagePath)}`);
        }
    } catch (error) {
        console.error(`✗ 轉換失敗: ${path.relative(IMG_DIR, imagePath)}`, error.message);
    }
}

/**
 * 主函數
 */
async function main() {
    console.log('🖼️  開始轉換圖片格式...\n');
    
    if (!fs.existsSync(IMG_DIR)) {
        console.error('❌ img 目錄不存在！');
        process.exit(1);
    }
    
    const images = getAllImages(IMG_DIR);
    console.log(`找到 ${images.length} 張圖片\n`);
    
    for (const image of images) {
        await convertImage(image);
    }
    
    console.log(`\n✅ 轉換完成！共處理 ${images.length} 張圖片`);
}

main().catch(console.error);
