/**
 * 生成響應式圖片腳本
 * 為每張圖片生成多種尺寸版本（用於 srcset）
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMG_DIR = path.join(__dirname, '../img');
const QUALITY = 92;

// 響應式圖片尺寸配置
const RESPONSIVE_SIZES = {
    small: 400,   // 手機
    medium: 800,  // 平板
    large: 1200,  // 桌面
    xlarge: 1920  // 大螢幕/Retina
};

/**
 * 生成響應式圖片版本
 */
async function generateResponsiveVersions(imagePath) {
    const ext = path.extname(imagePath);
    const baseName = path.basename(imagePath, ext);
    const dir = path.dirname(imagePath);
    
    // 跳過已經處理過的圖片（避免重複處理）
    if (baseName.includes('_small') || baseName.includes('_medium') || 
        baseName.includes('_large') || baseName.includes('_xlarge')) {
        return;
    }
    
    try {
        const metadata = await sharp(imagePath).metadata();
        const originalWidth = metadata.width;
        
        // 只生成比原始圖片小的版本
        for (const [sizeName, maxWidth] of Object.entries(RESPONSIVE_SIZES)) {
            if (maxWidth < originalWidth) {
                const outputPath = path.join(dir, `${baseName}_${sizeName}${ext}`);
                
                await sharp(imagePath)
                    .resize(maxWidth, null, {
                        withoutEnlargement: true,
                        fit: 'inside'
                    })
                    .jpeg({ quality: QUALITY, progressive: true })
                    .toFile(outputPath);
                
                console.log(`✓ 生成 ${sizeName}: ${path.relative(IMG_DIR, outputPath)}`);
            }
        }
    } catch (error) {
        console.error(`✗ 處理失敗: ${path.relative(IMG_DIR, imagePath)}`, error.message);
    }
}

/**
 * 遞迴處理所有圖片
 */
async function processAllImages(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            await processAllImages(filePath);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                await generateResponsiveVersions(filePath);
            }
        }
    }
}

/**
 * 主函數
 */
async function main() {
    console.log('📱 開始生成響應式圖片...\n');
    
    if (!fs.existsSync(IMG_DIR)) {
        console.error('❌ img 目錄不存在！');
        process.exit(1);
    }
    
    await processAllImages(IMG_DIR);
    
    console.log('\n✅ 響應式圖片生成完成！');
}

main().catch(console.error);
