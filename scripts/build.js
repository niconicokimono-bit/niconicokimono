/**
 * 構建腳本
 * 準備部署到 Vercel/Netlify
 */

const fs = require('fs');
const path = require('path');

console.log('🏗️  開始構建專案...\n');

// 確保必要的目錄存在
const dirs = ['img', 'components'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
        console.error(`❌ 目錄不存在: ${dir}`);
        process.exit(1);
    }
});

// 檢查關鍵文件
const files = ['index.html', 'app.js', 'style.css', 'components-loader.js'];
files.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ 文件不存在: ${file}`);
        process.exit(1);
    }
});

console.log('✓ 所有必要文件檢查通過\n');

// 創建 .vercelignore 和 .netlifyignore（如果需要）
const ignoreFiles = [
    { name: '.vercelignore', content: 'node_modules\nscripts\n*.md\n.git' },
    { name: '.netlifyignore', content: 'node_modules\nscripts\n*.md\n.git' }
];

ignoreFiles.forEach(({ name, content }) => {
    const filePath = path.join(__dirname, '..', name);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log(`✓ 已創建 ${name}`);
    }
});

console.log('\n✅ 構建準備完成！');
console.log('\n📦 部署說明：');
console.log('  - Vercel: 直接推送代碼，Vercel 會自動檢測並部署');
console.log('  - Netlify: 設置構建命令為空，發布目錄為根目錄');
console.log('  - 所有靜態資源（img/、components/）會自動包含在部署中');
