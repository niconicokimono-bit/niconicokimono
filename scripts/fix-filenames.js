/**
 * fix-filenames.js
 * 
 * 修正 img/ 資料夾中的問題檔名：
 * 1. 冒號 `:` → 底線 `_`（GitHub Pages 不支援冒號）
 * 2. 空格 → 移除或修正（如 `Gallery_ Premium` → `Gallery_Premium`）
 * 3. 副檔名強制小寫（`.JPG` → `.jpg`）
 * 4. 同步更新 app.js 和 photos.js 中的所有引用
 */

const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '..', 'img');
const APP_JS = path.join(__dirname, '..', 'app.js');
const PHOTOS_JS = path.join(__dirname, '..', 'photos.js');
const BACKUP_DIR = path.join(__dirname, '..', 'img-original');

const DRY_RUN = process.argv.includes('--dry-run');

function sanitizeFilename(name) {
    const ext = path.extname(name);
    const base = name.slice(0, name.length - ext.length);
    
    let newBase = base;
    // Replace colon with underscore
    newBase = newBase.replace(/:/g, '_');
    // Fix "Gallery_ Premium" → "Gallery_Premium" (space after underscore)
    newBase = newBase.replace(/_ /g, '_');
    // Fix "Plan_ Gold" → "Plan_Gold"
    newBase = newBase.replace(/_ /g, '_');
    
    // Force extension to lowercase
    const newExt = ext.toLowerCase();
    
    return newBase + newExt;
}

