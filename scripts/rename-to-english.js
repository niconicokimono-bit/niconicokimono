/**
 * rename-to-english.js
 * 將 img/ 中所有中文檔名重命名為英文，並同步更新所有程式碼引用。
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const IMG_DIR = path.join(__dirname, '..', 'img');
const BACKUP_DIR = path.join(__dirname, '..', 'img-original');
const CODE_FILES = ['app.js', 'style.css', 'photos.js', 'index.html'].map(f => path.join(__dirname, '..', f));
const DRY_RUN = process.argv.includes('--dry-run');

const RENAME_MAP = {
    // --- 封面照 ---
    '封面照1.jpg': 'cover1.jpg',
    '封面照2.jpg': 'cover2.jpg',
    '封面照3.png': 'cover3.png',
    '封面照4.jpg': 'cover4.jpg',
    '封面照5.jpg': 'cover5.jpg',
    '封面照6.jpg': 'cover6.jpg',
    '封面照7.jpg': 'cover7.jpg',
    '封面照8.jpg': 'cover8.jpg',
    '封面照9.jpg': 'cover9.jpg',
    '封面照10.jpg': 'cover10.jpg',

    // --- TOP5 推薦 ---
    'TOP5二尺袖1.jpg': 'top5_nishaku1.jpg',
    'TOP5二尺袖2.jpg': 'top5_nishaku2.jpg',
    'TOP5二尺袖3.jpg': 'top5_nishaku3.jpg',
    'TOP5蕾絲1.jpg': 'top5_lace1.jpg',
    'TOP5蕾絲2.jpg': 'top5_lace2.jpg',
    'TOP5蕾絲3.jpg': 'top5_lace3.jpg',
    'TOP5訪問服1.jpg': 'top5_houmongi1.jpg',
    'TOP5訪問服2.jpg': 'top5_houmongi2.jpg',
    'TOP5訪問服3.jpg': 'top5_houmongi3.jpg',
    'TOP5高定振袖1.jpg': 'top5_luxury_furisode1.jpg',
    'TOP5高定振袖2.jpg': 'top5_luxury_furisode2.jpg',
    'TOP5高定振袖3.jpg': 'top5_luxury_furisode3.jpg',
    'TOP5黑留袖1.jpg': 'top5_kurotomesode1.jpg',
    'TOP5黑留袖2.jpg': 'top5_kurotomesode2.jpg',
    'TOP5黑留袖3.jpg': 'top5_kurotomesode3.jpg',

    // --- 照片庫封面 ---
    '照片庫封面.jpg': 'gallery_cover.jpg',
    '二尺袖_照片庫.jpg': 'gallery_nishaku.jpg',
    '二尺袖_照片庫2.jpg': 'gallery_nishaku2.jpg',
    '小紋_照片庫.jpg': 'gallery_komon.jpg',
    '情侶套餐_照片庫.jpg': 'gallery_couple.jpg',
    '情侶套餐_照片庫2.jpg': 'gallery_couple2.jpg',
    '振袖_照片庫.jpg': 'gallery_furisode.jpg',
    '振袖_照片庫2.jpg': 'gallery_furisode2.jpg',
    '蕾絲_照片庫.jpg': 'gallery_lace.jpg',
    '蕾絲_照片庫2.jpg': 'gallery_lace2.jpg',
    '袴_照片庫.jpg': 'gallery_hakama.jpg',
    '訪問服_照片庫.jpg': 'gallery_houmongi.jpg',
    '訪問服_照片庫2.jpg': 'gallery_houmongi2.jpg',
    '高級小紋_照片庫.jpg': 'gallery_premium_komon.jpg',
    '高級小紋_照片庫2.jpg': 'gallery_premium_komon2.jpg',
    '高級武士服_照片庫.jpg': 'gallery_samurai.jpg',
    '高級武士服_照片庫2.jpg': 'gallery_samurai2.jpg',
    '高級訪問服_照片庫.jpg': 'gallery_premium_houmongi.jpg',
    '高級訪問服_照片庫2.jpg': 'gallery_premium_houmongi2.jpg',
    '黑留袖_照片庫.jpg': 'gallery_kurotomesode.jpg',
    '黑留袖_照片庫2.jpg': 'gallery_kurotomesode2.jpg',

    // --- 和服方案配件 ---
    '和服方案_內搭.png': 'plan_innerwear.png',
    '和服方案_分趾襪.png': 'plan_tabi.png',
    '和服方案_包包.png': 'plan_bag.png',
    '和服方案_木屐.png': 'plan_geta.png',
    '和服方案_腰帶.png': 'plan_obi.png',
    '和服方案_長乳半.png': 'plan_nagajuban.png',
    '和服方案_髮型.png': 'plan_hairstyle.png',
    '和服方案_髮飾.png': 'plan_hair_accessory.png',

    // --- 免費髮型 ---
    '免費髮型_丸子造型.jpg': 'hairstyle_bun.jpg',
    '免費髮型_假髮造型.jpg': 'hairstyle_wig.jpg',
    '免費髮型_日系低盤.jpg': 'hairstyle_low_updo.jpg',
    '免費髮型_日系盤髮.jpg': 'hairstyle_updo.jpg',
    '免費髮型_日系盤髮2.jpg': 'hairstyle_updo2.jpg',
    '免費髮型_日系馬尾.jpg': 'hairstyle_ponytail.jpg',
    '免費髮型_短髮盤髮.jpg': 'hairstyle_short_updo.jpg',
    '免費髮型_雙馬尾造型.jpg': 'hairstyle_twin_tails.jpg',

    // --- 收費髮型 ---
    '收費髮型1.jpg': 'premium_hairstyle1.jpg',
    '收費髮型2.jpg': 'premium_hairstyle2.jpg',
    '收費髮型3.jpg': 'premium_hairstyle3.jpg',
    '髮型設計封面.jpg': 'hairstyle_cover.jpg',

    // --- 茶室體驗 ---
    '茶室1.jpg': 'tearoom1.jpg',
    '茶室體驗.jpg': 'tearoom_experience.jpg',
    '茶室體驗1.jpg': 'tearoom_experience1.jpg',
    '茶室體驗2.jpg': 'tearoom_experience2.jpg',
    '茶室體驗3.jpg': 'tearoom_experience3.jpg',
    '茶室體驗4.jpg': 'tearoom_experience4.jpg',
    '茶室體驗5.jpg': 'tearoom_experience5.jpg',
    '茶室體驗5.png': 'tearoom_experience5.png',
    '茶室體驗封面.jpg': 'tearoom_cover.jpg',
    '茶室體驗封面2.jpg': 'tearoom_cover2.jpg',
    '抹茶體驗.jpg': 'matcha_experience.jpg',
    '和服抹茶體驗.jpg': 'kimono_matcha.jpg',

    // --- 攝影 ---
    '攝影封.jpg': 'photo_cover_small.jpg',
    '攝影封面.jpg': 'photo_cover.jpg',
    '攝影方案封面.jpg': 'photo_plan_cover.jpg',
    '攝影方案封面1.jpg': 'photo_plan_cover1.jpg',
    '攝影方案封面2.jpg': 'photo_plan_cover2.jpg',
    '攝影底下輪播1.jpg': 'photo_carousel1.jpg',
    '攝影底下輪播2.jpg': 'photo_carousel2.jpg',
    '攝影底下輪播3.jpg': 'photo_carousel3.jpg',
    '攝影底下輪播4.jpg': 'photo_carousel4.jpg',
    '攝影底下輪播5.jpg': 'photo_carousel5.jpg',
    '攝影底下輪播6.jpg': 'photo_carousel6.jpg',
    '攝影底下輪播7.jpg': 'photo_carousel7.jpg',
    '攝影底下輪播8.jpg': 'photo_carousel8.jpg',

    // --- 情侶套餐 ---
    '情侶套餐1.jpg': 'couple1.jpg',
    '情侶套餐2.jpg': 'couple2.jpg',
    '情侶套餐3.jpg': 'couple3.jpg',
    '情侶套餐4.jpg': 'couple4.jpg',

    // --- 高級武士服 ---
    '高級武士服1.jpg': 'samurai1.jpg',
    '高級武士服2.jpg': 'samurai2.jpg',
    '高級武士服3.jpg': 'samurai3.jpg',
    '高級武士服4.jpg': 'samurai4.jpg',
    '高級武士服5.jpg': 'samurai5.jpg',

    // --- 高級訪問服 ---
    '高級訪問服1.jpg': 'premium_houmongi1.jpg',
    '高級訪問服2.jpg': 'premium_houmongi2.jpg',
    '高級訪問服3.jpg': 'premium_houmongi3.jpg',
    '高級訪問服4.jpg': 'premium_houmongi4.jpg',
    '高級訪問服5.jpg': 'premium_houmongi5.jpg',
    '米高級訪問服1.jpg': 'beige_premium_houmongi1.jpg',
    '米高級訪問服2.jpg': 'beige_premium_houmongi2.jpg',
    '米高級訪問服3.jpg': 'beige_premium_houmongi3.jpg',
    '米高級訪問服5.jpg': 'beige_premium_houmongi5.jpg',
    '米高級訪問服6.jpg': 'beige_premium_houmongi6.jpg',

    // --- 振袖 ---
    '白精品振袖1.jpg': 'white_standard_furisode1.jpg',
    '白精品振袖2.jpg': 'white_standard_furisode2.jpg',
    '白精品振袖3.jpg': 'white_standard_furisode3.jpg',
    '白金振袖1.jpg': 'white_gold_furisode1.jpg',
    '白金振袖2.jpg': 'white_gold_furisode2.jpg',
    '白金振袖3.jpg': 'white_gold_furisode3.jpg',
    '白金振袖4.jpg': 'white_gold_furisode4.jpg',
    '紫高訂振袖2.jpg': 'purple_luxury_furisode2.jpg',
    '紫高訂振袖3.jpg': 'purple_luxury_furisode3.jpg',
    '紫高訂振袖4.jpg': 'purple_luxury_furisode4.jpg',
    '紫高訂振袖5.jpg': 'purple_luxury_furisode5.jpg',
    '紫高訂振袖6.jpg': 'purple_luxury_furisode6.jpg',
    '紫高訂振袖7.jpg': 'purple_luxury_furisode7.jpg',
    '紫高訂振袖8.jpg': 'purple_luxury_furisode8.jpg',
    '綠振袖1.jpg': 'green_furisode1.jpg',
    '綠振袖3.jpg': 'green_furisode3.jpg',
    '綠振袖4.jpg': 'green_furisode4.jpg',
    '綠振袖6.jpg': 'green_furisode6.jpg',

    // --- 蕾絲 ---
    '白蕾絲1.jpg': 'white_lace1.jpg',
    '白蕾絲2.jpg': 'white_lace2.jpg',
    '白蕾絲3.jpg': 'white_lace3.jpg',
    '白蕾絲4.jpg': 'white_lace4.jpg',
    '白蕾絲5.jpg': 'white_lace5.jpg',
    '白蕾絲6.jpg': 'white_lace6.jpg',
    '白蕾絲7.jpg': 'white_lace7.jpg',

    // --- 二尺袖 ---
    '粉二尺袖2.jpg': 'pink_nishaku2.jpg',
    '粉二尺袖3.jpg': 'pink_nishaku3.jpg',
    '粉二尺袖4.jpg': 'pink_nishaku4.jpg',
    '粉二尺袖5.jpg': 'pink_nishaku5.jpg',
    '藍二尺袖1.jpg': 'blue_nishaku1.jpg',
    '藍二尺袖2.jpg': 'blue_nishaku2.jpg',
    '藍二尺袖3.jpg': 'blue_nishaku3.jpg',
    '藍二尺袖4.jpg': 'blue_nishaku4.jpg',

    // --- 店舖 / 雜項 ---
    '介紹.jpg': 'intro.jpg',
    '和服手部特寫.png': 'kimono_hand_closeup.png',
    '寬敞明亮接待區.jpg': 'reception_area.jpg',
    '服務親切.jpg': 'friendly_service.jpg',
    '店內10.jpg': 'shop_interior10.jpg',
    '近景1.jpg': 'closeup1.jpg',
    '近景2.jpg': 'closeup2.jpg',
    '近景3.jpg': 'closeup3.jpg',
};

function main() {
    // Validate all files exist
    const imgFiles = new Set(fs.readdirSync(IMG_DIR));
    const missing = Object.keys(RENAME_MAP).filter(f => !imgFiles.has(f));
    if (missing.length > 0) {
        console.log('⚠ 以下檔案在 img/ 中找不到:');
        missing.forEach(f => console.log('  - ' + f));
    }

    // Check for unmapped Chinese files
    const mapped = new Set(Object.keys(RENAME_MAP));
    const unmapped = [...imgFiles].filter(f => /[^\x00-\x7F]/.test(f) && !mapped.has(f));
    if (unmapped.length > 0) {
        console.log('⚠ 以下中文檔案未在映射表中:');
        unmapped.forEach(f => console.log('  - ' + f));
        console.log('請先將這些加入 RENAME_MAP 再執行。');
        if (!DRY_RUN) process.exit(1);
    }

    // Check for collision
    const newNames = new Set();
    for (const [old, nw] of Object.entries(RENAME_MAP)) {
        if (newNames.has(nw)) { console.error('衝突: ' + nw); process.exit(1); }
        if (imgFiles.has(nw) && !mapped.has(nw)) { console.error('衝突: ' + nw + ' 已存在'); process.exit(1); }
        newNames.add(nw);
    }

    const total = Object.keys(RENAME_MAP).length - missing.length;
    console.log(`\n📋 將重命名 ${total} 個檔案\n`);

    if (DRY_RUN) {
        Object.entries(RENAME_MAP).forEach(([o, n]) => {
            if (imgFiles.has(o)) console.log(`  ${o} → ${n}`);
        });
        console.log('\n預覽完成。移除 --dry-run 以執行。');
        return;
    }

    // Phase 1: git mv files
    console.log('📁 重命名 img/ 檔案 (git mv)...');
    let renamed = 0;
    for (const [oldName, newName] of Object.entries(RENAME_MAP)) {
        if (!imgFiles.has(oldName)) continue;
        try {
            const oldPath = `img/${oldName}`;
            const tmpPath = `img/__tmp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
            const newPath = `img/${newName}`;
            execSync(`git mv "${oldPath}" "${tmpPath}"`, { stdio: 'pipe' });
            execSync(`git mv "${tmpPath}" "${newPath}"`, { stdio: 'pipe' });
            renamed++;
        } catch (e) {
            console.log(`  ✗ ${oldName}: ${e.message.split('\n')[0]}`);
        }
    }
    console.log(`  ✅ git mv ${renamed} 個檔案\n`);

    // Phase 2: Rename in img-original/
    if (fs.existsSync(BACKUP_DIR)) {
        console.log('📁 同步 img-original/...');
        const backupFiles = new Set(fs.readdirSync(BACKUP_DIR));
        let br = 0;
        for (const [oldName, newName] of Object.entries(RENAME_MAP)) {
            // Try both original case and current case
            const candidates = [oldName, oldName.replace(/\.jpg$/, '.JPG').replace(/\.png$/, '.PNG')];
            for (const candidate of candidates) {
                if (backupFiles.has(candidate)) {
                    const oldPath = path.join(BACKUP_DIR, candidate);
                    const newPath = path.join(BACKUP_DIR, newName);
                    const tmpPath = path.join(BACKUP_DIR, `__tmp_${Date.now()}_${Math.random().toString(36).slice(2)}`);
                    try {
                        fs.renameSync(oldPath, tmpPath);
                        fs.renameSync(tmpPath, newPath);
                        br++;
                    } catch(e) {}
                    break;
                }
            }
        }
        console.log(`  ✅ ${br} 個備份\n`);
    }

    // Phase 3: Update code references
    console.log('📝 更新程式碼引用...');
    for (const codePath of CODE_FILES) {
        if (!fs.existsSync(codePath)) continue;
        let content = fs.readFileSync(codePath, 'utf-8');
        let count = 0;
        for (const [oldName, newName] of Object.entries(RENAME_MAP)) {
            // Replace both direct and URI-encoded references
            const variants = [oldName, encodeURIComponent(oldName)];
            for (const variant of variants) {
                if (content.includes(variant)) {
                    const before = content;
                    content = content.split(variant).join(newName);
                    count += (before.length - content.length) / (variant.length - newName.length) || 1;
                }
            }
        }
        if (count > 0) {
            fs.writeFileSync(codePath, content, 'utf-8');
            console.log(`  ${path.basename(codePath)}: ~${Math.round(count)} 處`);
        }
    }

    // Phase 4: Verify
    console.log('\n🔍 驗證...');
    const updatedFiles = new Set(fs.readdirSync(IMG_DIR));
    const remainingChinese = [...updatedFiles].filter(f => /[^\x00-\x7F]/.test(f));
    console.log(`  img/ 中剩餘中文檔名: ${remainingChinese.length}`);
    if (remainingChinese.length > 0) {
        remainingChinese.forEach(f => console.log(`    - ${f}`));
    }

    console.log('\n🎉 完成！');
}

main();
