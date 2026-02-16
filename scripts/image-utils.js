/**
 * 圖片工具函數
 * 用於在 JavaScript 中生成響應式圖片標籤
 */

/**
 * 獲取圖片的 WebP 路徑
 */
function getWebPPath(originalPath) {
    const ext = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i;
    return originalPath.replace(ext, '.webp');
}

/**
 * 獲取圖片的 AVIF 路徑
 */
function getAVIFPath(originalPath) {
    const ext = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i;
    return originalPath.replace(ext, '.avif');
}

/**
 * 獲取響應式圖片路徑
 */
function getResponsivePath(originalPath, size) {
    // 在瀏覽器環境中，使用字符串操作
    if (typeof window !== 'undefined') {
        const ext = originalPath.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|webp|avif)$/i)?.[0] || '.jpg';
        const baseName = originalPath.replace(/\.[^/.]+$/, '');
        return `${baseName}_${size}${ext}`;
    }
    // 在 Node.js 環境中
    const path = require('path');
    const ext = path.extname(originalPath);
    const baseName = path.basename(originalPath, ext);
    const dir = path.dirname(originalPath);
    return `${dir}/${baseName}_${size}${ext}`;
}

/**
 * 生成響應式圖片 srcset
 */
function generateSrcSet(originalPath, sizes = ['small', 'medium', 'large', 'xlarge']) {
    const srcset = sizes.map(size => {
        const responsivePath = getResponsivePath(originalPath, size);
        const width = {
            small: 400,
            medium: 800,
            large: 1200,
            xlarge: 1920
        }[size];
        return `${responsivePath} ${width}w`;
    }).join(', ');
    
    return srcset;
}

/**
 * 生成完整的響應式圖片標籤 HTML
 * 支援 WebP/AVIF 優先，回退到原始格式
 */
function generateResponsiveImage(originalPath, alt = '', options = {}) {
    const {
        sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
        className = '',
        style = '',
        loading = 'lazy',
        quality = 92
    } = options;
    
    const webpPath = getWebPPath(originalPath);
    const avifPath = getAVIFPath(originalPath);
    const srcset = generateSrcSet(originalPath);
    const webpSrcset = generateSrcSet(webpPath);
    const avifSrcset = generateSrcSet(avifPath);
    
    return `
        <picture>
            <source type="image/avif" srcset="${avifSrcset}" sizes="${sizes}">
            <source type="image/webp" srcset="${webpSrcset}" sizes="${sizes}">
            <img 
                src="${originalPath}" 
                srcset="${srcset}" 
                sizes="${sizes}"
                alt="${alt}" 
                class="${className}"
                style="${style}"
                loading="${loading}"
            >
        </picture>
    `;
}

/**
 * 生成簡單的響應式圖片（僅 srcset，不包含 picture 標籤）
 */
function generateSimpleResponsiveImage(originalPath, alt = '', options = {}) {
    const {
        sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
        className = '',
        style = '',
        loading = 'lazy'
    } = options;
    
    const srcset = generateSrcSet(originalPath);
    
    return `<img 
        src="${originalPath}" 
        srcset="${srcset}" 
        sizes="${sizes}"
        alt="${alt}" 
        class="${className}"
        style="${style}"
        loading="${loading}"
    >`;
}

// 如果在 Node.js 環境中，導出函數
if (typeof module !== 'undefined' && module.exports) {
    const path = require('path');
    module.exports = {
        getWebPPath,
        getAVIFPath,
        getResponsivePath,
        generateSrcSet,
        generateResponsiveImage,
        generateSimpleResponsiveImage
    };
}

// 如果在瀏覽器環境中，添加到 window 對象
if (typeof window !== 'undefined') {
    window.ImageUtils = {
        getWebPPath,
        getAVIFPath,
        generateSrcSet,
        generateResponsiveImage,
        generateSimpleResponsiveImage
    };
}