function main() {
    console.log(DRY_RUN ? '🔍 預覽模式（不會實際修改）\n' : '🔧 開始修正檔名...\n');
    
    const files = fs.readdirSync(IMG_DIR);
    const renameMap = {}; // oldName → newName
    
    // Phase 1: Identify files that need renaming
    for (const file of files) {
        const newName = sanitizeFilename(file);
        if (newName !== file) {
            renameMap[file] = newName;
        }
    }
    
    const total = Object.keys(renameMap).length;
    if (total === 0) {
        console.log('✅ 所有檔名都已正常，不需要修改。');
        return;
    }
    
    console.log(`📋 需要重新命名的檔案: ${total} 個\n`);
    
    // Print rename plan
    let colonCount = 0, spaceCount = 0, extCount = 0;
    for (const [oldName, newName] of Object.entries(renameMap)) {
        const reasons = [];
        if (oldName.includes(':')) { reasons.push('冒號'); colonCount++; }
        if (/_ /.test(oldName) || / /.test(oldName)) { reasons.push('空格'); spaceCount++; }
        const oldExt = path.extname(oldName);
        if (oldExt !== oldExt.toLowerCase()) { reasons.push('大寫副檔名'); extCount++; }
        console.log(`  ${oldName}\n    → ${newName}  [${reasons.join(', ')}]`);
    }
    console.log(`\n統計: 冒號=${colonCount}, 空格=${spaceCount}, 大寫副檔名=${extCount}\n`);
    
    if (DRY_RUN) {
        console.log('預覽結束。移除 --dry-run 以實際執行。');
        return;
    }
    
    // Phase 2: Rename files in img/
    console.log('📁 重新命名檔案...');
    let renamed = 0;
    for (const [oldName, newName] of Object.entries(renameMap)) {
        const oldPath = path.join(IMG_DIR, oldName);
        const newPath = path.join(IMG_DIR, newName);
        
        // Check for collision
        if (fs.existsSync(newPath) && oldName.toLowerCase() !== newName.toLowerCase()) {
            console.log(`  ⚠ 衝突: ${newName} 已存在，跳過 ${oldName}`);
            continue;
        }
        
        // On case-insensitive FS (macOS): rename via temp file
        const tmpPath = path.join(IMG_DIR, `__tmp_rename_${Date.now()}_${Math.random().toString(36).slice(2)}`);
        fs.renameSync(oldPath, tmpPath);
        fs.renameSync(tmpPath, newPath);
        renamed++;
    }
    console.log(`  ✅ 已重命名 ${renamed} 個檔案\n`);
    
    // Also rename in img-original/ if it exists
    if (fs.existsSync(BACKUP_DIR)) {
        console.log('📁 同步更新 img-original/ 備份...');
        const backupFiles = fs.readdirSync(BACKUP_DIR);
        let backupRenamed = 0;
        for (const [oldName, newName] of Object.entries(renameMap)) {
            // Try both exact and case-variant matches
            const matchedFile = backupFiles.find(f => f === oldName || f.toLowerCase() === oldName.toLowerCase());
            if (matchedFile) {
                const oldPath = path.join(BACKUP_DIR, matchedFile);
                const newPath = path.join(BACKUP_DIR, newName);
                const tmpPath = path.join(BACKUP_DIR, `__tmp_rename_${Date.now()}_${Math.random().toString(36).slice(2)}`);
                try {
                    fs.renameSync(oldPath, tmpPath);
                    fs.renameSync(tmpPath, newPath);
                    backupRenamed++;
                } catch (e) {
                    // Silently skip if backup file doesn't exist
                }
            }
        }
        console.log(`  ✅ 已重命名 ${backupRenamed} 個備份檔\n`);
    }
    
    // Phase 3: Update app.js references
    console.log('📝 更新 app.js 引用...');
    let appContent = fs.readFileSync(APP_JS, 'utf-8');
    let appReplacements = 0;
    
    for (const [oldName, newName] of Object.entries(renameMap)) {
        // Replace direct references: img/oldName
        const oldRef = oldName;
        const newRef = newName;
        
        // Also handle URI-encoded versions
        const oldEncoded = encodeURIComponent(oldName);
        const newEncoded = newName; // new names don't need encoding
        
        // Count occurrences first
        let count = 0;
        let pos = 0;
        while ((pos = appContent.indexOf(oldRef, pos)) !== -1) {
            count++;
            pos += oldRef.length;
        }
        
        if (count > 0) {
            appContent = appContent.split(oldRef).join(newRef);
            appReplacements += count;
        }
        
        // Also replace encoded versions
        if (oldEncoded !== oldRef) {
            count = 0;
            pos = 0;
            while ((pos = appContent.indexOf(oldEncoded, pos)) !== -1) {
                count++;
                pos += oldEncoded.length;
            }
            if (count > 0) {
                appContent = appContent.split(oldEncoded).join(newRef);
                appReplacements += count;
            }
        }
    }
    
    fs.writeFileSync(APP_JS, appContent, 'utf-8');
    console.log(`  ✅ 已更新 ${appReplacements} 處引用\n`);
    
    // Phase 4: Update photos.js references
    if (fs.existsSync(PHOTOS_JS)) {
        console.log('📝 更新 photos.js 引用...');
        let photosContent = fs.readFileSync(PHOTOS_JS, 'utf-8');
        let photosReplacements = 0;
        
        for (const [oldName, newName] of Object.entries(renameMap)) {
            let count = 0;
            let pos = 0;
            while ((pos = photosContent.indexOf(oldName, pos)) !== -1) {
                count++;
                pos += oldName.length;
            }
            if (count > 0) {
                photosContent = photosContent.split(oldName).join(newName);
                photosReplacements += count;
            }
        }
        
        fs.writeFileSync(PHOTOS_JS, photosContent, 'utf-8');
        console.log(`  ✅ 已更新 ${photosReplacements} 處引用\n`);
    }
    
    // Phase 5: Final verification
    console.log('🔍 最終驗證...');
    const updatedAppContent = fs.readFileSync(APP_JS, 'utf-8');
    const updatedFiles = new Set(fs.readdirSync(IMG_DIR));
    
    // Check for remaining colons
    const remainingColonFiles = [...updatedFiles].filter(f => f.includes(':'));
    if (remainingColonFiles.length > 0) {
        console.log(`  ⚠ 仍有 ${remainingColonFiles.length} 個含冒號的檔案！`);
        remainingColonFiles.forEach(f => console.log(`    - ${f}`));
    } else {
        console.log('  ✅ img/ 中沒有含冒號的檔案');
    }
    
    // Check for remaining spaces
    const remainingSpaceFiles = [...updatedFiles].filter(f => f.includes(' '));
    if (remainingSpaceFiles.length > 0) {
        console.log(`  ⚠ 仍有 ${remainingSpaceFiles.length} 個含空格的檔案！`);
        remainingSpaceFiles.forEach(f => console.log(`    - ${f}`));
    } else {
        console.log('  ✅ img/ 中沒有含空格的檔案');
    }
    
    // Check for remaining uppercase extensions
    const upperExtFiles = [...updatedFiles].filter(f => /\.(JPG|JPEG|PNG|WEBP|GIF)$/i.test(f) && f !== f.toLowerCase().replace(/^(.*\.)/, (_, p) => p));
    const realUpperExt = [...updatedFiles].filter(f => {
        const ext = path.extname(f);
        return ext !== ext.toLowerCase();
    });
    if (realUpperExt.length > 0) {
        console.log(`  ⚠ 仍有 ${realUpperExt.length} 個大寫副檔名！`);
        realUpperExt.forEach(f => console.log(`    - ${f}`));
    } else {
        console.log('  ✅ 所有副檔名都是小寫');
    }
    
    // Check for colon references in app.js
    const colonRefs = updatedAppContent.match(/img\/[^'")\s]*:[^'")\s]*/g);
    if (colonRefs && colonRefs.length > 0) {
        console.log(`  ⚠ app.js 中仍有 ${colonRefs.length} 處含冒號的引用！`);
        [...new Set(colonRefs)].forEach(r => console.log(`    - ${r}`));
    } else {
        console.log('  ✅ app.js 中沒有含冒號的引用');
    }
    
    // Check broken references
    const imgRegex = /img\/([^'")\s,\\]+(\s[^'")\s,\\]*)*\.(jpg|jpeg|png|webp|gif))/gi;
    let match;
    const checked = new Set();
    const broken = [];
    while ((match = imgRegex.exec(updatedAppContent)) !== null) {
        const filename = match[1];
        if (checked.has(filename)) continue;
        checked.add(filename);
        let decoded;
        try { decoded = decodeURIComponent(filename); } catch(e) { decoded = filename; }
        if (!updatedFiles.has(decoded) && !updatedFiles.has(filename)) {
            broken.push(filename);
        }
    }
    if (broken.length > 0) {
        console.log(`  ⚠ app.js 中有 ${broken.length} 個引用找不到對應檔案：`);
        broken.forEach(f => console.log(`    - ${f}`));
    } else {
        console.log(`  ✅ app.js 中所有 ${checked.size} 個圖片引用都找得到檔案`);
    }
    
    console.log('\n🎉 修正完成！');
}

main();
