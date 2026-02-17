        // ╔══════════════════════════════════════════════════════════════╗
        // ║         📸 照片更新指南（Gallery + Plan 自動同步系統）         ║
        // ╠══════════════════════════════════════════════════════════════╣
        // ║                                                              ║
        // ║  ✅ 新增照片只需 2 步：                                       ║
        // ║     1. 將照片丟入 img/ 資料夾                                 ║
        // ║     2. 在終端機執行：node update-photos.js                     ║
        // ║        → photos.js 自動更新，刷新網頁即可看到新照片            ║
        // ║                                                              ║
        // ║  📋 兩種照片類型（歸類位置不同！）：                           ║
        // ║                                                              ║
        // ║  ① 型錄照（Plan）→ 和服方案 → 套餐詳情的「款式型錄」         ║
        // ║     格式：Plan_方案_顏色.jpg                                   ║
        // ║     範例：Plan_Lace_white.jpg                                  ║
        // ║     歸屬：首頁「和服方案」點進套餐後看到的款式照片             ║
        // ║                                                              ║
        // ║  ② 實穿照（Gallery）→ 照片庫 → 依日期分組的相簿              ║
        // ║     格式：Gallery_方案_YYMMDD_顏色.jpg                        ║
        // ║     範例：Gallery_Komon_250216_white1.jpg                     ║
        // ║     歸屬：「照片庫」分頁中的實際穿著效果                       ║
        // ║                                                              ║
        // ║  ⚠️ Plan_ 只出現在套餐詳情，Gallery_ 只出現在照片庫！         ║
        // ║                                                              ║
        // ║  🗂️ 方案對應表（Gallery / Plan 共用）：                        ║
        // ║     Komon              → 小紋套餐                             ║
        // ║     Premium_Komon      → 高級小紋套餐                         ║
        // ║     Lace               → 蕾絲套餐                             ║
        // ║     Nishaku_Sode       → 二尺袖套餐                           ║
        // ║     Houmongi           → 訪問服 ¥11,000                       ║
        // ║     Premium_Houmongi   → 高級訪問服 ¥16,500                   ║
        // ║     Kuro_Tomesode      → 黑留袖套餐                           ║
        // ║     Hakama             → 袴套餐                               ║
        // ║     Standard_Furisode  → 精品振袖 ¥9,900                      ║
        // ║     Gold_Furisode      → 金絲振袖 ¥16,500                     ║
        // ║     Luxury_Furisode    → 高訂振袖 ¥27,500                     ║
        // ║     Mens_Kimono        → 男士和服套餐                         ║
        // ║     Mens_Samurai       → 高級武士服套餐                       ║
        // ║     Couple             → 情侶套餐                             ║
        // ║     Kids               → 小孩和服套餐                         ║
        // ║                                                              ║
        // ║  🎨 顏色關鍵字：                                              ║
        // ║     白:white 米:beige 紅:red 橘:orange 黃:yellow              ║
        // ║     綠:green 藍:blue 紫:purple 粉:pink 黑:black              ║
        // ║     （不符合以上的自動歸類為「其他」）                          ║
        // ║                                                              ║
        // ╚══════════════════════════════════════════════════════════════╝

        // ====================================================
        // 多語系翻譯系統 (i18n)
        // ====================================================
        let currentLang = localStorage.getItem('lang') || 'zh-TW';
        let translations = {};

        // 載入翻譯檔
        async function loadTranslations() {
            try {
                const res = await fetch('languages.json');
                translations = await res.json();
                console.log('✓ 翻譯檔載入完成，共', Object.keys(translations).length, '筆');
            } catch (e) {
                console.warn('⚠️ 翻譯檔載入失敗:', e);
                translations = {};
            }
        }

        // 翻譯函數（支援 zh-TW / ja / en 三語系）
        function t(text) {
            if (currentLang === 'zh-TW') return text;
            const entry = translations[text];
            if (entry && entry[currentLang]) {
                return entry[currentLang];
            }
            return text;
        }

        // 切換語言（支援 zh-TW / ja / en）
        function switchLanguage(lang) {
            currentLang = lang;
            localStorage.setItem('lang', lang);
            // 更新 HTML lang 屬性
            const langMap = { 'ja': 'ja', 'en': 'en', 'zh-TW': 'zh-TW' };
            document.documentElement.lang = langMap[lang] || 'zh-TW';
            // 設定 body data-lang 供 CSS 字體切換
            document.body.dataset.lang = lang;
            // 動態更新 SEO 標題與描述
            const seoData = {
                'zh-TW': { title: 'NicoNico Kimono | 京都和服租借：免費髮型設計，近清水寺、八阪神社', desc: '京都 NicoNico 和服租借，步行至清水寺、八阪神社僅需數分鐘。我們提供全套餐包含【免費專業髮型設計】、多樣化蕾絲和服與振袖，並提供專業攝影方案。讓您的京都散策從精緻造型開始！' },
                'ja': { title: 'NicoNico Kimono | 京都着物レンタル：無料ヘアセット付き、清水寺・八坂神社近く', desc: '京都の着物レンタル専門店 NicoNico Kimono。清水寺・八坂神社まで徒歩数分。全プラン【無料プロヘアセット付き】、レース着物・振袖など多彩なプランをご用意。プロ撮影プランも。ご予約はこちら。' },
                'en': { title: 'NicoNico Kimono | Kyoto Kimono Rental: Free Hair Styling, Near Kiyomizu-dera & Yasaka Shrine', desc: 'NicoNico Kimono rental in Kyoto, just minutes walk to Kiyomizu-dera & Yasaka Shrine. All plans include FREE professional hair styling. Lace kimono, furisode & more. Professional photography plans available. Start your Kyoto stroll in style!' }
            };
            const seo = seoData[lang] || seoData['zh-TW'];
            document.title = seo.title;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', seo.desc);
            // 更新語言切換按鈕狀態
            updateLangToggleUI();
            // 更新手機版預約按鈕文字
            const mobileBookingText = document.getElementById('mobile-booking-text');
            if (mobileBookingText) mobileBookingText.textContent = t('點 我 預 約');
            // 翻譯靜態 HTML 組件
            translateStaticComponents();
            // 標記為語系切換中（避免 render 函數滾動到頂部）
            window._isLanguageSwitching = true;
            // 重新渲染當前頁面（使用全域暴露的 handleRoute）
            if (typeof window.handleRoute === 'function') {
                window.handleRoute();
            }
            // 重新初始化滾動淡入效果
            if (typeof window.initScrollFadeIn === 'function') {
                window.initScrollFadeIn();
            }
            // 重置旗標
            window._isLanguageSwitching = false;
        }

        // 更新語言切換按鈕 UI（懸浮下拉選單）
        function updateLangToggleUI() {
            // 更新下拉選單中的 active 狀態
            document.querySelectorAll('.floating-lang-option').forEach(btn => {
                if (btn.dataset.lang === currentLang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            // 更新顯示的語言標籤
            const label = document.getElementById('floating-lang-label');
            if (label) {
                const labelMap = { 'zh-TW': '中文', 'ja': '日本語', 'en': 'EN' };
                label.textContent = labelMap[currentLang] || '中文';
            }
            // 設定 body data-lang
            if (document.body) {
                document.body.dataset.lang = currentLang;
            }
        }

        // 翻譯靜態 HTML 組件（navbar, booking-form, fixed-widgets）
        function translateStaticComponents() {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (key) {
                    el.textContent = t(key);
                }
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (key) {
                    el.setAttribute('placeholder', t(key));
                }
            });
        }

        // 預先載入翻譯檔（保存 Promise 以便確保翻譯就緒後再初始化）
        const translationsReady = loadTranslations();

        // ====================================================
        // Cloudinary 雲端圖床系統 + 響應式圖片優化
        // ====================================================
        
        const _cloudCfg = window.CLOUDINARY_CONFIG || {};

        /**
         * 檢查 Cloudinary 是否已啟用
         */
        function isCloudinaryEnabled() {
            return !!(_cloudCfg.enabled && _cloudCfg.cloudName && _cloudCfg.cloudName !== 'YOUR_CLOUD_NAME');
        }

        /**
         * 將本地 img/ 路徑轉為 Cloudinary CDN URL
         * 當 Cloudinary 未啟用時，原樣回傳本地路徑
         *
         * @param {string} localPath - 本地路徑（如 'img/cover1.jpg'）
         * @param {object} opts
         * @param {number} opts.width   - 指定寬度（px）
         * @param {number} opts.height  - 指定高度（px）
         * @param {string} opts.crop    - 裁切模式：fill / limit / scale / fit
         * @param {string} opts.gravity - 重力方向：auto / face / center
         * @param {string} opts.quality - 品質：auto / auto:best / auto:good / 80
         * @returns {string}
         */
        function cloudImg(localPath, opts) {
            if (!isCloudinaryEnabled()) return localPath;
            opts = opts || {};

            // 解碼可能被 encodeURIComponent 編碼過的路徑
            var decoded;
            try { decoded = decodeURIComponent(localPath); } catch(e) { decoded = localPath; }

            // 將 'img/filename.ext' → '{baseFolder}/filename.ext'
            var folder = _cloudCfg.baseFolder || '';
            var publicId = decoded.replace(/^img\//, folder ? folder + '/' : '');

            // 組合 Cloudinary 轉換參數
            var transforms = [
                'f_' + (_cloudCfg.defaultFormat || 'auto'),
                'q_' + (opts.quality || _cloudCfg.defaultQuality || 'auto')
            ];
            if (opts.width)   transforms.push('w_' + opts.width);
            if (opts.height)  transforms.push('h_' + opts.height);
            if (opts.crop)    transforms.push('c_' + opts.crop);
            if (opts.gravity) transforms.push('g_' + opts.gravity);

            return 'https://res.cloudinary.com/' + _cloudCfg.cloudName
                 + '/image/upload/' + transforms.join(',')
                 + '/' + encodeURI(publicId);
        }

        /**
         * 生成 Cloudinary 響應式 srcset 字串
         * 未啟用時回傳空字串
         */
        function cloudSrcSet(localPath, widths) {
            if (!isCloudinaryEnabled()) return '';
            widths = widths || _cloudCfg.breakpoints || [400, 800, 1200, 1920];
            return widths.map(function(w) {
                return cloudImg(localPath, { width: w, crop: 'limit' }) + ' ' + w + 'w';
            }).join(', ');
        }
        
        /**
         * 頁面渲染後自動攔截所有 <img src="img/..."> 並轉為 Cloudinary URL
         * 透過 MutationObserver 實現，無需手動修改每個 img 標籤
         */
        var _cloudObserver = null;

        function _processImgElement(img) {
            if (!img || img.dataset.cloudified) return;

            var src = img.getAttribute('src');
            if (src && (src.startsWith('img/') || src.startsWith('img%2F'))) {
                var decoded;
                try { decoded = decodeURIComponent(src); } catch(e) { decoded = src; }
                var srcset = cloudSrcSet(decoded);
                if (srcset) img.srcset = srcset;
                img.sizes = img.sizes || _cloudCfg.defaultSizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
                img.src = cloudImg(decoded, { width: 800, crop: 'limit' });
                img.dataset.cloudified = 'true';
            }

            // 處理 onmouseover / onmouseout 中的 img/ 路徑
            ['onmouseover', 'onmouseout'].forEach(function(attr) {
                var val = img.getAttribute(attr);
                if (val && val.indexOf("img/") !== -1) {
                    var fixed = val.replace(/this\.src='(img\/[^']+)'/g, function(match, path) {
                        var d;
                        try { d = decodeURIComponent(path); } catch(e) { d = path; }
                        return "this.src='" + cloudImg(d, { width: 800, crop: 'limit' }) + "'";
                    });
                    img.setAttribute(attr, fixed);
                }
            });
        }

        function cloudifyAllImages() {
            if (!isCloudinaryEnabled()) return;
            document.querySelectorAll('img').forEach(_processImgElement);
        }

        function _initCloudinaryObserver() {
            if (!isCloudinaryEnabled() || _cloudObserver) return;

            _cloudObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType !== 1) return;
                        if (node.tagName === 'IMG') {
                            _processImgElement(node);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll('img').forEach(_processImgElement);
                        }
                    });
                });
            });
            _cloudObserver.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true
            });
            console.log('☁️ Cloudinary MutationObserver 已啟動');
        }
        
        // ====================================================
        // 應用程式初始化函數
        // 此函數將在組件完全加載後被調用
        // ====================================================
        function initApp() {
            console.log('🚀 開始初始化應用程式...');

        // ----------------------------------------------------
        // 1. 方案資料定義 (已更新為和服內容)
        // ----------------------------------------------------
        const kimonoPlans = [
            // --- 女士方案 (已排序) ---
            {
                id: 'plan1',
                name: '【女士】小紋套餐',
                shortDesc: '⋈*｡ 價格含腰帶、髮型、草履、手提包',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">以細緻優雅的「全面花紋」為特色，適合各種場合。</p>
                    
                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁小紋 ¥5,500 一套</li>
                        <li>⌁半幅腰帶 / 兵兒帶</li>
                        <li>⌁免費髮型 / 髮飾</li>
                        <li>⌁內搭、分趾襪、草履、日式提包</li>
                        <li>⌁可免費租借拍攝道具（雨傘、扇子）</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                    </div>
                `,
                image: 'img/cover3.jpg',
                price: '¥5,500（含稅）',
                photos: [
                    'img/cover1.jpg',
                    'img/cover2.jpg',
                    'img/cover4.jpg'
                ]
            },
            /* { // 浴衣 - 已註解
                id: 'plan9',
                name: '【女士】浴衣套餐（6月-9月）',
                shortDesc: '⋈*｡ 價格含腰帶、髮型、草履、手提包',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">夏季限定（6月至9月）！浴衣材質輕薄涼爽，花色繽紛，是參加夏日祭典與觀賞煙火的最佳選擇。</p>
                    
                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁浴衣一套</li>
                        <li>⌁肌襦袢（內襯衣）</li>
                        <li>⌁精美髮型</li>
                        <li>⌁草履、手提包</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                    </div>
                `,
                image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'%3E%3Cdefs%3E%3ClinearGradient id='bg6' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ecfeff'/%3E%3Cstop offset='100%25' style='stop-color:%2367e8f9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='450' fill='url(%23bg6)'/%3E%3Ctext x='300' y='170' text-anchor='middle' font-size='70'%3E🌺%3C/text%3E%3Ctext x='300' y='255' text-anchor='middle' fill='%230891b2' font-size='28' font-weight='600'%3E請稍候～%3C/text%3E%3Ctext x='300' y='300' text-anchor='middle' fill='%230891b2' font-size='24' font-weight='500'%3E馬上就要上傳照片了！%3C/text%3E%3C/svg%3E",
                price: '¥5,500（含稅）',
                photos: []
            },
            */
            {
                id: 'plan2',
                name: '【女士】高級小紋套餐',
                shortDesc: '⋈*｡ 價格含腰帶、髮型、草履、手提包',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">材質與設計更高級的小紋和服，適合追求更高質感與獨特花紋的您。</p>
                    
                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁高級小紋 ¥7,700 一套</li>
                        <li>⌁半幅腰帶 / 兵兒帶</li>
                        <li>⌁免費髮型 / 髮飾</li>
                        <li>⌁內搭、分趾襪、草履、日式提包</li>
                        <li>⌁可免費租借拍攝道具（雨傘、扇子）</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                    </div>
                `,
                image: 'img/cover5.jpg',
                price: '¥7,700（含稅）',
                photos: [
                    'img/cover6.jpg',
                    'img/cover7.jpg'
                ]
            },
            {
                id: 'plan3',
                name: '【女士】蕾絲套餐',
                shortDesc: '⋈*｡ 價格含腰帶、髮型、草履、手提包',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">近年來人氣爆棚的款式！結合日式傳統與西方蕾絲元素，打造獨一無二的甜美或復古風格。</p>
                    
                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁蕾絲 ¥7,700 一套</li>
                        <li>⌁半幅腰帶 / 兵兒帶</li>
                        <li>⌁免費髮型 / 髮飾</li>
                        <li>⌁內搭、分趾襪、草履、日式提包</li>
                        <li>⌁可免費租借拍攝道具（雨傘、扇子）</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                    </div>
                `,
                image: 'img/white_lace3.jpg',
                price: '¥7,700（含稅）',
                photos: [
                    'img/gallery_lace2.jpg',
                    'img/white_lace3.jpg',
                    'img/white_lace4.jpg',
                    'img/white_lace5.jpg'
                ]
            },
            {
                id: 'plan4',
                name: '【女士】二尺袖套餐',
                shortDesc: '⋈*｡ 價格含腰帶、髮型、草履、手提包',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">「二尺袖」是充滿活力的「中袖長」款式。花紋通常色彩鮮明、圖案大方，推薦給喜歡鮮豔色彩的您。</p>
                    
                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁二尺袖 ¥8,800 一套</li>
                        <li>⌁半幅腰帶</li>
                        <li>⌁免費髮型 / 髮飾</li>
                        <li>⌁內搭、分趾襪、草履、日式提包</li>
                        <li>⌁可免費租借拍攝道具（雨傘、扇子）</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                    </div>
                `,
                image: 'img/pink_nishaku3.jpg',
                price: '¥8,800（含稅）',
                photos: [
                    'img/pink_nishaku4.jpg',
                    'img/pink_nishaku5.jpg'
                ]
            },
            {
                id: 'plan5',
                name: '【女士】訪問服套餐',
                shortDesc: '⋈*｡ 價格含腰帶、髮型、草履、手提包',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">「訪問服」是高雅的準禮服，不論已婚或未婚皆可穿著。適合參加朋友婚宴、派對、茶會等正式場合。本套餐包含一般訪問服與高級訪問服，使用頂級絲綢與手工刺繡的高級訪問服，無論是布料、染色或圖案，皆為上乘之選，適合最重要的時刻。</p>
                    
                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁訪問服 ¥11,000~¥16,500 一套</li>
                        <li>⌁名古屋帶 / 二重太鼓帶</li>
                        <li>⌁免費髮型 / 髮飾</li>
                        <li>⌁內搭、分趾襪、草履、日式提包</li>
                        <li>⌁可免費租借拍攝道具（雨傘、扇子）</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                        
                        <!-- 相簿封面 -->
                        <div class="mt-6 not-prose flex gap-4 flex-wrap">
                            <div class="gallery-cover inline-block rounded-lg overflow-hidden shadow-md cursor-pointer" style="width: 300px; height: 400px;" onclick="openLightbox(['img/beige_premium_houmongi1.jpg', 'img/beige_premium_houmongi2.jpg', 'img/beige_premium_houmongi3.jpg', 'img/beige_premium_houmongi5.jpg', 'img/beige_premium_houmongi6.jpg'], 0)">
                                <img src="img/beige_premium_houmongi1.jpg" alt="高級訪問服相簿" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://placehold.co/300x400/6b21a8/ffffff?text=高級訪問服'">
                            </div>
                            <div class="gallery-cover inline-block rounded-lg overflow-hidden shadow-md cursor-pointer" style="width: 300px; height: 400px;" onclick="openLightbox(['img/cover8.jpg', 'img/premium_houmongi2.jpg', 'img/premium_houmongi3.jpg', 'img/premium_houmongi4.jpg', 'img/cover9.jpg'], 0)">
                                <img src="img/cover8.jpg" alt="高級訪問服相簿" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://placehold.co/300x400/6b21a8/ffffff?text=高級訪問服'">
                            </div>
                        </div>
                    </div>
                `,
                image: 'img/cover8.jpg',
                price: '¥11,000~16,500（含稅）',
                photos: [
                    'img/premium_houmongi2.jpg',
                    'img/premium_houmongi3.jpg',
                    'img/premium_houmongi4.jpg',
                    'img/cover9.jpg'
                ]
            },
            {
                id: 'plan7',
                name: '【女士】黑留袖套餐',
                shortDesc: '⋈*｡ 價格含腰帶、髮型、草履、手提包',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">「黑留袖」是已婚女士的第一禮服，通常在婚禮等最莊重的场合穿著。圖案集中在下擺，展現極致的格調與品味。</p>
                    
                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁黑留袖 ¥11,000 一套</li>
                        <li>⌁名古屋帶 / 二重太鼓帶</li>
                        <li>⌁免費髮型 / 髮飾</li>
                        <li>⌁內搭、分趾襪、草履、日式提包</li>
                        <li>⌁可免費租借拍攝道具（雨傘、扇子）</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                    </div>
                `,
                image: 'img/kimi5.jpg',
                price: '¥11,000（含稅）',
                photos: [
                    'img/kimi2.jpg',
                    'img/kimi7.jpg'
                ]
            },
            /* { // 高級訪問服 - 已註解
                id: 'plan6',
                name: '【女士】高級訪問服套餐',
                // ... content ...
            }, */
            {
                id: 'plan13',
                name: '【女士】袴套餐',
                shortDesc: '⋈*｡ 價格含腰帶、髮型、草履、手提包',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">「袴」是日本傳統的褲裙式服裝，結合和服上衣與袴褲，展現優雅而現代的日式風格。適合畢業典禮、成人式或特殊場合穿著，既傳統又時尚。</p>
                    
                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁袴+和服 ¥11,000~30,000 一套</li>
                        <li>⌁半幅帶</li>
                        <li>⌁免費髮型 / 髮飾</li>
                        <li>⌁內搭、分趾襪、草履、日式提包</li>
                        <li>⌁可免費租借拍攝道具（雨傘、扇子）</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                    </div>
                `,
                image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23fdf2f8'/%3E%3Cstop offset='50%25' style='stop-color:%23fce7f3'/%3E%3Cstop offset='100%25' style='stop-color:%23fbcfe8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='450' fill='url(%23bg)'/%3E%3Ctext x='300' y='170' text-anchor='middle' font-size='70'%3E🌸%3C/text%3E%3Ctext x='300' y='255' text-anchor='middle' fill='%23be185d' font-size='28' font-weight='600'%3E請稍候～%3C/text%3E%3Ctext x='300' y='300' text-anchor='middle' fill='%23be185d' font-size='24' font-weight='500'%3E馬上就要上傳照片了！%3C/text%3E%3C/svg%3E",
                price: '¥11,000~（含稅）',
                photos: []
            },
            {
                id: 'plan8',
                name: '【女士】振袖套餐',
                shortDesc: '⋈*｡ 價格含腰帶、髮型、草履、手提包',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">「振袖」是未婚女士的最高級禮服，以華麗的長袖為特徵。適合畢業典禮、成人式或拍攝紀念照。</p>
                    
                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁振袖 ¥9,900~27,500 一套</li>
                        <li>⌁袋帶</li>
                        <li>⌁免費髮型 / 髮飾</li>
                        <li>⌁內搭、分趾襪、草履、日式提包</li>
                        <li>⌁可免費租借拍攝道具（雨傘、扇子）</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                        
                        <!-- 振袖價位分類 -->
                        <div class="mt-6 mb-6 p-4 bg-white rounded-xl border border-gray-200">
                            <div class="flex flex-wrap gap-3 justify-center">
                                <button class="furisode-category-btn active" onclick="filterFurisode('all')" style="cursor: pointer; padding: 0.75rem 1.5rem; border: 2px solid #859A93; border-radius: 0.5rem; background-color: #859A93; color: white; font-weight: 500; transition: all 0.3s ease;">
                                    全部振袖
                                </button>
                                <button class="furisode-category-btn" onclick="filterFurisode('premium')" style="cursor: pointer; padding: 0.75rem 1.5rem; border: 2px solid #859A93; border-radius: 0.5rem; background-color: white; color: #859A93; font-weight: 500; transition: all 0.3s ease;">
                                    精品振袖 ¥9,900
                                </button>
                                <button class="furisode-category-btn" onclick="filterFurisode('gold')" style="cursor: pointer; padding: 0.75rem 1.5rem; border: 2px solid #859A93; border-radius: 0.5rem; background-color: white; color: #859A93; font-weight: 500; transition: all 0.3s ease;">
                                    金絲振袖 ¥16,500
                                </button>
                                <button class="furisode-category-btn" onclick="filterFurisode('couture')" style="cursor: pointer; padding: 0.75rem 1.5rem; border: 2px solid #859A93; border-radius: 0.5rem; background-color: white; color: #859A93; font-weight: 500; transition: all 0.3s ease;">
                                    高訂振袖 ¥27,500
                                </button>
                            </div>
                        </div>

                        <!-- 照片展示區 -->
                        

                        <div id="furisode-gallery" class="grid grid-cols-2 sm:grid-cols-3 gap-4 not-prose">
                            <!-- 精品振袖照片 -->
                            <div class="furisode-photo rounded-lg overflow-hidden shadow-md" data-furisode-type="premium">
                                <div style="width: 100%; aspect-ratio: 4/5; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem;">
                                    <span style="font-size: 3.5rem;">🌸</span>
                                    <span style="color: #be185d; font-size: 1.1rem; font-weight: 600; text-align: center; line-height: 1.8; font-family: 'Zen Maru Gothic', 'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', sans-serif;">請稍候～<br>馬上就要上傳照片了！</span>
                                </div>
                            </div>
                            <div class="furisode-photo rounded-lg overflow-hidden shadow-md" data-furisode-type="premium">
                                <div style="width: 100%; aspect-ratio: 4/5; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem;">
                                    <span style="font-size: 3.5rem;">✨</span>
                                    <span style="color: #be185d; font-size: 1.1rem; font-weight: 600; text-align: center; line-height: 1.8; font-family: 'Zen Maru Gothic', 'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', sans-serif;">請稍候～<br>馬上就要上傳照片了！</span>
                                </div>
                            </div>
                            <div class="furisode-photo rounded-lg overflow-hidden shadow-md" data-furisode-type="premium">
                                <div style="width: 100%; aspect-ratio: 4/5; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem;">
                                    <span style="font-size: 3.5rem;">💕</span>
                                    <span style="color: #be185d; font-size: 1.1rem; font-weight: 600; text-align: center; line-height: 1.8; font-family: 'Zen Maru Gothic', 'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', sans-serif;">請稍候～<br>馬上就要上傳照片了！</span>
                                </div>
                            </div>
                            
                            <!-- 金絲振袖照片 - 紫金絲振袖相簿 -->
                            <div class="furisode-photo rounded-lg overflow-hidden shadow-md gallery-cover" data-furisode-type="gold" onclick="openLightbox(['img/Gallery_Gold_Furisode_241124_red1.jpg', 'img/Gallery_Gold_Furisode_241124_red2.jpg', 'img/Gallery_Gold_Furisode_241124_red3.jpg', 'img/Gallery_Gold_Furisode_241124_red4.jpg', 'img/Gallery_Gold_Furisode_241124_red5.jpg'], 0)" style="cursor: pointer;">
                                <img src="img/Gallery_Gold_Furisode_241124_red1.jpg" alt="金絲振袖相簿" onerror="this.src='https://placehold.co/400x500/c026d3/ffffff?text=金絲振袖'">
                            </div>
                            <!-- 金絲振袖照片 - 藍金絲振袖相簿 -->
                            <div class="furisode-photo rounded-lg overflow-hidden shadow-md gallery-cover" data-furisode-type="gold" onclick="openLightbox(['img/Gallery_Gold_Furisode_20260215_blue1.jpg', 'img/Gallery_Gold_Furisode_20260215_blue2.jpg', 'img/Gallery_Gold_Furisode_20260215_blue3.jpg', 'img/Gallery_Gold_Furisode_20260215_blue4.jpg'], 0)" style="cursor: pointer;">
                                <img src="img/Gallery_Gold_Furisode_20260215_blue1.jpg" alt="金絲振袖相簿" onerror="this.src='https://placehold.co/400x500/c026d3/ffffff?text=金絲振袖'">
                            </div>
                            
                            <!-- 高訂振袖照片 - 白金振袖相簿（封面） -->
                            <div class="furisode-photo rounded-lg overflow-hidden shadow-md gallery-cover" data-furisode-type="couture" onclick="openLightbox(['img/white_gold_furisode4.jpg', 'img/white_gold_furisode1.jpg', 'img/white_gold_furisode2.jpg', 'img/white_gold_furisode3.jpg'], 0)" style="cursor: pointer;">
                                <img src="img/white_gold_furisode4.jpg" alt="白金振袖相簿" onerror="this.src='https://placehold.co/400x500/a21caf/ffffff?text=高訂振袖'">
                            </div>
                            
                            <!-- 高訂振袖照片 - 綠振袖相簿（封面） -->
                            <div class="furisode-photo rounded-lg overflow-hidden shadow-md gallery-cover" data-furisode-type="couture" onclick="openLightbox(['img/green_furisode1.jpg', 'img/green_furisode3.jpg', 'img/green_furisode4.jpg', 'img/green_furisode6.jpg'], 0)" style="cursor: pointer;">
                                <img src="img/green_furisode1.jpg" alt="綠振袖相簿" onerror="this.src='https://placehold.co/400x500/a21caf/ffffff?text=高訂振袖'">
                            </div>
                            
                            <!-- 高訂振袖照片 - 紫高訂振袖相簿（封面） -->
                            <div class="furisode-photo rounded-lg overflow-hidden shadow-md gallery-cover" data-furisode-type="couture" onclick="openLightbox(['img/purple_luxury_furisode2.jpg', 'img/purple_luxury_furisode3.jpg', 'img/purple_luxury_furisode4.jpg', 'img/purple_luxury_furisode5.jpg', 'img/purple_luxury_furisode6.jpg', 'img/purple_luxury_furisode7.jpg', 'img/purple_luxury_furisode8.jpg'], 4)" style="cursor: pointer;">
                                <img src="img/purple_luxury_furisode6.jpg" alt="紫高訂振袖相簿" onerror="this.src='https://placehold.co/400x500/a21caf/ffffff?text=高訂振袖'">
                            </div>
                        </div>
                    </div>
                `,
                image: 'img/white_standard_furisode1.jpg',
                price: '¥9,900~27,500（含稅）',
                photos: [
                    'img/white_standard_furisode2.jpg',
                    'img/white_standard_furisode3.jpg'
                ]
            },
            
            // --- 男士方案 (已排序) ---
            {
                id: 'plan10',
                name: '【男士】和服套餐',
                shortDesc: '⋈*｡ 價格含腰帶、草履、手提包',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">低調而帥氣的男士專屬方案，體驗傳統日本風格。我們提供多種尺寸和顏色的男士和服，風格沉穩，適合與伴侶一同漫步京都。</p>
                    
                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁普通和服 ¥5,500 一套</li>
                        <li>⌁另加購羽織 ¥1,100</li>
                        <li>⌁腰帶、分趾襪、草履、手提包</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                    </div>
                `,
                image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'%3E%3Cdefs%3E%3ClinearGradient id='bg2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23e0f2fe'/%3E%3Cstop offset='50%25' style='stop-color:%23bae6fd'/%3E%3Cstop offset='100%25' style='stop-color:%2393c5fd'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='450' fill='url(%23bg2)'/%3E%3Ctext x='300' y='170' text-anchor='middle' font-size='70'%3E✨%3C/text%3E%3Ctext x='300' y='255' text-anchor='middle' fill='%230369a1' font-size='28' font-weight='600'%3E請稍候～%3C/text%3E%3Ctext x='300' y='300' text-anchor='middle' fill='%230369a1' font-size='24' font-weight='500'%3E馬上就要上傳照片了！%3C/text%3E%3C/svg%3E",
                price: '¥5,500~8,800（含稅）',
                photos: [
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='bg3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23e0f2fe'/%3E%3Cstop offset='100%25' style='stop-color:%2393c5fd'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23bg3)'/%3E%3Ctext x='200' y='110' text-anchor='middle' font-size='50'%3E🎀%3C/text%3E%3Ctext x='200' y='175' text-anchor='middle' fill='%230369a1' font-size='22' font-weight='600'%3E請稍候～%3C/text%3E%3Ctext x='200' y='210' text-anchor='middle' fill='%230369a1' font-size='18' font-weight='500'%3E馬上就要上傳照片了！%3C/text%3E%3C/svg%3E",
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='bg4' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23e0f2fe'/%3E%3Cstop offset='100%25' style='stop-color:%2393c5fd'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23bg4)'/%3E%3Ctext x='200' y='110' text-anchor='middle' font-size='50'%3E💕%3C/text%3E%3Ctext x='200' y='175' text-anchor='middle' fill='%230369a1' font-size='22' font-weight='600'%3E請稍候～%3C/text%3E%3Ctext x='200' y='210' text-anchor='middle' fill='%230369a1' font-size='18' font-weight='500'%3E馬上就要上傳照片了！%3C/text%3E%3C/svg%3E"
                ]
            },
            /*
            { // 男士浴衣 - 已註解
                id: 'plan12',
                name: '【男士】浴衣套餐（6月-9月）',
                shortDesc: '⋈*｡ 價格含腰帶、草履、手提包',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">夏季限定（6月至9月）！男士浴衣同樣輕便有型，適合在炎熱的天氣中帥氣地漫步京都。</p>
                    
                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁男士浴衣一套</li>
                        <li>⌁內襯、腰帶</li>
                        <li>⌁二趾襪、草履、手提包</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                    </div>
                `,
                image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'%3E%3Cdefs%3E%3ClinearGradient id='bg7' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ecfeff'/%3E%3Cstop offset='100%25' style='stop-color:%2367e8f9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='450' fill='url(%23bg7)'/%3E%3Ctext x='300' y='170' text-anchor='middle' font-size='70'%3E🎐%3C/text%3E%3Ctext x='300' y='255' text-anchor='middle' fill='%230891b2' font-size='28' font-weight='600'%3E請稍候～%3C/text%3E%3Ctext x='300' y='300' text-anchor='middle' fill='%230891b2' font-size='24' font-weight='500'%3E馬上就要上傳照片了！%3C/text%3E%3C/svg%3E",
                price: '¥5,500（含稅）',
                photos: []
            },
            */
            {
                id: 'plan11',
                name: '【男士】高級武士服套餐',
                shortDesc: '⋈*｡ 價格含腰帶、草履、手提包',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">體驗更正式的男士服飾「袴」或高品質的和服。此方案提供更精緻的布料與設計，展現武士般的氣勢與品味。</p>

                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁高級和服+羽織+袴 ¥16,500 一套</li>
                        <li>⌁腰帶、分趾襪、草履、手提包</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                    </div>
                `,
                image: 'img/samurai1.jpg',
                price: '¥16,500（含稅）',
                photos: [
                    'img/samurai2.jpg',
                    'img/samurai3.jpg',
                    'img/samurai4.jpg',
                    'img/samurai5.jpg'
                ]
            },
            
            // --- 小孩方案 ---
            {
                id: 'plan14',
                name: '【小孩】和服套餐',
                shortDesc: '⋈*｡ 價格含腰帶、髮型、草履、手提包',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">專為小朋友設計的和服套餐，讓孩子也能體驗傳統日式文化。我們提供多種可愛的款式和顏色，讓小朋友在京都留下美好的回憶。</p>
                    
                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁兒童和服 ¥5,500 一套</li>
                        <li>⌁腰帶、分趾襪、草履、手提包</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                    </div>
                `,
                image: "img/Gallery_Kids_240102_red1.jpg",
                price: '¥5,500（含稅）',
                photos: []
            },
            
            // --- 情侶方案 ---
            {
                id: 'plan15',
                name: '【情侶】和服套餐',
                shortDesc: '⋈*｡ 款式皆為普通小紋,到店後可換款補差價',
                longDesc: `
                    <!-- ✿和服介紹 -->
                    <h2 class="text-2xl font-bold text-main mb-3" style="font-weight: 600;">✿和服介紹</h2>
                    <p class="mb-4 text-main">專為情侶設計的和服套餐，讓您與伴侶一同體驗傳統日式文化。款式皆為普通小紋，可補差價換款，詳情請詢問 @Niconico_kimono</p>
                    
                    <!-- ✿方案包含： -->
                    <h2 class="text-2xl font-bold text-main mt-6 mb-3" style="font-weight: 600;">✿方案包含：</h2>
                    <ul class="list-none space-y-2 pl-0 text-main" style="padding-left: 0;">
                        <li>⌁女士小紋 ¥5,500 一套</li>
                        <li>⌁男士和服 ¥6,600 一套</li>
                        <li>⌁腰帶、髮型(女士)</li>
                        <li>⌁分趾襪、草履、手提包</li>
                        <li>⌁可免費租借拍攝道具（雨傘、扇子）</li>
                    </ul>
                    
                    <!-- ✿歸還時間 -->
                    <div class="mt-6 border-t pt-4">
                        <h3 class="text-xl font-bold text-red-600 mb-2">※當日17:30前需歸還</h3>
                        <h3 class="text-xl font-bold text-red-600">※免費隔日中午12:00前歸還（需付押金¥10,000）</h3>
                    </div>

                    <!-- ⋆˚. 照片參考₊⊹ -->
                    <div class="mt-8">
                        <h2 class="text-2xl font-bold text-main mb-3 flex items-baseline" style="font-weight: 600;">
                            <span>⋆˚. 照片參考₊⊹</span>
                            <span class="text-lg font-medium text-gray-600 ml-2">｜可提前預留款式</span>
                        </h2>
                    </div>
                `,
                image: 'img/couple1.jpg',
                price: '¥9,900~（含稅）',
                photos: [
                    'img/couple2.jpg',
                    'img/gallery_couple2.jpg',
                    'img/couple4.jpg',
                    'img/samurai1.jpg',
                    'img/samurai2.jpg'
                ]
            }
        ];

        // ----------------------------------------------------
        // 2. 渲染邏輯 (*** 所有函式都已補全 ***)
        // ----------------------------------------------------
        // 獲取 content 元素的輔助函數
        function getContentDiv() {
            return document.getElementById('content');
        }
        
        // --- Carousel Logic ---
        let slideIndex = 1;

        function plusSlides(n) {
            showSlides(slideIndex += n);
        }

        function showSlides(n) {
            let i;
            let slides = document.getElementsByClassName("mySlides");
            if (slides.length === 0) return; // 如果輪播圖不在當前頁面，則不執行

            // 修正邏輯：正確處理所有情況
            if (n > slides.length) {
                slideIndex = 1;
            } else if (n < 1) {
                slideIndex = slides.length;
            } else {
                slideIndex = n;
            }
            
            for (i = 0; i < slides.length; i++) {
                 if (slides[i]) slides[i].style.display = "none";
            }
            
            if (slides[slideIndex-1]) {
                slides[slideIndex-1].style.display = "block";
            }
        }
        // --- End Carousel Logic ---


        /**
         * 生成和服方案圖示 HTML
         */
        function getKimonoPlanIcons(planId) {
            // 定義圖示數據 - 使用更詳細、更符合實際物品的圖標
            const icons = {
                kimono: { label: '和服', svg: '<path d="M5 3 L12 3 L12 5 L19 5 L19 21 L5 21 Z" fill="none"/><path d="M5 5 L12 5 L12 21 M12 5 L19 5 L19 21" stroke-width="1.5"/><path d="M7 7 L17 7" stroke-width="1"/><path d="M7 9 L17 9" stroke-width="1"/><path d="M8 11 L16 11" stroke-width="1"/><circle cx="9" cy="13" r="0.8" fill="none"/><circle cx="15" cy="13" r="0.8" fill="none"/><path d="M3 7 Q5 6 7 7 Q9 8 12 7 Q15 8 17 7 Q19 6 21 7" stroke-width="1.5" fill="none"/>' },
                obi: { label: '腰帶', svg: '<rect x="3" y="9" width="18" height="6" rx="1" fill="none" stroke-width="1.5"/><path d="M5 11 L19 11" stroke-width="1.5"/><path d="M5 13 L19 13" stroke-width="1.5"/><path d="M9 8 L9 16 M15 8 L15 16" stroke-width="1.5"/><path d="M9 10 Q11 9 12 10 Q13 9 15 10" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="1.5" fill="none"/>' },
                underwear: { label: '內搭', svg: '<path d="M7 3 L17 3 L17 7 L15 7 L15 19 L9 19 L9 7 L7 7 Z" fill="none" stroke-width="1.5"/><path d="M9 5 L15 5" stroke-width="1.5"/><path d="M10 7 L14 7" stroke-width="1"/><path d="M10 9 L14 9" stroke-width="1"/><path d="M11 5 L11 3 M13 5 L13 3" stroke-width="1.5" stroke-linecap="round"/>' },
                hairstyle: { label: '髮型', svg: '<circle cx="12" cy="6" r="4.5" fill="none" stroke-width="1.5"/><path d="M4 11 Q7 9 12 11 Q17 9 20 11" stroke-width="1.5" fill="none"/><path d="M5 14 Q8 12 12 14 Q16 12 19 14" stroke-width="1.5" fill="none"/><path d="M6 17 Q9 15 12 17 Q15 15 18 17" stroke-width="1.5" fill="none"/><circle cx="10" cy="8" r="0.5" fill="none"/><circle cx="14" cy="8" r="0.5" fill="none"/><path d="M10 10 Q12 11 14 10" stroke-width="1" fill="none"/>' },
                zori: { label: '草履', svg: '<ellipse cx="12" cy="15" rx="9" ry="3" fill="none" stroke-width="1.5"/><path d="M3 15 L21 15" stroke-width="1.5"/><path d="M6 13 L6 17 M18 13 L18 17" stroke-width="1.5" stroke-linecap="round"/><path d="M8 12 L8 18 M16 12 L16 18" stroke-width="1" stroke-linecap="round"/><circle cx="9" cy="14" r="0.8" fill="none"/><circle cx="15" cy="14" r="0.8" fill="none"/><path d="M7 16 Q9 15 12 16 Q15 15 17 16" stroke-width="1" fill="none"/>' },
                bag: { label: '提包', svg: '<path d="M7 5 L17 5 L18 6 L18 17 L17 18 L7 18 L6 17 L6 6 Z" fill="none" stroke-width="1.5"/><path d="M8 6 L16 6" stroke-width="1"/><path d="M8 8 L16 8" stroke-width="1"/><path d="M8 10 L16 10" stroke-width="1"/><path d="M9 5 L9 3 M15 5 L15 3" stroke-width="1.5" stroke-linecap="round"/><path d="M9 3 Q12 2 15 3" stroke-width="1.5" fill="none"/><circle cx="10" cy="12" r="0.8" fill="none"/><circle cx="14" cy="12" r="0.8" fill="none"/>' }
            };

            // 判斷方案類型
            const isMale = planId && ['plan10', 'plan11'].includes(planId);
            
            // 女生/小孩方案：和服、腰帶、內搭、髮型、草履、提包
            // 男生方案：和服、腰帶、內搭、草履、提包
            let iconList = [];
            if (isMale) {
                iconList = ['kimono', 'obi', 'underwear', 'zori', 'bag'];
            } else {
                iconList = ['kimono', 'obi', 'underwear', 'hairstyle', 'zori', 'bag'];
            }

            // 生成 HTML
            let iconsHtml = '<div class="home-kimono-icons">';
            iconList.forEach(iconKey => {
                const icon = icons[iconKey];
                iconsHtml += `
                    <div class="home-kimono-icon-item">
                        <div class="home-kimono-icon-circle">
                            <svg viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                ${icon.svg}
                            </svg>
                        </div>
                        <div class="home-kimono-icon-label">${t(icon.label)}</div>
                    </div>
                `;
            });
            iconsHtml += '</div>';
            return iconsHtml;
        }

        /**
         * 生成和服方案頁面圖示 HTML
         */
        function getKimonoPlanPageIcons(planId) {
            // 定義圖示數據 - 使用更詳細、更符合實際物品的圖標
            const icons = {
                kimono: { label: '和服', svg: '<path d="M5 3 L12 3 L12 5 L19 5 L19 21 L5 21 Z" fill="none"/><path d="M5 5 L12 5 L12 21 M12 5 L19 5 L19 21" stroke-width="1.5"/><path d="M7 7 L17 7" stroke-width="1"/><path d="M7 9 L17 9" stroke-width="1"/><path d="M8 11 L16 11" stroke-width="1"/><circle cx="9" cy="13" r="0.8" fill="none"/><circle cx="15" cy="13" r="0.8" fill="none"/><path d="M3 7 Q5 6 7 7 Q9 8 12 7 Q15 8 17 7 Q19 6 21 7" stroke-width="1.5" fill="none"/>' },
                obi: { label: '腰帶', svg: '<rect x="3" y="9" width="18" height="6" rx="1" fill="none" stroke-width="1.5"/><path d="M5 11 L19 11" stroke-width="1.5"/><path d="M5 13 L19 13" stroke-width="1.5"/><path d="M9 8 L9 16 M15 8 L15 16" stroke-width="1.5"/><path d="M9 10 Q11 9 12 10 Q13 9 15 10" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="1.5" fill="none"/>' },
                underwear: { label: '內搭', svg: '<path d="M7 3 L17 3 L17 7 L15 7 L15 19 L9 19 L9 7 L7 7 Z" fill="none" stroke-width="1.5"/><path d="M9 5 L15 5" stroke-width="1.5"/><path d="M10 7 L14 7" stroke-width="1"/><path d="M10 9 L14 9" stroke-width="1"/><path d="M11 5 L11 3 M13 5 L13 3" stroke-width="1.5" stroke-linecap="round"/>' },
                hairstyle: { label: '髮型', svg: '<circle cx="12" cy="6" r="4.5" fill="none" stroke-width="1.5"/><path d="M4 11 Q7 9 12 11 Q17 9 20 11" stroke-width="1.5" fill="none"/><path d="M5 14 Q8 12 12 14 Q16 12 19 14" stroke-width="1.5" fill="none"/><path d="M6 17 Q9 15 12 17 Q15 15 18 17" stroke-width="1.5" fill="none"/><circle cx="10" cy="8" r="0.5" fill="none"/><circle cx="14" cy="8" r="0.5" fill="none"/><path d="M10 10 Q12 11 14 10" stroke-width="1" fill="none"/>' },
                zori: { label: '草履', svg: '<ellipse cx="12" cy="15" rx="9" ry="3" fill="none" stroke-width="1.5"/><path d="M3 15 L21 15" stroke-width="1.5"/><path d="M6 13 L6 17 M18 13 L18 17" stroke-width="1.5" stroke-linecap="round"/><path d="M8 12 L8 18 M16 12 L16 18" stroke-width="1" stroke-linecap="round"/><circle cx="9" cy="14" r="0.8" fill="none"/><circle cx="15" cy="14" r="0.8" fill="none"/><path d="M7 16 Q9 15 12 16 Q15 15 17 16" stroke-width="1" fill="none"/>' },
                bag: { label: '提包', svg: '<path d="M7 5 L17 5 L18 6 L18 17 L17 18 L7 18 L6 17 L6 6 Z" fill="none" stroke-width="1.5"/><path d="M8 6 L16 6" stroke-width="1"/><path d="M8 8 L16 8" stroke-width="1"/><path d="M8 10 L16 10" stroke-width="1"/><path d="M9 5 L9 3 M15 5 L15 3" stroke-width="1.5" stroke-linecap="round"/><path d="M9 3 Q12 2 15 3" stroke-width="1.5" fill="none"/><circle cx="10" cy="12" r="0.8" fill="none"/><circle cx="14" cy="12" r="0.8" fill="none"/>' }
            };

            // 判斷方案類型
            const isMale = planId && ['plan10', 'plan11'].includes(planId);
            
            // 女生/小孩方案：和服、腰帶、內搭、髮型、草履、提包
            // 男生方案：和服、腰帶、內搭、草履、提包
            let iconList = [];
            if (isMale) {
                iconList = ['kimono', 'obi', 'underwear', 'zori', 'bag'];
            } else {
                iconList = ['kimono', 'obi', 'underwear', 'hairstyle', 'zori', 'bag'];
            }

            // 生成 HTML
            let iconsHtml = '<div class="kimono-plan-card-icons">';
            iconList.forEach(iconKey => {
                const icon = icons[iconKey];
                iconsHtml += `
                    <div class="kimono-plan-card-icon-item">
                        <div class="kimono-plan-card-icon-circle">
                            <svg viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                ${icon.svg}
                            </svg>
                        </div>
                        <div class="kimono-plan-card-icon-label">${t(icon.label)}</div>
                    </div>
                `;
            });
            iconsHtml += '</div>';
            return iconsHtml;
        }

        // ====== 通用不規則圓形裝飾生成器 ======
        function generatePageBlobs(pageName, zIndex = 0) {
            const blobConfigs = {
                home: [
                    // 超大
                    { w:450, h:380, color:'rgba(240,236,224,0.35)', top:'0%', left:'-6rem', rot:-12, br:'58% 42% 50% 50%/48% 56% 44% 52%' },
                    { w:420, h:350, color:'rgba(195,228,218,0.18)', top:'10%', right:'-5rem', rot:18, br:'44% 56% 38% 62%/52% 60% 40% 48%' },
                    { w:400, h:340, color:'rgba(225,200,215,0.16)', top:'25%', left:'-4rem', rot:-8, br:'52% 48% 56% 44%/44% 56% 44% 56%' },
                    { w:440, h:360, color:'rgba(190,215,235,0.15)', top:'40%', right:'-6rem', rot:22, br:'60% 40% 46% 54%/50% 50% 50% 50%' },
                    { w:380, h:320, color:'rgba(240,220,215,0.20)', top:'55%', left:'-5rem', rot:14, br:'46% 54% 42% 58%/56% 44% 56% 44%' },
                    { w:420, h:340, color:'rgba(200,230,215,0.17)', top:'68%', right:'-4rem', rot:-15, br:'55% 45% 48% 52%/42% 58% 42% 58%' },
                    { w:360, h:300, color:'rgba(230,210,220,0.14)', top:'82%', left:'-3rem', rot:10, br:'48% 52% 44% 56%/54% 46% 54% 46%' },
                    // 大
                    { w:300, h:260, color:'rgba(220,195,205,0.16)', top:'5%', left:'15%', rot:25, br:'50% 50% 42% 58%/58% 42% 58% 42%' },
                    { w:280, h:240, color:'rgba(185,220,205,0.15)', top:'18%', right:'10%', rot:-20, br:'56% 44% 52% 48%/46% 54% 46% 54%' },
                    { w:320, h:270, color:'rgba(200,205,230,0.13)', top:'35%', left:'20%', rot:16, br:'44% 56% 56% 44%/52% 48% 52% 48%' },
                    { w:290, h:250, color:'rgba(230,215,200,0.18)', top:'50%', right:'8%', rot:-12, br:'58% 42% 46% 54%/50% 50% 50% 50%' },
                    { w:260, h:220, color:'rgba(195,225,220,0.16)', top:'65%', left:'25%', rot:20, br:'52% 48% 40% 60%/56% 44% 56% 44%' },
                    { w:280, h:230, color:'rgba(225,200,220,0.14)', top:'78%', right:'15%', rot:-18, br:'46% 54% 58% 42%/42% 58% 42% 58%' },
                    // 中
                    { w:200, h:220, color:'rgba(230,195,200,0.18)', top:'3%', left:'40%', rot:32, br:'55% 45% 52% 48%/42% 58% 42% 58%' },
                    { w:180, h:200, color:'rgba(180,215,200,0.16)', top:'15%', left:'55%', rot:-28, br:'48% 52% 44% 56%/54% 46% 54% 46%' },
                    { w:190, h:170, color:'rgba(205,200,228,0.15)', top:'30%', right:'25%', rot:22, br:'62% 38% 48% 52%/44% 56% 44% 56%' },
                    { w:170, h:190, color:'rgba(220,210,195,0.17)', top:'48%', left:'35%', rot:-16, br:'50% 50% 42% 58%/58% 42% 58% 42%' },
                    { w:200, h:180, color:'rgba(195,220,210,0.15)', top:'60%', right:'20%', rot:28, br:'44% 56% 56% 44%/52% 48% 52% 48%' },
                    { w:180, h:160, color:'rgba(225,200,210,0.16)', top:'75%', left:'45%', rot:-22, br:'56% 44% 52% 48%/46% 54% 46% 54%' },
                    // 小
                    { w:120, h:130, color:'rgba(235,205,210,0.22)', top:'1%', right:'30%', rot:-35, br:'60% 40% 46% 54%/50% 50% 50% 50%' },
                    { w:100, h:110, color:'rgba(185,225,210,0.20)', top:'12%', left:'70%', rot:40, br:'52% 48% 56% 44%/44% 56% 44% 56%' },
                    { w:90, h:100, color:'rgba(210,200,230,0.18)', top:'28%', left:'60%', rot:-30, br:'48% 52% 44% 56%/54% 46% 54% 46%' },
                    { w:110, h:100, color:'rgba(230,215,200,0.22)', top:'42%', right:'30%', rot:35, br:'55% 45% 52% 48%/42% 58% 42% 58%' },
                    { w:80, h:90, color:'rgba(195,220,205,0.18)', top:'58%', left:'50%', rot:-25, br:'62% 38% 48% 52%/44% 56% 44% 56%' },
                    { w:100, h:90, color:'rgba(220,200,225,0.20)', top:'72%', right:'35%', rot:18, br:'44% 56% 48% 52%/52% 48% 52% 48%' },
                    { w:70, h:80, color:'rgba(230,210,195,0.24)', top:'85%', left:'40%', rot:-15, br:'58% 42% 46% 54%/50% 50% 50% 50%' },
                    { w:90, h:80, color:'rgba(185,215,225,0.20)', bottom:'3%', right:'25%', rot:25, br:'50% 50% 42% 58%/58% 42% 58% 42%' },
                ],
                kimonoPlans: [
                    // 大
                    { w:400, h:340, color:'rgba(240,236,224,0.38)', top:'1%', left:'-6rem', rot:-10, br:'55% 45% 48% 52%/50% 50% 50% 50%' },
                    { w:350, h:300, color:'rgba(195,225,215,0.16)', top:'14%', right:'-5rem', rot:20, br:'48% 52% 44% 56%/54% 46% 54% 46%' },
                    { w:320, h:270, color:'rgba(225,195,210,0.14)', top:'30%', left:'-3rem', rot:-18, br:'56% 44% 52% 48%/46% 54% 46% 54%' },
                    { w:380, h:310, color:'rgba(190,210,230,0.13)', top:'48%', right:'-4rem', rot:28, br:'44% 56% 56% 44%/52% 48% 52% 48%' },
                    { w:340, h:280, color:'rgba(240,220,215,0.18)', top:'65%', left:'-5rem', rot:14, br:'50% 50% 42% 58%/58% 42% 58% 42%' },
                    { w:300, h:260, color:'rgba(200,230,210,0.15)', top:'80%', right:'-3rem', rot:-12, br:'62% 38% 48% 52%/44% 56% 44% 56%' },
                    // 中
                    { w:200, h:220, color:'rgba(230,200,210,0.15)', top:'10%', left:'25%', rot:25, br:'52% 48% 56% 44%/44% 56% 44% 56%' },
                    { w:180, h:160, color:'rgba(180,215,200,0.14)', top:'42%', right:'15%', rot:-22, br:'46% 54% 42% 58%/56% 44% 56% 44%' },
                    { w:190, h:170, color:'rgba(200,200,225,0.12)', top:'72%', left:'20%', rot:16, br:'58% 42% 48% 52%/50% 50% 50% 50%' },
                    // 小
                    { w:110, h:120, color:'rgba(220,190,195,0.18)', top:'6%', right:'20%', rot:-30, br:'55% 45% 52% 48%/42% 58% 42% 58%' },
                    { w:90, h:100, color:'rgba(185,220,205,0.16)', top:'25%', left:'50%', rot:35, br:'48% 52% 44% 56%/54% 46% 54% 46%' },
                    { w:80, h:90, color:'rgba(210,195,225,0.15)', top:'55%', left:'45%', rot:-15, br:'60% 40% 50% 50%/42% 58% 42% 58%' },
                    { w:70, h:75, color:'rgba(240,215,200,0.22)', bottom:'8%', right:'30%', rot:20, br:'44% 56% 48% 52%/52% 48% 52% 48%' },
                ],
                hairMakeup: [
                    { w:300, h:260, color:'rgba(225,195,210,0.16)', top:'3%', right:'5%', rot:-12, br:'52% 48% 56% 44%/44% 56% 44% 56%' },
                    { w:280, h:240, color:'rgba(240,236,224,0.36)', top:'20%', left:'-5rem', rot:16, br:'46% 54% 42% 58%/56% 44% 56% 44%' },
                    { w:220, h:200, color:'rgba(190,220,210,0.14)', top:'45%', right:'-3rem', rot:-22, br:'58% 42% 48% 52%/50% 50% 50% 50%' },
                    { w:340, h:270, color:'rgba(240,220,215,0.15)', bottom:'10%', left:'3%', rot:10, br:'44% 56% 54% 46%/48% 52% 48% 52%' },
                    { w:120, h:130, color:'rgba(200,210,230,0.14)', top:'65%', left:'40%', rot:35, br:'60% 40% 50% 50%/42% 58% 42% 58%' },
                    { w:90, h:100, color:'rgba(220,195,200,0.18)', top:'10%', left:'30%', rot:-28, br:'55% 45% 48% 52%/56% 44% 56% 44%' },
                ],
                reviews: [
                    // 大
                    { w:380, h:320, color:'rgba(240,236,224,0.35)', top:'2%', left:'-5rem', rot:-15, br:'55% 45% 42% 58%/48% 52% 48% 52%' },
                    { w:340, h:290, color:'rgba(195,220,215,0.16)', top:'16%', right:'-4rem', rot:24, br:'46% 54% 58% 42%/54% 46% 54% 46%' },
                    { w:320, h:270, color:'rgba(225,200,215,0.15)', top:'35%', left:'-3rem', rot:-20, br:'50% 50% 44% 56%/56% 44% 56% 44%' },
                    { w:360, h:300, color:'rgba(190,215,230,0.13)', top:'52%', right:'-5rem', rot:18, br:'58% 42% 52% 48%/42% 58% 42% 58%' },
                    { w:300, h:250, color:'rgba(240,220,215,0.18)', top:'70%', left:'-4rem', rot:12, br:'44% 56% 48% 52%/52% 48% 52% 48%' },
                    // 中
                    { w:200, h:180, color:'rgba(220,195,200,0.16)', top:'8%', left:'20%', rot:30, br:'52% 48% 56% 44%/44% 56% 44% 56%' },
                    { w:180, h:200, color:'rgba(185,215,200,0.14)', top:'28%', right:'10%', rot:-25, br:'48% 52% 44% 56%/54% 46% 54% 46%' },
                    { w:190, h:170, color:'rgba(200,200,225,0.12)', top:'58%', left:'15%', rot:22, br:'56% 44% 52% 48%/46% 54% 46% 54%' },
                    // 小
                    { w:100, h:110, color:'rgba(230,200,205,0.20)', top:'5%', right:'22%', rot:-35, br:'62% 38% 48% 52%/44% 56% 44% 56%' },
                    { w:80, h:90, color:'rgba(180,220,200,0.16)', top:'42%', left:'40%', rot:40, br:'50% 50% 42% 58%/58% 42% 58% 42%' },
                    { w:90, h:80, color:'rgba(210,195,225,0.15)', top:'75%', right:'18%', rot:-18, br:'44% 56% 56% 44%/52% 48% 52% 48%' },
                    { w:70, h:80, color:'rgba(220,210,190,0.22)', bottom:'3%', left:'35%', rot:15, br:'58% 42% 46% 54%/50% 50% 50% 50%' },
                ],
                albumDetail: [
                    { w:340, h:280, color:'rgba(240,236,224,0.35)', top:'2%', right:'-4rem', rot:-18, br:'52% 48% 40% 60%/58% 42% 58% 42%' },
                    { w:300, h:260, color:'rgba(200,225,215,0.15)', top:'15%', left:'-5rem', rot:15, br:'44% 56% 54% 46%/46% 54% 46% 54%' },
                    { w:280, h:240, color:'rgba(225,200,215,0.14)', top:'35%', right:'-3rem', rot:-25, br:'56% 44% 48% 52%/50% 50% 50% 50%' },
                    { w:320, h:270, color:'rgba(190,210,230,0.12)', top:'55%', left:'-4rem', rot:20, br:'48% 52% 56% 44%/44% 56% 44% 56%' },
                    { w:200, h:180, color:'rgba(240,220,215,0.18)', top:'72%', right:'5%', rot:-10, br:'60% 40% 44% 56%/52% 48% 52% 48%' },
                    { w:100, h:110, color:'rgba(220,195,200,0.18)', top:'8%', left:'25%', rot:32, br:'55% 45% 52% 48%/42% 58% 42% 58%' },
                    { w:80, h:90, color:'rgba(185,220,205,0.15)', top:'48%', left:'45%', rot:-20, br:'50% 50% 42% 58%/58% 42% 58% 42%' },
                    { w:70, h:80, color:'rgba(200,195,225,0.16)', bottom:'5%', left:'30%', rot:25, br:'44% 56% 48% 52%/52% 48% 52% 48%' },
                ],
                photoPlans: [
                    // 大
                    { w:400, h:330, color:'rgba(240,236,224,0.36)', top:'2%', left:'-6rem', rot:-12, br:'58% 42% 46% 54%/50% 50% 50% 50%' },
                    { w:360, h:300, color:'rgba(195,225,220,0.17)', top:'15%', right:'-5rem', rot:26, br:'44% 56% 52% 48%/56% 44% 56% 44%' },
                    { w:340, h:280, color:'rgba(225,195,215,0.15)', top:'32%', left:'-4rem', rot:-16, br:'52% 48% 42% 58%/48% 52% 48% 52%' },
                    { w:380, h:310, color:'rgba(190,210,235,0.14)', top:'50%', right:'-4rem', rot:14, br:'46% 54% 58% 42%/42% 58% 42% 58%' },
                    { w:320, h:260, color:'rgba(240,220,215,0.20)', top:'68%', left:'-5rem', rot:22, br:'55% 45% 50% 50%/54% 46% 54% 46%' },
                    { w:300, h:250, color:'rgba(200,230,210,0.16)', bottom:'3%', right:'-3rem', rot:-10, br:'50% 50% 44% 56%/58% 42% 58% 42%' },
                    // 中
                    { w:200, h:220, color:'rgba(230,200,210,0.16)', top:'8%', left:'22%', rot:28, br:'48% 52% 56% 44%/44% 56% 44% 56%' },
                    { w:190, h:170, color:'rgba(180,215,200,0.15)', top:'40%', right:'12%', rot:-20, br:'56% 44% 42% 58%/52% 48% 52% 48%' },
                    { w:180, h:200, color:'rgba(200,200,230,0.13)', top:'62%', left:'18%', rot:18, br:'46% 54% 48% 52%/48% 52% 48% 52%' },
                    // 小
                    { w:110, h:120, color:'rgba(225,195,200,0.20)', top:'5%', right:'18%', rot:-32, br:'62% 38% 48% 52%/44% 56% 44% 56%' },
                    { w:90, h:100, color:'rgba(185,225,210,0.17)', top:'28%', left:'48%', rot:36, br:'55% 45% 52% 48%/42% 58% 42% 58%' },
                    { w:80, h:85, color:'rgba(210,195,230,0.16)', top:'55%', left:'42%', rot:-15, br:'50% 50% 42% 58%/58% 42% 58% 42%' },
                    { w:70, h:75, color:'rgba(240,215,200,0.22)', top:'78%', right:'25%', rot:20, br:'44% 56% 56% 44%/52% 48% 52% 48%' },
                    { w:60, h:70, color:'rgba(195,220,215,0.18)', bottom:'8%', left:'55%', rot:-25, br:'58% 42% 46% 54%/50% 50% 50% 50%' },
                ],
                faq: [
                    { w:320, h:270, color:'rgba(240,236,224,0.34)', top:'2%', right:'-4rem', rot:-14, br:'50% 50% 44% 56%/58% 42% 58% 42%' },
                    { w:280, h:240, color:'rgba(195,220,215,0.14)', top:'18%', left:'-5rem', rot:18, br:'46% 54% 56% 44%/42% 58% 42% 58%' },
                    { w:240, h:200, color:'rgba(225,200,215,0.13)', top:'40%', right:'-3rem', rot:-22, br:'58% 42% 42% 58%/52% 48% 52% 48%' },
                    { w:300, h:250, color:'rgba(190,210,230,0.12)', top:'60%', left:'-4rem', rot:15, br:'44% 56% 52% 48%/48% 52% 48% 52%' },
                    { w:180, h:160, color:'rgba(240,220,215,0.18)', bottom:'5%', right:'8%', rot:-28, br:'55% 45% 48% 52%/56% 44% 56% 44%' },
                    { w:100, h:110, color:'rgba(220,195,200,0.18)', top:'10%', left:'25%', rot:30, br:'52% 48% 56% 44%/44% 56% 44% 56%' },
                    { w:80, h:90, color:'rgba(185,220,205,0.15)', top:'50%', left:'40%', rot:-15, br:'60% 40% 50% 50%/42% 58% 42% 58%' },
                ],
                access: [
                    { w:320, h:270, color:'rgba(240,236,224,0.36)', top:'3%', left:'-5rem', rot:-10, br:'54% 46% 48% 52%/46% 54% 46% 54%' },
                    { w:280, h:240, color:'rgba(200,225,215,0.15)', top:'18%', right:'-3rem', rot:22, br:'42% 58% 56% 44%/52% 48% 52% 48%' },
                    { w:260, h:220, color:'rgba(225,200,215,0.14)', top:'38%', left:'-4rem', rot:-18, br:'56% 44% 44% 56%/50% 50% 50% 50%' },
                    { w:300, h:250, color:'rgba(190,215,230,0.13)', top:'58%', right:'-4rem', rot:16, br:'48% 52% 52% 48%/44% 56% 44% 56%' },
                    { w:240, h:200, color:'rgba(240,220,215,0.18)', bottom:'5%', left:'-3rem', rot:25, br:'60% 40% 46% 54%/58% 42% 58% 42%' },
                    { w:120, h:130, color:'rgba(220,195,200,0.16)', top:'8%', left:'30%', rot:-25, br:'55% 45% 52% 48%/42% 58% 42% 58%' },
                    { w:90, h:100, color:'rgba(185,220,205,0.15)', top:'48%', right:'15%', rot:35, br:'50% 50% 42% 58%/58% 42% 58% 42%' },
                ],
            };
            const blobs = blobConfigs[pageName] || blobConfigs.home;
            return `<div style="position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;pointer-events:none;z-index:${zIndex};">${blobs.map(b => {
                let s = `position:absolute;width:${b.w}px;height:${b.h}px;background:${b.color};border-radius:${b.br};transform:rotate(${b.rot}deg);pointer-events:none;`;
                if (b.top) s += `top:${b.top};`;
                if (b.bottom) s += `bottom:${b.bottom};`;
                if (b.left) s += `left:${b.left};`;
                if (b.right) s += `right:${b.right};`;
                return `<div style="${s}"></div>`;
            }).join('')}</div>`;
        }

        /**
         * 渲染 - 首頁
         */
        function renderHome() {
            let html = `
                <!-- Hero 封面區 -->
                
                <div style="position:relative;">
                <section class="hero-full-width relative mb-0" style="position:relative;overflow:hidden;">
                    <!-- 不規則圓形裝飾 hero -->
                    <div style="position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;pointer-events:none;z-index:2;">
                        <div style="position:absolute;width:340px;height:280px;background:rgba(240,236,224,0.35);border-radius:58% 42% 50% 50%/48% 56% 44% 52%;transform:rotate(-12deg);top:-5%;left:-5rem;"></div>
                        <div style="position:absolute;width:180px;height:160px;background:rgba(195,228,218,0.18);border-radius:52% 48% 44% 56%/54% 46% 54% 46%;transform:rotate(22deg);top:20%;right:8%;"></div>
                        <div style="position:absolute;width:100px;height:110px;background:rgba(225,200,215,0.20);border-radius:55% 45% 52% 48%/42% 58% 42% 58%;transform:rotate(30deg);bottom:10%;left:30%;"></div>
                    </div>
                    <!-- 左側圖片區 -->
                    <div class="hero-right">
                        <div class="hero-image-grid">
                            <div class="hero-image-item">
                                <img src="img/cover1.jpg" alt="${t('京都清水寺和服體驗 - NicoNico 免費髮型服務')}" onerror="this.src='https://placehold.co/600x800/F5E6D3/000000?text=${encodeURIComponent(t('封面照1'))}';">
                    </div>
                            <div class="hero-image-item">
                                <img src="img/cover2.jpg" alt="${t('京都和服租借 - NicoNico Kimono 專業造型')}" onerror="this.src='https://placehold.co/600x800/F5E6D3/000000?text=${encodeURIComponent(t('封面照2'))}';">
                            </div>
                            <div class="hero-image-item">
                                <img src="img/cover3.jpg" alt="${t('京都清水寺和服體驗 - NicoNico 蕾絲和服振袖')}" onerror="this.src='https://placehold.co/600x800/F5E6D3/000000?text=${encodeURIComponent(t('封面照3'))}';">
                            </div>
                            <div class="hero-image-item">
                                <img src="img/cover4.jpg" alt="${t('京都八阪神社和服散策 - NicoNico Kimono')}" onerror="this.src='https://placehold.co/600x800/F5E6D3/000000?text=${encodeURIComponent(t('封面照4'))}';">
                            </div>
                        </div>
                    </div>
                    
                    <!-- 右側文字區 -->
                    <div class="hero-left">
                        <!-- SEO H1：含核心關鍵字，視覺隱藏但搜尋引擎可讀 -->
                        <h1 style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">
                            ${t('京都清水寺旁，提供免費髮型設計的專業和服租借')} - NicoNico Kimono
                        </h1>
                        <div class="hero-main-text">
                            京都で、<br>
                            ニコニコ笑顔の<br>
                            物語を
                        </div>
                        <div class="hero-sub-text">
                            In Kyoto,<br>
                            create your story<br>
                            with smiles.
                        </div>
                    </div>
                </section>

                <!-- 波浪分隔線 -->
                <div style="position: relative; width: 100%; height: 100px; margin-bottom: -1px; overflow: hidden; z-index: 1;">
                    <svg viewBox="0 0 1200 100" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;">
                        <path d="M0,50 C200,20 400,80 600,50 C800,20 1000,80 1200,50 L1200,100 L0,100 Z" fill="#FFFCF7" />
                    </svg>
                </div>

                <!-- 價格表 -->
                <div class="content-section p-8 md:p-16 mb-0" style="max-width: 1200px; margin-left: auto; margin-right: auto; background: #FFFCF7;">
                    
                    <!-- NOTICE & EVENTS 區塊 -->
                    <div class="topics-pickup-section" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-bottom: 5rem; padding-bottom: 3rem; border-bottom: 1px solid #e5e7eb; position: relative;">
                        <!-- 不規則圓形裝飾 NOTICE -->
                        <div style="position:absolute;width:300px;height:250px;background:rgba(190,215,230,0.14);border-radius:48% 52% 44% 56%/54% 46% 54% 46%;transform:rotate(18deg);top:-10%;right:-3rem;pointer-events:none;z-index:0;"></div>
                        <div style="position:absolute;width:160px;height:140px;background:rgba(225,200,215,0.16);border-radius:56% 44% 52% 48%/46% 54% 46% 54%;transform:rotate(-20deg);bottom:-8%;left:-2rem;pointer-events:none;z-index:0;"></div>
                        <div style="position:absolute;width:90px;height:100px;background:rgba(200,228,218,0.18);border-radius:60% 40% 48% 52%/44% 56% 44% 56%;transform:rotate(30deg);top:35%;left:48%;pointer-events:none;z-index:0;"></div>
                        <!-- 左側：NOTICE -->
                        <div>
                            <h3 style="font-size: 0.875rem; font-weight: 600; color: #9ca3af; letter-spacing: 0.2em; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif;">NOTICE</h3>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="display: flex; gap: 1.5rem; padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6; font-size: 0.875rem; color: #544739;">
                                    <span style="color: #9ca3af; flex-shrink: 0; width: 5rem;">2026.02</span>
                                    <span>${t('【重要】只要留下五星Google評論 即可免費使用茶室(15m)！')}</span>
                                </li>
                                <li style="display: flex; gap: 1.5rem; padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6; font-size: 0.875rem; color: #544739;">
                                    <span style="color: #9ca3af; flex-shrink: 0; width: 5rem;">2026.01</span>
                                    <span>${t('【通知】高級訪問服新款到貨！')}</span>
                                </li>
                                <li style="display: flex; gap: 1.5rem; padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6; font-size: 0.875rem; color: #544739; cursor: pointer;" onclick="location.hash='plan/plan15';">
                                    <span style="color: #9ca3af; flex-shrink: 0; width: 5rem;">2025.12</span>
                                    <span>${t('【通知】推出情侶套餐')}</span>
                                </li>
                                <li style="display: flex; gap: 1.5rem; padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6; font-size: 0.875rem; color: #544739; cursor: pointer;" onclick="location.hash='photo-plans';">
                                    <span style="color: #9ca3af; flex-shrink: 0; width: 5rem;">2025.11</span>
                                    <span>${t('【通知】攝影方案全面升級')}</span>
                                </li>
                                <li style="display: flex; gap: 1.5rem; padding: 0.75rem 0; font-size: 0.875rem; color: #544739; cursor: pointer;" onclick="location.hash='tea-room';">
                                    <span style="color: #9ca3af; flex-shrink: 0; width: 5rem;">2025.10</span>
                                    <span>${t('【通知】店內茶室空間翻新完成')}</span>
                                </li>
                            </ul>
                        </div>
                        
                        <!-- 右側：EVENTS -->
                        <div>
                            <h3 style="font-size: 0.875rem; font-weight: 600; color: #9ca3af; letter-spacing: 0.2em; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif;">EVENTS</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                                <!-- Events 1 -->
                                <div style="cursor: pointer;" onclick="location.hash='tea-room';">
                                    <div style="aspect-ratio: 4/3; overflow: hidden; margin-bottom: 0.75rem;">
                                        <img src="img/tearoom_cover.jpg" alt="${t('茶室體驗')}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='img/tearoom1.jpg'">
                                    </div>
                                    <p style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 0.25rem;">${t('茶室體驗')}</p>
                                    <p style="font-size: 0.875rem; color: #544739; font-weight: 500;">${t('抹茶體驗 NEW OPEN')}</p>
                                </div>
                                <!-- Events 2 -->
                                <div style="cursor: pointer;" onclick="location.hash='photo-plans';">
                                    <div style="aspect-ratio: 4/3; overflow: hidden; margin-bottom: 0.75rem;">
                                        <img src="img/closeup1.jpg" alt="${t('攝影方案')}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='img/cover1.jpg'">
                                    </div>
                                    <p style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 0.25rem;">${t('攝影服務')}</p>
                                    <p style="font-size: 0.875rem; color: #544739; font-weight: 500;">${t('專業外拍方案')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Top 5 區塊 -->
                    
                    <div class="top5-section" style="position:relative;overflow:visible;">
                        <!-- 不規則圓形裝飾 Top5 -->
                        <div style="position:absolute;width:320px;height:270px;background:rgba(240,236,224,0.30);border-radius:44% 56% 38% 62%/52% 60% 40% 48%;transform:rotate(-14deg);top:5%;left:-4rem;pointer-events:none;z-index:0;"></div>
                        <div style="position:absolute;width:200px;height:180px;background:rgba(185,220,210,0.16);border-radius:58% 42% 48% 52%/50% 50% 50% 50%;transform:rotate(25deg);top:40%;right:-3rem;pointer-events:none;z-index:0;"></div>
                        <div style="position:absolute;width:110px;height:120px;background:rgba(210,200,228,0.18);border-radius:52% 48% 56% 44%/44% 56% 44% 56%;transform:rotate(-28deg);bottom:8%;left:20%;pointer-events:none;z-index:0;"></div>
                        <div class="top5-header">
                            <h2 class="top5-title">Top 5</h2>
                            <div style="text-align: center; margin-top: 1rem;">
                                <a href="#kimono-plans" class="top5-view-more" onclick="window.scrollTo({ top: 0, behavior: 'smooth' }); return true;">${t('查看更多')}</a>
                            </div>
                        </div>
                        <div class="top5-grid">
                            <!-- 1. 蕾絲 -->
                            <div class="top5-card" onclick="location.hash='plan/plan3';" data-card="lace">
                                <div class="top5-card-image">
                                    <img src="img/top5_lace1.jpg" alt="${t('蕾絲套餐')}" class="img-main show" onerror="this.src='https://placehold.co/300x360/ec4899/ffffff?text=蕾絲套餐';">
                                    <img src="img/top5_lace2.jpg" alt="${t('蕾絲套餐')}" class="img-hover" onerror="this.src='https://placehold.co/300x360/ec4899/ffffff?text=蕾絲套餐';">
                                    <img src="img/top5_lace3.jpg" alt="${t('蕾絲套餐')}" class="img-hover-2" onerror="this.src='https://placehold.co/300x360/ec4899/ffffff?text=蕾絲套餐';">
                                    <div class="top5-badge">1</div>
                                </div>
                                <div class="top5-card-info">
                                    <div class="top5-color-options">
                                        <div class="top5-color-dot" style="background: #a7f3d0;"></div>
                                        <div class="top5-color-dot" style="background: #ffffff; border: 1px solid #e5e5e5;"></div>
                                        <div class="top5-color-dot" style="background: #065f46;"></div>
                                    </div>
                                    <div class="top5-card-name">${t('蕾絲套餐')}</div>
                                    <div class="top5-card-price">
                                        <span class="top5-price-sale">¥7,700</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 2. 訪問服 -->
                            <div class="top5-card" onclick="location.hash='plan/plan5';" data-card="houmongi">
                                <div class="top5-card-image">
                                    <img src="img/top5_houmongi1.jpg" alt="${t('訪問服套餐')}" class="img-main show" onerror="this.src='https://placehold.co/300x360/34d399/ffffff?text=訪問服套餐';">
                                    <img src="img/top5_houmongi2.jpg" alt="${t('訪問服套餐')}" class="img-hover" onerror="this.src='https://placehold.co/300x360/34d399/ffffff?text=訪問服套餐';">
                                    <img src="img/top5_houmongi3.jpg" alt="${t('訪問服套餐')}" class="img-hover-2" onerror="this.src='https://placehold.co/300x360/34d399/ffffff?text=訪問服套餐';">
                                    <div class="top5-badge">2</div>
                                </div>
                                <div class="top5-card-info">
                                    <div class="top5-color-options">
                                        <div class="top5-color-dot" style="background: #fce7f3;"></div>
                                        <div class="top5-color-dot" style="background: #e9d5ff;"></div>
                                        <div class="top5-color-dot" style="background: #fef3c7;"></div>
                                    </div>
                                    <div class="top5-card-name">${t('訪問服套餐')}</div>
                                    <div class="top5-card-price">
                                        <span class="top5-price-sale">¥11,000~</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 3. 高定振袖 -->
                            <div class="top5-card" onclick="location.hash='plan/plan8';" data-card="furisode">
                                <div class="top5-card-image">
                                    <img src="img/top5_luxury_furisode1.jpg" alt="${t('高定振袖套餐')}" class="img-main show" onerror="this.src='https://placehold.co/300x360/d946ef/ffffff?text=高定振袖套餐';">
                                    <img src="img/top5_luxury_furisode2.jpg" alt="${t('高定振袖套餐')}" class="img-hover" onerror="this.src='https://placehold.co/300x360/d946ef/ffffff?text=高定振袖套餐';">
                                    <img src="img/top5_luxury_furisode3.jpg" alt="${t('高定振袖套餐')}" class="img-hover-2" onerror="this.src='https://placehold.co/300x360/d946ef/ffffff?text=高定振袖套餐';">
                                    <div class="top5-badge">3</div>
                                </div>
                                <div class="top5-card-info">
                                    <div class="top5-color-options">
                                        <div class="top5-color-dot" style="background: #fef3c7;"></div>
                                        <div class="top5-color-dot" style="background: #fce7f3;"></div>
                                        <div class="top5-color-dot" style="background: #e9d5ff;"></div>
                                    </div>
                                    <div class="top5-card-name">${t('高定振袖套餐')}</div>
                                    <div class="top5-card-price">
                                        <span class="top5-price-sale">¥27,500</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 4. 黑留袖 -->
                            <div class="top5-card" onclick="location.hash='plan/plan7';" data-card="tomesode">
                                <div class="top5-card-image">
                                    <img src="img/top5_kurotomesode1.jpg" alt="${t('黑留袖套餐')}" class="img-main show" onerror="this.src='https://placehold.co/300x360/1c1917/ffffff?text=黑留袖套餐';">
                                    <img src="img/top5_kurotomesode2.jpg" alt="${t('黑留袖套餐')}" class="img-hover" onerror="this.src='https://placehold.co/300x360/1c1917/ffffff?text=黑留袖套餐';">
                                    <img src="img/top5_kurotomesode3.jpg" alt="${t('黑留袖套餐')}" class="img-hover-2" onerror="this.src='https://placehold.co/300x360/1c1917/ffffff?text=黑留袖套餐';">
                                    <div class="top5-badge">4</div>
                                </div>
                                <div class="top5-card-info">
                                    <div class="top5-color-options">
                                        <div class="top5-color-dot" style="background: #1c1917;"></div>
                                        <div class="top5-color-dot" style="background: #374151;"></div>
                                        <div class="top5-color-dot" style="background: #4b5563;"></div>
                                    </div>
                                    <div class="top5-card-name">${t('黑留袖套餐')}</div>
                                    <div class="top5-card-price">
                                        <span class="top5-price-sale">¥11,000</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 5. 二尺袖 -->
                            <div class="top5-card" onclick="location.hash='plan/plan4';" data-card="nishaku">
                                <div class="top5-card-image">
                                    <img src="img/top5_nishaku1.jpg" alt="${t('二尺袖套餐')}" class="img-main show" onerror="this.src='https://placehold.co/300x360/86198f/ffffff?text=二尺袖套餐';">
                                    <img src="img/top5_nishaku2.jpg" alt="${t('二尺袖套餐')}" class="img-hover" onerror="this.src='https://placehold.co/300x360/86198f/ffffff?text=二尺袖套餐';">
                                    <img src="img/top5_nishaku3.jpg" alt="${t('二尺袖套餐')}" class="img-hover-2" onerror="this.src='https://placehold.co/300x360/86198f/ffffff?text=二尺袖套餐';">
                                    <div class="top5-badge">5</div>
                                </div>
                                <div class="top5-card-info">
                                    <div class="top5-color-options">
                                        <div class="top5-color-dot" style="background: #fce7f3;"></div>
                                        <div class="top5-color-dot" style="background: #f9a8d4;"></div>
                                        <div class="top5-color-dot" style="background: #ec4899;"></div>
                                    </div>
                                    <div class="top5-card-name">${t('二尺袖套餐')}</div>
                                    <div class="top5-card-price">
                                        <span class="top5-price-sale">¥8,800</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 價格表 - 日系簡約雜誌風格 -->
                    <div class="menu-price-section" id="price-list">
                        <div class="menu-price-header">
                            <span class="menu-price-label">price list</span>
                            <div class="menu-price-line"></div>
                            <h2 class="menu-price-title">${t('價格表')}</h2>
                        </div>
                        
                        <div class="menu-price-grid">
                            <!-- 左欄 -->
                            <div class="menu-price-column">
                                <!-- 女士套餐 -->
                                <div class="menu-price-category">
                                    <span class="menu-price-category-en">for ladies</span>
                                    <h3 class="menu-price-category-title">${t('女士套餐')}</h3>
                                </div>
                                <div class="menu-price-item" onclick="location.hash='plan/plan1';">
                                    <span class="menu-price-name">${t('小紋套餐')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>5,500</span>
                                </div>
                                <div class="menu-price-item" onclick="location.hash='plan/plan2';">
                                    <span class="menu-price-name">${t('高級小紋套餐')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>7,700</span>
                                </div>
                                <div class="menu-price-item" onclick="location.hash='plan/plan3';">
                                    <span class="menu-price-name">${t('蕾絲套餐')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>7,700</span>
                                </div>
                                <div class="menu-price-item" onclick="location.hash='plan/plan4';">
                                    <span class="menu-price-name">${t('二尺袖套餐')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>8,800</span>
                                </div>
                                <div class="menu-price-item" onclick="location.hash='plan/plan5';">
                                    <span class="menu-price-name">${t('訪問服套餐')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>11,000~16,500</span>
                                </div>
                                <div class="menu-price-item" onclick="location.hash='plan/plan7';">
                                    <span class="menu-price-name">${t('黑留袖套餐')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>11,000</span>
                                </div>
                                <div class="menu-price-item" onclick="location.hash='plan/plan13';">
                                    <span class="menu-price-name">${t('袴套餐')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>11,000~</span>
                            </div>
                                <div class="menu-price-item" onclick="location.hash='plan/plan8';">
                                    <span class="menu-price-name">${t('振袖套餐')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>9,900~27,500</span>
                                </div>
                                </div>
                            
                            <!-- 右欄 -->
                            <div class="menu-price-column">
                                <!-- 男士套餐 -->
                                <div class="menu-price-category">
                                    <span class="menu-price-category-en">for gentlemen</span>
                                    <h3 class="menu-price-category-title">${t('男士套餐')}</h3>
                                </div>
                                <div class="menu-price-item" onclick="location.hash='plan/plan10';">
                                    <span class="menu-price-name">${t('和服套餐')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>5,500~8,800</span>
                                </div>
                                <div class="menu-price-item" onclick="location.hash='plan/plan11';">
                                    <span class="menu-price-name">${t('高級武士服套餐')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>16,500</span>
                                </div>
                                
                                <!-- 其他套餐 -->
                                <div class="menu-price-category" style="margin-top: 3rem;">
                                    <span class="menu-price-category-en">kids & couple</span>
                                    <h3 class="menu-price-category-title">${t('其他套餐')}</h3>
                                </div>
                                <div class="menu-price-item" onclick="location.hash='plan/plan14';">
                                    <span class="menu-price-name">${t('小孩和服套餐')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>5,500</span>
                            </div>
                                <div class="menu-price-item" onclick="location.hash='plan/plan15';">
                                    <span class="menu-price-name">${t('情侶和服套餐')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>9,900~</span>
                        </div>
                        
                                <!-- 加購服務 -->
                                <div class="menu-price-category" style="margin-top: 3rem;">
                                    <span class="menu-price-category-en">additional services</span>
                                    <h3 class="menu-price-category-title">${t('加購服務')}</h3>
                                    </div>
                                <div class="menu-price-item" onclick="location.hash='photo-plans';">
                                    <span class="menu-price-name">${t('攝影方案')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>15,000~</span>
                                    </div>
                                <div class="menu-price-item" onclick="location.hash='tea-room';">
                                    <span class="menu-price-name">${t('茶室租借')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>3,000</span>
                                </div>
                                <div class="menu-price-item" onclick="location.hash='tea-room';">
                                    <span class="menu-price-name">${t('抹茶體驗')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>4,000~</span>
                                    </div>
                                <div class="menu-price-item">
                                    <span class="menu-price-name">${t('飯店歸還')}</span>
                                    <span class="menu-price-dots"></span>
                                    <span class="menu-price-value"><span class="menu-price-yen">¥</span>3,300</span>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>

                <!-- 上波浪 - 從淺色過渡到綠色（本店特色頂部） -->
                <div class="feature-wave-top" style="position: relative; width: 100%; height: 100px; margin-top: -1px; overflow: hidden; z-index: 2;">
                    <svg viewBox="0 0 1200 100" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;">
                        <path d="M0,100 L1200,100 L1200,50 C1000,80 800,20 600,50 C400,80 200,20 0,50 Z" fill="#879A94" />
                    </svg>
                </div>

                <!-- 本店特色 -->
                <div class="feature-section-wrapper">
                    <div class="feature-background-illustrations">
                        <!-- 和服插畫 -->
                        <svg class="feature-illustration" style="top: 10%; left: 5%; width: 120px; height: 150px;" viewBox="0 0 100 120">
                            <path d="M30,20 L30,100 M50,15 L50,100 M70,20 L70,100 M20,30 Q20,25 30,25 Q40,25 40,30 M60,30 Q60,25 70,25 Q80,25 80,30 M30,50 Q30,45 50,45 Q70,45 70,50" stroke-linecap="round"/>
                        </svg>
                        <!-- 蝴蝶結插畫 -->
                        <svg class="feature-illustration" style="top: 15%; right: 8%; width: 80px; height: 60px;" viewBox="0 0 80 60">
                            <path d="M20,30 Q10,20 20,10 Q30,20 20,30 M60,30 Q70,20 60,10 Q50,20 60,30 M40,15 Q40,5 40,5 M40,45 Q40,55 40,55" stroke-linecap="round"/>
                        </svg>
                        <!-- 愛心插畫 -->
                        <svg class="feature-illustration" style="top: 25%; left: 15%; width: 50px; height: 45px;" viewBox="0 0 50 45">
                            <path d="M25,35 C25,35 10,25 10,15 C10,10 15,8 20,12 C25,8 30,10 30,15 C30,25 25,35 25,35 Z" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <!-- 櫻花插畫 -->
                        <svg class="feature-illustration" style="top: 40%; right: 12%; width: 60px; height: 60px;" viewBox="0 0 60 60">
                            <circle cx="30" cy="30" r="15" fill="none"/>
                            <path d="M30,15 Q35,20 30,25 Q25,20 30,15 M45,30 Q40,35 35,30 Q40,25 45,30 M30,45 Q25,40 30,35 Q35,40 30,45 M15,30 Q20,25 25,30 Q20,35 15,30" stroke-linecap="round"/>
                        </svg>
                        <!-- 和服袖子插畫 -->
                        <svg class="feature-illustration" style="bottom: 20%; left: 8%; width: 100px; height: 80px;" viewBox="0 0 100 80">
                            <path d="M20,10 Q10,20 15,40 Q20,60 30,70 Q40,75 50,70 Q60,65 65,50 Q70,30 80,20 Q75,10 60,15 Q45,20 30,15 Q25,12 20,10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <!-- 扇子插畫 -->
                        <svg class="feature-illustration" style="bottom: 15%; right: 10%; width: 70px; height: 50px;" viewBox="0 0 70 50">
                            <path d="M10,25 Q35,5 60,25 M10,25 Q35,15 60,25 M10,25 Q35,25 60,25 M10,25 Q35,35 60,25 M10,25 Q35,45 60,25" stroke-linecap="round"/>
                        </svg>
                        <!-- 小愛心 -->
                        <svg class="feature-illustration" style="top: 60%; left: 20%; width: 35px; height: 30px;" viewBox="0 0 35 30">
                            <path d="M17.5,25 C17.5,25 7,17 7,10 C7,6 9,5 12,7 C17.5,5 22,6 22,10 C22,17 17.5,25 17.5,25 Z" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <!-- 蝴蝶結2 -->
                        <svg class="feature-illustration" style="top: 70%; right: 15%; width: 60px; height: 45px;" viewBox="0 0 60 45">
                            <path d="M15,22 Q8,15 15,8 Q22,15 15,22 M45,22 Q52,15 45,8 Q38,15 45,22 M30,5 Q30,2 30,2 M30,40 Q30,43 30,43" stroke-linecap="round"/>
                        </svg>
                        <!-- 和服輪廓 -->
                        <svg class="feature-illustration" style="bottom: 10%; left: 25%; width: 90px; height: 110px;" viewBox="0 0 90 110">
                            <path d="M25,10 Q25,5 45,5 Q65,5 65,10 M25,10 L25,100 M65,10 L65,100 M20,30 Q20,25 25,25 Q30,25 30,30 M60,30 Q60,25 65,25 Q70,25 70,30" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>

                    <div class="feature-service-container">
                        <h2 class="feature-service-title">${t('本店特色')}</h2>
                        <div class="feature-service-grid">
                            <!-- 特色 01: 免費隔日歸還 -->
                            <div class="feature-service-item clickable" onclick="location.hash='faq'; setTimeout(() => { const faqItem = document.getElementById('return-time-faq'); const faqQuestion = faqItem?.querySelector('.faq-question'); const faqAnswer = faqItem?.querySelector('.faq-answer'); const faqIcon = faqItem?.querySelector('.faq-icon'); if (faqAnswer && !faqAnswer.classList.contains('active')) { faqAnswer.classList.add('active'); faqIcon?.classList.add('active'); } faqItem?.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 100);">
                                <div class="feature-service-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                            </div>
                                <div class="feature-service-main-title">${t('免費隔日歸還')}</div>
                                <div class="feature-service-sub-title">Next Day Return</div>
                                <div class="feature-service-description">${t('最晚可隔日中午前歸還，不用匆忙趕時間。讓您有充足的時間享受京都之旅，無需擔心時間壓力。')}</div>
                            </div>

                            <!-- 特色 02: 可跨店歸還 -->
                            <div class="feature-service-item clickable" onclick="location.hash='faq'; setTimeout(() => { const faqItem = document.getElementById('cross-store-return-faq'); const faqAnswer = faqItem?.querySelector('.faq-answer'); const faqIcon = faqItem?.querySelector('.faq-icon'); if (faqAnswer && !faqAnswer.classList.contains('active')) { faqAnswer.classList.add('active'); faqIcon?.classList.add('active'); } faqItem?.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 100);">
                                <div class="feature-service-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </div>
                                <div class="feature-service-main-title">${t('可跨店歸還')}</div>
                                <div class="feature-service-sub-title">Cross-Store Return</div>
                                <div class="feature-service-description">${t('祇園店 / 清水寺店皆可歸還，行程安排更自由。無論您在哪裡結束旅程，都能方便歸還和服。')}</div>
                        </div>

                            <!-- 特色 03: 多種免費髮型 -->
                            <div class="feature-service-item clickable" onclick="location.hash='hairstyle';">
                                <div class="feature-service-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                            </div>
                                <div class="feature-service-main-title">${t('多種免費髮型')}</div>
                                <div class="feature-service-sub-title">Free Hairstyles</div>
                                <div class="feature-service-description">${t('提供多款可愛髮型，部分升級造型也可加價選擇。專業髮型師為您打造完美日式造型。')}</div>
                            </div>

                            <!-- 特色 04: 專業攝影師 -->
                            <div class="feature-service-item clickable" onclick="location.hash='photo-plans';">
                                <div class="feature-service-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                </div>
                                <div class="feature-service-main-title">${t('專業攝影師')}</div>
                                <div class="feature-service-sub-title">Professional Photographer</div>
                                <div class="feature-service-description">${t('熟悉京都景點與光線，為您記錄最美京都時光。專業攝影師捕捉您最動人的瞬間。')}</div>
                        </div>

                            <!-- 特色 05: 茶室租借 -->
                            <div class="feature-service-item clickable" onclick="location.hash='tea-room';">
                                <div class="feature-service-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                            </div>
                                <div class="feature-service-main-title">${t('茶室租借')}</div>
                                <div class="feature-service-sub-title">Tea Room Rental</div>
                                <div class="feature-service-description">${t('店內附設日式茶室，可拍照或搭配抹茶體驗。在傳統日式空間中留下珍貴回憶。')}</div>
                            </div>

                            <!-- 特色 06: 服務親切 -->
                            <div class="feature-service-item clickable" onclick="location.hash='store-intro'; setTimeout(() => { const staffGallery = document.getElementById('staff-gallery'); if (staffGallery) { staffGallery.scrollIntoView({behavior: 'smooth', block: 'center'}); setTimeout(() => { const galleryImg = staffGallery.querySelector('.store-gallery-cover'); if (galleryImg) { galleryImg.click(); } }, 300); } }, 100);">
                                <div class="feature-service-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <div class="feature-service-main-title">${t('服務親切')}</div>
                                <div class="feature-service-sub-title">Friendly Service</div>
                                <div class="feature-service-description">${t('中文、英文、日文對應的工作人員，耐心協助挑選和服。親切專業的服務讓您安心享受和服體驗。')}</div>
                            </div>
                        </div>
                            </div>
                    <!-- 底部波浪：絕對定位，從綠色區塊底部長出，壓在白色區塊上 -->
                    <div class="feature-bottom-wave">
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;">
                            <path d="M0,0 L1200,0 L1200,60 C1050,95 900,25 750,60 C600,95 450,25 300,60 C150,95 50,40 0,60 Z" fill="#879A94"/>
                    </svg>
                    </div>
                </div>

                <!-- 封面照展示區 - 雜誌風格 -->
                <div class="content-section p-8 md:p-16 mb-0" style="max-width: 100%; margin-left: auto; margin-right: auto; background: #FFFCF7; position:relative; overflow:hidden;">
                    <!-- 不規則圓形裝飾 封面照 -->
                    <div style="position:absolute;width:300px;height:260px;background:rgba(195,225,220,0.16);border-radius:50% 50% 42% 58%/58% 42% 58% 42%;transform:rotate(16deg);top:-5%;right:-4rem;pointer-events:none;z-index:0;"></div>
                    <div style="position:absolute;width:180px;height:200px;background:rgba(230,200,210,0.15);border-radius:46% 54% 58% 42%/42% 58% 42% 58%;transform:rotate(-22deg);bottom:5%;left:-3rem;pointer-events:none;z-index:0;"></div>
                    <div style="position:absolute;width:100px;height:90px;background:rgba(200,210,230,0.18);border-radius:55% 45% 48% 52%/56% 44% 56% 44%;transform:rotate(35deg);top:40%;left:15%;pointer-events:none;z-index:0;"></div>
                    
                    <div class="magazine-photos-container">
                        <div class="magazine-photos-layout">
                            <!-- 封面照5 - 左側大圖 -->
                            <div class="magazine-photo-item magazine-photo-5">
                                <img src="img/cover5.jpg" alt="${t('封面照5')}" onerror="this.src='https://placehold.co/700x500/F5E6D3/000000?text=${encodeURIComponent(t('封面照5'))}';">
                            </div>

                            <!-- 封面照6 - 右上小圖 -->
                            <div class="magazine-photo-item magazine-photo-6">
                                <img src="img/cover6.jpg" alt="${t('封面照6')}" onerror="this.src='https://placehold.co/500x240/F5E6D3/000000?text=${encodeURIComponent(t('封面照6'))}';">
                            </div>

                            <!-- 封面照7 - 右下小圖 -->
                            <div class="magazine-photo-item magazine-photo-7">
                                <img src="img/cover7.jpg" alt="${t('封面照7')}" onerror="this.src='https://placehold.co/500x240/F5E6D3/000000?text=${encodeURIComponent(t('封面照7'))}';">

                            </div>
                        
                        <!-- 文字區塊 -->
                        <div class="magazine-text-block">
                            <div class="magazine-text-number">Kyoto</div>
                            <div class="magazine-text-line"></div>
                            <div class="magazine-text-title">${t('在京都，<br>留下美好的回憶')}</div>
                            <div class="magazine-text-english">In Kyoto,<br>create beautiful memories</div>
                        </div>
                        
                        <div class="magazine-quote-box">
                            <div class="magazine-quote-text">
                                ${t('穿上優雅的和服，漫步於傳統街道，感受日本文化的魅力。每一張照片都記錄著美好的時光，讓您的京都之旅更加難忘。')}
                            </div>
                        </div>

                        <!-- 右側垂直文字 -->
                        <div class="magazine-vertical-text">
                            京都で、<br>あなたの物語を<br>着物で彩る。
                        </div>
                    </div>
                    </div>
                        </div>
                    </div>

                <!-- 波浪分隔線 - 封面照下波浪，過渡到和服方案 -->
                <div style="position: relative; width: 100%; height: 100px; margin-top: -1px; overflow: hidden; z-index: 1;">
                    <svg viewBox="0 0 1200 100" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;">
                        <path d="M0,0 L1200,0 L1200,50 C1000,80 800,20 600,50 C400,80 200,20 0,50 Z" fill="#FFFCF7" />
                    </svg>
                </div>

                <!-- 和服方案 -->
                <div class="km-wrapper" style="position:relative;overflow:hidden;">

                <!-- 背景花瓣裝飾 -->
                <div class="km-bg-petals">
                    <svg class="km-petal km-petal-1" viewBox="0 0 30 30"><path d="M15 2 Q20 8 18 15 Q15 22 10 18 Q5 14 8 8 Q11 2 15 2Z" fill="#d4a5a5"/></svg>
                    <svg class="km-petal km-petal-2" viewBox="0 0 30 30"><path d="M15 2 Q20 8 18 15 Q15 22 10 18 Q5 14 8 8 Q11 2 15 2Z" fill="#c9a96e"/></svg>
                    <svg class="km-petal km-petal-3" viewBox="0 0 30 30"><path d="M15 2 Q20 8 18 15 Q15 22 10 18 Q5 14 8 8 Q11 2 15 2Z" fill="#bfc7b3"/></svg>
                    <svg class="km-petal km-petal-4" viewBox="0 0 30 30"><path d="M15 2 Q20 8 18 15 Q15 22 10 18 Q5 14 8 8 Q11 2 15 2Z" fill="#d4a5a5"/></svg>
                    <svg class="km-petal km-petal-5" viewBox="0 0 30 30"><path d="M15 2 Q20 8 18 15 Q15 22 10 18 Q5 14 8 8 Q11 2 15 2Z" fill="#c9a96e"/></svg>
                    <svg class="km-petal km-petal-6" viewBox="0 0 30 30"><path d="M15 2 Q20 8 18 15 Q15 22 10 18 Q5 14 8 8 Q11 2 15 2Z" fill="#bfc7b3"/></svg>
                </div>

                <!-- 不規則圓形裝飾 和服方案 -->
                <div style="position:absolute;width:340px;height:280px;background:rgba(240,236,224,0.28);border-radius:52% 48% 40% 60%/56% 44% 56% 44%;transform:rotate(-10deg);top:3%;right:-4rem;pointer-events:none;z-index:0;"></div>
                <div style="position:absolute;width:200px;height:170px;background:rgba(195,220,215,0.16);border-radius:44% 56% 54% 46%/48% 52% 48% 52%;transform:rotate(20deg);top:50%;left:-3rem;pointer-events:none;z-index:0;"></div>
                <div style="position:absolute;width:110px;height:100px;background:rgba(225,200,220,0.18);border-radius:60% 40% 50% 50%/42% 58% 42% 58%;transform:rotate(-25deg);bottom:10%;right:15%;pointer-events:none;z-index:0;"></div>

                <!-- 不對稱幾何裝飾 -->
                <div class="km-geo-line km-geo-line-left"></div>
                <div class="km-geo-line km-geo-line-right"></div>
                <div class="km-geo-rect km-geo-rect-1"></div>
                <div class="km-geo-rect km-geo-rect-2"></div>

                <div class="km-container">
                    <!-- Section Header -->
                    <div class="km-header">
                        <span class="km-header-en">kimono plans</span>
                        <div class="km-header-line"></div>
                        <h2 class="km-header-title">${t('和服方案')}</h2>
                    </div>
                    
                    <!-- 女士方案 -->
                    <div class="km-category">
                        <span class="km-category-en">for ladies</span>
                        <div class="km-grid">
            `;

            kimonoPlans.forEach(plan => {
                if (plan.id && ['plan1','plan2','plan3','plan4','plan5','plan7','plan13','plan8'].includes(plan.id)) {
                    const displayName = t(plan.name.replace('【女士】', ''));
                    const priceNum = t(plan.price).replace('（含稅）', '').replace('（税込）', '');
                    const isPopular = plan.id === 'plan2' || plan.id === 'plan3';
                    html += `
                            <div class="km-item" onclick="location.hash='plan/${plan.id}';">
                                <div class="km-item-visual">
                                    <div class="km-vertical-label">${displayName}</div>
                                    <div class="km-item-img">
                                        ${isPopular ? `<div class="km-stamp"><span class="km-stamp-text">${t('人氣')}</span><span class="km-stamp-en">Popular</span></div>` : ''}
                                        <img src="${plan.image}" alt="${t(plan.name)}" onerror="this.onerror=null; this.src='https://placehold.co/300x400/f5f5f5/999999?text=${encodeURIComponent(displayName)}'">
                                    </div>
                                </div>
                                <div class="km-item-info">
                                    <div class="km-kamon">
                                        <svg viewBox="0 0 40 40" fill="none" stroke="#bbb" stroke-width="0.4">
                                            <circle cx="20" cy="20" r="16"/>
                                            <circle cx="20" cy="20" r="8"/>
                                            <line x1="20" y1="4" x2="20" y2="12"/>
                                            <line x1="20" y1="28" x2="20" y2="36"/>
                                            <line x1="4" y1="20" x2="12" y2="20"/>
                                            <line x1="28" y1="20" x2="36" y2="20"/>
                                        </svg>
                                </div>
                                    <span class="km-tag">${t('女士')}</span>
                                    <h3 class="km-name">${displayName}</h3>
                                    <p class="km-desc">${t(plan.shortDesc)}</p>
                                    <p class="km-price">${priceNum}</p>
                                    <a href="#plan/${plan.id}" class="km-link">${t('查看詳情')} <span class="km-arrow">→</span></a>
                                </div>
                                <div class="km-divider"></div>
                            </div>
                    `;
                }
            });

            html += `
                        </div>
                    </div>

                    <!-- 其他方案 -->
                    <div class="km-category">
                        <span class="km-category-en">for gentlemen · kids · couple</span>
                        <div class="km-grid">
            `;

            kimonoPlans.forEach(plan => {
                if (plan.id && ['plan10','plan11','plan14','plan15'].includes(plan.id)) {
                    let tag = t('男士');
                    if (plan.id === 'plan14') tag = t('小孩');
                    if (plan.id === 'plan15') tag = t('情侶');
                    const displayName = t(plan.name.replace('【男士】', '').replace('【小孩】', '').replace('【情侶】', ''));
                    const priceNum = t(plan.price).replace('（含稅）', '').replace('（税込）', '');
                    const isPopular = plan.id === 'plan15';
                    
                    html += `
                            <div class="km-item" onclick="location.hash='plan/${plan.id}';">
                                <div class="km-item-visual">
                                    <div class="km-vertical-label">${displayName}</div>
                                    <div class="km-item-img">
                                        ${isPopular ? `<div class="km-stamp"><span class="km-stamp-text">${t('人氣')}</span><span class="km-stamp-en">Popular</span></div>` : ''}
                                        <img src="${plan.image}" alt="${t(plan.name)}" onerror="this.onerror=null; this.src='https://placehold.co/300x400/f5f5f5/999999?text=${encodeURIComponent(displayName)}'">
                                </div>
                                </div>
                                <div class="km-item-info">
                                    <div class="km-kamon">
                                        <svg viewBox="0 0 40 40" fill="none" stroke="#bbb" stroke-width="0.4">
                                            <circle cx="20" cy="20" r="16"/>
                                            <circle cx="20" cy="20" r="8"/>
                                            <line x1="20" y1="4" x2="20" y2="12"/>
                                            <line x1="20" y1="28" x2="20" y2="36"/>
                                            <line x1="4" y1="20" x2="12" y2="20"/>
                                            <line x1="28" y1="20" x2="36" y2="20"/>
                                        </svg>
                                    </div>
                                    <span class="km-tag">${tag}</span>
                                    <h3 class="km-name">${displayName}</h3>
                                    <p class="km-desc">${t(plan.shortDesc)}</p>
                                    <p class="km-price">${priceNum}</p>
                                    <a href="#plan/${plan.id}" class="km-link">${t('查看詳情')} <span class="km-arrow">→</span></a>
                                </div>
                                <div class="km-divider"></div>
                            </div>
                    `;
                }
            });

            html += `
                        </div>
                    </div>
                </div>
                </div>

                <!-- 波浪分隔線 -->
                <div style="position: relative; width: 100%; height: 100px; margin-top: -1px; overflow: hidden; z-index: 1;">
                    <svg viewBox="0 0 1200 100" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;">
                        <path d="M0,0 L1200,0 L1200,50 C1000,80 800,20 600,50 C400,80 200,20 0,50 Z" fill="#FFFCF7" />
                    </svg>
                </div>`;

            // 添加攝影方案預覽 - 乾淨對稱圖示化風格
            html += `
                <section class="photo-svc-section">
                    <!-- 標題區 -->
                    <div class="photo-svc-header">
                        <span class="photo-svc-label">photography</span>
                        <div class="photo-svc-title-line"></div>
                        <h2 class="photo-svc-title">${t('攝影方案')}</h2>
                </div>

                    <!-- 三欄方案 -->
                    <div class="photo-svc-grid">
                            <!-- Plan A -->
                        <div class="photo-svc-card">
                            <div class="photo-svc-icon">
                                <svg viewBox="0 0 48 48" fill="none" stroke="rgba(255,252,247,0.75)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="24" cy="24" r="18"/>
                                    <circle cx="24" cy="24" r="2"/>
                                    <line x1="24" y1="6" x2="24" y2="12"/>
                                    <line x1="24" y1="36" x2="24" y2="42"/>
                                    <line x1="6" y1="24" x2="12" y2="24"/>
                                    <line x1="36" y1="24" x2="42" y2="24"/>
                                    <line x1="24" y1="24" x2="24" y2="14"/>
                                    <line x1="24" y1="24" x2="30" y2="24"/>
                                </svg>
                            </div>
                            <h3 class="photo-svc-name">${t('30分鐘方案')}</h3>
                            <span class="photo-svc-en">PLAN A</span>
                            <div class="photo-svc-divider"></div>
                            <p class="photo-svc-desc">${t('輕鬆記錄京都的美好瞬間。底片 30-60 張，無精修，適合 1~2 人的快速街拍體驗。')}</p>
                            <span class="photo-svc-price">¥10,000</span>
                            </div>

                            <!-- Plan B -->
                        <div class="photo-svc-card">
                            <div class="photo-svc-icon">
                                <svg viewBox="0 0 48 48" fill="none" stroke="rgba(255,252,247,0.75)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="4" y="14" width="40" height="24" rx="3"/>
                                    <circle cx="24" cy="26" r="7"/>
                                    <circle cx="24" cy="26" r="3"/>
                                    <rect x="16" y="10" width="16" height="4" rx="1"/>
                                    <circle cx="36" cy="20" r="1.5"/>
                                </svg>
                            </div>
                            <h3 class="photo-svc-name">${t('60分鐘方案')}</h3>
                            <span class="photo-svc-en">PLAN B</span>
                            <div class="photo-svc-divider"></div>
                            <p class="photo-svc-desc">${t('深度探索京都風情。底片 80-100 張，含精修 5 張，適合 1~3 人的悠閒攝影散步。')}</p>
                            <span class="photo-svc-price">¥15,000</span>
                            </div>

                            <!-- Plan C -->
                        <div class="photo-svc-card">
                            <div class="photo-svc-icon">
                                <svg viewBox="0 0 48 48" fill="none" stroke="rgba(255,252,247,0.75)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="6" y="6" width="26" height="36" rx="2"/>
                                    <rect x="16" y="10" width="26" height="36" rx="2"/>
                                    <line x1="22" y1="16" x2="36" y2="16"/>
                                    <line x1="22" y1="22" x2="36" y2="22"/>
                                    <line x1="22" y1="28" x2="32" y2="28"/>
                                    <polyline points="10,30 14,26 18,32 22,24 26,34"/>
                                </svg>
                            </div>
                            <h3 class="photo-svc-name">${t('90分鐘方案')}</h3>
                            <span class="photo-svc-en">PLAN C</span>
                            <div class="photo-svc-divider"></div>
                            <p class="photo-svc-desc">${t('完整的京都攝影之旅。底片 150 張以上，含精修 10 張，適合 1~6 人的團體或特殊紀念。')}</p>
                            <span class="photo-svc-price">¥22,000</span>
                        </div>
                            </div>

                    <!-- CTA -->
                    <div class="photo-svc-cta-wrap">
                        <a href="#photo-plans" class="photo-svc-cta">
                            ${t('查看詳細內容')} <span class="photo-svc-cta-arrow">→</span>
                            </a>
                        </div>
                </section>

                <!-- 常見問題 - 手風琴收合風格 -->
                <section class="faq-home-section" style="position:relative;overflow:hidden;">
                    <!-- 不規則圓形裝飾 FAQ -->
                    <div style="position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;pointer-events:none;z-index:0;">
                        <div style="position:absolute;width:320px;height:270px;background:rgba(240,236,224,0.32);border-radius:55% 45% 48% 52%/50% 50% 50% 50%;transform:rotate(-10deg);top:-5%;left:-4rem;"></div>
                        <div style="position:absolute;width:200px;height:180px;background:rgba(190,215,230,0.16);border-radius:48% 52% 44% 56%/54% 46% 54% 46%;transform:rotate(22deg);top:30%;right:-3rem;"></div>
                        <div style="position:absolute;width:100px;height:110px;background:rgba(225,200,215,0.20);border-radius:60% 40% 50% 50%/42% 58% 42% 58%;transform:rotate(35deg);bottom:10%;left:25%;"></div>
                    </div>
                    <div class="faq-home-header">
                        <h2 class="faq-home-title">${t('常見問題')}</h2>
                        <span class="faq-home-subtitle">FAQ</span>
                </div>

                    <div class="faq-home-list">
                        <!-- 問題1 -->
                        <div class="faq-home-card" onclick="this.classList.toggle('open')">
                            <div class="faq-home-q-row">
                                <span class="faq-home-q-mark">Q.</span>
                                <span class="faq-home-q-text">${t('可以當日預約嗎？')}</span>
                                <span class="faq-home-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
                                </div>
                            <div class="faq-home-a-panel">
                                <div class="faq-home-a-content">
                                    <span class="faq-home-a-mark">A.</span>
                                    <span class="faq-home-a-text">${t('建議提前預約！但若當天有空檔，也可接受預約。')}</span>
                            </div>
                            </div>
                        </div>

                        <!-- 問題2 -->
                        <div class="faq-home-card" onclick="this.classList.toggle('open')">
                            <div class="faq-home-q-row">
                                <span class="faq-home-q-mark">Q.</span>
                                <span class="faq-home-q-text">${t('穿著和服加做髮型需要多長時間？')}</span>
                                <span class="faq-home-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
                                </div>
                            <div class="faq-home-a-panel">
                                <div class="faq-home-a-content">
                                    <span class="faq-home-a-mark">A.</span>
                                    <span class="faq-home-a-text">${t('穿著和服以及髮型設計約需1小時左右。')}</span>
                            </div>
                            </div>
                        </div>

                        <!-- 問題3 -->
                        <div class="faq-home-card" onclick="this.classList.toggle('open')">
                            <div class="faq-home-q-row">
                                <span class="faq-home-q-mark">Q.</span>
                                <span class="faq-home-q-text">${t('最早可以預約幾點？')}</span>
                                <span class="faq-home-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
                                </div>
                            <div class="faq-home-a-panel">
                                <div class="faq-home-a-content">
                                    <span class="faq-home-a-mark">A.</span>
                                    <span class="faq-home-a-text">${t('我們最早可接受早上6:00的預約。')}</span>
                            </div>
                            </div>
                        </div>

                        <!-- 問題4 -->
                        <div class="faq-home-card" onclick="this.classList.toggle('open')">
                            <div class="faq-home-q-row">
                                <span class="faq-home-q-mark">Q.</span>
                                <span class="faq-home-q-text">${t('最晚幾點前要歸還？')}</span>
                                <span class="faq-home-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
                                </div>
                            <div class="faq-home-a-panel">
                                <div class="faq-home-a-content">
                                    <span class="faq-home-a-mark">A.</span>
                                    <span class="faq-home-a-text">${t('當日17:30前需歸還。如需隔日歸還，可免費隔日中午12:00前歸還（需付押金¥10,000）。')}</span>
                            </div>
                            </div>
                        </div>

                        <!-- 問題5 -->
                        <div class="faq-home-card" onclick="this.classList.toggle('open')">
                            <div class="faq-home-q-row">
                                <span class="faq-home-q-mark">Q.</span>
                                <span class="faq-home-q-text">${t('可以寄放行李在店裡嗎？')}</span>
                                <span class="faq-home-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
                                </div>
                            <div class="faq-home-a-panel">
                                <div class="faq-home-a-content">
                                    <span class="faq-home-a-mark">A.</span>
                                    <span class="faq-home-a-text">${t('可以！我們提供行李寄存服務，讓您輕鬆享受和服體驗，無需擔心隨身物品的存放問題。')}</span>
                            </div>
                            </div>
                        </div>
                    </div>

                    <!-- 查看更多問題按鈕 -->
                    <div class="faq-home-cta-wrap">
                        <a href="#faq" onclick="renderFaq(); return false;" class="faq-home-cta">${t('查看更多問題')} <span style="margin-left: 0.5rem;">→</span></a>
                    </div>
                </section>

                <!-- OUR SERVICE - 本店服務（最下方） -->
                <section class="our-service-section" style="position:relative;overflow:hidden;">
                    <!-- 不規則圓形裝飾 OUR SERVICE -->
                    <div style="position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;pointer-events:none;z-index:0;">
                        <div style="position:absolute;width:300px;height:250px;background:rgba(240,236,224,0.28);border-radius:52% 48% 42% 58%/48% 52% 48% 52%;transform:rotate(-12deg);top:-5%;right:-3rem;"></div>
                        <div style="position:absolute;width:180px;height:160px;background:rgba(195,225,215,0.16);border-radius:44% 56% 56% 44%/54% 46% 54% 46%;transform:rotate(18deg);bottom:8%;left:-2rem;"></div>
                        <div style="position:absolute;width:100px;height:110px;background:rgba(210,200,228,0.18);border-radius:58% 42% 46% 54%/50% 50% 50% 50%;transform:rotate(-25deg);top:40%;left:30%;"></div>
                    </div>
                    <div class="our-service-inner">
                        <header class="our-service-header">
                            <div class="our-service-title-wrap">
                                <span class="our-service-line"></span>
                                <h2 class="our-service-title">OUR SERVICE</h2>
                                <span class="our-service-line"></span>
                </div>
                            <p class="our-service-sub">${t('ニコニコ着物為您提供的服務一覽。')}</p>
                            <p class="our-service-sub">${t('如有未列於選單的服務，歡迎透過聯絡表單詢問。')}</p>
                        </header>
                        <div class="our-service-grid">
                            <a href="#kimono-plans" class="our-service-card group" onclick="location.hash='kimono-plans'; return false;">
                                <div class="our-service-img-wrap">
                                    <img src="img/closeup1.jpg" alt="${t('和服租借')}" class="our-service-img" onerror="this.src='https://placehold.co/600x600/F5E6D3/544739?text=KIMONO'">
                            </div>
                                <div class="our-service-overlay">
                                    <h3 class="our-service-card-title">KIMONO RENTAL</h3>
                                    <span class="our-service-card-jp">${t('和服租借')}</span>
                                    <span class="our-service-btn">VIEW DETAILS</span>
                        </div>
                            </a>
                            <a href="#photo-plans" class="our-service-card group" onclick="location.hash='photo-plans'; return false;">
                                <div class="our-service-img-wrap">
                                    <img src="img/photo_cover_small.jpg" alt="${t('專業攝影')}" class="our-service-img" onerror="this.src='https://placehold.co/600x600/F5E6D3/544739?text=PHOTO'">
                        </div>
                                <div class="our-service-overlay">
                                    <h3 class="our-service-card-title">PHOTOGRAPHY</h3>
                                    <span class="our-service-card-jp">${t('專業攝影')}</span>
                                    <span class="our-service-btn">VIEW DETAILS</span>
                        </div>
                            </a>
                            <a href="#tea-room" class="our-service-card group" onclick="location.hash='tea-room'; return false;">
                                <div class="our-service-img-wrap">
                                    <img src="img/tearoom_experience2.jpg" alt="${t('茶室體驗')}" class="our-service-img" onerror="this.src='https://placehold.co/600x600/F5E6D3/544739?text=TEA'">
                        </div>
                                <div class="our-service-overlay">
                                    <h3 class="our-service-card-title">TEA ROOM</h3>
                                    <span class="our-service-card-jp">${t('茶室體驗')}</span>
                                    <span class="our-service-btn">VIEW DETAILS</span>
                            </div>
                            </a>
                        </div>
                    </div>
                </section>
            `;

            // 關閉外層 wrapper + 綠色波浪 + Footer
            html += `
                <div class="wave-green-band">
                    <svg viewBox="0 0 1200 100" preserveAspectRatio="none"><path d="M0,0 L1200,0 L1200,50 C1000,80 800,20 600,50 C400,80 200,20 0,50 Z" fill="#859A93"/></svg>
                </div>
                </div>
            `;
            html += getFooterHTML();

            getContentDiv().innerHTML = html;
            
            // 初始化 Top 5 卡片圖片切換邏輯
            initTop5ImageSwitch();
            
            // 初始化店內介紹茶室輪播
            initTearoomCarousel();
        }
        
        // 店內介紹茶室輪播功能
        function initTearoomCarousel() {
            const carousel = document.getElementById('tearoom-carousel');
            if (!carousel) return;
            
            const img = document.getElementById('tearoom-carousel-img');
            const dots = carousel.querySelectorAll('.tearoom-dot');
            const tearoomImages = ['img/matcha_experience.jpg', 'img/tearoom_experience2.jpg', 'img/tearoom_experience3.jpg', 'img/tearoom_experience4.jpg'];
            let currentIndex = 0;
            
            // 點擊小點切換圖片
            dots.forEach((dot, index) => {
                dot.addEventListener('click', function(e) {
                    e.stopPropagation();
                    currentIndex = index;
                    img.src = tearoomImages[currentIndex];
                    
                    dots.forEach(d => d.classList.remove('active'));
                    dots[currentIndex].classList.add('active');
                });
            });
            
            // 自動輪播
            let autoSlide = setInterval(() => {
                currentIndex = (currentIndex + 1) % tearoomImages.length;
                img.src = tearoomImages[currentIndex];
                
                dots.forEach(d => d.classList.remove('active'));
                dots[currentIndex].classList.add('active');
            }, 3000);
            
            // 鼠標懸停時暫停
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoSlide);
            });
            
            carousel.addEventListener('mouseleave', () => {
                autoSlide = setInterval(() => {
                    currentIndex = (currentIndex + 1) % tearoomImages.length;
                    img.src = tearoomImages[currentIndex];
                    
                    dots.forEach(d => d.classList.remove('active'));
                    dots[currentIndex].classList.add('active');
                }, 3000);
            });
        }
        
        // Top 5 卡片圖片切換邏輯函數
        function initTop5ImageSwitch() {
            const cards = document.querySelectorAll('.top5-card');
            
            cards.forEach(card => {
                const imgMain = card.querySelector('.img-main');
                const imgHover = card.querySelector('.img-hover');
                const imgHover2 = card.querySelector('.img-hover-2');
                
                // 如果沒有必要的圖片元素，跳過
                if (!imgMain || !imgHover) return;
                
                let hoverTimer = null;
                
                card.addEventListener('mouseenter', function() {
                    // 清除計時器（防止重複觸發）
                    if (hoverTimer) {
                        clearTimeout(hoverTimer);
                        hoverTimer = null;
                    }
                    
                    // 清除所有顯示狀態
                    imgMain.classList.remove('show');
                    imgHover.classList.remove('show');
                    if (imgHover2) imgHover2.classList.remove('show');
                    
                    // 立即顯示第二張
                    imgHover.classList.add('show');
                    
                    // 3秒後顯示第三張
                    if (imgHover2) {
                        hoverTimer = setTimeout(function() {
                            if (imgHover && imgHover2) {
                                imgHover.classList.remove('show');
                                imgHover2.classList.add('show');
                            }
                        }, 3000);
                    }
                });
                
                card.addEventListener('mouseleave', function() {
                    // 清除計時器
                    if (hoverTimer) {
                        clearTimeout(hoverTimer);
                        hoverTimer = null;
                    }
                    
                    // 恢復到第一張
                    imgMain.classList.add('show');
                    imgHover.classList.remove('show');
                    if (imgHover2) imgHover2.classList.remove('show');
                });
            });
        }

        /**
         * 渲染 - 和服方案選擇 (獨立頁面)
         */
        function renderKimonoPlans() {
            let html = `
                
                
                <div class="kimono-plans-container" style="background: #FFFCF7; min-height: 100vh; padding: 2rem 0; position: relative; overflow: hidden;">
                    ${generatePageBlobs('kimonoPlans')}
                    <div class="kimono-plans-header" style="position: relative; z-index: 1;">
                        <h2 class="kimono-plans-title">
                            <span>${t('和服方案')}</span>
                            <span class="kimono-plans-title-en">Kimono Rental Plan</span>
                        </h2>
                        <div class="kimono-plans-filter">
                            <select id="kimono-category-filter" class="kimono-filter-select" onchange="filterKimonoPlans(this.value)">
                                <option value="all">${t('全部')}</option>
                                <option value="ladies">${t('女士')}</option>
                                <option value="men">${t('男士')}</option>
                                <option value="kids">${t('小孩')}</option>
                                <option value="other">${t('其他')}</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="kimono-plans-grid" id="kimono-plans-grid" style="position: relative; z-index: 1;">
            `;
            
            // --- Loop through plans ---
            kimonoPlans.forEach(plan => {
                // Skip commented out plans
                if (plan.id && plan.id.startsWith('plan')) {
                    // 判斷分類
                    let category = 'other';
                    if (plan.name.includes('女士')) {
                        category = 'ladies';
                    } else if (plan.name.includes('男士')) {
                        category = 'men';
                    } else if (plan.name.includes('小孩')) {
                        category = 'kids';
                    } else if (plan.name.includes('情侶')) {
                        category = 'other';
                    }
                    
                    const isPopular = plan.id === 'plan2' || plan.id === 'plan3' || plan.id === 'plan15';
                    
                    // 定義每個方案的英文名稱
                    const planEnglishNames = {
                        'plan1': 'Komon Plan',
                        'plan2': 'Premium Komon Plan',
                        'plan3': 'Lace Plan',
                        'plan4': 'Nishaku-sode Plan',
                        'plan5': 'Houmongi Plan',
                        'plan7': 'Kurotomesode Plan',
                        'plan8': 'Furisode Plan',
                        'plan13': 'Hakama Plan',
                        'plan10': 'Men\'s Kimono Plan',
                        'plan11': 'Premium Samurai Plan',
                        'plan14': 'Kids Kimono Plan',
                        'plan15': 'Couple Plan'
                    };
                    
                    // 定義每個方案的顏色（根據圖片顏色）
                    const planColors = {
                        'plan1': ['#d4a574', '#f5e6d3', '#8b6f47'], // 小紋 - 米色系
                        'plan2': ['#c9a982', '#e8d5c4', '#9d7a5a'], // 高級小紋 - 棕色系
                        'plan3': ['#a7f3d0', '#ffffff', '#065f46'], // 蕾絲 - 綠色系
                        'plan4': ['#fce7f3', '#e9d5ff', '#fef3c7'], // 二尺袖 - 粉色系
                        'plan5': ['#d1d5db', '#f3f4f6', '#9ca3af'], // 訪問服 - 灰色系
                        'plan7': ['#1f2937', '#374151', '#111827'], // 黑留袖 - 深色系
                        'plan8': ['#fef3c7', '#fde68a', '#fcd34d'], // 振袖 - 黃色系
                        'plan13': ['#dbeafe', '#bfdbfe', '#93c5fd'], // 袴 - 藍色系
                        'plan10': ['#6b7280', '#9ca3af', '#4b5563'], // 男士和服 - 灰色系
                        'plan11': ['#1c1917', '#292524', '#0c0a09'], // 高級武士服 - 深色系
                        'plan14': ['#fce7f3', '#fbcfe8', '#f9a8d4'], // 小孩和服 - 粉色系
                        'plan15': ['#fef3c7', '#fde68a', '#fcd34d'] // 情侶 - 黃色系
                    };
                    
                    const colors = planColors[plan.id] || ['#d1d5db', '#e5e7eb', '#9ca3af'];
                    const colorDotsHTML = colors.map(color => 
                        `<div class="kimono-plan-color-dot" style="background-color: ${color};"></div>`
                    ).join('');
                    
                    const englishName = planEnglishNames[plan.id] || '';
                    const titleWithEnglish = englishName ? 
                        `${t(plan.name)} ｜ <span class="kimono-plan-card-title-en">${englishName}</span>` : 
                        t(plan.name);
                    
                    html += `
                        <div class="kimono-plan-card" data-category="${category}" onclick="location.hash='plan/${plan.id}';">
                            <div class="kimono-plan-card-image-wrapper">
                                ${isPopular ? `
                                <div class="kimono-plan-popular-badge">${t('人氣')}</div>
                                ` : ''}
                                <img src="${plan.image}" alt="${t(plan.name)}" class="kimono-plan-card-image" onerror="this.onerror=null; this.src='https://placehold.co/400x533/cccccc/000000?text=${encodeURIComponent(t('圖片缺失'))}'">
                            </div>
                            <div class="kimono-plan-card-content">
                                <h3 class="kimono-plan-card-title">${titleWithEnglish}</h3>
                                <p class="kimono-plan-card-price">${t(plan.price)}</p>
                                <div class="kimono-plan-color-dots">
                                    ${colorDotsHTML}
                                </div>
                            </div>
                        </div>
                    `;
                }
            });

            html += `
                    </div>
                </div>
            `;

            // 添加 Footer
            html += getFooterHTML();

            getContentDiv().innerHTML = html;
            
            // 初始化篩選功能
            initKimonoPlansFilter();
            
            // 滾動到頁面頂部（語系切換時不滾動）
            if (!window._isLanguageSwitching) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        
        // 和服方案篩選功能
        function initKimonoPlansFilter() {
            const filterSelect = document.getElementById('kimono-category-filter');
            if (filterSelect) {
                filterSelect.addEventListener('change', function() {
                    filterKimonoPlans(this.value);
                });
            }
        }
        
        function filterKimonoPlans(category) {
            const cards = document.querySelectorAll('.kimono-plan-card');
            cards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // 獲取參考照片相簿（動態讀取 Plan_ 型錄照）
        // ====================================================
        // Plan_ 照片由 photos.js 提供（window.planFiles）
        // 透過 getPlanPhotosForPlan() 自動分類至對應方案
        // 以後只要命名為 Plan_方案_顏色.jpg 放入 img/，
        // 執行 node update-photos.js 後刷新即可自動出現
        // ====================================================
        function getReferencePhotoGallery(planId) {
            // ====== 英文顏色 → 中文 ======
            const colorMap = {
                white: '白', beige: '米', red: '紅', orange: '橘',
                yellow: '黃', green: '綠', blue: '藍', purple: '紫',
                pink: '粉', black: '黑', grey: '其他', gray: '其他', other: '其他'
            };
            function parseColor(filename) {
                const base = filename.replace(/\.[^.]+$/, '').replace(/\d+$/, '');
                const parts = base.split(/[_\s]+/);
                const last = (parts[parts.length - 1] || '').toLowerCase();
                return colorMap[last] || '其他';
            }

            // ====== 免過濾的方案 ======
            const noFilterPlans = ['plan7', 'plan13', 'plan10', 'plan11', 'plan14', 'plan15'];

            // ====== 價格篩選按鈕設定（僅 plan5 訪問服、plan8 振袖）======
            const priceButtonConfigs = {
                'plan5': {
                    gridId: 'houmongi-gallery-grid',
                    buttons: [
                        { price: 'all', label: '全部' },
                        { price: '11000', label: '訪問服 ¥11,000' },
                        { price: '16500', label: '高級訪問服 ¥16,500' }
                    ]
                },
                'plan8': {
                    gridId: 'furisode-gallery-grid',
                    buttons: [
                        { price: 'all', label: '全部' },
                        { price: '9900', label: '精品振袖 ¥9,900' },
                        { price: '16500', label: '金絲振袖 ¥16,500' },
                        { price: '27500', label: '高訂振袖 ¥27,500' }
                    ]
                }
            };

            // ====== 動態取得 Plan_ 型錄照 ======
            const dynamicPhotos = getPlanPhotosForPlan(planId);

            // 特殊靜態照片（非 Plan_ 命名但仍需顯示的例外）
            const staticExtras = {
                'plan11': []
            };

            // 合併動態 + 靜態照片
            const allPhotos = [...dynamicPhotos];
            if (staticExtras[planId]) {
                staticExtras[planId].forEach(function(p) { allPhotos.push(p); });
            }

            // 豐富化：確保每張照片都有 src / srcset / price / color / alt
            const photosEnriched = allPhotos.map(function(p) {
                return {
                    src: p.src,
                    srcset: p.srcset || '',
                    localSrc: p.localSrc || p.src,
                    price: p.price || '',
                    color: p.color || parseColor(p.src),
                    alt: p.alt || ''
                };
            });

            if (photosEnriched.length === 0) {
                return `
                    <div class="reference-photo-gallery" style="max-width: 1400px; margin: 0 auto;">
                        <div style="text-align: center; padding: 3rem 2rem; color: #9ca3af; font-size: 0.95rem;">
                            ${t('型錄照片準備中，敬請期待')}
                        </div>
                    </div>
                `;
            }

            // 存到全域（供 lightbox 使用 — 存本地路徑，showLightboxImage 會自動轉 Cloudinary）
            window._catalogPhotos = photosEnriched.map(function(p) { return p.localSrc; });

            const needColorFilter = !noFilterPlans.includes(planId);
            const availColors = [...new Set(photosEnriched.map(function(p) { return p.color; }))];
            const colorOrder = ['白','米','紅','橘','黃','綠','藍','紫','粉','黑','其他'];
            const sortedColors = colorOrder.filter(function(c) { return availColors.includes(c); });
            const btnStyle = 'cursor:pointer;padding:0.5rem 1.25rem;border:1.5px solid #859A93;border-radius:0.375rem;font-size:0.875rem;font-weight:500;transition:all 0.3s ease;';

            // === 價格分類方案（plan5 訪問服、plan8 振袖）＋顏色過濾 ===
            if (priceButtonConfigs[planId]) {
                const cfg = priceButtonConfigs[planId];
            return `
                    <div class="reference-photo-gallery" style="max-width: 1400px; margin: 0 auto;">
                        <!-- 價格篩選 -->
                        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; margin-bottom: 1rem;">
                            ${cfg.buttons.map((b, i) => `
                                <button class="gallery-filter-btn ${i === 0 ? 'active' : ''}" onclick="filterGalleryPhotos('${b.price}')" style="${btnStyle} background-color:${i === 0 ? '#859A93' : 'white'}; color:${i === 0 ? 'white' : '#859A93'};">
                                    ${t(b.label)}
                                </button>
                            `).join('')}
                        </div>
                        <!-- 顏色篩選下拉 -->
                        ${sortedColors.length >= 1 ? `
                        <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem; padding-right: 0.5rem;">
                            <div class="color-dropdown" style="position: relative; display: inline-block;">
                                <button id="colorDropdownBtn" onclick="toggleColorDropdown()" style="display:flex;align-items:center;gap:0.5rem;padding:0.55rem 1.4rem;border:none;border-radius:9999px;background-color:#859A93;color:white;font-size:0.9rem;font-weight:500;cursor:pointer;transition:all 0.3s ease;box-shadow:0 2px 6px rgba(0,0,0,0.12);">
                                    <span id="colorDropdownLabel">${t('全部')}</span>
                                    <span style="font-size:0.7rem;">▼</span>
                                </button>
                                <div id="colorDropdownMenu" style="display:none;position:absolute;right:0;top:calc(100% + 6px);min-width:120px;background:white;border-radius:0.75rem;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:50;overflow:hidden;">
                                    <div class="color-dropdown-item active" data-color="all" onclick="selectColorPrice('all', this)" style="padding:0.6rem 1.2rem;cursor:pointer;font-size:0.875rem;color:#859A93;font-weight:500;transition:background 0.2s;">${t('全部')}</div>
                                    ${sortedColors.map(c => `
                                        <div class="color-dropdown-item" data-color="${c}" onclick="selectColorPrice('${c}', this)" style="padding:0.6rem 1.2rem;cursor:pointer;font-size:0.875rem;color:#555;transition:background 0.2s;">${t(c)}</div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}
                        <div class="reference-photo-gallery-grid" id="${cfg.gridId}">
                            ${photosEnriched.map(p => `
                                <div class="reference-photo-item gallery-photo" data-price="${p.price}" data-color="${p.color}" style="transition: opacity 0.4s ease, transform 0.4s ease;">
                                    <img src="${p.src}" ${p.srcset ? `srcset="${p.srcset}" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"` : ''} alt="${p.alt || '京都和服租借 Niconico Kyoto - 款式型錄'}" loading="lazy" style="width:100%;height:100%;object-fit:cover;aspect-ratio:3/4;" data-cloudified="${p.srcset ? 'true' : ''}" onerror="this.parentElement.style.display='none'">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // === 一般方案（僅顏色過濾）===
            return `
                <div class="reference-photo-gallery" style="max-width: 1400px; margin: 0 auto;">
                    ${needColorFilter && sortedColors.length >= 1 ? `
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem; padding-right: 0.5rem;">
                        <div class="color-dropdown" style="position: relative; display: inline-block;">
                            <button id="colorDropdownBtn" onclick="toggleColorDropdown()" style="display:flex;align-items:center;gap:0.5rem;padding:0.55rem 1.4rem;border:none;border-radius:9999px;background-color:#859A93;color:white;font-size:0.9rem;font-weight:500;cursor:pointer;transition:all 0.3s ease;box-shadow:0 2px 6px rgba(0,0,0,0.12);">
                                <span id="colorDropdownLabel">${t('全部')}</span>
                                <span style="font-size:0.7rem;">▼</span>
                            </button>
                            <div id="colorDropdownMenu" style="display:none;position:absolute;right:0;top:calc(100% + 6px);min-width:120px;background:white;border-radius:0.75rem;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:50;overflow:hidden;">
                                <div class="color-dropdown-item active" data-color="all" onclick="selectColorGeneral('all', this)" style="padding:0.6rem 1.2rem;cursor:pointer;font-size:0.875rem;color:#859A93;font-weight:500;transition:background 0.2s;">${t('全部')}</div>
                                ${sortedColors.map(c => `
                                    <div class="color-dropdown-item" data-color="${c}" onclick="selectColorGeneral('${c}', this)" style="padding:0.6rem 1.2rem;cursor:pointer;font-size:0.875rem;color:#555;transition:background 0.2s;">${t(c)}</div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    <div class="reference-photo-gallery-grid" id="catalog-gallery-grid">
                        ${photosEnriched.map((p, index) => `
                            <div class="reference-photo-item catalog-clickable" data-index="${index}" data-color="${p.color}" style="cursor: pointer; aspect-ratio: 3/4; overflow: hidden; transition: opacity 0.4s ease, transform 0.4s ease;">
                                <img src="${p.src}" 
                                     ${p.srcset ? `srcset="${p.srcset}" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"` : ''}
                                     alt="${p.alt || '京都和服租借 Niconico Kyoto - 款式型錄'}" 
                                     class="reference-photo active"
                                     loading="lazy"
                                     style="width: 100%; height: 100%; object-fit: cover;"
                                     data-cloudified="${p.srcset ? 'true' : ''}"
                                     onerror="this.parentElement.style.display='none'">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // ====================================================
        // Gallery 實穿照系統 — 動態分類引擎
        // ====================================================
        // 照片清單由 photos.js 提供（透過 window.galleryFiles）
        // photos.js 由 update-photos.js 腳本自動產生
        //
        // 運作流程：
        // 1. 將照片命名為 Gallery_方案_日期_顏色.jpg 放入 img/
        // 2. 在終端機執行：node update-photos.js
        // 3. photos.js 自動更新照片清單
        // 4. 網頁端的 parseGalleryFile() 解析每個檔名
        //    → 自動識別方案、價格、顏色
        // 5. renderAlbumDetail() 自動分組為相簿
        //    → 同日期同顏色合為一個相簿，新日期排最前
        // ====================================================
        // galleryFiles 由 photos.js 提供（window.galleryFiles）
        // 若 photos.js 未載入，使用空陣列作為安全回退
        const galleryFiles = window.galleryFiles || [];

        // ====================================================
        // 檔名關鍵字 → planId 映射
        // ⚠️ 順序重要：長的、更精確的關鍵字必須排在前面！
        // 例如 'Premium_Houmongi' 必須在 'Houmongi' 之前，
        // 否則 Gallery_Premium_Houmongi_... 會被誤判為一般訪問服。
        // ====================================================
        const galleryPlanMapping = [
            // --- 訪問服（有價格分類）---
            { keyword: 'Premium_Houmongi', planId: 'plan5', price: '16500' },
            { keyword: 'Houmongi',         planId: 'plan5', price: '11000' },
            // --- 小紋 ---
            { keyword: 'Premium_Komon',    planId: 'plan2' },
            { keyword: 'Komon',            planId: 'plan1' },
            // --- 振袖（有價格分類）---
            { keyword: 'Luxury_Furisode',  planId: 'plan8', price: '27500' },
            { keyword: 'Gold_Furisode',    planId: 'plan8', price: '16500' },
            { keyword: 'Standard_Furisode',planId: 'plan8', price: '9900' },
            { keyword: 'Furisode',         planId: 'plan8', price: '9900' },  // 未標明等級 → 預設精品
            // --- 其他方案 ---
            { keyword: 'Kuro_Tomesode',    planId: 'plan7' },
            { keyword: 'Nishaku_Sode',     planId: 'plan4' },
            { keyword: 'Nishaku',          planId: 'plan4' },                 // 簡寫相容
            { keyword: 'Hakama',           planId: 'plan13' },
            { keyword: 'hakama',           planId: 'plan13' },             // 小寫相容
            { keyword: 'Mens_Samurai',     planId: 'plan11' },
            { keyword: 'Mens_Kimono',      planId: 'plan10' },
            { keyword: 'Mens',             planId: 'plan10' },                // 簡寫相容
            { keyword: 'Couple',           planId: 'plan15' },
            { keyword: 'couple',           planId: 'plan15' },
            { keyword: 'Lace',             planId: 'plan3' },
            { keyword: 'Kids',             planId: 'plan14' }
        ];

        // 顏色英文 → 中文映射
        const galleryColorMap = {
            white: '白', beige: '米', red: '紅', orange: '橘',
            yellow: '黃', green: '綠', blue: '藍', purple: '紫',
            pink: '粉', black: '黑', grey: '其他', gray: '其他', other: '其他'
        };

        // 顏色 → 色碼 (用於顏色圓點)
        const colorDotHex = {
            '白': '#f5f5f0', '米': '#d4c5a9', '紅': '#c0392b', '橘': '#e67e22',
            '黃': '#f1c40f', '綠': '#27ae60', '藍': '#2980b9', '紫': '#8e44ad',
            '粉': '#e8a0bf', '黑': '#2c2c2c', '其他': '#aaa'
        };

        // planId → 中文方案名稱 + 英文方案名稱（SEO alt 用）
        const planIdToEnName = {
            plan1: 'Komon', plan2: 'Premium Komon', plan3: 'Lace Kimono',
            plan4: 'Nishaku-sode', plan5: 'Houmongi', plan7: 'Kurotomesode',
            plan8: 'Furisode', plan10: "Men's Kimono", plan11: 'Premium Samurai',
            plan13: 'Hakama', plan14: 'Kids Kimono', plan15: 'Couple'
        };
        const planIdToZhName = {
            plan1: '小紋', plan2: '高級小紋', plan3: '蕾絲',
            plan4: '二尺袖', plan5: '訪問服', plan7: '黑留袖',
            plan8: '振袖', plan10: '男士和服', plan11: '高級武士服',
            plan13: '袴', plan14: '小孩和服', plan15: '情侶'
        };

        /**
         * 解析單一 Gallery 檔名 → { src, planId, price, color, alt }
         *
         * 例外處理：
         * - 無法識別方案關鍵字 → 回傳 null（該照片會被跳過，不會報錯）
         * - 無法識別顏色 → 自動歸為「其他」
         * - 檔名缺少底線或格式不完整 → 仍嘗試解析，不會讓網頁當機
         */
        function parseGalleryFile(filename) {
            try {
            // 找 planId
            let planId = null, price = null;
            const normalized = filename.replace(/\s+/g, '_'); // 處理空格
            for (const m of galleryPlanMapping) {
                if (normalized.indexOf(m.keyword) !== -1) {
                    planId = m.planId;
                    price = m.price || null;
                    break;
                }
            }
                if (!planId) return null; // 無法識別方案 → 安靜跳過

            // 解析顏色：去副檔名 → 去 macOS 複製後綴 " 2" → 去結尾數字 → 取最後段
            const base = filename.replace(/\.[^.]+$/, '');
            const cleaned = base.replace(/\s+\d+$/, '').replace(/\d+$/, '');
            const parts = cleaned.split(/[_\s]+/).filter(Boolean);
            const lastPart = (parts[parts.length - 1] || '').toLowerCase();
            const color = galleryColorMap[lastPart] || '其他';

            // 處理檔名中的空格（URL 編碼）
                const localSrc = 'img/' + encodeURIComponent(filename).replace(/%2F/g, '/');
                // SEO alt 屬性（含中英文關鍵字）
                const planNameEn = planIdToEnName[planId] || 'Kimono';
                const planNameZh = planIdToZhName[planId] || '和服';
                const alt = '京都和服租借 Niconico Kyoto - ' + planNameZh + '實穿參考 ' + planNameEn + ' Guest Photo';
                // Cloudinary 響應式 URL（未啟用時 src = localSrc, srcset = ''）
                const src = cloudImg(localSrc, { width: 800, crop: 'limit' });
                const srcset = cloudSrcSet(localSrc);
                return { src, srcset, localSrc, planId, price, color, alt };
            } catch (e) {
                // 任何解析錯誤都不應讓網頁當機
                console.warn('⚠️ Gallery 檔名解析失敗，已跳過:', filename, e);
                return null;
            }
        }

        /**
         * 取得指定 planId 的所有 Gallery 實穿照
         */
        function getGalleryPhotosForPlan(planId) {
            return galleryFiles
                .map(parseGalleryFile)
                .filter(p => p && p.planId === planId);
        }

        // ====== Plan_ 型錄照（由 photos.js 提供 window.planFiles）======
        const planFiles = window.planFiles || [];

        /**
         * 解析單一 Plan 型錄檔名 → { src, planId, price, color }
         * 格式：Plan_方案_顏色.jpg（無日期）
         *
         * 使用與 Gallery 相同的 galleryPlanMapping 與 galleryColorMap
         */
        function parsePlanFile(filename) {
            try {
                var planId = null, price = null;
                var normalized = filename.replace(/\s+/g, '_');
                for (var i = 0; i < galleryPlanMapping.length; i++) {
                    var m = galleryPlanMapping[i];
                    if (normalized.indexOf(m.keyword) !== -1) {
                        planId = m.planId;
                        price = m.price || null;
                        break;
                    }
                }
                if (!planId) return null;

                // 解析顏色
                var base = filename.replace(/\.[^.]+$/, '');
                var cleaned = base.replace(/\s+\d+$/, '').replace(/\d+$/, '');
                var parts = cleaned.split(/[_\s]+/).filter(Boolean);
                var lastPart = (parts[parts.length - 1] || '').toLowerCase();
                var color = galleryColorMap[lastPart] || '其他';

                var localSrc = 'img/' + encodeURIComponent(filename).replace(/%2F/g, '/');
                // SEO alt 屬性（含中英文關鍵字）
                var planNameEn = planIdToEnName[planId] || 'Kimono';
                var planNameZh = planIdToZhName[planId] || '和服';
                var alt = '京都和服租借 Niconico Kyoto - ' + planNameZh + '款式型錄 ' + planNameEn + ' Style';
                // Cloudinary 響應式 URL（未啟用時 src = localSrc, srcset = ''）
                var src = cloudImg(localSrc, { width: 800, crop: 'limit' });
                var srcset = cloudSrcSet(localSrc);
                return { src: src, srcset: srcset, localSrc: localSrc, planId: planId, price: price, color: color, alt: alt };
            } catch (e) {
                console.warn('⚠️ Plan 檔名解析失敗，已跳過:', filename, e);
                return null;
            }
        }

        /**
         * 取得指定 planId 的所有 Plan 型錄照
         */
        function getPlanPhotosForPlan(planId) {
            return planFiles
                .map(parsePlanFile)
                .filter(function(p) { return p && p.planId === planId; });
        }

        /**
         * 渲染實穿照相簿區塊（含顏色圓點篩選）
         */
        function renderCustomerGallery(planId) {
            const photos = getGalleryPhotosForPlan(planId);
            if (photos.length === 0) return '';

            // 提取可用顏色（去重、排序）
            const colorOrder = ['白','米','紅','橘','黃','綠','藍','紫','粉','黑','其他'];
            const availColors = [...new Set(photos.map(p => p.color))];
            const sortedColors = colorOrder.filter(c => availColors.includes(c));

            // 價格分類（僅 plan5/plan8 需要）
            const hasPriceFilter = ['plan5', 'plan8'].includes(planId);
            const priceLabels = {
                'plan5': [
                    { price: 'all', label: '全部' },
                    { price: '11000', label: '訪問服 ¥11,000' },
                    { price: '16500', label: '高級訪問服 ¥16,500' }
                ],
                'plan8': [
                    { price: 'all', label: '全部' },
                    { price: '9900', label: '精品振袖 ¥9,900' },
                    { price: '16500', label: '金絲振袖 ¥16,500' },
                    { price: '27500', label: '高訂振袖 ¥27,500' }
                ]
            };

            const btnStyle = 'cursor:pointer;padding:0.4rem 1rem;border:1.5px solid #859A93;border-radius:0.375rem;font-size:0.8rem;font-weight:500;transition:all 0.3s ease;';

            return `
                <!-- 實穿照相簿 -->
                <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px dashed #d1d5db;">
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 600; color: #544739; margin-bottom: 1.5rem; text-align: center; letter-spacing: 0.05em;">
                        ${t('⋆˚. 照片參考₊⊹')}
                    </h3>

                    <!-- 篩選列 -->
                    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1.5rem;">
                        ${hasPriceFilter ? priceLabels[planId].map((b, i) => `
                            <button class="cg-price-btn ${i === 0 ? 'active' : ''}" data-price="${b.price}" onclick="filterCustomerGallery()" style="${btnStyle} background-color:${i === 0 ? '#859A93' : 'white'}; color:${i === 0 ? 'white' : '#859A93'};">
                                ${t(b.label)}
                            </button>
                        `).join('') : ''}
                    </div>

                    <!-- 顏色圓點 -->
                    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem;">
                        <button class="cg-color-dot active" data-color="all" onclick="filterCustomerGallery(event)" style="width:28px;height:28px;border-radius:50%;border:2px solid #859A93;background:linear-gradient(135deg,#eee 50%,#ccc 50%);cursor:pointer;transition:all 0.2s;box-shadow:0 0 0 2px #859A93;" title="${t('全部')}"></button>
                        ${sortedColors.map(c => `
                            <button class="cg-color-dot" data-color="${c}" onclick="filterCustomerGallery(event)" style="width:28px;height:28px;border-radius:50%;border:2px solid transparent;background:${colorDotHex[c] || '#aaa'};cursor:pointer;transition:all 0.2s;" title="${t(c)}"></button>
                        `).join('')}
                    </div>

                    <!-- 照片網格 -->
                    <div id="customer-gallery-grid" class="reference-photo-gallery-grid">
                        ${photos.map((p, i) => `
                            <div class="reference-photo-item cg-photo" data-color="${p.color}" ${p.price ? `data-price="${p.price}"` : ''} style="cursor:pointer;aspect-ratio:3/4;overflow:hidden;transition:opacity 0.4s ease,transform 0.4s ease;" onclick="openCustomerGalleryLightbox(${i})">
                                <img src="${p.src}" ${p.srcset ? `srcset="${p.srcset}" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"` : ''} alt="${p.alt || '京都和服租借 Niconico Kyoto - 實穿參考'}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" data-cloudified="${p.srcset ? 'true' : ''}" onerror="this.parentElement.style.display='none'">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // 篩選實穿照（顏色圓點 + 價格按鈕）
        window.filterCustomerGallery = function() {
            // 取得當前點擊的按鈕
            const clickedBtn = event.currentTarget;

            // 更新顏色圓點 active 狀態
            if (clickedBtn.classList.contains('cg-color-dot')) {
                document.querySelectorAll('.cg-color-dot').forEach(d => {
                    d.classList.remove('active');
                    d.style.boxShadow = 'none';
                    d.style.borderColor = 'transparent';
                });
                clickedBtn.classList.add('active');
                clickedBtn.style.boxShadow = '0 0 0 2px #859A93';
                clickedBtn.style.borderColor = '#859A93';
            }

            // 更新價格按鈕 active 狀態
            if (clickedBtn.classList.contains('cg-price-btn')) {
                document.querySelectorAll('.cg-price-btn').forEach(b => {
                    b.classList.remove('active');
                    b.style.backgroundColor = 'white';
                    b.style.color = '#859A93';
                });
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#859A93';
                clickedBtn.style.color = 'white';
            }

            // 取得目前篩選值
            const activeColor = document.querySelector('.cg-color-dot.active');
            const activePrice = document.querySelector('.cg-price-btn.active');
            const colorFilter = activeColor ? activeColor.dataset.color : 'all';
            const priceFilter = activePrice ? activePrice.dataset.price : 'all';

            // 篩選照片
            document.querySelectorAll('.cg-photo').forEach(photo => {
                const matchColor = (colorFilter === 'all' || photo.dataset.color === colorFilter);
                const matchPrice = (priceFilter === 'all' || !photo.dataset.price || photo.dataset.price === priceFilter);
                if (matchColor && matchPrice) {
                    photo.style.display = '';
                    requestAnimationFrame(() => {
                        photo.style.opacity = '1';
                        photo.style.transform = 'scale(1)';
                    });
                } else {
                    photo.style.opacity = '0';
                    photo.style.transform = 'scale(0.95)';
                    setTimeout(() => { if (photo.style.opacity === '0') photo.style.display = 'none'; }, 300);
                }
            });
        };

        // Lightbox for customer gallery
        window.openCustomerGalleryLightbox = function(clickedIndex) {
            const allItems = Array.from(document.querySelectorAll('.cg-photo'));
            const visibleItems = allItems.filter(p => p.style.display !== 'none');
            const photos = visibleItems.map(p => p.querySelector('img').src);
            // 找出點擊的項目在可見列表中的索引
            const clickedEl = allItems[clickedIndex];
            let idx = visibleItems.indexOf(clickedEl);
            if (idx === -1) idx = 0;
            if (photos.length > 0) {
                openLightbox(photos, idx);
            }
        };

        // ====== 篩選狀態追蹤 ======
        window._currentPriceFilter = 'all';
        window._currentColorFilter = 'all';

        // 通用：依「價格 + 顏色」同時篩選 .gallery-photo
        function applyDualFilter() {
            const price = window._currentPriceFilter;
            const color = window._currentColorFilter;
            const photos = document.querySelectorAll('.gallery-photo');
            photos.forEach(photo => {
                const matchPrice = (price === 'all' || photo.dataset.price === price);
                const matchColor = (color === 'all' || photo.dataset.color === color);
                if (matchPrice && matchColor) {
                    photo.style.display = '';
                    requestAnimationFrame(() => {
                        photo.style.opacity = '1';
                        photo.style.transform = 'scale(1)';
                    });
                } else {
                    photo.style.opacity = '0';
                    photo.style.transform = 'scale(0.95)';
                    setTimeout(() => { if (photo.style.opacity === '0') photo.style.display = 'none'; }, 300);
                }
            });
        }

        // Gallery 價格篩選（價格分類方案用）
        window.filterGalleryPhotos = function(price) {
            window._currentPriceFilter = price;
            const buttons = document.querySelectorAll('.gallery-filter-btn');
            buttons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.backgroundColor = 'white';
                btn.style.color = '#859A93';
            });
            event.target.classList.add('active');
            event.target.style.backgroundColor = '#859A93';
            event.target.style.color = 'white';
            applyDualFilter();
        };

        // ====== 顏色下拉選單控制 ======
        window.toggleColorDropdown = function() {
            const menu = document.getElementById('colorDropdownMenu');
            if (!menu) return;
            if (menu.style.display === 'none' || !menu.style.display) {
                menu.style.display = 'block';
                // 點擊其他區域關閉
                setTimeout(() => {
                    document.addEventListener('click', closeDropdownOutside);
                }, 0);
            } else {
                menu.style.display = 'none';
                document.removeEventListener('click', closeDropdownOutside);
            }
        };
        function closeDropdownOutside(e) {
            const dropdown = document.querySelector('.color-dropdown');
            if (dropdown && !dropdown.contains(e.target)) {
                const menu = document.getElementById('colorDropdownMenu');
                if (menu) menu.style.display = 'none';
                document.removeEventListener('click', closeDropdownOutside);
            }
        }

        // 價格分類方案的顏色篩選（下拉版）
        window.selectColorPrice = function(color, el) {
            window._currentColorFilter = color;
            // 更新 active 狀態
            document.querySelectorAll('.color-dropdown-item').forEach(item => item.classList.remove('active'));
            el.classList.add('active');
            // 更新按鈕文字
            const label = document.getElementById('colorDropdownLabel');
            if (label) label.textContent = color === 'all' ? t('全部') : t(color);
            // 關閉下拉
            const menu = document.getElementById('colorDropdownMenu');
            if (menu) menu.style.display = 'none';
            document.removeEventListener('click', closeDropdownOutside);
            applyDualFilter();
        };

        // 一般型錄照片的顏色篩選（下拉版）
        window.selectColorGeneral = function(color, el) {
            // 更新 active 狀態
            document.querySelectorAll('.color-dropdown-item').forEach(item => item.classList.remove('active'));
            el.classList.add('active');
            // 更新按鈕文字
            const label = document.getElementById('colorDropdownLabel');
            if (label) label.textContent = color === 'all' ? t('全部') : t(color);
            // 關閉下拉
            const menu = document.getElementById('colorDropdownMenu');
            if (menu) menu.style.display = 'none';
            document.removeEventListener('click', closeDropdownOutside);
            // 篩選照片
            const items = document.querySelectorAll('#catalog-gallery-grid .catalog-clickable');
            items.forEach(item => {
                const itemColor = item.getAttribute('data-color');
                if (color === 'all' || itemColor === color) {
                    item.style.display = '';
                    requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    });
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        };
        
        // 相簿輪播功能
        let carouselIntervals = new Map();
        
        function startPhotoCarousel(element) {
            const photos = element.querySelectorAll('.reference-photo');
            if (photos.length <= 1) return;
            
            let currentIndex = 0;
            
            // 清除可能存在的舊interval
            if (carouselIntervals.has(element)) {
                clearInterval(carouselIntervals.get(element));
            }
            
            const interval = setInterval(() => {
                photos[currentIndex].classList.remove('active');
                photos[currentIndex].style.opacity = '0';
                
                currentIndex = (currentIndex + 1) % photos.length;
                
                photos[currentIndex].classList.add('active');
                photos[currentIndex].style.opacity = '1';
            }, 2000); // 每2秒切換一次
            
            carouselIntervals.set(element, interval);
        }
        
        function stopPhotoCarousel(element) {
            if (carouselIntervals.has(element)) {
                clearInterval(carouselIntervals.get(element));
                carouselIntervals.delete(element);
            }
            
            // 重置到第一張
            const photos = element.querySelectorAll('.reference-photo');
            photos.forEach((photo, index) => {
                if (index === 0) {
                    photo.classList.add('active');
                    photo.style.opacity = '1';
                } else {
                    photo.classList.remove('active');
                    photo.style.opacity = '0';
                }
            });
        }

        /**
         * 渲染 - 方案詳細頁面 (*** 完整版 ***)
         * @param {string} planId - 方案ID
         */
        function renderPlanDetail(planId) {
            // 重置篩選狀態
            window._currentPriceFilter = 'all';
            window._currentColorFilter = 'all';

            const plan = kimonoPlans.find(p => p.id === planId);

            if (!plan) {
                // 找不到方案時的錯誤頁面
                getContentDiv().innerHTML = `
                    <div class="text-center py-20 bg-white rounded-xl shadow-lg">
                        <h2 class="text-4xl font-bold text-red-500 mb-4">${t('找不到方案')}</h2>
                        <p class="text-xl text-gray-600 mb-8">${t('您請求的方案 ID:')} "${planId}" ${t('不存在。')}</p>
                        <a href="#kimono-plans" class="bg-gray-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-600 transition duration-300">
                            &larr; ${t('返回方案列表')}
                        </a>
                    </div>
                `;
                return;
            }

            // 收集所有照片（主圖 + 其他照片）
            const allPhotos = [plan.image, ...(plan.photos || [])].filter(Boolean);
            
            // 處理多張照片的 HTML (照片參考 - 用於下方展示)
            let photoGallery = '';
            if (plan.photos && plan.photos.length > 0) {
                photoGallery = `
                    <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 not-prose">
                        ${plan.photos.map(photoUrl => `
                            <div class="rounded-lg overflow-hidden shadow-md">
                                <img src="${photoUrl}" alt="${t('方案補充照片')}" class="w-full h-auto object-cover" onerror="this.onerror=null; this.src='https://placehold.co/400x300/cccccc/000000?text=${encodeURIComponent(t('圖片缺失'))}'">
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            // 判斷方案類型
            const isLadiesOrChildren = plan.name.includes('女士') || plan.name.includes('小孩') || plan.name.includes('情侶');
            const isMen = plan.name.includes('男士');
            
            // 套餐內容項目（移除和服，讓圖示能在一排顯示）
            const ladiesItems = [
                { name: '腰帶', icon: 'obi' },
                { name: '髮型', icon: 'hair' },
                { name: '內搭', icon: 'underwear' },
                { name: '長襦袢', icon: 'nagajuban' },
                { name: '草履', icon: 'zori' },
                { name: '日式提包', icon: 'bag' },
                { name: '分趾襪', icon: 'tabi' },
                { name: '髮飾', icon: 'hairpin' }
            ];
            
            const menItems = [
                { name: '腰帶', icon: 'obi' },
                { name: '內搭', icon: 'underwear' },
                { name: '長襦袢', icon: 'nagajuban' },
                { name: '草履', icon: 'zori' },
                { name: '日式提包', icon: 'bag' },
                { name: '分趾襪', icon: 'tabi' }
            ];
            
            const planItems = isLadiesOrChildren ? ladiesItems : menItems;
            
            // 圖示對應圖片路徑（透明背景 PNG）
            function getIconImage(iconType) {
                const iconImages = {
                    obi: 'img/plan_obi.png',
                    hair: 'img/plan_hairstyle.png',
                    underwear: 'img/plan_innerwear.png',
                    nagajuban: 'img/plan_nagajuban.png',
                    zori: 'img/plan_geta.png',
                    bag: 'img/plan_bag.png',
                    tabi: 'img/plan_tabi.png',
                    hairpin: 'img/plan_hair_accessory.png'
                };
                return iconImages[iconType] || '';
            }
            
            // 從 longDesc 中提取內容
            const longDescStr = plan.longDesc || '';
            
            // 提取和服介紹
            const introMatch = longDescStr.match(/<!-- ✿和服介紹 -->[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/);
            const introText = introMatch ? introMatch[1] : '';
            
            // 提取方案包含列表
            const includesMatch = longDescStr.match(/<!-- ✿方案包含： -->[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/);
            let includesList = '';
            if (includesMatch) {
                const listItems = includesMatch[1].match(/<li[^>]*>([^<]+)<\/li>/g);
                if (listItems) {
                    includesList = listItems.map(li => {
                        const rawText = li.replace(/<[^>]+>/g, '').trim();
                        const translatedText = t(rawText).replace(/⌁/g, '');
                        return `<li style="margin-bottom: 1rem; color: #4a4a4a; display: flex; align-items: baseline; gap: 1rem;"><span style="color: #9ca3af;">—</span><span>${translatedText}</span></li>`;
                    }).join('');
                }
            }
            
            // 提取歸還時間
            const returnMatch = longDescStr.match(/<!-- ✿歸還時間 -->[\s\S]*?<h3[^>]*>([^<]+)<\/h3>[\s\S]*?<h3[^>]*>([^<]+)<\/h3>/);
            const returnTime1 = returnMatch ? returnMatch[1].trim() : '※當日17:30前需歸還';
            const returnTime2 = returnMatch ? returnMatch[2].trim() : '※免費隔日中午12:00前歸還（需付押金¥10,000）';
            
            // 生成套餐內容 HTML（使用透明背景 PNG 圖示）
            const planItemsHTML = planItems.map(item => `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                    <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                        <img src="${getIconImage(item.icon)}" alt="${t(item.name)}" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.style.display='none'">
                    </div>
                    <span style="font-size: 0.7rem; color: #6b6b6b; font-weight: 400; text-align: center; white-space: nowrap; letter-spacing: 0.05em;">${t(item.name)}</span>
                </div>
            `).join('');

            // 方案詳細頁面結構 (*** 日式高級雜誌極簡風格 ***)
            // 根據方案 ID 生成不同的裝飾色塊
            function generatePlanBlobs(planId) {
                // 每個方案的獨特色塊配置
                const blobSets = {
                    plan1: [ // 小紋
                        { w: 300, h: 240, color: 'rgba(240,236,224,0.4)', top: '3%', left: '-4rem', rotate: -12, br: '62% 38% 46% 54% / 60% 44% 56% 40%' },
                        { w: 160, h: 190, color: 'rgba(220,190,185,0.1)', top: '15%', right: '5%', rotate: 25, br: '44% 56% 38% 62% / 52% 60% 40% 48%' },
                        { w: 120, h: 130, color: 'rgba(135,154,148,0.08)', top: '45%', left: '8%', rotate: -20, br: '55% 45% 60% 40% / 48% 55% 45% 52%' },
                        { w: 220, h: 180, color: 'rgba(240,220,215,0.12)', bottom: '15%', right: '-3rem', rotate: 15, br: '48% 52% 42% 58% / 56% 44% 56% 44%' },
                        { w: 90, h: 110, color: 'rgba(135,154,148,0.06)', bottom: '30%', left: '3%', rotate: 35, br: '58% 42% 52% 48% / 46% 58% 42% 54%' },
                    ],
                    plan2: [ // 高級小紋
                        { w: 200, h: 260, color: 'rgba(135,154,148,0.07)', top: '5%', right: '-2rem', rotate: 18, br: '50% 50% 40% 60% / 55% 45% 55% 45%' },
                        { w: 280, h: 220, color: 'rgba(240,236,224,0.35)', top: '20%', left: '-5rem', rotate: -10, br: '58% 42% 50% 50% / 42% 58% 42% 58%' },
                        { w: 140, h: 150, color: 'rgba(220,180,180,0.1)', top: '55%', right: '10%', rotate: -30, br: '45% 55% 55% 45% / 50% 50% 50% 50%' },
                        { w: 170, h: 140, color: 'rgba(240,220,215,0.15)', bottom: '10%', left: '5%', rotate: 22, br: '60% 40% 48% 52% / 44% 56% 44% 56%' },
                        { w: 100, h: 80, color: 'rgba(135,154,148,0.05)', top: '38%', left: '45%', rotate: -15, br: '52% 48% 46% 54% / 58% 42% 58% 42%' },
                    ],
                    plan3: [ // 蕾絲
                        { w: 240, h: 200, color: 'rgba(220,190,190,0.12)', top: '2%', left: '10%', rotate: -8, br: '55% 45% 42% 58% / 48% 52% 48% 52%' },
                        { w: 180, h: 220, color: 'rgba(240,236,224,0.38)', top: '30%', right: '-3rem', rotate: 20, br: '46% 54% 58% 42% / 54% 46% 54% 46%' },
                        { w: 130, h: 160, color: 'rgba(135,154,148,0.06)', bottom: '25%', left: '-2rem', rotate: -25, br: '62% 38% 44% 56% / 50% 50% 50% 50%' },
                        { w: 260, h: 190, color: 'rgba(240,220,215,0.1)', bottom: '5%', right: '8%', rotate: 12, br: '42% 58% 52% 48% / 56% 44% 56% 44%' },
                        { w: 80, h: 100, color: 'rgba(220,180,180,0.08)', top: '60%', left: '50%', rotate: 40, br: '50% 50% 50% 50% / 60% 40% 60% 40%' },
                    ],
                    plan4: [ // 二尺袖
                        { w: 190, h: 250, color: 'rgba(135,154,148,0.08)', top: '8%', left: '-3rem', rotate: 15, br: '48% 52% 56% 44% / 42% 58% 42% 58%' },
                        { w: 260, h: 200, color: 'rgba(240,236,224,0.32)', top: '25%', right: '3%', rotate: -18, br: '56% 44% 40% 60% / 52% 48% 52% 48%' },
                        { w: 110, h: 130, color: 'rgba(220,190,185,0.12)', top: '50%', left: '15%', rotate: 30, br: '44% 56% 60% 40% / 48% 52% 48% 52%' },
                        { w: 160, h: 180, color: 'rgba(240,220,215,0.1)', bottom: '12%', left: '60%', rotate: -22, br: '60% 40% 46% 54% / 56% 44% 56% 44%' },
                        { w: 220, h: 170, color: 'rgba(220,180,180,0.07)', bottom: '35%', right: '-4rem', rotate: 8, br: '52% 48% 54% 46% / 44% 56% 44% 56%' },
                    ],
                    plan5: [ // 訪問服
                        { w: 320, h: 250, color: 'rgba(240,236,224,0.36)', top: '1%', right: '-5rem', rotate: -14, br: '58% 42% 48% 52% / 46% 54% 46% 54%' },
                        { w: 150, h: 180, color: 'rgba(135,154,148,0.07)', top: '35%', left: '2%', rotate: 22, br: '42% 58% 54% 46% / 58% 42% 58% 42%' },
                        { w: 200, h: 160, color: 'rgba(220,190,185,0.1)', top: '55%', right: '12%', rotate: -28, br: '54% 46% 42% 58% / 50% 50% 50% 50%' },
                        { w: 130, h: 110, color: 'rgba(240,220,215,0.14)', bottom: '8%', left: '20%', rotate: 18, br: '46% 54% 56% 44% / 52% 48% 52% 48%' },
                        { w: 100, h: 120, color: 'rgba(135,154,148,0.05)', bottom: '28%', left: '-2rem', rotate: -35, br: '60% 40% 50% 50% / 44% 56% 44% 56%' },
                    ],
                    plan7: [ // 黑留袖
                        { w: 280, h: 230, color: 'rgba(240,236,224,0.33)', top: '6%', left: '5%', rotate: -20, br: '50% 50% 44% 56% / 58% 42% 58% 42%' },
                        { w: 170, h: 200, color: 'rgba(220,180,180,0.09)', top: '18%', right: '-2rem', rotate: 28, br: '56% 44% 52% 48% / 40% 60% 40% 60%' },
                        { w: 120, h: 140, color: 'rgba(135,154,148,0.07)', top: '48%', left: '-3rem', rotate: 10, br: '44% 56% 48% 52% / 56% 44% 56% 44%' },
                        { w: 200, h: 160, color: 'rgba(240,220,215,0.12)', bottom: '20%', right: '15%', rotate: -16, br: '62% 38% 56% 44% / 48% 52% 48% 52%' },
                        { w: 90, h: 100, color: 'rgba(220,190,185,0.08)', bottom: '40%', left: '40%', rotate: 32, br: '48% 52% 58% 42% / 52% 48% 52% 48%' },
                    ],
                    plan8: [ // 振袖
                        { w: 250, h: 310, color: 'rgba(220,190,185,0.1)', top: '3%', right: '8%', rotate: -10, br: '46% 54% 40% 60% / 54% 46% 54% 46%' },
                        { w: 180, h: 150, color: 'rgba(240,236,224,0.4)', top: '28%', left: '-4rem', rotate: 16, br: '58% 42% 54% 46% / 42% 58% 42% 58%' },
                        { w: 140, h: 170, color: 'rgba(135,154,148,0.06)', top: '52%', right: '-2rem', rotate: -24, br: '52% 48% 44% 56% / 60% 40% 60% 40%' },
                        { w: 200, h: 160, color: 'rgba(240,220,215,0.13)', bottom: '10%', left: '12%', rotate: 20, br: '40% 60% 50% 50% / 48% 52% 48% 52%' },
                        { w: 110, h: 90, color: 'rgba(220,180,180,0.07)', top: '40%', left: '30%', rotate: -38, br: '55% 45% 60% 40% / 50% 50% 50% 50%' },
                    ],
                    plan10: [ // 男士和服
                        { w: 220, h: 180, color: 'rgba(135,154,148,0.08)', top: '4%', left: '-3rem', rotate: 12, br: '54% 46% 48% 52% / 46% 54% 46% 54%' },
                        { w: 300, h: 240, color: 'rgba(240,236,224,0.34)', top: '22%', right: '-4rem', rotate: -15, br: '42% 58% 56% 44% / 52% 48% 52% 48%' },
                        { w: 130, h: 160, color: 'rgba(220,190,185,0.08)', top: '50%', left: '10%', rotate: 25, br: '60% 40% 42% 58% / 44% 56% 44% 56%' },
                        { w: 170, h: 140, color: 'rgba(240,220,215,0.11)', bottom: '15%', right: '5%', rotate: -20, br: '48% 52% 54% 46% / 58% 42% 58% 42%' },
                        { w: 100, h: 120, color: 'rgba(135,154,148,0.05)', bottom: '35%', left: '55%', rotate: 30, br: '56% 44% 50% 50% / 42% 58% 42% 58%' },
                    ],
                    plan11: [ // 武士服
                        { w: 260, h: 210, color: 'rgba(240,236,224,0.38)', top: '2%', right: '3%', rotate: -22, br: '50% 50% 42% 58% / 56% 44% 56% 44%' },
                        { w: 180, h: 230, color: 'rgba(135,154,148,0.06)', top: '30%', left: '-5rem', rotate: 14, br: '46% 54% 58% 42% / 40% 60% 40% 60%' },
                        { w: 150, h: 130, color: 'rgba(220,180,180,0.1)', top: '55%', right: '10%', rotate: -32, br: '58% 42% 46% 54% / 52% 48% 52% 48%' },
                        { w: 200, h: 170, color: 'rgba(240,220,215,0.12)', bottom: '8%', left: '15%', rotate: 18, br: '44% 56% 52% 48% / 48% 52% 48% 52%' },
                        { w: 90, h: 110, color: 'rgba(220,190,185,0.07)', bottom: '42%', left: '45%', rotate: -15, br: '62% 38% 48% 52% / 54% 46% 54% 46%' },
                    ],
                    plan13: [ // 袴
                        { w: 200, h: 280, color: 'rgba(220,190,185,0.09)', top: '5%', left: '8%', rotate: -18, br: '52% 48% 40% 60% / 58% 42% 58% 42%' },
                        { w: 240, h: 190, color: 'rgba(240,236,224,0.36)', top: '20%', right: '-3rem', rotate: 22, br: '44% 56% 54% 46% / 46% 54% 46% 54%' },
                        { w: 160, h: 140, color: 'rgba(135,154,148,0.07)', top: '50%', left: '-2rem', rotate: -10, br: '56% 44% 48% 52% / 50% 50% 50% 50%' },
                        { w: 130, h: 160, color: 'rgba(240,220,215,0.14)', bottom: '12%', right: '12%', rotate: 28, br: '48% 52% 56% 44% / 42% 58% 42% 58%' },
                        { w: 110, h: 90, color: 'rgba(220,180,180,0.08)', bottom: '30%', left: '35%', rotate: 40, br: '60% 40% 44% 56% / 54% 46% 54% 46%' },
                    ],
                    plan14: [ // 兒童
                        { w: 230, h: 200, color: 'rgba(220,190,190,0.12)', top: '3%', right: '5%', rotate: 15, br: '55% 45% 50% 50% / 45% 55% 45% 55%' },
                        { w: 180, h: 220, color: 'rgba(240,236,224,0.35)', top: '25%', left: '-4rem', rotate: -20, br: '48% 52% 42% 58% / 56% 44% 56% 44%' },
                        { w: 140, h: 120, color: 'rgba(135,154,148,0.08)', top: '48%', right: '-2rem', rotate: 30, br: '42% 58% 56% 44% / 50% 50% 50% 50%' },
                        { w: 190, h: 150, color: 'rgba(240,220,215,0.1)', bottom: '18%', left: '10%', rotate: -12, br: '60% 40% 46% 54% / 44% 56% 44% 56%' },
                        { w: 100, h: 130, color: 'rgba(220,180,180,0.07)', bottom: '38%', right: '30%', rotate: 25, br: '50% 50% 54% 46% / 58% 42% 58% 42%' },
                    ],
                    plan15: [ // 情侶
                        { w: 280, h: 240, color: 'rgba(220,190,185,0.11)', top: '1%', left: '-3rem', rotate: -16, br: '46% 54% 58% 42% / 42% 58% 42% 58%' },
                        { w: 160, h: 200, color: 'rgba(135,154,148,0.07)', top: '22%', right: '2%', rotate: 24, br: '58% 42% 44% 56% / 54% 46% 54% 46%' },
                        { w: 220, h: 170, color: 'rgba(240,236,224,0.38)', top: '45%', left: '5%', rotate: -28, br: '50% 50% 52% 48% / 48% 52% 48% 52%' },
                        { w: 140, h: 160, color: 'rgba(240,220,215,0.13)', bottom: '10%', right: '10%', rotate: 10, br: '44% 56% 48% 52% / 56% 44% 56% 44%' },
                        { w: 100, h: 80, color: 'rgba(220,180,180,0.09)', top: '65%', left: '50%', rotate: -35, br: '62% 38% 52% 48% / 46% 54% 46% 54%' },
                    ],
                };
                // 預設色塊（給未特別定義的方案）
                const defaultBlobs = [
                    { w: 260, h: 220, color: 'rgba(240,236,224,0.36)', top: '5%', left: '-4rem', rotate: -12, br: '55% 45% 48% 52% / 50% 50% 50% 50%' },
                    { w: 180, h: 200, color: 'rgba(135,154,148,0.06)', top: '20%', right: '-2rem', rotate: 20, br: '48% 52% 44% 56% / 54% 46% 54% 46%' },
                    { w: 140, h: 150, color: 'rgba(220,180,180,0.09)', top: '50%', left: '10%', rotate: -22, br: '56% 44% 52% 48% / 46% 54% 46% 54%' },
                    { w: 200, h: 170, color: 'rgba(240,220,215,0.12)', bottom: '15%', right: '8%', rotate: 15, br: '44% 56% 56% 44% / 52% 48% 52% 48%' },
                    { w: 100, h: 120, color: 'rgba(135,154,148,0.05)', bottom: '35%', left: '40%', rotate: 30, br: '60% 40% 48% 52% / 48% 52% 48% 52%' },
                ];
                const blobs = blobSets[planId] || defaultBlobs;
                return blobs.map(b => {
                    let pos = `width:${b.w}px;height:${b.h}px;background:${b.color};border-radius:${b.br};transform:rotate(${b.rotate}deg);position:absolute;z-index:0;pointer-events:none;`;
                    if (b.top) pos += `top:${b.top};`;
                    if (b.bottom) pos += `bottom:${b.bottom};`;
                    if (b.left) pos += `left:${b.left};`;
                    if (b.right) pos += `right:${b.right};`;
                    return `<div style="${pos}"></div>`;
                }).join('');
            }

            const contentDiv = getContentDiv();
            if (!contentDiv) {
                console.error('❌ 無法找到 #content 元素');
                return;
            }
            contentDiv.innerHTML = `
                <div style="background: #F9F8F6; min-height: 100vh; padding: 4rem 0 6rem; position: relative;">
                
                    <!-- 不規則裝飾色塊容器（獨立 overflow:hidden，不影響 sticky） -->
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; pointer-events: none; z-index: 0;">
                        ${generatePlanBlobs(plan.id)}
                    </div>
                
                    <div class="plan-detail-container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 1;">
                
                        <!-- 兩欄佈局：大圖、詳情 -->
                        <div class="plan-detail-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-bottom: 5rem; align-items: start;">
                            
                            <!-- 左側：大圖和縮圖列 -->
                            <div class="plan-detail-image-section" style="display: flex; gap: 1rem; align-items: flex-start; position: sticky; top: 2rem; align-self: flex-start;">
                                ${allPhotos.length > 1 ? `
                                    <div class="plan-detail-thumbnails-column" id="thumbnails-column" style="flex-shrink: 0; align-self: stretch;">
                                            ${allPhotos.map((photo, index) => `
                                                <img src="${photo}" 
                                                     alt="${t('縮圖')} ${index + 1}" 
                                                     class="plan-detail-thumbnail-item ${index === 0 ? 'active' : ''}"
                                                     onclick="switchMainImage(${index}, '${photo.replace(/'/g, "\\'")}')"
                                                     onerror="this.onerror=null; this.src='https://placehold.co/120x160/cccccc/000000?text=${encodeURIComponent(t('圖片缺失'))}'">
                                            `).join('')}
                                    </div>
                                ` : ''}
                                <div class="plan-detail-image-wrapper" id="main-image-wrapper" style="flex: 1; display: flex; align-items: flex-start; cursor: pointer;">
                                    <img id="main-plan-image" 
                                         src="${plan.image}" 
                                         alt="${t(plan.name)}" 
                                         class="plan-detail-image"
                                         style="width: 100%; height: auto; object-fit: cover;"
                                         onerror="this.onerror=null; this.src='https://placehold.co/600x600/cccccc/000000?text=${encodeURIComponent(t('圖片缺失'))}'">
                                </div>
                            </div>

                            <!-- 右側：詳情 -->
                            <div class="plan-detail-info" style="padding-top: 1rem;">
                                
                                <!-- 產品名稱與價格（同一行） -->
                                <h1 style="font-size: 1.75rem; font-weight: 500; color: #333333; margin-bottom: 1rem; font-family: 'Noto Serif TC', serif; letter-spacing: 0.1em; line-height: 1.4; display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap;">
                                    <span>${t(plan.name)}</span>
                                    <span style="font-size: 1.1rem; font-weight: 400; color: #8a8a8a; font-family: 'EB Garamond', serif;">${t(plan.price)}</span>
                        </h1>

                                <!-- 簡短描述（價格包含項目） -->
                                <p style="font-size: 0.875rem; color: #6b6b6b; margin-bottom: 3rem; line-height: 2; letter-spacing: 0.02em;">
                                    ${t(plan.shortDesc).replace(/⋈\*｡/g, '').trim()}
                        </p>

                                <!-- 和服介紹 -->
                                <div style="margin-bottom: 3rem;">
                                    <h2 style="font-size: 0.8rem; font-weight: 500; color: #9ca3af; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif; letter-spacing: 0.2em; text-transform: uppercase;">
                                        About
                                    </h2>
                                    <p style="font-size: 0.9rem; color: #4a4a4a; line-height: 2.2; letter-spacing: 0.02em;">
                                        ${t(introText || '以細緻優雅的「全面花紋」為特色，適合各種場合。')}
                                    </p>
                                </div>

                                <!-- 方案包含 -->
                                <div style="margin-bottom: 3rem;">
                                    <h2 style="font-size: 0.8rem; font-weight: 500; color: #9ca3af; margin-bottom: 2rem; font-family: 'Cormorant Garamond', serif; letter-spacing: 0.2em; text-transform: uppercase;">
                                        Includes
                                    </h2>
                                    
                                    <!-- 套餐內容圖示 -->
                                    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem 0; margin-bottom: 2.5rem; padding: 0 0.5rem;">
                                        ${planItemsHTML}
                                    </div>
                                    
                                    <!-- 詳細列表 -->
                                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.875rem; line-height: 2;">
                                        ${includesList || `<li style="margin-bottom: 1rem; color: #4a4a4a; display: flex; align-items: baseline; gap: 1rem;"><span style="color: #9ca3af;">—</span><span>${t('小紋 ¥5,500 一套')}</span></li><li style="margin-bottom: 1rem; color: #4a4a4a; display: flex; align-items: baseline; gap: 1rem;"><span style="color: #9ca3af;">—</span><span>${t('半幅腰帶 / 兵兒帶')}</span></li><li style="margin-bottom: 1rem; color: #4a4a4a; display: flex; align-items: baseline; gap: 1rem;"><span style="color: #9ca3af;">—</span><span>${t('免費髮型 / 髮飾')}</span></li><li style="margin-bottom: 1rem; color: #4a4a4a; display: flex; align-items: baseline; gap: 1rem;"><span style="color: #9ca3af;">—</span><span>${t('內搭、分趾襪、草履、日式提包')}</span></li><li style="margin-bottom: 1rem; color: #4a4a4a; display: flex; align-items: baseline; gap: 1rem;"><span style="color: #9ca3af;">—</span><span>${t('可免費租借拍攝道具（雨傘、扇子）')}</span></li>`}
                                    </ul>
                                </div>

                                <!-- 點我預約按鈕 -->
                                <div style="margin-top: 3rem;">
                                    <a href="#" onclick="event.preventDefault(); openBookingModal(); return false;" 
                                       style="display: block; width: 100%; padding: 1.25rem 2rem; background: #3d3d3d; color: white; text-align: center; text-decoration: none; font-weight: 400; font-size: 1rem; letter-spacing: 0.5em; transition: all 0.3s ease; cursor: pointer;"
                                       onmouseover="this.style.background='#2a2a2a'"
                                       onmouseout="this.style.background='#3d3d3d'">
                                        ${t('點 我 預 約')}
                                    </a>
                                </div>

                                <!-- 歸還時間 -->
                                <div style="margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid #e8e8e8;">
                                    <p style="font-size: 0.75rem; color: #b8a89a; margin-bottom: 0.75rem; letter-spacing: 0.02em;">
                                        ${t(returnTime1)}
                                    </p>
                                    <p style="font-size: 0.75rem; color: #b8a89a; letter-spacing: 0.02em;">
                                        ${t(returnTime2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- 參考照片 -->
                        <div style="margin-top: 5rem; padding-top: 4rem; border-top: 1px solid #e8e8e8;">
                            <h2 style="font-size: 0.8rem; font-weight: 500; color: #9ca3af; margin-bottom: 3rem; font-family: 'Cormorant Garamond', serif; letter-spacing: 0.2em; text-transform: uppercase; text-align: center;">
                                Gallery
                            </h2>
                            ${getReferencePhotoGallery(plan.id)}
                        </div>
                    </div>
                </div>

                <!-- Lightbox 燈箱 -->
                <div id="lightbox" class="lightbox" onclick="if(event.target.id === 'lightbox') closeLightbox()">
                    <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
                    <span class="lightbox-nav lightbox-prev" onclick="changeLightboxImage(-1); event.stopPropagation();">&#10094;</span>
                    <div class="lightbox-content">
                        <img id="lightbox-img" src="" alt="${t('相簿圖片')}">
                        <div style="text-align: center; color: white; margin-top: 1rem; font-size: 1.125rem;">
                            <span id="lightbox-counter"></span>
                        </div>
                    </div>
                    <span class="lightbox-nav lightbox-next" onclick="changeLightboxImage(1); event.stopPropagation();">&#10095;</span>
                </div>

                ${getFooterHTML()}
            `;
            
            // 當前圖片索引
            let currentPhotoIndex = 0;

            // 主圖點擊 → 開啟 Lightbox 瀏覽所有方案照片
            const mainPlanImage = document.getElementById('main-plan-image');
            if (mainPlanImage) {
                mainPlanImage.style.cursor = 'zoom-in';
                mainPlanImage.addEventListener('click', function() {
                    if (typeof window.openLightbox === 'function') {
                        window.openLightbox(allPhotos, currentPhotoIndex);
                    }
                });
            }
            
            // 切換主圖的函數
            window.switchMainImage = function(index, imageUrl) {
                const mainImage = document.getElementById('main-plan-image');
                const thumbnails = document.querySelectorAll('.plan-detail-thumbnail-item');
                
                if (mainImage) {
                    mainImage.src = imageUrl;
                }
                
                // 更新當前索引
                currentPhotoIndex = index;
                
                // 更新縮圖的 active 狀態
                thumbnails.forEach((thumb, i) => {
                    if (i === index) {
                        thumb.classList.add('active');
                    } else {
                        thumb.classList.remove('active');
                    }
                });
            };
            
            // 縮圖上下滾動函數
            window.scrollThumbnails = function(direction) {
                const column = document.getElementById('thumbnails-column');
                if (!column) return;
                
                const scrollAmount = 100;
                if (direction === 'up') {
                    column.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
                } else {
                    column.scrollBy({ top: scrollAmount, behavior: 'smooth' });
                }
            };
            
            // 鼠標懸停切換圖片功能（兩張圖片來回切換）
            const mainImageWrapper = document.getElementById('main-image-wrapper');
            let originalPhotoIndex = 0; // 記錄原始圖片索引
            
            if (mainImageWrapper && allPhotos.length > 1) {
                // 記錄初始圖片索引
                originalPhotoIndex = currentPhotoIndex;
                
                // 鼠標進入時切換到下一張
                mainImageWrapper.addEventListener('mouseenter', function() {
                    // 計算下一張的索引
                    const nextIndex = (currentPhotoIndex + 1) % allPhotos.length;
                    const nextPhoto = allPhotos[nextIndex];
                    switchMainImage(nextIndex, nextPhoto);
                });
                
                // 鼠標離開時切換回原始圖片
                mainImageWrapper.addEventListener('mouseleave', function() {
                    const originalPhoto = allPhotos[originalPhotoIndex];
                    switchMainImage(originalPhotoIndex, originalPhoto);
                });
            }
            
            // 為價格分類型錄照片（振袖 & 訪問服）綁定 Lightbox
            const priceGrids = document.querySelectorAll('.gallery-photo img');
            if (priceGrids.length > 0) {
                priceGrids.forEach((img) => {
                    img.style.cursor = 'pointer';
                    img.addEventListener('click', function() {
                        const grid = this.closest('.reference-photo-gallery-grid');
                        if (!grid) return;
                        const currentVisible = [];
                        grid.querySelectorAll('.gallery-photo').forEach(item => {
                            if (item.style.display !== 'none') {
                                const innerImg = item.querySelector('img');
                                if (innerImg && innerImg.src) currentVisible.push(innerImg.src);
                            }
                        });
                        const clickedIdx = currentVisible.indexOf(this.src);
                        if (typeof window.openLightbox === 'function') {
                            window.openLightbox(currentVisible, clickedIdx >= 0 ? clickedIdx : 0);
                        }
                    });
                });
            }

            // 為一般型錄照片綁定 Lightbox
            const catalogItems = document.querySelectorAll('#catalog-gallery-grid .catalog-clickable');
            if (catalogItems.length > 0) {
                catalogItems.forEach((item) => {
                    item.addEventListener('click', function() {
                        // 收集目前可見的照片
                        const visibleItems = document.querySelectorAll('#catalog-gallery-grid .catalog-clickable');
                        const currentVisible = [];
                        let clickedIdx = 0;
                        visibleItems.forEach(vi => {
                            if (vi.style.display !== 'none') {
                                const img = vi.querySelector('img');
                                if (img && img.src) {
                                    if (vi === item) clickedIdx = currentVisible.length;
                                    currentVisible.push(img.src);
                                }
                            }
                        });
                        if (typeof window.openLightbox === 'function') {
                            window.openLightbox(currentVisible, clickedIdx);
                        }
                    });
                });
            }
            
            if (!window._isLanguageSwitching) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        /**
         * 渲染 - 靜態頁面 (通用模板) (*** 完整版 ***)
         * @param {string} title - 頁面大標題
         * @param {string} contentHtml - 頁面的 HTML 內容
         */
        function renderStaticPage(title, contentHtml, englishTitle = '', centerTitle = false, blobName = '') {
            const contentDiv = getContentDiv();
            if (!contentDiv) {
                console.error('❌ 無法找到 #content 元素');
                return;
            }
            
            // 檢查是否為特殊頁面（不需標題/不同容器）
            // 使用 englishTitle 判斷，避免日文模式下 t() 翻譯後比較失敗
            const isPhotoPlans = englishTitle === 'Photography Plan';
            const isPhotoGallery = englishTitle === 'Photo Gallery';
            const isStoreIntro = title === '';
            const isSpecialPage = isPhotoPlans || isPhotoGallery || isStoreIntro;
            let containerClass = 'bg-white rounded-xl shadow-xl p-6 md:p-10 lg:p-12 prose max-w-none';
            if (isPhotoPlans || isPhotoGallery) containerClass = 'bg-white prose max-w-none';
            if (isStoreIntro) containerClass = 'store-intro-wrapper p-0 overflow-hidden';
            
            const titleStyle = centerTitle ? 'justify-content: center;' : '';
            const titleHTML = englishTitle ? 
                `<h1 class="text-4xl font-extrabold text-gray-900 mb-6" style="font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: #544739; letter-spacing: 0.1em; line-height: 1.2; display: flex; align-items: baseline; gap: 1rem; ${titleStyle}">
                    <span>${title}</span>
                    <span style="font-size: 1rem; font-weight: 400; color: #544739; font-family: 'Inter', sans-serif; letter-spacing: 0.2em;">${englishTitle}</span>
                </h1>` :
                `<h1 class="text-4xl font-extrabold text-gray-900 mb-6" style="font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: #544739; letter-spacing: 0.1em; line-height: 1.2; display: flex; align-items: baseline; gap: 1rem; ${titleStyle}">${title}</h1>`;
            
            contentDiv.innerHTML = `
                <div class="${containerClass}" style="${isSpecialPage ? '' : 'position:relative;overflow:hidden;'}">
                    ${isSpecialPage ? '' : generatePageBlobs(blobName || 'hairMakeup')}
                    ${isSpecialPage ? '' : titleHTML}
                    <div style="position:relative;z-index:1;">
                    ${contentHtml}
                    </div>
                </div>

                ${getFooterHTML()}
            `;
            if (!window._isLanguageSwitching) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        
        /**
         * 渲染 - 髮型設計 (*** 完整版 ***) - Not in Nav, but exists
         */
        function renderHairMakeup() { // This function exists
            const content = `
                <p class="text-lg text-gray-700 mb-4">${t('我們提供專業的日式髮型設計與化妝服務，讓您的和服造型更加完美。')}</p>
                <h2 class="text-2xl font-bold mt-8 mb-3 text-gray-800">${t('髮型設計')}</h2>
                <p>${t('我們的髮型師會根據您的臉型與選擇的和服款式，為您設計最適合的髮型。包含編髮、盤髮等，並提供多種精美髮飾供您租借（部分需額外付費）。')}</p>
                <ul class="list-disc pl-5 mt-4 space-y-2 text-gray-700">
                    <li><strong>${t('簡易髮型：')}</strong> ${t('包含在標準方案內。')}</li>
                    <li><strong>${t('精緻髮型：')}</strong> NT$ 500 (${t('包含指定髮飾')})</li>
                </ul>
                <h2 class="text-2xl font-bold mt-8 mb-3 text-gray-800">${t('化妝服務')}</h2>
                <p>${t('由專業化妝師提供的全套日式妝容服務，讓您上鏡更好看。')}</p>
                <ul class="list-disc pl-5 mt-4 space-y-2 text-gray-700">
                    <li><strong>${t('重點化妝：')}</strong> NT$ 300 (${t('眼妝、唇彩')})</li>
                    <li><strong>${t('全套妝容：')}</strong> NT$ 800 (${t('底妝至全臉完妝')})</li>
                </ul>
                <div style="width: 100%; aspect-ratio: 2/1; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.5rem; margin-top: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <span style="font-size: 4rem;">💄</span>
                    <span style="color: #be185d; font-size: 1.3rem; font-weight: 600; text-align: center; line-height: 1.8; font-family: 'Zen Maru Gothic', 'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', sans-serif;">${t('請稍候～')}<br>${t('馬上就要上傳照片了！')}</span>
                </div>
            `;
            renderStaticPage(t('髮型設計及化妝服務'), content);
        }

        /**
         * 渲染 - 髮型設計菜單 (*** 日系雜誌瀑布流風格版 ***)
         */
        function renderHairstyle() {
            // 八種免費髮型
            const freeStyles = [
                { id: '01', name: '日系盤髮', nameEn: 'Japanese Updo', category: 'classic', image: 'img/hairstyle_updo.jpg', size: 'tall' },
                { id: '02', name: '日系盤髮2', nameEn: 'Japanese Updo II', category: 'classic', image: 'img/hairstyle_updo2.jpg', size: 'square' },
                { id: '03', name: '日系低盤', nameEn: 'Japanese Low Bun', category: 'classic', image: 'img/hairstyle_low_updo.jpg', size: 'wide' },
                { id: '04', name: '雙馬尾造型', nameEn: 'Twin Tails', category: 'cute', image: 'img/hairstyle_twin_tails.jpg', size: 'tall' },
                { id: '05', name: '日系馬尾', nameEn: 'Japanese Ponytail', category: 'cute', image: 'img/hairstyle_ponytail.jpg', size: 'square' },
                { id: '06', name: '短髮盤髮', nameEn: 'Short Hair Updo', category: 'classic', image: 'img/hairstyle_short_updo.jpg', size: 'square' },
                { id: '07', name: '假髮造型', nameEn: 'Wig Style', category: 'classic', image: 'img/hairstyle_wig.jpg', size: 'wide' },
                { id: '08', name: '丸子造型', nameEn: 'Bun Style', category: 'cute', image: 'img/hairstyle_bun.jpg', size: 'tall' }
            ];
            
            const content = `
                <div class="hair-mag-page" style="position: relative;">
                    <!-- 不規則裝飾色塊 -->
                    <div style="position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;pointer-events:none;z-index:0;">
                        <div style="position:absolute;width:300px;height:240px;background:rgba(240,236,224,0.35);border-radius:58% 42% 50% 50%/48% 56% 44% 52%;transform:rotate(-15deg);top:2%;left:-4rem;"></div>
                        <div style="position:absolute;width:180px;height:210px;background:rgba(220,190,185,0.1);border-radius:44% 56% 38% 62%/52% 60% 40% 48%;transform:rotate(22deg);top:12%;right:8%;"></div>
                        <div style="position:absolute;width:240px;height:200px;background:rgba(135,154,148,0.06);border-radius:52% 48% 56% 44%/44% 56% 44% 56%;transform:rotate(-8deg);top:35%;left:5%;"></div>
                        <div style="position:absolute;width:160px;height:180px;background:rgba(240,220,215,0.12);border-radius:60% 40% 46% 54%/50% 50% 50% 50%;transform:rotate(18deg);top:50%;right:-2rem;"></div>
                        <div style="position:absolute;width:280px;height:220px;background:rgba(240,236,224,0.3);border-radius:46% 54% 42% 58%/56% 44% 56% 44%;transform:rotate(12deg);top:65%;left:-3rem;"></div>
                        <div style="position:absolute;width:130px;height:150px;background:rgba(220,180,180,0.08);border-radius:55% 45% 52% 48%/42% 58% 42% 58%;transform:rotate(-25deg);top:78%;right:12%;"></div>
                        <div style="position:absolute;width:200px;height:170px;background:rgba(135,154,148,0.05);border-radius:48% 52% 58% 42%/52% 48% 52% 48%;transform:rotate(30deg);bottom:5%;left:15%;"></div>
                    </div>

                    <!-- Hero 區塊 -->
                    <header class="hair-mag-hero">
                        <div class="hair-mag-hero-deco"></div>
                        <!-- 左側：標題 + 封面照 -->
                        <div class="hair-mag-hero-left">
                            <div class="hair-mag-hero-content">
                                <span class="hair-mag-hero-en">Hair Design</span>
                                <div class="hair-mag-hero-line"></div>
                                <h1 class="hair-mag-hero-title">${t('髮型設計')}</h1>
                                <p class="hair-mag-hero-sub">ニコニコ着物</p>
                            </div>
                            <div class="hair-mag-hero-img">
                                <img src="img/hairstyle_cover.jpg" alt="${t('髮型設計')}" onerror="this.style.opacity='0'">
                            </div>
                        </div>
                        <!-- 右側：文字介紹 -->
                        <div class="hair-mag-hero-right">
                            <p class="hair-mag-hero-intro-en">About Our Hair Styling</p>
                            <div class="hair-mag-hero-intro-line"></div>
                            <p class="hair-mag-hero-intro">
                                ${t('女士和服套餐皆包含免費髮型設計，')}<br>
                                ${t('由專業造型師依據您的臉型與和服款式，')}<br>
                                ${t('量身打造最適合的造型。')}
                            </p>
                        </div>
                    </header>
                    
                    <!-- 免費髮型區塊 -->
                    <section class="hair-mag-section">
                        <div class="hair-mag-section-header">
                            <span class="hair-mag-section-en">free style</span>
                            <div class="hair-mag-section-line"></div>
                            <h2 class="hair-mag-section-title">${t('基本髮型')}</h2>
                            <p class="hair-mag-section-desc">${t('所有和服方案皆包含以下八種基本髮型，由專業造型師為您打造')}</p>
                    </div>

                        <!-- 4x2 網格佈局 -->
                        <div class="hair-mag-grid">
                            ${freeStyles.map((style, index) => `
                                <div class="hair-mag-item" onclick="openHairLightbox(${index})">
                                    <div class="hair-mag-item-img">
                                        <img src="${style.image}" alt="${t(style.name)}" onerror="this.src='https://placehold.co/400x500/F9F8F6/444444?text=${encodeURIComponent(t(style.name))}'">
                    </div>
                                    <div class="hair-mag-item-info">
                                        <span class="hair-mag-item-num">Style ${style.id}</span>
                                        <h3 class="hair-mag-item-name">${t(style.name)}</h3>
                                        <span class="hair-mag-item-free">${t('無料 / Free')}</span>
                    </div>
                                </div>
                            `).join('')}
                    </div>
                    </section>

                    <!-- 加購項目：新日本髮 -->
                    <section class="hair-mag-premium">
                        <div class="hair-mag-premium-deco"></div>
                        <div class="hair-mag-premium-deco-2"></div>
                        
                        <div class="hair-mag-premium-content">
                            <div class="hair-mag-premium-text">
                                <span class="hair-mag-premium-en">premium option</span>
                                <div class="hair-mag-premium-line"></div>
                                <h2 class="hair-mag-premium-title">${t('新日本髮')}</h2>
                                <p class="hair-mag-premium-title-jp">しんにほんがみ</p>
                                <div class="hair-mag-premium-price">
                                    <span class="hair-mag-premium-plus">+</span>
                                    <span class="hair-mag-premium-yen">¥5,500</span>
                    </div>
                                <p class="hair-mag-premium-desc">
                                    ${t('傳統日本髮的現代詮釋，結合古典美學與當代技法。')}<br>
                                    ${t('適合振袖、訪問服等正式場合，展現極致優雅。')}
                                </p>
                                <ul class="hair-mag-premium-features">
                                    <li>${t('專業造型師約 20 分鐘精心打造')}</li>
                                    <li>${t('適合拍攝紀念寫真')}</li>
                                </ul>
                </div>
                            <div class="hair-mag-premium-img" onclick="openHairLightbox(8)">
                                <img src="img/premium_hairstyle1.jpg" alt="${t('新日本髮')}" onerror="this.src='https://placehold.co/500x650/F9F8F6/444444?text=${encodeURIComponent(t('新日本髮'))}'">
                        </div>
                    </div>
                    </section>
                    
                    <!-- 備註 -->
                    <footer class="hair-mag-footer">
                        <div class="hair-mag-footer-inner">
                            <span class="hair-mag-footer-en">information</span>
                            <div class="hair-mag-footer-line"></div>
                            <ul>
                                <li>${t('髮型設計時間約 15-20 分鐘')}</li>
                                <li>${t('女士套餐價格皆包含髮型設計，並可任選髮飾')}</li>
                                <li>${t('另提供加購髮型 (¥5,500~)')}</li>
                                <li>${t('如有額外需求，請私訊')} <a href="https://www.instagram.com/niconico_kimono/" target="_blank" style="color: #859A93;">@Niconico_kimono</a></li>
                            </ul>
                        </div>
                    </footer>
                </div>

                <!-- Lightbox -->
                <div id="lightbox" class="lightbox" onclick="if(event.target.id === 'lightbox') closeLightbox()">
                    <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
                        <span class="lightbox-nav lightbox-prev" onclick="changeLightboxImage(-1); event.stopPropagation();">&#10094;</span>
                    <div class="lightbox-content">
                        <img id="lightbox-img" src="" alt="${t('放大檢視')}" class="active">
                        <video id="lightbox-video" src="" controls style="display: none;"></video>
                        <div id="lightbox-counter" style="color: white; margin-top: 1rem; text-align: center;"></div>
                    </div>
                        <span class="lightbox-nav lightbox-next" onclick="changeLightboxImage(1); event.stopPropagation();">&#10095;</span>
                </div>
            `;
            
            // 設定 Lightbox 圖片
            window.hairLightboxImages = [
                ...freeStyles.map(s => s.image),
                'img/premium_hairstyle1.jpg'
            ];
            
            getContentDiv().innerHTML = content + getFooterHTML();
            if (!window._isLanguageSwitching) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        
        // 髮型頁面 Lightbox
        function openHairLightbox(index) {
            const images = window.hairLightboxImages || [];
            if (images.length === 0) return;
            
            currentLightboxImages = images;
            currentLightboxIndex = index;
            
            const lightbox = document.getElementById('lightbox');
            const img = document.getElementById('lightbox-img');
            const video = document.getElementById('lightbox-video');
            const counter = document.getElementById('lightbox-counter');
            
            img.src = images[index];
            img.style.display = 'block';
            video.style.display = 'none';
            counter.textContent = `${index + 1} / ${images.length}`;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // 攝影方案 - 查看照片（使用 lightbox 顯示單張樣片）
        window.openPhotoPlanSample = function(imageSrc) {
            const lightbox = document.getElementById('lightbox');
            const img = document.getElementById('lightbox-img');
            const video = document.getElementById('lightbox-video');
            const counter = document.getElementById('lightbox-counter');
            
            if (!lightbox || !img) return;
            
            currentLightboxImages = [imageSrc];
            currentLightboxIndex = 0;
            
            img.src = imageSrc;
            img.style.display = 'block';
            if (video) video.style.display = 'none';
            if (counter) counter.textContent = '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        /**
         * 渲染 - 店內介紹 (日系雜誌排版風格)
         */
        function renderStoreIntro() {
            console.log('📝 開始渲染店內介紹...');
            const content = `
                <div class="si-page">
                    <!-- 糖霜滴落頂部裝飾：綠色糖霜從上方滴入米白色背景 -->
                    <div class="si-drip-top">
                        <svg viewBox="0 0 1200 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0,0 L1200,0 L1200,80 Q1160,75 1120,95 Q1080,120 1040,90 Q1000,65 960,85 Q920,115 880,90 Q840,70 800,100 Q760,140 720,105 Q680,75 640,95 Q600,130 560,95 Q520,65 480,90 Q440,125 400,90 Q360,65 320,95 Q280,130 240,95 Q200,70 160,100 Q120,145 80,100 Q40,65 0,90 Z" fill="#879A94"/>
                        </svg>
                    </div>

                    <!-- 標題區：米白背景，糖霜下方充足留白 -->
                    <div class="si-hero-band">
                        <!-- 半透明幾何色塊裝飾 -->
                        <div class="si-geo-blob si-geo-1"></div>
                        <div class="si-geo-blob si-geo-2"></div>
                        <div class="si-geo-blob si-geo-3"></div>
                        <div class="si-geo-blob si-geo-4"></div>
                        <div class="si-geo-blob si-geo-5"></div>
                        <div class="si-geo-blob si-geo-6"></div>

                        <!-- 手繪感小元素 -->
                        <svg class="si-deco si-deco-1" viewBox="0 0 20 20"><line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" stroke-width="1"/><line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" stroke-width="1"/></svg>
                        <svg class="si-deco si-deco-2" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3" fill="currentColor"/></svg>
                        <svg class="si-deco si-deco-3" viewBox="0 0 20 20"><line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" stroke-width="1"/><line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" stroke-width="1"/></svg>
                        <svg class="si-deco si-deco-4" viewBox="0 0 10 10"><circle cx="5" cy="5" r="2.5" fill="currentColor"/></svg>
                        <svg class="si-deco si-deco-5" viewBox="0 0 30 8"><path d="M2,4 Q8,0 14,4 Q20,8 26,4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
                        <svg class="si-deco si-deco-6" viewBox="0 0 20 20"><line x1="10" y1="3" x2="10" y2="17" stroke="currentColor" stroke-width="0.8"/><line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" stroke-width="0.8"/></svg>

                        <div class="si-hero-inner">
                            <p class="si-hero-en">STORE INTRODUCTION</p>
                            <h1 class="si-hero-title">${t('店內介紹')}</h1>
                            <div class="si-hero-title-deco">
                                <svg viewBox="0 0 60 12" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10,2 Q15,0 20,3 Q25,6 30,4 Q35,2 40,5 Q45,8 50,4" fill="none" stroke="rgba(135,154,148,0.35)" stroke-width="1.2" stroke-linecap="round"/>
                                    <circle cx="30" cy="10" r="1.5" fill="rgba(135,154,148,0.3)"/>
                                </svg>
                            </div>
                            <div class="si-hero-sub-wrap">
                                <span class="si-hero-sub-line"></span>
                                <p class="si-hero-sub">京都の伝統美を、心ゆくまで。</p>
                                <span class="si-hero-sub-line"></span>
                            </div>
                        </div>
                        </div>

                    <!-- TOPICS 標題區 -->
                    <div class="si-topics-header">
                        <div class="si-topics-line"></div>
                        <h2 class="si-topics-title">TOPICS</h2>
                        <div class="si-topics-line"></div>
                                </div>

                    <!-- 四欄卡片區 -->
                    <div class="si-cards-wrap">
                        <div class="si-cards-grid">
                            <!-- 卡片 01: 挑選和服 -->
                            <div class="si-card">
                                <div class="si-card-meta">
                                    <span class="si-card-num">01</span>
                                    <span class="si-card-label">KIMONO SELECT</span>
                                </div>
                                <div class="si-card-img-wrap">
                                    <img src="img/reception_area.jpg" alt="${t('NicoNico Kimono 鄰近八阪神社與清水寺 - 店內和服挑選區')}" class="si-card-img" onerror="this.src='https://placehold.co/400x500/F5E6D3/544739?text=01'">
                                </div>
                                <h3 class="si-card-title">${t('挑選和服')}</h3>
                                <p class="si-card-desc">${t('數百套和服任您挑選，')}<br>${t('從日常小紋到華麗振袖，')}<br>${t('找到最適合您的京都之美。')}</p>
                            </div>

                            <!-- 卡片 02: 髮型著裝區 -->
                            <div class="si-card si-card-offset">
                                <div class="si-card-meta">
                                    <span class="si-card-num">02</span>
                                    <span class="si-card-label">STYLING AREA</span>
                                </div>
                                <div class="si-card-img-wrap">
                                    <img src="img/shop_interior10.jpg" alt="${t('髮型著裝區')}" class="si-card-img" onerror="this.src='https://placehold.co/400x500/F5E6D3/544739?text=02'">
                                </div>
                                <h3 class="si-card-title">${t('髮型著裝區')}</h3>
                                <p class="si-card-desc">${t('專業造型師為您打造')}<br>${t('精緻日式髮型，')}<br>${t('多款免費造型可供選擇。')}</p>
                            </div>

                            <!-- 卡片 03: 茶室租借 -->
                            <div class="si-card">
                                <div class="si-card-meta">
                                    <span class="si-card-num">03</span>
                                    <span class="si-card-label">TEA ROOM</span>
                                    </div>
                                <div class="si-card-img-wrap">
                                    <img src="img/tearoom1.jpg" alt="${t('茶室租借')}" class="si-card-img" onerror="this.src='https://placehold.co/400x500/F5E6D3/544739?text=03'">
                                </div>
                                <h3 class="si-card-title">${t('茶室租借')}</h3>
                                <p class="si-card-desc">${t('附設傳統日式茶室，')}<br>${t('可拍照留念或搭配抹茶體驗，')}<br>${t('在靜謐空間中留下珍貴回憶。')}</p>
                            </div>

                            <!-- 卡片 04: 服務親切 -->
                            <div class="si-card si-card-offset">
                                <div class="si-card-meta">
                                    <span class="si-card-num">04</span>
                                    <span class="si-card-label">FRIENDLY SERVICE</span>
                                </div>
                                <div class="si-card-img-wrap">
                                    <img src="img/friendly_service.jpg" alt="${t('NicoNico Kimono 鄰近八阪神社與清水寺 - 親切中日英三語服務')}" class="si-card-img" onerror="this.src='https://placehold.co/400x500/F5E6D3/544739?text=04'">
                            </div>
                                <h3 class="si-card-title">${t('服務親切')}</h3>
                                <p class="si-card-desc">${t('中文、英文、日文對應，')}<br>${t('耐心協助挑選搭配和服，')}<br>${t('讓您安心享受京都之旅。')}</p>
                        </div>
                    </div>
                    </div>

                    <!-- read more 按鈕 -->
                    <div class="si-readmore-wrap">
                        <a href="#home" class="si-readmore-btn" onclick="location.hash='home'; return false;">
                            read more <span class="si-readmore-arrow">&#9662;</span>
                        </a>
                    </div>

                    <!-- 底部版權 -->
                    <footer class="si-footer">
                        <div class="si-footer-line"></div>
                        <p class="si-footer-text">Niconico Kimono Rental &copy; Kyoto</p>
                    </footer>
                </div>

                <!-- Lightbox 燈箱 -->
                <div id="lightbox" class="lightbox" onclick="if(event.target.id === 'lightbox') closeLightbox()">
                    <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
                    <span class="lightbox-nav lightbox-prev" onclick="changeLightboxImage(-1); event.stopPropagation();">&#10094;</span>
                    <div class="lightbox-content">
                        <img id="lightbox-img" src="" alt="${t('相簿圖片')}">
                        <div style="text-align: center; color: white; margin-top: 1rem; font-size: 1.125rem;">
                            <span id="lightbox-counter"></span>
                        </div>
                    </div>
                    <span class="lightbox-nav lightbox-next" onclick="changeLightboxImage(1); event.stopPropagation();">&#10095;</span>
                </div>
            `;
            renderStaticPage('', content);
        }

        /**
         * 渲染 - 茶室 (*** 完整版 ***)
         */
        function renderTeaRoom() {
            console.log('📝 開始渲染茶室...');
            const content = `
                <!-- Hero 區塊（與髮型設計同風格） -->
                <div class="hair-mag-page" style="padding-bottom: 0; position: relative; overflow: hidden;">
                    <!-- 不規則橢圓形裝飾背景 -->
                    <div style="position: absolute; top: 5%; left: -60px; width: 220px; height: 180px; background: rgba(232, 190, 190, 0.18); border-radius: 50% 40% 55% 45%; transform: rotate(-15deg); z-index: 0; pointer-events: none;"></div>
                    <div style="position: absolute; top: 12%; right: -40px; width: 180px; height: 140px; background: rgba(183, 210, 220, 0.16); border-radius: 45% 55% 40% 60%; transform: rotate(20deg); z-index: 0; pointer-events: none;"></div>
                    <div style="position: absolute; top: 55%; left: 8%; width: 160px; height: 130px; background: rgba(191, 199, 179, 0.2); border-radius: 55% 45% 50% 50%; transform: rotate(-8deg); z-index: 0; pointer-events: none;"></div>
                    <header class="hair-mag-hero tea-hero-custom">
                        <div class="hair-mag-hero-deco" style="background: rgba(191, 199, 179, 0.12);"></div>
                        <!-- 左側：標題 + 封面照 -->
                        <div class="hair-mag-hero-left" style="flex: 1 1 auto;">
                            <div class="hair-mag-hero-content">
                                <span class="hair-mag-hero-en">Tea Room</span>
                                <div class="hair-mag-hero-line"></div>
                                <h1 class="hair-mag-hero-title">${t('茶室')}</h1>
                                <p class="hair-mag-hero-sub">ニコニコ着物</p>
                    </div>
                            <div class="hair-mag-hero-img" style="max-width: 720px;">
                                <img src="img/tearoom_cover2.jpg" alt="${t('茶室')}" onerror="this.style.opacity='0'">
                    </div>
                        </div>
                        <!-- 右側：文字介紹 -->
                        <div class="hair-mag-hero-right">
                            <p class="hair-mag-hero-intro-en">About Our Tea Room</p>
                            <div class="hair-mag-hero-intro-line"></div>
                            <p class="hair-mag-hero-intro">
                                ${t('穿上和服，踏入茶室，')}<br>
                                ${t('體驗一場正統的京都抹茶時光。')}<br>
                                ${t('為旅程留下最優雅的回憶。')}
                            </p>
                        </div>
                    </header>
                </div>

                <!-- Section 01: Main Image and Text with Overlapping Green Block -->
                <div class="tea-room-section-01-wrapper" style="background: white; width: 100vw; margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%); margin-top: 0; padding: 6rem 0; position: relative; overflow: visible;">
                    <!-- 不規則橢圓裝飾 -->
                    <div style="position: absolute; top: -30px; right: 5%; width: 200px; height: 160px; background: rgba(232, 190, 190, 0.14); border-radius: 50% 45% 55% 40%; transform: rotate(12deg); z-index: 0; pointer-events: none;"></div>
                    <div style="position: absolute; bottom: 8%; left: -30px; width: 170px; height: 140px; background: rgba(183, 210, 220, 0.15); border-radius: 40% 55% 45% 60%; transform: rotate(-18deg); z-index: 0; pointer-events: none;"></div>
                    <div style="position: absolute; top: 40%; right: -20px; width: 130px; height: 110px; background: rgba(230, 218, 195, 0.2); border-radius: 55% 45% 50% 50%; transform: rotate(25deg); z-index: 0; pointer-events: none;"></div>
                    <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; position: relative;">
                        <!-- Flex 容器：圖片和文字垂直對齊 -->
                        <div class="tea-room-section-01-flex" style="display: flex; align-items: center; gap: 4rem; position: relative;">
                            <!-- 左側：圖片容器（包含色塊、圖片） -->
                            <div style="position: relative; flex: 0 0 auto; width: 40%; aspect-ratio: 4/5; overflow: visible;" class="tea-room-section-01-image">
                                <!-- 淺綠色裝飾色塊（位於圖片後方，漂浮） -->
                                <div class="tea-room-green-deco" style="position: absolute; top: 0; left: -20px; width: 160px; height: 120%; background: #BFC7B3; z-index: -1;"></div>
                                
                                <!-- 主圖片（自然呈現，不被色塊推擠） -->
                                <img src="img/tearoom_experience5.jpg" alt="${t('茶室體驗')}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; position: relative; z-index: 0;" onerror="this.src='https://placehold.co/400x500/ecfdf5/10b981?text=茶室體驗5'">
                    </div>
                            
                            <!-- 右側：文字區塊（垂直置中） -->
                            <div style="flex: 1; padding: 0; display: flex; flex-direction: column; justify-content: center;" class="tea-room-section-01-text">
                                <div style="max-width: ${currentLang === 'zh-TW' ? '520px' : '600px'};">
                                    <p style="font-size: ${currentLang === 'zh-TW' ? '0.95rem' : '0.875rem'}; line-height: ${currentLang === 'zh-TW' ? '2.5' : '2'}; color: #544739; margin-bottom: 2rem; font-family: 'Noto Serif TC', serif; font-weight: 300; letter-spacing: ${currentLang === 'zh-TW' ? '0.08em' : '0.02em'}; white-space: ${currentLang === 'zh-TW' ? 'nowrap' : 'normal'};">
                                        ${t('在靜謐的茶室中，親手點一碗抹茶，感受京都獨有的慢節奏。')}
                                    </p>
                                    <p style="font-size: ${currentLang === 'zh-TW' ? '0.95rem' : '0.875rem'}; line-height: ${currentLang === 'zh-TW' ? '2.5' : '2'}; color: #544739; margin-bottom: 2rem; font-family: 'Noto Serif TC', serif; font-weight: 300; letter-spacing: ${currentLang === 'zh-TW' ? '0.08em' : '0.02em'}; white-space: ${currentLang === 'zh-TW' ? 'nowrap' : 'normal'};">
                                        ${t('從抹茶的香氣、泡沫到入口的回甘，每一個步驟都是與日本茶文化的對話。')}
                                    </p>
                                    <p style="font-size: ${currentLang === 'zh-TW' ? '0.95rem' : '0.875rem'}; line-height: ${currentLang === 'zh-TW' ? '2.5' : '2'}; color: #544739; margin-bottom: 3rem; font-family: 'Noto Serif TC', serif; font-weight: 300; letter-spacing: ${currentLang === 'zh-TW' ? '0.08em' : '0.02em'}; white-space: ${currentLang === 'zh-TW' ? 'nowrap' : 'normal'};">
                                        ${t('放慢腳步，讓一碗抹茶，成為旅途中最安靜、最難忘的片刻。')}
                                    </p>
                                    <p style="font-size: 0.875rem; letter-spacing: 0.3em; color: #000; font-family: 'Cormorant Garamond', serif; text-transform: uppercase; font-weight: 400;">
                                        NICONICO KIMONO RENTAL | TEA CEREMONY
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 三個方案 -->
                <div class="tea-room-plans-wrapper" style="background: white; width: 100vw; margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%); padding: 6rem 0; position: relative; overflow: hidden;">
                    <!-- 不規則橢圓裝飾 -->
                    <div style="position: absolute; top: -20px; left: 3%; width: 190px; height: 150px; background: rgba(191, 199, 179, 0.16); border-radius: 48% 52% 43% 57%; transform: rotate(-10deg); z-index: 0; pointer-events: none;"></div>
                    <div style="position: absolute; bottom: -30px; right: 8%; width: 220px; height: 170px; background: rgba(232, 190, 190, 0.13); border-radius: 52% 48% 55% 45%; transform: rotate(15deg); z-index: 0; pointer-events: none;"></div>
                    <div style="position: absolute; top: 50%; left: -40px; width: 140px; height: 120px; background: rgba(183, 210, 220, 0.18); border-radius: 45% 55% 50% 50%; transform: rotate(-22deg); z-index: 0; pointer-events: none;"></div>
                    <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 1;">
                        <div class="tea-room-plans-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
                            <!-- Plan A -->
                            <div style="border: 1px solid #544739; padding: 2.5rem; position: relative; display: flex; flex-direction: column;">
                                <div style="font-size: 4rem; font-weight: 300; color: #544739; line-height: 1; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif;">
                                    A
                                </div>
                                <h3 style="font-size: 1.25rem; font-weight: 300; color: #544739; margin: 0 0 0.5rem 0; text-align: center; letter-spacing: 0.1em;">
                                    ${t('茶室租借')}
                                </h3>
                                <p style="font-size: 0.875rem; color: #6b7280; margin: 0 0 1.5rem 0; text-align: center;">
                                    30-minute Tea Room Rental
                                </p>
                                <div style="color: #374151; line-height: 1.8; font-size: ${currentLang === 'zh-TW' ? '0.95rem' : '0.85rem'}; margin-bottom: 2rem; flex-grow: 1;">
                                    <p style="margin-bottom: 1rem;">
                                        ${t('在充滿日式風情的傳統茶室中，享受寧靜的時光。可以在此拍攝和服照片，或單純感受京都的傳統文化氛圍。')}
                                    </p>
                                    <ul style="list-style: none; padding: 0; margin: 0;">
                                        <li style="margin-bottom: 0.5rem;">● <strong>${t('費用：')}</strong> ¥3,000</li>
                                        <li style="margin-bottom: 0.5rem;">● <strong>${t('內容：')}</strong> ${t('茶室使用30分鐘')}</li>
                                        <li style="margin-bottom: 0.5rem;">● <strong>${t('人數：')}</strong> ${t('1~4人')}</li>
                        </ul>
                                </div>
                                <a href="javascript:void(0)" onclick="openPhotoPlanSample('img/tearoom_experience.jpg')" style="display: block; padding: 0.75rem 2rem; border: 1px solid #544739; color: #544739; text-decoration: none; text-align: center; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s ease; cursor: pointer; margin-top: auto;" onmouseover="this.style.backgroundColor='#544739'; this.style.color='#fff';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#544739';">
                                    ${t('查看照片')}
                                </a>
                            </div>
                            
                            <!-- Plan B -->
                            <div style="border: 1px solid #544739; padding: 2.5rem; position: relative; display: flex; flex-direction: column;">
                                <div style="font-size: 4rem; font-weight: 300; color: #544739; line-height: 1; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif;">
                                    B
                                </div>
                                <h3 style="font-size: 1.25rem; font-weight: 300; color: #544739; margin: 0 0 0.5rem 0; text-align: center; letter-spacing: 0.1em;">
                                    ${t('抹茶體驗')}
                                </h3>
                                <p style="font-size: 0.875rem; color: #6b7280; margin: 0 0 1.5rem 0; text-align: center;">
                                    45-minute Matcha Experience
                                </p>
                                <div style="color: #374151; line-height: 1.8; font-size: ${currentLang === 'zh-TW' ? '0.95rem' : '0.85rem'}; margin-bottom: 2rem; flex-grow: 1;">
                                    <p style="margin-bottom: 1rem;">
                                        ${t('從抹茶的香氣、泡沫到入口的回甘，專業茶道師傅將指導您體驗傳統茶道儀式，讓您深入了解日本茶文化的精髓。')}
                                    </p>
                                    <ul style="list-style: none; padding: 0; margin: 0;">
                                        <li style="margin-bottom: 0.5rem;">● <strong>${t('費用：')}</strong> ¥4,000</li>
                                        <li style="margin-bottom: 0.5rem;">● <strong>${t('內容：')}</strong> ${t('抹茶體驗45分鐘（含茶道指導）')}</li>
                                        <li style="margin-bottom: 0.5rem;">● <strong>${t('人數：')}</strong> ${t('1~4人')}</li>
                        </ul>
                                </div>
                                <a href="javascript:void(0)" onclick="openPhotoPlanSample('img/tearoom_experience1.jpg')" style="display: block; padding: 0.75rem 2rem; border: 1px solid #544739; color: #544739; text-decoration: none; text-align: center; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s ease; cursor: pointer; margin-top: auto;" onmouseover="this.style.backgroundColor='#544739'; this.style.color='#fff';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#544739';">
                                    ${t('查看照片')}
                                </a>
                            </div>
                            
                            <!-- Plan C -->
                            <div style="border: 1px solid #544739; padding: 2.5rem; position: relative; display: flex; flex-direction: column;">
                                <div style="font-size: 4rem; font-weight: 300; color: #544739; line-height: 1; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif;">
                                    C
                                </div>
                                <h3 style="font-size: 1.25rem; font-weight: 300; color: #544739; margin: 0 0 0.5rem 0; text-align: center; letter-spacing: 0.1em; white-space: nowrap;">
                                    ${t('和服抹茶體驗')}
                                </h3>
                                <p style="font-size: 0.875rem; color: #6b7280; margin: 0 0 1.5rem 0; text-align: center; white-space: nowrap;">
                                    45-minute Kimono & Matcha Experience
                                </p>
                                <div style="color: #374151; line-height: 1.8; font-size: ${currentLang === 'zh-TW' ? '0.95rem' : '0.85rem'}; margin-bottom: 2rem; flex-grow: 1;">
                                    <p style="margin-bottom: 1rem;">
                                        ${t('穿上優雅的和服，在傳統茶室中體驗抹茶文化。結合和服之美與茶道之雅，讓您完整感受京都的傳統文化魅力。')}
                                    </p>
                                    <ul style="list-style: none; padding: 0; margin: 0;">
                                        <li style="margin-bottom: 0.5rem;">● <strong>${t('費用：')}</strong> ¥8,000</li>
                                        <li style="margin-bottom: 0.5rem;">● <strong>${t('內容：')}</strong> ${t('小紋和服搭配抹茶體驗（可補差價升級成不同款式）')}</li>
                                        <li style="margin-bottom: 0.5rem;">● <strong>${t('人數：')}</strong> ${t('1~4人')}</li>
                </ul>
                                </div>
                                <a href="javascript:void(0)" onclick="openPhotoPlanSample('img/kimono_matcha.jpg')" style="display: block; padding: 0.75rem 2rem; border: 1px solid #544739; color: #544739; text-decoration: none; text-align: center; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s ease; cursor: pointer; margin-top: auto;" onmouseover="this.style.backgroundColor='#544739'; this.style.color='#fff';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#544739';">
                                    ${t('查看照片')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 02: KIMONO Title and Four Small Images -->
                <div class="tea-room-section-02-wrapper" style="background: white; width: 100vw; margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%); padding: 6rem 0; position: relative; overflow: hidden;">
                    <!-- 不規則橢圓裝飾 -->
                    <div style="position: absolute; top: 10%; right: -30px; width: 180px; height: 150px; background: rgba(191, 199, 179, 0.17); border-radius: 50% 42% 58% 48%; transform: rotate(8deg); z-index: 0; pointer-events: none;"></div>
                    <div style="position: absolute; bottom: 5%; left: 2%; width: 200px; height: 160px; background: rgba(230, 218, 195, 0.18); border-radius: 45% 55% 48% 52%; transform: rotate(-12deg); z-index: 0; pointer-events: none;"></div>
                    <div style="position: absolute; top: 50%; right: 12%; width: 130px; height: 100px; background: rgba(232, 190, 190, 0.15); border-radius: 55% 45% 50% 50%; transform: rotate(30deg); z-index: 0; pointer-events: none;"></div>
                    <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 1;">
                        
                        <!-- 上方橫線裝飾（置中對齊） -->
                        <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 2.5rem;">
                            <div style="flex: 1; height: 1px; background: #BFC7B3;"></div>
                            <div style="font-size: 3.5rem; font-weight: 200; color: #859A93; font-family: 'Cormorant Garamond', serif; line-height: 1; letter-spacing: 0.1em;" class="tea-room-section-02-number">02</div>
                            <div style="flex: 1; height: 1px; background: #BFC7B3;"></div>
                            </div>
                        
                        <!-- 照片區域（含裝飾色塊） -->
                        <div style="position: relative; margin-top: 1rem;">
                            <!-- 左側裝飾色塊 -->
                            <div class="tea-room-deco-bar-left" style="position: absolute; left: -2rem; top: 15%; width: 80px; height: 70%; background: #BFC7B3; z-index: 0;"></div>
                            
                            <!-- 右側裝飾色塊 -->
                            <div class="tea-room-deco-bar-right" style="position: absolute; right: -2rem; bottom: 10%; width: 60px; height: 50%; background: #BFC7B3; z-index: 0;"></div>
                        
                            <!-- 四張小圖網格（3:4 比例，錯落排列） -->
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; position: relative; z-index: 1; padding-bottom: 24px;" class="tea-room-images-grid">
                                <div class="tea-img-item" style="position: relative; width: 100%; aspect-ratio: 3 / 4; overflow: hidden; transform: translateY(-20px);">
                                    <img src="img/matcha_experience.jpg" alt="${t('茶室體驗1')}" style="width: 100%; height: 100%; object-fit: cover; display: block; cursor: pointer;" onclick="if(typeof window.openLightbox === 'function') { window.openLightbox(['img/matcha_experience.jpg', 'img/tearoom_experience2.jpg', 'img/tearoom_experience3.jpg', 'img/tearoom_experience4.jpg'], 0); }" onerror="this.src='https://placehold.co/300x400/ecfdf5/10b981?text=${encodeURIComponent(t('茶室體驗1'))}'">
                            </div>
                                <div class="tea-img-item" style="position: relative; width: 100%; aspect-ratio: 3 / 4; overflow: hidden;">
                                    <img src="img/tearoom_experience2.jpg" alt="${t('茶室體驗2')}" style="width: 100%; height: 100%; object-fit: cover; display: block; cursor: pointer;" onclick="if(typeof window.openLightbox === 'function') { window.openLightbox(['img/matcha_experience.jpg', 'img/tearoom_experience2.jpg', 'img/tearoom_experience3.jpg', 'img/tearoom_experience4.jpg'], 1); }" onerror="this.src='https://placehold.co/300x400/ecfdf5/10b981?text=${encodeURIComponent(t('茶室體驗2'))}'">
                            </div>
                                <div class="tea-img-item" style="position: relative; width: 100%; aspect-ratio: 3 / 4; overflow: hidden; transform: translateY(-20px);">
                                    <img src="img/tearoom_experience3.jpg" alt="${t('茶室體驗3')}" style="width: 100%; height: 100%; object-fit: cover; display: block; cursor: pointer;" onclick="if(typeof window.openLightbox === 'function') { window.openLightbox(['img/matcha_experience.jpg', 'img/tearoom_experience2.jpg', 'img/tearoom_experience3.jpg', 'img/tearoom_experience4.jpg'], 2); }" onerror="this.src='https://placehold.co/300x400/ecfdf5/10b981?text=${encodeURIComponent(t('茶室體驗3'))}'">
                                </div>
                                <div class="tea-img-item" style="position: relative; width: 100%; aspect-ratio: 3 / 4; overflow: hidden;">
                                    <img src="img/tearoom_experience4.jpg" alt="${t('茶室體驗4')}" style="width: 100%; height: 100%; object-fit: cover; display: block; cursor: pointer;" onclick="if(typeof window.openLightbox === 'function') { window.openLightbox(['img/matcha_experience.jpg', 'img/tearoom_experience2.jpg', 'img/tearoom_experience3.jpg', 'img/tearoom_experience4.jpg'], 3); }" onerror="this.src='https://placehold.co/300x400/ecfdf5/10b981?text=${encodeURIComponent(t('茶室體驗4'))}'">
                                </div>
                            </div>
                        </div>
                        
                        <!-- KIMONO 標題（置中於四張圖正下方） -->
                        <div style="text-align: center; margin-top: 2.5rem;">
                            <h2 style="font-size: 3.5rem; font-weight: 600; letter-spacing: 0.5em; color: #544739; font-family: 'Cormorant Garamond', serif; margin: 0; line-height: 1.2; text-indent: 0.5em;" class="tea-room-kimono-title">KIMONO</h2>
                        </div>
                    </div>
                </div>

                <!-- Lightbox 燈箱 -->
                <div id="lightbox" class="lightbox" onclick="if(event.target.id === 'lightbox') closeLightbox()">
                    <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
                    <span class="lightbox-nav lightbox-prev" onclick="changeLightboxImage(-1); event.stopPropagation();">&#10094;</span>
                    <div class="lightbox-content">
                        <img id="lightbox-img" src="" alt="${t('相簿圖片')}">
                        <div style="text-align: center; color: white; margin-top: 1rem; font-size: 1.125rem;">
                            <span id="lightbox-counter"></span>
                        </div>
                    </div>
                    <span class="lightbox-nav lightbox-next" onclick="changeLightboxImage(1); event.stopPropagation();">&#10095;</span>
                </div>
            `;
            // 直接設置內容，不顯示頁面標題
            const contentDiv = getContentDiv();
            if (contentDiv) {
                contentDiv.innerHTML = content + getFooterHTML();
                if (!window._isLanguageSwitching) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        }
        
        // 茶室頁面輪播功能
        function initTearoomPageCarousel() {
            const container = document.getElementById('tearoom-page-carousel');
            if (!container) return;
            
            let tearoomCurrentSlide = 0;
            const tearoomTotalSlides = 4;
            let tearoomAutoSlide = null;
            
            window.changeTearoomSlide = function(direction) {
                const slides = container.querySelectorAll('.tearoom-carousel-slide img');
                const dots = container.querySelectorAll('.tearoom-carousel-dot');
                
                tearoomCurrentSlide += direction;
                
                if (tearoomCurrentSlide >= tearoomTotalSlides) {
                    tearoomCurrentSlide = 0;
                } else if (tearoomCurrentSlide < 0) {
                    tearoomCurrentSlide = tearoomTotalSlides - 1;
                }
                
                slides.forEach((slide, index) => {
                    if (index === tearoomCurrentSlide) {
                        slide.classList.add('active');
                    } else {
                        slide.classList.remove('active');
                    }
                });
                
                dots.forEach((dot, index) => {
                    if (index === tearoomCurrentSlide) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            };
            
            window.goToTearoomSlide = function(index) {
                const slides = container.querySelectorAll('.tearoom-carousel-slide img');
                const dots = container.querySelectorAll('.tearoom-carousel-dot');
                
                tearoomCurrentSlide = index;
                
                slides.forEach((slide, i) => {
                    if (i === tearoomCurrentSlide) {
                        slide.classList.add('active');
                    } else {
                        slide.classList.remove('active');
                    }
                });
                
                dots.forEach((dot, i) => {
                    if (i === tearoomCurrentSlide) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            };
            
            // 自動輪播
            tearoomAutoSlide = setInterval(() => {
                window.changeTearoomSlide(1);
            }, 4000);
            
            // 當鼠標懸停時暫停自動輪播
            container.addEventListener('mouseenter', () => {
                if (tearoomAutoSlide) {
                    clearInterval(tearoomAutoSlide);
                }
            });
            
            container.addEventListener('mouseleave', () => {
                tearoomAutoSlide = setInterval(() => {
                    window.changeTearoomSlide(1);
                }, 4000);
            });
        }

        /**
         * 渲染 - 客返照片 (*** 完整版 ***)
         */
        function renderReviews() {
            console.log('📝 開始渲染照片庫...');
            const content = `
                
                <!-- Hero Section with Cover Image and Overlay Text -->
                <div class="photo-plans-hero-fullwidth">
                    <div class="slideshow-container photo-plans-hero-container">
                        <div class="mySlides fade">
                            <img src="img/gallery_cover.jpg" alt="${t('照片庫封面')}" class="photo-plans-hero-image-fullwidth" style="object-position: center 80%;" onerror="this.src='https://placehold.co/1200x600/cccccc/000000?text=照片庫封面'">
                    </div>
                        <!-- 極淡黑色漸層（確保文字清晰） -->
                        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0.3) 100%); z-index: 3; pointer-events: none;"></div>
                        <!-- Overlay Text -->
                        <div class="photo-gallery-hero-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: space-between; align-items: stretch; padding: 0; z-index: 5; pointer-events: none;">
                            <!-- 左側：垂直排列標題 -->
                            <div class="pg-hero-left" style="display: flex; align-items: center; padding: 3rem 2.5rem;">
                                <div style="writing-mode: vertical-rl; text-orientation: mixed; color: white; font-family: 'Noto Serif TC', serif; font-weight: 300; letter-spacing: 0.25em; line-height: 2.2;">
                                    <span style="font-size: 1.6rem;">${t('照')}</span>
                                    <span style="font-size: 1.6rem;">${t('片')}</span>
                                    <span style="font-size: 1.6rem;">${t('庫')}</span>
                                    <span style="display: block; margin-top: 1.2rem; font-size: 0.7rem; font-family: 'Cormorant Garamond', serif; letter-spacing: 0.15em; opacity: 0.7; font-weight: 400;">Photo Gallery</span>
                    </div>
                            </div>
                            <!-- 右側：日文副標題 + 英文翻譯 -->
                            <div class="pg-hero-right" style="display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; padding: 3rem 3.5rem;">
                                <div style="color: white; text-align: right;">
                                    <div style="font-size: 1.1rem; font-family: 'Noto Serif TC', serif; font-weight: 300; letter-spacing: 0.3em; line-height: 1.8; margin-bottom: 0.6rem;">京都で、和服の美しさを写真に残します。</div>
                                    <div style="font-size: 0.75rem; font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; letter-spacing: 0.15em; opacity: 0.7;">Capturing the beauty of kimono in Kyoto</div>
                                </div>
                </div>
                    </div>
                        <style>
                            @media (max-width: 768px) {
                                .photo-gallery-hero-overlay {
                                    flex-direction: row !important;
                                    align-items: stretch !important;
                                    padding: 0 !important;
                                }
                                .pg-hero-left {
                                    padding: 2rem 1.2rem !important;
                                }
                                .pg-hero-left div span:not(:last-child) {
                                    font-size: 1.3rem !important;
                                }
                                .pg-hero-right {
                                    padding: 2rem 1.5rem !important;
                                }
                                .pg-hero-right div > div:first-child {
                                    font-size: 0.9rem !important;
                                    letter-spacing: 0.2em !important;
                                }
                                .pg-hero-right div > div:last-child {
                                    font-size: 0.65rem !important;
                                }
                            }
                        </style>
                        </div>
                    </div>

                <!-- Top 12 Section -->
                <div class="bg-white" style="background: white; padding: 1.5rem 1.5rem; position: relative; overflow: hidden;">
                    ${generatePageBlobs('reviews')}
                    <div style="max-width: 1400px; margin: 0 auto; position: relative; z-index: 1;">
                        <div style="text-align: center; margin-bottom: 1.5rem;">
                            <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: #544739; margin: 0 0 1rem 0; letter-spacing: 0.1em;">
                                Photo Gallery
                            </h2>
                            <div style="position: relative; display: inline-block;">
                                <select id="photo-gallery-filter" onchange="filterPhotoGallery(this.value)" style="padding: 0.75rem 3rem 0.75rem 2rem; background-color: #859A93; color: white; border: none; border-radius: 50px; font-size: 0.875rem; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s ease; appearance: none; -webkit-appearance: none; -moz-appearance: none; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); outline: none;" onmouseover="this.style.backgroundColor='#6b8279'; this.style.boxShadow='0 4px 6px rgba(0, 0, 0, 0.15)';" onmouseout="this.style.backgroundColor='#859A93'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.1)';">
                                    <option value="all">${t('全部')}</option>
                                    <option value="female">${t('女士')}</option>
                                    <option value="male">${t('男士')}</option>
                                    <option value="other">${t('其他')}</option>
                                </select>
                                <span style="position: absolute; right: 1.25rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: white; font-size: 0.875rem;">▼</span>
                        </div>
                    </div>

                        <div class="top-12-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; margin-top: 1.5rem;">
                            <!-- 1. 小紋套餐 -->
                            <div class="top-12-card" data-gender="female" style="position: relative; background: white; border-radius: 0; overflow: hidden; cursor: pointer;" onclick="window.location.hash='#album/komon'">
                                <div style="position: relative; width: 100%; aspect-ratio: 3/4; background: #f5f5f5; overflow: hidden;">
                                    <img src="img/gallery_komon.jpg" alt="${t('小紋套餐')}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" onmouseover="this.src='img/Gallery_Komon_260101_green4.jpg'" onmouseout="this.src='img/gallery_komon.jpg'" onerror="this.src='https://placehold.co/400x500/d946ef/ffffff?text=小紋套餐'">
                        </div>
                                <div style="padding: 1.5rem; background: white;">
                                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #a8d5ba;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #6b9e7a;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #1a1a1a;"></div>
                    </div>
                                    <div style="font-size: 1rem; font-weight: 500; color: #544739; margin-bottom: 0.5rem;">${t('小紋套餐')} ｜ Komon plan</div>
                                    <div style="font-size: 1.125rem; font-weight: 500; color: #544739; font-family: 'EB Garamond', serif;">¥5,500</div>
                        </div>
                    </div>

                            <!-- 2. 高級小紋套餐 -->
                            <div class="top-12-card" data-gender="female" style="position: relative; background: white; border-radius: 0; overflow: hidden; cursor: pointer;" onclick="window.location.hash='#album/premium-komon'">
                                <div style="position: relative; width: 100%; aspect-ratio: 3/4; background: #f5f5f5; overflow: hidden;">
                                    <img src="img/gallery_premium_komon.jpg" alt="${t('高級小紋套餐')}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" onmouseover="this.src='img/gallery_premium_komon2.jpg'" onmouseout="this.src='img/gallery_premium_komon.jpg'" onerror="this.src='https://placehold.co/400x500/c026d3/ffffff?text=高級小紋套餐'">
                        </div>
                                <div style="padding: 1.5rem; background: white;">
                                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #f8b4c4;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #d946ef;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #fbbf24;"></div>
                    </div>
                                    <div style="font-size: 1rem; font-weight: 500; color: #544739; margin-bottom: 0.5rem;">${t('高級小紋套餐')} ｜ Premium Komon</div>
                                    <div style="font-size: 1.125rem; font-weight: 500; color: #544739; font-family: 'EB Garamond', serif;">¥7,700</div>
                        </div>
                    </div>

                            <!-- 3. 蕾絲套餐 -->
                            <div class="top-12-card" data-gender="female" style="position: relative; background: white; border-radius: 0; overflow: hidden; cursor: pointer;" onclick="window.location.hash='#album/lace'">
                                <div style="position: relative; width: 100%; aspect-ratio: 3/4; background: #f5f5f5; overflow: hidden;">
                                    <img src="img/gallery_lace.jpg" alt="${t('蕾絲套餐')}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" onmouseover="this.src='img/white_lace1.jpg'" onmouseout="this.src='img/gallery_lace.jpg'" onerror="this.src='img/white_lace3.jpg'">
                        </div>
                                <div style="padding: 1.5rem; background: white;">
                                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #a8d5ba;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #6b9e7a;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #1a1a1a;"></div>
                    </div>
                                    <div style="font-size: 1rem; font-weight: 500; color: #544739; margin-bottom: 0.5rem;">${t('蕾絲套餐')} ｜ Lace plan</div>
                                    <div style="font-size: 1.125rem; font-weight: 500; color: #544739; font-family: 'EB Garamond', serif;">¥7,700</div>
                        </div>
                    </div>

                            <!-- 4. 二尺袖套餐 -->
                            <div class="top-12-card" data-gender="female" style="position: relative; background: white; border-radius: 0; overflow: hidden; cursor: pointer;" onclick="window.location.hash='#album/nishaku-sode'">
                                <div style="position: relative; width: 100%; aspect-ratio: 3/4; background: #f5f5f5; overflow: hidden;">
                                    <img src="img/gallery_nishaku.jpg" alt="${t('二尺袖套餐')}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" onmouseover="this.src='img/gallery_nishaku2.jpg'" onmouseout="this.src='img/gallery_nishaku.jpg'" onerror="this.src='img/pink_nishaku3.jpg'">
                        </div>
                                <div style="padding: 1.5rem; background: white;">
                                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #f8b4c4;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #ec4899;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #be185d;"></div>
                    </div>
                                    <div style="font-size: 1rem; font-weight: 500; color: #544739; margin-bottom: 0.5rem;">${t('二尺袖套餐')} ｜ Nishaku-sode plan</div>
                                    <div style="font-size: 1.125rem; font-weight: 500; color: #544739; font-family: 'EB Garamond', serif;">¥8,800</div>
                        </div>
                    </div>

                            <!-- 5. 訪問服套餐 -->
                            <div class="top-12-card" data-gender="female" style="position: relative; background: white; border-radius: 0; overflow: hidden; cursor: pointer;" onclick="window.location.hash='#album/houmongi'">
                                <div style="position: relative; width: 100%; aspect-ratio: 3/4; background: #f5f5f5; overflow: hidden;">
                                    <img src="img/gallery_houmongi.jpg" alt="${t('訪問服套餐')}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" onmouseover="this.src='img/gallery_houmongi2.jpg'" onmouseout="this.src='img/gallery_houmongi.jpg'" onerror="this.src='img/cover8.jpg'">
                        </div>
                                <div style="padding: 1.5rem; background: white;">
                                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #f8b4c4;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #d946ef;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #fbbf24;"></div>
                    </div>
                                    <div style="font-size: 1rem; font-weight: 500; color: #544739; margin-bottom: 0.5rem;">${t('訪問服套餐')} ｜ Houmongi plan</div>
                                    <div style="font-size: 1.125rem; font-weight: 500; color: #544739; font-family: 'EB Garamond', serif;">¥11,000~16,500</div>
                        </div>
                    </div>

                            <!-- 6. 黑留袖套餐 -->
                            <div class="top-12-card" data-gender="female" style="position: relative; background: white; border-radius: 0; overflow: hidden; cursor: pointer;" onclick="window.location.hash='#album/kurotomesode'">
                                <div style="position: relative; width: 100%; aspect-ratio: 3/4; background: #f5f5f5; overflow: hidden;">
                                    <img src="img/gallery_kurotomesode.jpg" alt="${t('黑留袖套餐')}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" onmouseover="this.src='img/photo_carousel3.jpg'" onmouseout="this.src='img/gallery_kurotomesode.jpg'" onerror="this.src='img/kimi5.jpg'">
                        </div>
                                <div style="padding: 1.5rem; background: white;">
                                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #1a1a1a;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #4b5563;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #1e3a8a;"></div>
                    </div>
                                    <div style="font-size: 1rem; font-weight: 500; color: #544739; margin-bottom: 0.5rem;">${t('黑留袖套餐')} ｜ Kurotomesode plan</div>
                                    <div style="font-size: 1.125rem; font-weight: 500; color: #544739; font-family: 'EB Garamond', serif;">¥11,000</div>
                    </div>
                </div>

                            <!-- 8. 袴套餐 -->
                            <div class="top-12-card" data-gender="female" style="position: relative; background: white; border-radius: 0; overflow: hidden; cursor: pointer;" onclick="window.location.hash='#album/hakama'">
                                <div style="position: relative; width: 100%; aspect-ratio: 3/4; background: #f5f5f5; overflow: hidden;">
                                    <img src="img/gallery_hakama.jpg" alt="${t('袴套餐')}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://placehold.co/400x500/8b5cf6/ffffff?text=袴套餐'">
                    </div>
                                <div style="padding: 1.5rem; background: white;">
                                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #a78bfa;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #8b5cf6;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #7c3aed;"></div>
                </div>
                                    <div style="font-size: 1rem; font-weight: 500; color: #544739; margin-bottom: 0.5rem;">${t('袴套餐')} ｜ Hakama plan</div>
                                    <div style="font-size: 1.125rem; font-weight: 500; color: #544739; font-family: 'EB Garamond', serif;">¥11,000~</div>
                    </div>
                </div>

                            <!-- 9. 振袖套餐 -->
                            <div class="top-12-card" data-gender="female" style="position: relative; background: white; border-radius: 0; overflow: hidden; cursor: pointer;" onclick="window.location.hash='#album/furisode'">
                                <div style="position: relative; width: 100%; aspect-ratio: 3/4; background: #f5f5f5; overflow: hidden;">
                                    <img src="img/gallery_furisode.jpg" alt="${t('振袖套餐')}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" onmouseover="this.src='img/gallery_furisode2.jpg'" onmouseout="this.src='img/gallery_furisode.jpg'" onerror="this.src='img/white_standard_furisode1.jpg'">
                    </div>
                                <div style="padding: 1.5rem; background: white;">
                                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #fbbf24;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #f8b4c4;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #d946ef;"></div>
                    </div>
                                    <div style="font-size: 1rem; font-weight: 500; color: #544739; margin-bottom: 0.5rem;">${t('振袖套餐')} ｜ Furisode plan</div>
                                    <div style="font-size: 1.125rem; font-weight: 500; color: #544739; font-family: 'EB Garamond', serif;">¥9,900~</div>
                    </div>
                    </div>

                            <!-- 10. 男士和服套餐 -->
                            <div class="top-12-card" data-gender="male" style="position: relative; background: white; border-radius: 0; overflow: hidden; cursor: pointer;" onclick="window.location.hash='#album/mens-kimono'">
                                <div style="position: relative; width: 100%; aspect-ratio: 3/4; background: #f5f5f5; overflow: hidden;">
                                    <img src="img/Gallery_Mens_Kimono_250101_black.jpg" alt="${t('男士和服套餐')}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://placehold.co/400x500/3b82f6/ffffff?text=男士和服套餐'">
                        </div>
                                <div style="padding: 1.5rem; background: white;">
                                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #93c5fd;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #60a5fa;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #3b82f6;"></div>
                    </div>
                                    <div style="font-size: 1rem; font-weight: 500; color: #544739; margin-bottom: 0.5rem;">${t('男士和服套餐')} ｜ Men's kimono plan</div>
                                    <div style="font-size: 1.125rem; font-weight: 500; color: #544739; font-family: 'EB Garamond', serif;">¥5,500~8,800</div>
                        </div>
                    </div>

                            <!-- 11. 高級武士服套餐 -->
                            <div class="top-12-card" data-gender="male" style="position: relative; background: white; border-radius: 0; overflow: hidden; cursor: pointer;" onclick="window.location.hash='#album/premium-samurai'">
                                <div style="position: relative; width: 100%; aspect-ratio: 3/4; background: #f5f5f5; overflow: hidden;">
                                    <img src="img/gallery_samurai.jpg" alt="${t('高級武士服套餐')}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" onmouseover="this.src='img/gallery_samurai2.jpg'" onmouseout="this.src='img/gallery_samurai.jpg'" onerror="this.src='https://placehold.co/400x500/2563eb/ffffff?text=高級武士服套餐'">
                        </div>
                                <div style="padding: 1.5rem; background: white;">
                                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #1a1a1a;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #4b5563;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #1e3a8a;"></div>
                    </div>
                                    <div style="font-size: 1rem; font-weight: 500; color: #544739; margin-bottom: 0.5rem;">${t('高級武士服套餐')} ｜ Premium Samurai</div>
                                    <div style="font-size: 1.125rem; font-weight: 500; color: #544739; font-family: 'EB Garamond', serif;">¥16,500</div>
                        </div>
                    </div>

                            <!-- 12. 情侶套餐 -->
                            <div class="top-12-card" data-gender="other" style="position: relative; background: white; border-radius: 0; overflow: hidden; cursor: pointer;" onclick="window.location.hash='#album/couple'">
                                <div style="position: relative; width: 100%; aspect-ratio: 3/4; background: #f5f5f5; overflow: hidden;">
                                    <img src="img/gallery_couple.jpg" alt="${t('情侶套餐')}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" onmouseover="this.src='img/photo_carousel2.jpg'" onmouseout="this.src='img/gallery_couple.jpg'" onerror="this.src='img/couple1.jpg'">
                    </div>
                                <div style="padding: 1.5rem; background: white;">
                                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #f8b4c4;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #ec4899;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #e91e63;"></div>
                        </div>
                                    <div style="font-size: 1rem; font-weight: 500; color: #544739; margin-bottom: 0.5rem;">${t('情侶套餐')} ｜ Couple plan</div>
                                    <div style="font-size: 1.125rem; font-weight: 500; color: #544739; font-family: 'EB Garamond', serif;">¥9,900~</div>
                        </div>
                    </div>

                            <!-- 13. 小孩和服套餐 -->
                            <div class="top-12-card" data-gender="other" style="position: relative; background: white; border-radius: 0; overflow: hidden; cursor: pointer;" onclick="window.location.hash='#album/child'">
                                <div style="position: relative; width: 100%; aspect-ratio: 3/4; background: #f5f5f5; overflow: hidden;">
                                    <img src="img/Plan_Kids_250101_pink.jpg" alt="${t('小孩和服套餐')}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" onmouseover="this.src='img/Gallery_Kids_240102_red1.jpg'" onmouseout="this.src='img/Plan_Kids_250101_pink.jpg'" onerror="this.src='https://placehold.co/400x500/fbbf24/ffffff?text=小孩和服套餐'">
                        </div>
                                <div style="padding: 1.5rem; background: white;">
                                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #fbbf24;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #f59e0b;"></div>
                                        <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: #d97706;"></div>
                    </div>
                                    <div style="font-size: 1rem; font-weight: 500; color: #544739; margin-bottom: 0.5rem;">${t('小孩和服套餐')} ｜ Child kimono plan</div>
                                    <div style="font-size: 1.125rem; font-weight: 500; color: #544739; font-family: 'EB Garamond', serif;">¥5,500</div>
                    </div>
                        </div>
                    </div>
                        </div>
                    <style>
                        @media (max-width: 1024px) {
                            .top-12-grid {
                                grid-template-columns: repeat(2, 1fr) !important;
                            }
                        }
                        @media (max-width: 640px) {
                            .top-12-grid {
                                grid-template-columns: 1fr !important;
                            }
                        }
                    </style>
                    </div>

                <!-- Request Section -->
                <div class="bg-white" style="background: white; padding: 1.5rem 1.5rem;">
                    <div style="max-width: 1200px; margin: 0 auto;">
                        <div style="border-top: 1px solid #859A93; width: 100%; margin-bottom: 1.5rem;"></div>
                        <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 600; color: #544739; margin: 0 0 1.5rem 0; letter-spacing: 0.05em; text-align: center;">
                            Niconico kimono rental
                        </h2>
                        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                            <p style="font-size: 1rem; line-height: 2; color: #544739; margin: 0 0 1.5rem 0;">
                                ${t('在京都，遇見最美的自己 ✧ 用和服與照片，為您留下最珍貴的回憶')}
                            </p>
                        </div>
                        <div style="text-align: center;">
                            <button onclick="document.getElementById('booking-modal')?.classList.add('active');" style="padding: 0.875rem 2.5rem; background-color: transparent; color: #544739; border: 1px solid #544739; border-radius: 0; font-size: 0.875rem; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s ease; font-weight: 500;" onmouseover="this.style.backgroundColor='#544739'; this.style.color='white';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#544739';">
                                ${t('點我預約')}
                            </button>
                    </div>
                        </div>
                    </div>

                <!-- Lightbox 燈箱 -->
                <div id="lightbox" class="lightbox" onclick="if(event.target.id === 'lightbox') closeLightbox()">
                    <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
                    <span class="lightbox-nav lightbox-prev" onclick="changeLightboxImage(-1); event.stopPropagation();">&#10094;</span>
                    <div class="lightbox-content">
                        <img id="lightbox-img" src="" alt="${t('相簿圖片')}">
                        <div style="text-align: center; color: white; margin-top: 1rem; font-size: 1.125rem;">
                            <span id="lightbox-counter"></span>
                        </div>
                    </div>
                    <span class="lightbox-nav lightbox-next" onclick="changeLightboxImage(1); event.stopPropagation();">&#10095;</span>
                        </div>
            `;
            renderStaticPage(t('照片庫'), content, 'Photo Gallery');
            
            // 添加透明導航欄樣式
            const header = document.querySelector('header');
            if (header) {
                header.classList.add('photo-plans-navbar-transparent');
            }
            
            // 設置白色背景
            const app = document.getElementById('app');
            const contentDiv = document.getElementById('content');
            if (app) {
                app.classList.add('photo-plans-white-bg');
            }
            if (contentDiv) {
                contentDiv.classList.add('photo-plans-white-bg');
            }
            
            // 初始化照片庫封面（即使只有一張圖片，也使用相同的結構）
            setTimeout(() => {
                const slides = document.querySelectorAll('.photo-plans-hero-fullwidth .mySlides');
                if (slides.length > 0) {
                    // 顯示第一張
                    let currentSlide = 0;
                    slides.forEach((slide, index) => {
                        slide.style.display = index === currentSlide ? 'block' : 'none';
                    });
                }
            }, 100);
            
            // 初始化滾動淡入效果
            setTimeout(() => {
                initScrollFadeIn();
            }, 300);
        }
        
        // 照片庫過濾函數
        window.filterPhotoGallery = function(category) {
            const cards = document.querySelectorAll('.top-12-card');
            cards.forEach(card => {
                const gender = card.getAttribute('data-gender');
                if (category === 'all' || gender === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        function renderAlbumDetail(albumId) {
            console.log('📸 開始渲染相簿詳情:', albumId);
            
            // 定義各相簿基本資料與圖片檔名前綴
            const albumData = {
                'komon': {
                    title: '小紋', titleEn: 'Komon', filePrefix: '小紋',
                    colorFilterType: 'full', photos: []
                },
                'premium-komon': {
                    title: '高級小紋', titleEn: 'Premium Komon', filePrefix: '高級小紋',
                    colorFilterType: 'full', photos: []
                },
                'lace': {
                    title: '蕾絲', titleEn: 'Lace', filePrefix: '蕾絲',
                    colorFilterType: 'full', photos: []
                },
                'nishaku-sode': {
                    title: '二尺袖', titleEn: 'Nishaku-sode', filePrefix: '二尺袖',
                    colorFilterType: 'full', photos: []
                },
                'houmongi': {
                    title: '訪問服', titleEn: 'Houmongi', filePrefix: '訪問服',
                    colorFilterType: 'full',
                    priceFilter: [
                        { price: 'all', label: '全部' },
                        { price: '11000', label: '訪問服 ¥11,000' },
                        { price: '16500', label: '高級訪問服 ¥16,500' }
                    ],
                    photos: []
                },
                'kurotomesode': {
                    title: '黑留袖', titleEn: 'Kurotomesode', filePrefix: '黑留袖',
                    colorFilterType: 'none', photos: []
                },
                'hakama': {
                    title: '袴', titleEn: 'Hakama', filePrefix: '袴',
                    colorFilterType: 'full', photos: []
                },
                'furisode': {
                    title: '振袖', titleEn: 'Furisode', filePrefix: '振袖',
                    colorFilterType: 'full',
                    priceFilter: [
                        { price: 'all', label: '全部' },
                        { price: '9900', label: '精品振袖 ¥9,900' },
                        { price: '16500', label: '金絲振袖 ¥16,500' },
                        { price: '27500', label: '高訂振袖 ¥27,500' }
                    ],
                    photos: []
                },
                'mens-kimono': {
                    title: '男士和服', titleEn: "Men's Kimono", filePrefix: '男士和服',
                    colorFilterType: 'none', photos: []
                },
                'premium-samurai': {
                    title: '高級武士服', titleEn: 'Premium Samurai', filePrefix: '高級武士服',
                    colorFilterType: 'none', photos: []
                },
                'couple': {
                    title: '情侶套餐', titleEn: 'Couple Plan', filePrefix: '情侶套餐',
                    colorFilterType: 'none', photos: []
                },
                'child': {
                    title: '小孩和服', titleEn: 'Child Kimono', filePrefix: '小孩和服',
                    colorFilterType: 'none', photos: []
                }
            };
            
            const album = albumData[albumId];
            if (!album) {
                console.error('找不到相簿:', albumId);
                renderHome();
                return;
            }

            const filePrefix = album.filePrefix;
            const allPhotos = [...album.photos];
            
            // ====== 自動合併 Gallery_ 實穿照（依檔名規則 Gallery_方案_日期_顏色）======
            const albumToPlanId = {
                'komon': 'plan1', 'premium-komon': 'plan2', 'lace': 'plan3',
                'nishaku-sode': 'plan4', 'houmongi': 'plan5', 'kurotomesode': 'plan7',
                'hakama': 'plan13', 'furisode': 'plan8', 'mens-kimono': 'plan10',
                'premium-samurai': 'plan11', 'couple': 'plan15', 'child': 'plan14'
            };
            const matchPlanId = albumToPlanId[albumId];
            if (matchPlanId) {
                const galleryPhotos = getGalleryPhotosForPlan(matchPlanId);
                const existingSrcs = new Set(allPhotos.map(p => p.src));
                galleryPhotos.forEach(function(gp) {
                    if (!existingSrcs.has(gp.src)) {
                        allPhotos.push({ src: gp.src, color: gp.color, price: gp.price || null });
                    }
                });
            }
            
            // ====== 自動分組（Auto-Grouping）======
            // 邏輯：同一方案 + 同一日期 + 同一顏色 → 自動合為一個相簿封面
            // 當偵測到新的日期關鍵字（如 250216），會自動建立新的相簿
            // 排序：新日期的相簿自動排在最前面（由新到舊）
            function getGroupKey(photo) {
                const filename = photo.src.replace('img/', '').replace(/\.[^.]+$/, '');
                // URL-decode（處理 Gallery_ 檔名中的 %20 等）
                let decoded = filename;
                try { decoded = decodeURIComponent(filename); } catch(e) {}
                const groupName = decoded.replace(/\d+$/, '');
                return groupName || photo.color;
            }
            
            const groupMap = {};
            allPhotos.forEach(photo => {
                const key = getGroupKey(photo);
                if (!groupMap[key]) {
                    groupMap[key] = { color: photo.color, price: photo.price || null, photos: [] };
                }
                groupMap[key].photos.push(photo.src);
            });
            // 從 group key 中提取日期數字（用於排序）
            function extractDateFromKey(key) {
                try {
                    var decoded = decodeURIComponent(key);
                    var m = decoded.match(/_(\d{6,8})_/);
                    if (m) {
                        var d = m[1];
                        // 統一轉為 8 碼：YYMMDD → 20YYMMDD
                        return d.length === 6 ? '20' + d : d;
                    }
                } catch(e) {}
                return '00000000'; // 無日期的排到最後
            }

            const groups = Object.entries(groupMap).map(([key, val]) => ({
                key: key,
                color: val.color,
                price: val.price,
                cover: val.photos[0],
                photos: val.photos,
                count: val.photos.length,
                _dateSort: extractDateFromKey(key)
            }));

            // 排序：新日期在前（由新到舊）
            groups.sort(function(a, b) {
                if (b._dateSort !== a._dateSort) return b._dateSort.localeCompare(a._dateSort);
                return a.key.localeCompare(b.key); // 同日期按 key 字母排
            });

            // 將 group key 轉為友善顯示標籤
            function getGroupLabel(key) {
                // 1. 處理手動命名照片（照片庫_方案_顏色 格式）
                var clean = key.replace('照片庫_' + filePrefix + '_', '');
                if (clean !== key) return clean;

                // 2. 處理 Gallery_ 自動分類照片
                var decoded = key;
                try { decoded = decodeURIComponent(key); } catch(e) {}
                // 格式：Gallery_Category_YYMMDD_color 或 Gallery_Category_YYYYMMDD_color
                var m = decoded.match(/Gallery_\s*[A-Za-z_]+?_(\d{6,8})_?(.*)$/);
                if (m) {
                    var d = m[1]; // YYMMDD (6碼) 或 YYYYMMDD (8碼)
                    var colorPart = (m[2] || '').replace(/_$/, '').replace(/_/g, ' ').trim();
                    var colorTranslate = {
                        white:'白',beige:'米',red:'紅',orange:'橘',yellow:'黃',
                        green:'綠',blue:'藍',purple:'紫',pink:'粉',black:'黑',
                        grey:'其他',gray:'其他'
                    };
                    var colorCN = colorTranslate[colorPart.toLowerCase()] || colorPart || '其他';
                    var dateStr;
                    if (d.length === 8) {
                        dateStr = d.substring(0,4) + '.' + d.substring(4,6) + '.' + d.substring(6,8);
                    } else {
                        dateStr = '20' + d.substring(0,2) + '.' + d.substring(2,4) + '.' + d.substring(4,6);
                    }
                    return dateStr + ' — ' + t(colorCN);
                }

                return decoded || key;
            }
            
            // 生成封面卡片 HTML
            function generateCoverHTML(groups) {
                if (groups.length === 0) {
                    return '<div style="text-align: center; padding: 4rem 2rem; color: #859A93; font-size: 1.1rem;">' + t('暫無照片，敬請期待') + '</div>';
                }
                return groups.map((group, idx) => `
                    <div class="album-cover-card" data-color="${group.color}" data-price="${group.price || ''}" data-group-index="${idx}" onclick="openAlbumGroup(${idx})" style="position: relative; width: 100%; aspect-ratio: 3/4; overflow: hidden; cursor: pointer; background: #f5f5f5; transition: opacity 0.4s ease, transform 0.4s ease;">
                        <img src="${group.cover}" alt="京都和服租借 Niconico Kyoto - ${t(album.title)}${album.titleEn} ${getGroupLabel(group.key)}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease, filter 0.3s ease;" onerror="this.parentElement.style.display='none'">
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 0.8rem 1rem 0.6rem; background: linear-gradient(transparent, rgba(0,0,0,0.35)); pointer-events: none;">
                        </div>
                        <div class="album-cover-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0); display: flex; align-items: center; justify-content: center; transition: background 0.3s ease; pointer-events: none;">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0; transition: opacity 0.3s ease; filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3));">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                        </div>
                    </div>
                `).join('');
            }
            
            const content = `
                <style>
                    .album-cover-card:hover img {
                        transform: scale(1.05);
                        filter: brightness(0.88);
                    }
                    .album-cover-card:hover .album-cover-overlay {
                        background: rgba(0,0,0,0.15) !important;
                    }
                    .album-cover-card:hover .album-cover-overlay svg {
                        opacity: 1 !important;
                    }
                    .album-cover-card.fade-out {
                        opacity: 0;
                        transform: scale(0.95);
                        pointer-events: none;
                    }
                    .album-cover-card.fade-in {
                        opacity: 1;
                        transform: scale(1);
                    }
                    @media (max-width: 640px) {
                        .album-covers-grid {
                            grid-template-columns: repeat(2, 1fr) !important;
                            gap: 0.75rem !important;
                        }
                    }
                </style>

                <div style="background: white; min-height: 100vh; position: relative; overflow: hidden;">
                    ${generatePageBlobs('albumDetail')}
                    <!-- 返回按鈕 -->
                    <div style="max-width: 1400px; margin: 0 auto; padding: 2rem 1.5rem 1rem 1.5rem;">
                        <button onclick="window.location.hash='#reviews'" style="background: transparent; border: 1px solid #859A93; color: #859A93; padding: 0.5rem 1.5rem; cursor: pointer; font-size: 0.875rem; letter-spacing: 0.1em; transition: all 0.3s ease;" onmouseover="this.style.backgroundColor='#859A93'; this.style.color='white';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#859A93';">
                            ← ${t('返回照片庫')}
                        </button>
                    </div>

                    <!-- 標題區 -->
                    <div style="max-width: 1400px; margin: 0 auto; padding: 1rem 1.5rem 2rem 1.5rem;">
                        <div style="text-align: center; margin-bottom: 1.5rem;">
                            <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: #544739; margin: 0 0 1.5rem 0; letter-spacing: 0.1em;">
                                ${t(album.title)}｜${album.titleEn}
                            </h1>
                            ${album.priceFilter ? `
                            <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; margin-bottom: 1rem;">
                                ${album.priceFilter.map((b, i) => `
                                    <button class="album-price-btn ${i === 0 ? 'active' : ''}" data-price="${b.price}" onclick="filterAlbumByPrice('${b.price}', this)" style="cursor:pointer; padding: 0.55rem 1.4rem; border: 1.5px solid #859A93; border-radius: 50px; font-size: 0.85rem; font-weight: 500; letter-spacing: 0.05em; transition: all 0.3s ease; background-color:${i === 0 ? '#859A93' : 'white'}; color:${i === 0 ? 'white' : '#859A93'}; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
                                        ${t(b.label)}
                                    </button>
                                `).join('')}
                            </div>
                            ` : ''}
                            ${album.colorFilterType !== 'none' ? `
                            <div style="position: relative; display: inline-block;">
                                <select id="album-color-filter" onchange="filterAlbumCovers(this.value)" style="padding: 0.75rem 3rem 0.75rem 2rem; background-color: #859A93; color: white; border: none; border-radius: 50px; font-size: 0.875rem; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s ease; appearance: none; -webkit-appearance: none; -moz-appearance: none; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); outline: none;" onmouseover="this.style.backgroundColor='#6b8279'; this.style.boxShadow='0 4px 6px rgba(0, 0, 0, 0.15)';" onmouseout="this.style.backgroundColor='#859A93'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.1)';">
                                    <option value="all">${t('全部')}</option>
                                    <option value="白">${t('白')}</option>
                                    <option value="米">${t('米')}</option>
                                    <option value="紅">${t('紅')}</option>
                                    <option value="橘">${t('橘')}</option>
                                    <option value="黃">${t('黃')}</option>
                                    <option value="綠">${t('綠')}</option>
                                    <option value="藍">${t('藍')}</option>
                                    <option value="紫">${t('紫')}</option>
                                    <option value="粉">${t('粉')}</option>
                                    <option value="黑">${t('黑')}</option>
                                    <option value="其他">${t('其他')}</option>
                                </select>
                                <span style="position: absolute; right: 1.25rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: white; font-size: 0.875rem;">▼</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- 封面列表 -->
                    <div style="max-width: 1400px; margin: 0 auto; padding: 0 1.5rem 4rem 1.5rem;">
                        <div class="album-covers-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
                            ${generateCoverHTML(groups)}
                        </div>
                        </div>
                        <!-- 相簿底部預約按鈕 -->
                        <div style="text-align: center; padding: 2rem 0 1rem;">
                            <button onclick="event.preventDefault(); openBookingModal(); return false;" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2.5rem; background: #859A93; color: white; border: none; border-radius: 50px; font-size: 1rem; font-weight: 600; letter-spacing: 0.08em; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(133,154,147,0.35);" onmouseover="this.style.background='#6b8279'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(133,154,147,0.45)';" onmouseout="this.style.background='#859A93'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(133,154,147,0.35)';">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                ${t('立即預約')} ／ Book Now
                            </button>
                        </div>
                    </div>

                <!-- Lightbox 燈箱 -->
                <div id="lightbox" class="lightbox" onclick="if(event.target.id === 'lightbox') closeLightbox()">
                    <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
                    <span class="lightbox-nav lightbox-prev" onclick="changeLightboxImage(-1); event.stopPropagation();">&#10094;</span>
                    <div class="lightbox-content">
                        <img id="lightbox-img" src="" alt="${t('相簿圖片')}">
                        <div style="text-align: center; color: white; margin-top: 1rem; font-size: 1.125rem;">
                            <span id="lightbox-counter"></span>
                        </div>
                        </div>
                    <span class="lightbox-nav lightbox-next" onclick="changeLightboxImage(1); event.stopPropagation();">&#10095;</span>
                        </div>
                    `;
            
            const contentDiv = getContentDiv();
            contentDiv.innerHTML = content;
            
            // ====== 相簿互動邏輯（直接執行） ======
            window._albumGroups = groups;

            // 點擊封面 → 直接開啟 Lightbox 瀏覽該組所有照片
            window.openAlbumGroup = function(groupIndex) {
                const group = window._albumGroups[groupIndex];
                if (!group) return;
                if (typeof window.openLightbox === 'function') {
                    window.openLightbox(group.photos, 0);
                }
            };

            // 統一篩選邏輯（同時考慮價格 + 顏色）
            function applyAlbumFilters() {
                const colorSelect = document.getElementById('album-color-filter');
                const activeColor = colorSelect ? colorSelect.value : 'all';
                const activePriceBtn = document.querySelector('.album-price-btn.active');
                const activePrice = activePriceBtn ? activePriceBtn.getAttribute('data-price') : 'all';

                const cards = document.querySelectorAll('.album-cover-card');
                cards.forEach(function(card) {
                    const cardColor = card.getAttribute('data-color');
                    const cardPrice = card.getAttribute('data-price');
                    const matchColor = (activeColor === 'all' || cardColor === activeColor);
                    const matchPrice = (activePrice === 'all' || cardPrice === activePrice);
                    const shouldShow = matchColor && matchPrice;
                    if (!shouldShow) {
                        card.classList.add('fade-out');
                        card.classList.remove('fade-in');
                        setTimeout(function() { card.style.display = 'none'; }, 350);
                    } else {
                        card.style.display = '';
                        requestAnimationFrame(function() {
                            card.classList.remove('fade-out');
                            card.classList.add('fade-in');
                        });
                    }
                });
            }

            // 顏色下拉選單
            window.filterAlbumCovers = function(color) {
                applyAlbumFilters();
            };

            // 價格按鈕
            window.filterAlbumByPrice = function(price, btn) {
                document.querySelectorAll('.album-price-btn').forEach(function(b) {
                    b.classList.remove('active');
                    b.style.backgroundColor = 'white';
                    b.style.color = '#859A93';
                });
                btn.classList.add('active');
                btn.style.backgroundColor = '#859A93';
                btn.style.color = 'white';
                applyAlbumFilters();
            };

            // Gallery_ 照片已由 albumToPlanId + getGalleryPhotosForPlan 自動合併，無需動態掃描
            
            // 設置白色背景
            const app = document.getElementById('app');
            const contentContainer = document.getElementById('content');
            if (app) {
                app.classList.add('photo-plans-white-bg');
            }
            if (contentContainer) {
                contentContainer.classList.add('photo-plans-white-bg');
            }
            
            // 初始化滾動淡入效果
            setTimeout(() => {
                initScrollFadeIn();
            }, 100);
        }

        /**
         * 渲染 - 攝影方案 (*** 完整版 - Updated FAQ & IG Link ***)
         */
        function renderPhotoPlans() {
            console.log('📝 開始渲染攝影方案...');
            const content = `
                
                <!-- Hero Section with Carousel and Overlay Text -->
                <div class="photo-plans-hero-fullwidth">
                    <div class="slideshow-container photo-plans-hero-container">
                        <div class="mySlides fade">
                            <img src="img/photo_plan_cover2.jpg" alt="${t('京都清水寺和服攝影 - NicoNico 專業攝影方案')}" class="photo-plans-hero-image-fullwidth" onerror="this.src='https://placehold.co/1200x600/cccccc/000000?text=${encodeURIComponent(t('攝影方案封面'))}'">
                    </div>
                        <!-- Overlay Text -->
                        <div class="photo-plans-hero-overlay">
                            <h1 class="photo-plans-hero-title">${t('攝影方案')}</h1>
                            <p class="photo-plans-hero-subtitle">Photography Plan</p>
                        </div>
                        </div>
                    </div>

                <!-- About Section -->
                <div class="photo-plans-about-section" style="background: white; padding: 4rem 1.5rem; position: relative; overflow: hidden;">
                    ${generatePageBlobs('photoPlans')}
                    <div class="photo-plans-about-container" style="display: grid; grid-template-columns: 0.8fr 2.2fr; gap: 10rem; align-items: stretch; max-width: 1200px; margin: 0 auto;">
                        <!-- Left: Image -->
                        <div class="photo-plans-about-image" style="display: flex; align-items: stretch; justify-content: flex-start;">
                            <img src="img/intro.jpg" alt="${t('攝影介紹')}" class="photo-plans-about-img" style="width: 100%; height: 100%; object-fit: cover; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);" onerror="this.src='https://placehold.co/600x800/cccccc/000000?text=介紹'">
                </div>

                        <!-- Right: Text Content -->
                        <div class="photo-plans-about-text" style="display: flex; flex-direction: column; justify-content: center; text-align: left; padding-left: 2rem;">
                            <div style="margin-bottom: 2rem;">
                                <p style="font-size: 0.875rem; color: #6b7280; margin: 0 0 0.5rem 0; letter-spacing: 0.1em; text-transform: uppercase;">
                                    Niconico kimono rental
                                </p>
                                <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: #544739; margin: 0 0 2rem 0; letter-spacing: 0.05em; line-height: 1.2;">
                                    Capturing memories in Kyoto
                                </h2>
                            </div>
                            <div style="color: #374151; line-height: ${currentLang === 'zh-TW' ? '2' : '1.8'}; font-size: ${currentLang === 'zh-TW' ? '1rem' : '0.875rem'}; margin-bottom: 2rem;">
                                <p style="margin-bottom: 1.5rem;">
                                    ${t('為什麼要選擇我們的攝影服務？')}<br>
                                    ${t('我們專注於捕捉最自然、最真實的瞬間，讓每一張照片都充滿情感與溫度。')}
                                </p>
                                <p style="margin-bottom: 1.5rem;">
                                    ${t('擅長日系風格攝影，以清新、自然、溫暖的色調，為您記錄下最美好的回憶。')}<br>
                                    ${t('無論是個人寫真、情侶照、還是家庭照，我們都能用鏡頭捕捉您最真實、最動人的一面。')}
                                </p>
                                <p style="margin-bottom: 1.5rem;">
                                    ${t('專業攝影隨拍，記錄清水寺與八阪神社的美麗瞬間')}
                                </p>
                                <p style="margin-bottom: 1.5rem;">
                                    ${t('我們的攝影師擁有豐富的經驗，能夠以親切、耐心的方式引導您，讓您在拍攝過程中感到輕鬆自在。')}
                                </p>
                                <p>
                                    ${t('讓我們一起，在京都的美景中，創造屬於您的獨特回憶。')}
                                </p>
                        </div>
                            <div style="margin-top: 2rem;">
                                <a href="#photo-plans-portfolio" onclick="event.preventDefault(); document.getElementById('photo-plans-portfolio')?.scrollIntoView({ behavior: 'smooth' }); return false;" style="display: inline-block; padding: 0.75rem 2rem; border: 1px solid #544739; color: #544739; text-decoration: none; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s ease; cursor: pointer;" onmouseover="this.style.backgroundColor='#544739'; this.style.color='#fff';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#544739';">
                                    ${t('查看作品集')}
                                </a>
                            </div>
                        </div>
                            </div>
                        </div>
                        
                <!-- Plans Section -->
                <div style="background: white; padding: 4rem 1.5rem;">
                    <div style="text-align: center; margin-bottom: 4rem;">
                        <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: #544739; margin: 0 0 0.5rem 0; letter-spacing: 0.1em;">
                            ${t('方案')} | Plan
                        </h2>
                        </div>
                        
                    <div class="photo-plans-service-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; max-width: 1200px; margin: 0 auto;">
                        <!-- Plan A -->
                        <div class="photo-plan-service-card" style="border: 1px solid #544739; padding: 2.5rem; position: relative; display: flex; flex-direction: column;">
                            <div style="font-size: 4rem; font-weight: 300; color: #544739; line-height: 1; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif;">
                                A
                            </div>
                            <h3 style="font-size: 1.25rem; font-weight: 300; color: #544739; margin: 0 0 0.5rem 0; text-align: center; letter-spacing: 0.1em;">
                                ${t('30分鐘外拍方案')}
                            </h3>
                            <p style="font-size: 0.875rem; color: #6b7280; margin: 0 0 1.5rem 0; text-align: center;">
                                30-minute outdoor shooting plan
                            </p>
                            <div style="color: #374151; line-height: 1.8; font-size: 0.95rem; margin-bottom: 2rem; flex-grow: 1;">
                                <p style="margin-bottom: 1rem;">
                                    ${t('在周邊的景點（如知恩院、円山公園）快速拍攝。適合想要快速記錄美好瞬間的您。')}
                                </p>
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    <li style="margin-bottom: 0.5rem;">● <strong>${t('費用：')}</strong> ¥10,000</li>
                                    <li style="margin-bottom: 0.5rem;">● <strong>${t('內容：')}</strong> ${t('底片30-60張，無精修')}</li>
                                    <li style="margin-bottom: 0.5rem;">● <strong>${t('人數：')}</strong> ${t('1~2人 (每加1人會額外收¥2,500)')}</li>
                                </ul>
                        </div>
                            <a href="javascript:void(0)" onclick="openPhotoPlanSample('img/30m.jpg')" style="display: block; padding: 0.75rem 2rem; border: 1px solid #544739; color: #544739; text-decoration: none; text-align: center; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s ease; cursor: pointer; margin-top: auto;" onmouseover="this.style.backgroundColor='#544739'; this.style.color='#fff';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#544739';">
                                ${t('查看照片')}
                            </a>
                        </div>
                        
                        <!-- Plan B -->
                        <div class="photo-plan-service-card" style="border: 1px solid #544739; padding: 2.5rem; position: relative; display: flex; flex-direction: column;">
                            <div style="font-size: 4rem; font-weight: 300; color: #544739; line-height: 1; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif;">
                                B
                            </div>
                            <h3 style="font-size: 1.25rem; font-weight: 300; color: #544739; margin: 0 0 0.5rem 0; text-align: center; letter-spacing: 0.1em;">
                                ${t('60分鐘外拍方案')}
                            </h3>
                            <p style="font-size: 0.875rem; color: #6b7280; margin: 0 0 1.5rem 0; text-align: center;">
                                60-minute outdoor shooting plan
                            </p>
                            <div style="color: #374151; line-height: 1.8; font-size: 0.95rem; margin-bottom: 2rem; flex-grow: 1;">
                                <p style="margin-bottom: 1rem;">
                                    ${t('可至八阪神社、清水寺、二三年坂等知名景點拍攝。（可免費在店內茶室拍攝）')}
                                </p>
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    <li style="margin-bottom: 0.5rem;">● <strong>${t('費用：')}</strong> ¥15,000</li>
                                    <li style="margin-bottom: 0.5rem;">● <strong>${t('內容：')}</strong> ${t('底片80-100張，精修5張')}</li>
                                    <li style="margin-bottom: 0.5rem;">● <strong>${t('人數：')}</strong> ${t('1~3人 (每加1人會額外收¥2,500)')}</li>
                                </ul>
                        </div>
                            <a href="javascript:void(0)" onclick="openPhotoPlanSample('img/60m.jpg')" style="display: block; padding: 0.75rem 2rem; border: 1px solid #544739; color: #544739; text-decoration: none; text-align: center; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s ease; cursor: pointer; margin-top: auto;" onmouseover="this.style.backgroundColor='#544739'; this.style.color='#fff';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#544739';">
                                ${t('查看照片')}
                            </a>
                        </div>
                        
                        <!-- Plan C -->
                        <div class="photo-plan-service-card" style="border: 1px solid #544739; padding: 2.5rem; position: relative; display: flex; flex-direction: column;">
                            <div style="font-size: 4rem; font-weight: 300; color: #544739; line-height: 1; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif;">
                                C
                            </div>
                            <h3 style="font-size: 1.25rem; font-weight: 300; color: #544739; margin: 0 0 0.5rem 0; text-align: center; letter-spacing: 0.1em;">
                                ${t('90分鐘外拍方案')}
                            </h3>
                            <p style="font-size: 0.875rem; color: #6b7280; margin: 0 0 1.5rem 0; text-align: center;">
                                90-minute outdoor shooting plan
                            </p>
                            <div style="color: #374151; line-height: 1.8; font-size: 0.95rem; margin-bottom: 2rem; flex-grow: 1;">
                                <p style="margin-bottom: 1rem;">
                                    ${t('可至八阪神社、清水寺、二三年坂等知名景點拍攝。（可免費在店內茶室拍攝）')}
                                </p>
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    <li style="margin-bottom: 0.5rem;">● <strong>${t('費用：')}</strong> ¥22,000</li>
                                    <li style="margin-bottom: 0.5rem;">● <strong>${t('內容：')}</strong> ${t('底片150張以上，精修10張')}</li>
                                    <li style="margin-bottom: 0.5rem;">● <strong>${t('人數：')}</strong> ${t('1~6人 (每加1人會額外收¥2,500)')}</li>
                                </ul>
                        </div>
                            <a href="javascript:void(0)" onclick="openPhotoPlanSample('img/90m.jpg')" style="display: block; padding: 0.75rem 2rem; border: 1px solid #544739; color: #544739; text-decoration: none; text-align: center; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s ease; cursor: pointer; margin-top: auto;" onmouseover="this.style.backgroundColor='#544739'; this.style.color='#fff';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#544739';">
                                ${t('查看照片')}
                            </a>
                        </div>
                            </div>
                        </div>
                        
                <!-- Portfolio Section -->
                <div id="photo-plans-portfolio" class="mt-12 border-t pt-8" style="background: white; padding: 4rem 1.5rem;">
                    <div style="max-width: 1200px; margin: 0 auto;">
                        <div style="margin-bottom: 3rem;">
                            <p style="font-size: 0.875rem; color: #6b7280; margin: 0 0 0.5rem 0; letter-spacing: 0.1em; text-transform: uppercase;">
                                — ${t('作品集')} | Portfolio
                            </p>
                            <h3 style="font-size: 1.5rem; font-weight: 300; color: #544739; margin: 0; letter-spacing: 0.1em;">
                                In Kyoto
                            </h3>
                        </div>
                        
                        <!-- Portfolio Carousel -->
                        <div class="photo-portfolio-carousel-container" style="position: relative; margin-bottom: 3rem;">
                            <div class="photo-portfolio-carousel" style="display: flex; overflow-x: auto; gap: 2rem; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; -ms-overflow-style: none;">
                                <!-- 原有作品 -->
                                <div class="photo-portfolio-square" style="aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; flex-shrink: 0; width: calc(33.333% - 1.33rem); scroll-snap-align: start;" onclick="openLightbox(['img/blue_nishaku1.jpg', 'img/blue_nishaku2.jpg', 'img/blue_nishaku3.jpg', 'img/blue_nishaku4.jpg'], 0)">
                                    <img src="img/blue_nishaku1.jpg" alt="${t('攝影作品')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0;">
                            </div>
                                <div class="photo-portfolio-square" style="aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; flex-shrink: 0; width: calc(33.333% - 1.33rem); scroll-snap-align: start;" onclick="openLightbox(['img/white_standard_furisode1.jpg', 'img/white_standard_furisode2.jpg', 'img/white_standard_furisode3.jpg'], 0)">
                                    <img src="img/white_standard_furisode1.jpg" alt="${t('攝影作品')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0;">
                        </div>
                                <div class="photo-portfolio-square" style="aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; flex-shrink: 0; width: calc(33.333% - 1.33rem); scroll-snap-align: start;" onclick="openLightbox(['img/cover8.jpg', 'img/premium_houmongi2.jpg', 'img/premium_houmongi3.jpg', 'img/premium_houmongi4.jpg', 'img/cover9.jpg'], 0)">
                                    <img src="img/cover8.jpg" alt="${t('攝影作品')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0;">
                        </div>
                                <!-- Gallery 作品集 -->
                                <div class="photo-portfolio-square" style="aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; flex-shrink: 0; width: calc(33.333% - 1.33rem); scroll-snap-align: start;" onclick="openLightbox(['img/Gallery_Lace_240731_white1.jpg', 'img/Gallery_Lace_240731_white2.jpg', 'img/Gallery_Lace_240731_white3.jpg', 'img/Gallery_Lace_240731_white4.jpg', 'img/Gallery_Lace_240731_white5.jpg'], 0)">
                                    <img src="img/Gallery_Lace_240731_white1.jpg" alt="${t('攝影作品')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0;">
                                </div>
                                <div class="photo-portfolio-square" style="aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; flex-shrink: 0; width: calc(33.333% - 1.33rem); scroll-snap-align: start;" onclick="openLightbox(['img/Gallery_Lace_240810_white1.jpg', 'img/Gallery_Lace_240810_white2.jpg', 'img/Gallery_Lace_240810_white3.jpg'], 0)">
                                    <img src="img/Gallery_Lace_240810_white1.jpg" alt="${t('攝影作品')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0;">
                                </div>
                                <div class="photo-portfolio-square" style="aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; flex-shrink: 0; width: calc(33.333% - 1.33rem); scroll-snap-align: start;" onclick="openLightbox(['img/Gallery_Kuro_Tomesode_260203_1.jpg', 'img/Gallery_Kuro_Tomesode_260203_2.jpg', 'img/Gallery_Kuro_Tomesode_260203_3.jpg', 'img/Gallery_Kuro_Tomesode_260203_4.jpg', 'img/Gallery_Kuro_Tomesode_260203_5.jpg'], 0)">
                                    <img src="img/Gallery_Kuro_Tomesode_260203_1.jpg" alt="${t('攝影作品')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0;">
                                </div>
                                <div class="photo-portfolio-square" style="aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; flex-shrink: 0; width: calc(33.333% - 1.33rem); scroll-snap-align: start;" onclick="openLightbox(['img/Gallery_Kuro_Tomesode_260202_1.jpg', 'img/Gallery_Kuro_Tomesode_260202_2.jpg', 'img/Gallery_Kuro_Tomesode_260202_3.jpg', 'img/Gallery_Kuro_Tomesode_260202_4.jpg'], 0)">
                                    <img src="img/Gallery_Kuro_Tomesode_260202_1.jpg" alt="${t('攝影作品')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0;">
                                </div>
                                <div class="photo-portfolio-square" style="aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; flex-shrink: 0; width: calc(33.333% - 1.33rem); scroll-snap-align: start;" onclick="openLightbox(['img/Gallery_Mens_Samurai_250329_1.jpg', 'img/Gallery_Mens_Samurai_250329_2.jpg', 'img/Gallery_Mens_Samurai_250329_3.jpg', 'img/Gallery_Mens_Samurai_250329_4.jpg', 'img/Gallery_Mens_Samurai_250329_5.jpg'], 0)">
                                    <img src="img/Gallery_Mens_Samurai_250329_1.jpg" alt="${t('攝影作品')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0;">
                                </div>
                                <div class="photo-portfolio-square" style="aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; flex-shrink: 0; width: calc(33.333% - 1.33rem); scroll-snap-align: start;" onclick="openLightbox(['img/Gallery_Premium_Komon_260101_other1.jpg', 'img/Gallery_Premium_Komon_260101_other2.jpg', 'img/Gallery_Premium_Komon_260101_other3.jpg'], 0)">
                                    <img src="img/Gallery_Premium_Komon_260101_other1.jpg" alt="${t('攝影作品')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0;">
                                </div>
                                <div class="photo-portfolio-square" style="aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; flex-shrink: 0; width: calc(33.333% - 1.33rem); scroll-snap-align: start;" onclick="openLightbox(['img/Gallery_Gold_Furisode_20260215_blue1.jpg', 'img/Gallery_Gold_Furisode_20260215_blue2.jpg', 'img/Gallery_Gold_Furisode_20260215_blue3.jpg', 'img/Gallery_Gold_Furisode_20260215_blue4.jpg', 'img/Gallery_Gold_Furisode_20260215_blue5.jpg', 'img/Gallery_Gold_Furisode_20260215_blue6.jpg', 'img/Gallery_Gold_Furisode_20260215_blue7.jpg', 'img/Gallery_Gold_Furisode_20260215_blue8.jpg'], 0)">
                                    <img src="img/Gallery_Gold_Furisode_20260215_blue1.jpg" alt="${t('攝影作品')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0;">
                                </div>
                                <div class="photo-portfolio-square" style="aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; flex-shrink: 0; width: calc(33.333% - 1.33rem); scroll-snap-align: start;" onclick="openLightbox(['img/Gallery_couple_251203_1.jpg', 'img/Gallery_couple_251203_2.jpg', 'img/Gallery_couple_251203_3.jpg', 'img/Gallery_couple_251203_4.jpg'], 0)">
                                    <img src="img/Gallery_couple_251203_1.jpg" alt="${t('攝影作品')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0;">
                                </div>
                                <div class="photo-portfolio-square" style="aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; flex-shrink: 0; width: calc(33.333% - 1.33rem); scroll-snap-align: start;" onclick="openLightbox(['img/Gallery_Couple_260202_1.jpg', 'img/Gallery_Couple_260202_2.jpg', 'img/Gallery_Couple_260202_3.jpg'], 0)">
                                    <img src="img/Gallery_Couple_260202_1.jpg" alt="${t('攝影作品')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0;">
                    </div>
                </div>
                            <style>
                                .photo-portfolio-carousel::-webkit-scrollbar {
                                    display: none;
                                }
                            </style>
                        </div>
                        
                        <!-- Description Text -->
                        <div style="color: #374151; line-height: 2; font-size: 1rem; margin-bottom: 2rem; max-width: 800px;">
                            <p style="margin-bottom: 1rem;">
                                ${t('使用Sonya7c2及GR3進行拍攝，捕捉充滿自然光線溫暖的照片，以及能夠感受到日常生活的瞬間。')}
                            </p>
                            <p>
                                ${t('如有疑問，歡迎隨時與我們聯繫諮詢')} <a href="https://www.instagram.com/niconico_kimono" target="_blank" rel="noopener noreferrer" style="color: #544739; text-decoration: underline;">@niconico_kimono</a>
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Lightbox -->
                <div id="lightbox" class="lightbox">
                    <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
                    <span class="lightbox-nav lightbox-prev" onclick="changeLightboxImage(-1)">&#10094;</span>
                    <div class="lightbox-content">
                        <img id="lightbox-img" src="" alt="${t('放大檢視')}">
                    </div>
                    <span class="lightbox-nav lightbox-next" onclick="changeLightboxImage(1)">&#10095;</span>
                </div>

                <!-- FAQ Section (Updated Content) -->
                <div class="prose max-w-none" style="background: white; padding: 4rem 1.5rem;">
                    <div style="max-width: 1200px; margin: 0 auto;">
                        <div style="border-top: 1px dashed #d1d5db; padding-top: 2rem; margin-top: 0;">
                    <h3 class="text-3xl font-bold text-gray-800 mb-4" style="font-weight: 600;">${t('✧˚.常見Ｑ＆Ａ')}</h3>
                    <div class="space-y-4">
                        <div>
                            <h4 class="text-xl font-semibold text-primary mt-0 mb-1">${t('Ｑ：精修包含哪些？')}</h4>
                            <p class="text-gray-700 m-0">${t('Ａ： 調色、臉部微調（皮膚、瘦臉等等），以自然為主。')}</p>
                        </div>
                        <div>
                            <h4 class="text-xl font-semibold text-primary mt-0 mb-1">${t('Ｑ：如果下雨會怎麼辦？')}</h4>
                            <p class="text-gray-700 m-0">${t('Ａ：小雨會照常拍攝，攝影師會準備透明雨傘作為道具。若遇暴雨，可免費改期或取消。')}</p>
                        </div>
                        <div>
                            <h4 class="text-xl font-semibold text-primary mt-0 mb-1">${t('Ｑ：照片大概多久會拿到？')}</h4>
                            <p class="text-gray-700 m-0">${t('Ａ：底片會於 3-5天內提供下載連結。精修照片會於 2 週內提供。')}</p>
                        </div>
                         <div>
                            <h4 class="text-xl font-semibold text-primary mt-0 mb-1">${t('Ｑ：會去哪裡拍攝？')}</h4>
                            <p class="text-gray-700 m-0">${t('Ａ：可與攝影師討論喜歡的風格、場景，再決定要去哪裡拍攝。')}</p>
                        </div>
                    </div>
                        </div>
                    </div>

                    <!-- Add Notes and IG Link (Updated Text & Link) -->
                    <div class="mt-6 text-sm text-gray-600 not-prose" style="background: white; padding: 0 1.5rem 2rem 1.5rem;">
                        <div style="max-width: 1200px; margin: 0 auto;">
                         <p class="mb-1">${t('※照片下載連結期限為14天，14天後將會刪除檔案。')}</p>
                         <p class="mb-4">${t('※所有照片皆經過客人同意才會上傳到官網、Instagram。')}</p>
                         <a href="https://www.instagram.com/gagaq9q9" target="_blank" rel="noopener noreferrer" class="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition duration-300 no-underline shadow-md">
                            ${t('攝影師')}Instagram ੯‧̀͡u\
                         </a>
                        </div>
                    </div>

                    <!-- Photo Carousel Section -->
                    <div style="background: white; padding: 4rem 0 0 0; margin: 0; width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw;">
                        <div class="photo-bottom-carousel-container" style="position: relative; overflow: hidden; width: 100%; margin: 0; padding: 0;">
                                <div class="photo-bottom-carousel-track" style="display: flex; transition: transform 0.5s ease-in-out; will-change: transform; width: 100%; margin: 0; padding: 0;">
                                <div class="photo-bottom-carousel-item" style="flex-shrink: 0; width: calc(100% / 6); padding: 0; margin: 0;">
                                    <img src="img/photo_carousel1.jpg" alt="${t('攝影作品')}" style="width: 100%; height: auto; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 0; display: block; margin: 0; padding: 0;">
                                </div>
                                <div class="photo-bottom-carousel-item" style="flex-shrink: 0; width: calc(100% / 6); padding: 0; margin: 0;">
                                    <img src="img/couple3.jpg" alt="${t('攝影作品')}" style="width: 100%; height: auto; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 0; display: block; margin: 0; padding: 0;">
                                </div>
                                <div class="photo-bottom-carousel-item" style="flex-shrink: 0; width: calc(100% / 6); padding: 0; margin: 0;">
                                    <img src="img/gallery_kurotomesode2.jpg" alt="${t('攝影作品')}" style="width: 100%; height: auto; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 0; display: block; margin: 0; padding: 0;">
                                </div>
                                <div class="photo-bottom-carousel-item" style="flex-shrink: 0; width: calc(100% / 6); padding: 0; margin: 0;">
                                    <img src="img/photo_carousel4.jpg" alt="${t('攝影作品')}" style="width: 100%; height: auto; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 0; display: block; margin: 0; padding: 0;">
                                </div>
                                <div class="photo-bottom-carousel-item" style="flex-shrink: 0; width: calc(100% / 6); padding: 0; margin: 0;">
                                    <img src="img/photo_carousel5.jpg" alt="${t('攝影作品')}" style="width: 100%; height: auto; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 0; display: block; margin: 0; padding: 0;">
                                </div>
                                <div class="photo-bottom-carousel-item" style="flex-shrink: 0; width: calc(100% / 6); padding: 0; margin: 0;">
                                    <img src="img/photo_carousel6.jpg" alt="${t('攝影作品')}" style="width: 100%; height: auto; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 0; display: block; margin: 0; padding: 0;">
                                </div>
                                <div class="photo-bottom-carousel-item" style="flex-shrink: 0; width: calc(100% / 6); padding: 0; margin: 0;">
                                    <img src="img/photo_carousel7.jpg" alt="${t('攝影作品')}" style="width: 100%; height: auto; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 0; display: block; margin: 0; padding: 0;">
                                </div>
                                <div class="photo-bottom-carousel-item" style="flex-shrink: 0; width: calc(100% / 6); padding: 0; margin: 0;">
                                    <img src="img/photo_carousel8.jpg" alt="${t('攝影作品')}" style="width: 100%; height: auto; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 0; display: block; margin: 0; padding: 0;">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Navigation Text Section -->
                    <div style="background: white; padding: 7rem 0 1.5rem 0; text-align: center; width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; margin-top: 0; margin-bottom: 0;">
                        <div style="color: #374151; font-size: 0.875rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 400; font-family: 'Inter', sans-serif; margin: 0 auto;">
                            Niconico | Kimono | Kyoto | Photography | Welcome
                        </div>
                    </div>
                </div>
            `;
            renderStaticPage(t('攝影方案'), content, 'Photography Plan');
            
            // 添加透明導航欄樣式
            const header = document.querySelector('header');
            if (header) {
                header.classList.add('photo-plans-navbar-transparent');
            }
            
            // 初始化攝影方案封面輪播
            setTimeout(() => {
                initPhotoPlansCarousel();
            }, 100);
            
            // 初始化底部照片輪播
            setTimeout(() => {
                initPhotoBottomCarousel();
            }, 200);
            
            // 初始化滾動淡入效果
            setTimeout(() => {
                initScrollFadeIn();
            }, 300);
        }
        
        // 攝影方案封面輪播功能
        function initPhotoPlansCarousel() {
            const slides = document.querySelectorAll('.photo-plans-hero-fullwidth .mySlides');
            if (slides.length === 0) return;
            
            // 顯示第一張
            showSlides(1);
            
            // 自動輪播（每 3 秒切換一次）
            let carouselInterval = setInterval(() => {
                slideIndex++;
                if (slideIndex > slides.length) {
                    slideIndex = 1;
                }
                showSlides(slideIndex);
            }, 3000);
            
            // 當鼠標懸停在輪播上時暫停自動輪播
            const slideshowContainer = document.querySelector('.photo-plans-hero-fullwidth .slideshow-container');
            if (slideshowContainer) {
                slideshowContainer.addEventListener('mouseenter', () => {
                    clearInterval(carouselInterval);
                });
                slideshowContainer.addEventListener('mouseleave', () => {
                    carouselInterval = setInterval(() => {
                        slideIndex++;
                        if (slideIndex > slides.length) {
                            slideIndex = 1;
                        }
                        showSlides(slideIndex);
                    }, 3000);
                });
            }
        }

        // 全局 FAQ 折疊功能（暴露到 window 对象）
        window.toggleFaq = function(element) {
            const answer = element.nextElementSibling;
            const icon = element.querySelector('.faq-icon');
            
            // 切換當前項目（允許同時展開多個問題）
            answer.classList.toggle('active');
            icon.classList.toggle('active');
        }
        
        // FAQ 卡片點擊功能（點擊切換，不再自動關閉）（暴露到 window 对象）
        window.toggleFaqCard = function(card) {
            const wrapper = card.closest('.faq-item-wrapper');
            if (!wrapper) return;
            
            const answer = wrapper.querySelector('.faq-answer');
            const arrow = card.querySelector('.faq-arrow');
            
            // 只切換當前卡片的答案
            if (answer) {
                const isActive = answer.classList.contains('active');
                if (isActive) {
                    answer.classList.remove('active');
                    if (arrow) {
                        arrow.style.transform = 'rotate(0deg)';
                    }
                } else {
                    answer.classList.add('active');
                    if (arrow) {
                        arrow.style.transform = 'rotate(90deg)';
                    }
                }
            }
        }

        // 首頁常見問題切換函數（暴露到 window 对象）
        window.toggleFaqHome = function(item) {
            const isActive = item.classList.contains('active');
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        }
        
        // FAQ 分類篩選功能（暴露到 window 供 onclick 使用）
        window.filterFaqCategory = function(category) {
            // 更新按鈕狀態（用 data-category 屬性比對，避免翻譯後文字不匹配）
            const buttons = document.querySelectorAll('.faq-filter-btn');
            buttons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-category') === category) {
                    btn.classList.add('active');
                }
            });
            
            // 顯示/隱藏分類
            const sections = document.querySelectorAll('.faq-category-section');
            sections.forEach(section => {
                if (category === '全部' || section.dataset.category === category) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        }
        
        // 顯示全部FAQ
        function showAllFaqs() {
            const mainSection = document.querySelector('.faq-container');
            const allSection = document.getElementById('faq-all-section');
            
            if (mainSection && allSection) {
                mainSection.style.display = 'none';
                allSection.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        // 全局照片篩選功能
        function showAllCategoryPhotos() {
            // 顯示所有照片
            const photoGrid = document.getElementById('photo-grid');
            if (photoGrid) {
                photoGrid.classList.remove('hidden');
                // 顯示所有分類的照片
                filterPhotos('all');
                // 滾動到照片區域
                setTimeout(() => {
                    photoGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
        
        function selectKimonoMainCategory(category) {
            // 更新主按鈕狀態
            const mainButtons = document.querySelectorAll('.kimono-style-main-btn');
            mainButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            // 隱藏所有子分類
            const ladiesSub = document.getElementById('ladies-sub-buttons');
            const menSub = document.getElementById('men-sub-buttons');
            const otherSub = document.getElementById('other-sub-buttons');
            
            if (ladiesSub) ladiesSub.classList.remove('show');
            if (menSub) menSub.classList.remove('show');
            if (otherSub) otherSub.classList.remove('show');

            // 顯示對應的子分類
            if (category === 'ladies' && ladiesSub) {
                ladiesSub.classList.add('show');
            } else if (category === 'men' && menSub) {
                menSub.classList.add('show');
            } else if (category === 'other' && otherSub) {
                otherSub.classList.add('show');
            } else if (category === 'all') {
                // 顯示所有照片
                showAllCategoryPhotos();
            }
        }

        // 暴露到全局作用域
        window.showCategoryPhotos = function(category) {
            // 隱藏分類卡片區域和側邊欄
            const reviewsCards = document.querySelector('.reviews-cards');
            if (reviewsCards) {
                reviewsCards.classList.add('hidden');
            }
            const reviewsGalleryContainer = document.querySelector('.reviews-gallery-container');
            if (reviewsGalleryContainer) {
                reviewsGalleryContainer.classList.add('hidden');
            }

            // 顯示照片網格
            const photoGrid = document.getElementById('photo-grid');
            if (photoGrid) {
                photoGrid.classList.remove('hidden');
                // 過濾顯示對應分類的照片
                filterPhotos(category);
                // 滾動到照片區域
                setTimeout(() => {
                    photoGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }

            // 更新子分類按鈕狀態
            const subButtons = document.querySelectorAll('.kimono-style-sub-btn');
            subButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            if (event && event.target) {
                event.target.classList.add('active');
            }

            // 調用 filterPhotos（不傳遞 event，因為是從卡片點擊觸發的）
            filterPhotos(category, null);
        }

        function filterPhotos(category, clickedButton) {
            // 過濾照片顯示

            // 隱藏所有子分類按鈕（點擊套餐後不顯示子分類）
            const furisodeSubcategory = document.getElementById('furisode-subcategory');
            if (furisodeSubcategory) {
                    furisodeSubcategory.classList.add('hidden');
                }

            const houmongiSubcategory = document.getElementById('houmongi-subcategory');
            if (houmongiSubcategory) {
                houmongiSubcategory.classList.add('hidden');
            }

            // 隱藏性別篩選器
            const genderFilter = document.getElementById('gender-filter');
            if (genderFilter) {
                genderFilter.style.display = 'none';
            }

            // 篩選照片 - 只顯示當前套餐的照片
            const photos = document.querySelectorAll('.photo-item');
            photos.forEach(photo => {
                if (photo.dataset.category === category) {
                    photo.classList.remove('hidden');
                } else {
                    photo.classList.add('hidden');
                }
            });
        }


        function getCategoryName(category) {
            const categoryNames = {
                'plan1': '小紋',
                'plan2': '高級小紋',
                'plan3': '蕾絲',
                'plan4': '二尺袖',
                'plan5': '訪問服',
                'plan7': '黑留袖',
                'plan8': '振袖',
                'plan10': '男士',
                'plan11': '高級武士服',
                'plan13': '袴',
                'plan14': '小孩'
            };
            return categoryNames[category] ? t(categoryNames[category]) : '';
        }

        // 振袖子分類篩選功能
        // 暴露到全局作用域
        window.filterFurisodeSub = function(type, skipButtonUpdate) {
            // 更新按鈕狀態
            if (!skipButtonUpdate) {
                const buttons = document.querySelectorAll('.furisode-sub-btn');
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.backgroundColor = 'white';
                    btn.style.color = '#859A93';
                });
                if (event && event.target) {
                event.target.classList.add('active');
                    event.target.style.backgroundColor = '#859A93';
                event.target.style.color = 'white';
                }
            }

            // 如果選擇特定子分類，隱藏分類卡片區域，只顯示該子分類的相簿
            const reviewsCards = document.querySelector('.reviews-cards');
            const genderFilter = document.getElementById('gender-filter');
            if (type === 'all-furisode') {
                // 顯示全部時，顯示分類卡片，隱藏性別篩選器
                if (reviewsCards) {
                    reviewsCards.classList.remove('hidden');
                }
                if (genderFilter) {
                    genderFilter.style.display = 'none';
                }
                // 顯示所有振袖照片
            const photos = document.querySelectorAll('.photo-item[data-category="plan8"]');
            photos.forEach(photo => {
                    photo.classList.remove('hidden');
                });
                } else {
                // 選擇特定子分類時，隱藏分類卡片，顯示性別篩選器，只顯示該子分類的相簿
                if (reviewsCards) {
                    reviewsCards.classList.add('hidden');
                }
                if (genderFilter) {
                    genderFilter.style.display = 'flex';
                }
                // 隱藏所有其他分類的照片
                const allPhotos = document.querySelectorAll('.photo-item');
                allPhotos.forEach(photo => {
                    photo.classList.add('hidden');
                });
                // 只顯示該子分類的振袖照片
                const photos = document.querySelectorAll('.photo-item[data-category="plan8"]');
                photos.forEach(photo => {
                    if (photo.dataset.furisodeSub === type) {
                        photo.classList.remove('hidden');
                    }
                });
                // 重置性別篩選為全部
                filterByGender('all', true);
                // 滾動到照片區域
                const photoGrid = document.getElementById('photo-grid');
                if (photoGrid) {
                    setTimeout(() => {
                        photoGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        }

        // 訪問服子分類篩選功能
        // 暴露到全局作用域
        window.filterHoumongiSub = function(type, skipButtonUpdate) {
            // 更新按鈕狀態
            if (!skipButtonUpdate) {
                const buttons = document.querySelectorAll('.houmongi-sub-btn');
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.backgroundColor = 'white';
                    btn.style.color = '#859A93';
                });
                if (event && event.target) {
                    event.target.classList.add('active');
                    event.target.style.backgroundColor = '#859A93';
                    event.target.style.color = 'white';
                }
            }

            // 如果選擇特定子分類，隱藏分類卡片區域，只顯示該子分類的相簿
            const reviewsCards = document.querySelector('.reviews-cards');
            const genderFilter = document.getElementById('gender-filter');
            if (type === 'all-houmongi') {
                // 顯示全部時，顯示分類卡片，隱藏性別篩選器
                if (reviewsCards) {
                    reviewsCards.classList.remove('hidden');
                }
                if (genderFilter) {
                    genderFilter.style.display = 'none';
                }
                // 顯示所有訪問服照片
                const photos = document.querySelectorAll('.photo-item[data-category="plan5"]');
                photos.forEach(photo => {
                    photo.classList.remove('hidden');
                });
            } else {
                // 選擇特定子分類時，隱藏分類卡片，顯示性別篩選器，只顯示該子分類的相簿
                if (reviewsCards) {
                    reviewsCards.classList.add('hidden');
                }
                if (genderFilter) {
                    genderFilter.style.display = 'flex';
                }
                // 隱藏所有其他分類的照片
                const allPhotos = document.querySelectorAll('.photo-item');
                allPhotos.forEach(photo => {
                    photo.classList.add('hidden');
                });
                // 只顯示該子分類的訪問服照片
                const photos = document.querySelectorAll('.photo-item[data-category="plan5"]');
                photos.forEach(photo => {
                    if (photo.dataset.houmongiSub === type) {
                        photo.classList.remove('hidden');
                    }
                });
                // 重置性別篩選為全部
                filterByGender('all', true);
                // 滾動到照片區域
                const photoGrid = document.getElementById('photo-grid');
                if (photoGrid) {
                    setTimeout(() => {
                        photoGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        }

        // 性別篩選功能
        function filterByGender(gender, skipButtonUpdate) {
            // 更新按鈕狀態
            if (!skipButtonUpdate) {
                const buttons = document.querySelectorAll('.gender-filter-btn');
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.backgroundColor = 'white';
                    btn.style.color = '#859A93';
                });
                if (event && event.target) {
                    event.target.classList.add('active');
                    event.target.style.backgroundColor = '#859A93';
                    event.target.style.color = 'white';
                }
            }

            // 找出當前應該顯示的照片類別
            // 先檢查是否有子分類活動
            let targetCategory = null;
            let targetSubType = null;
            
            const furisodeSubcategory = document.getElementById('furisode-subcategory');
            if (furisodeSubcategory && !furisodeSubcategory.classList.contains('hidden')) {
                const activeFurisodeBtn = document.querySelector('.furisode-sub-btn.active');
                if (activeFurisodeBtn) {
                    const onclickAttr = activeFurisodeBtn.getAttribute('onclick');
                    if (onclickAttr) {
                        const match = onclickAttr.match(/filterFurisodeSub\('([^']+)'\)/);
                        if (match) {
                            targetSubType = match[1];
                            targetCategory = 'plan8';
                        }
                    }
                }
            }
            
            const houmongiSubcategory = document.getElementById('houmongi-subcategory');
            if (!targetCategory && houmongiSubcategory && !houmongiSubcategory.classList.contains('hidden')) {
                const activeHoumongiBtn = document.querySelector('.houmongi-sub-btn.active');
                if (activeHoumongiBtn) {
                    const onclickAttr = activeHoumongiBtn.getAttribute('onclick');
                    if (onclickAttr) {
                        const match = onclickAttr.match(/filterHoumongiSub\('([^']+)'\)/);
                        if (match) {
                            targetSubType = match[1];
                            targetCategory = 'plan5';
                        }
                    }
                }
            }
            
            // 如果沒有子分類，找出當前顯示的第一張照片的類別
            if (!targetCategory) {
                const visiblePhotos = document.querySelectorAll('.photo-item:not(.hidden)');
                if (visiblePhotos.length > 0) {
                    targetCategory = visiblePhotos[0].dataset.category;
                }
            }

            // 獲取目標照片
            let targetPhotos = [];
            if (targetCategory === 'plan8' && targetSubType && targetSubType !== 'all-furisode') {
                targetPhotos = document.querySelectorAll(`.photo-item[data-category="plan8"][data-furisode-sub="${targetSubType}"]`);
            } else if (targetCategory === 'plan5' && targetSubType && targetSubType !== 'all-houmongi') {
                targetPhotos = document.querySelectorAll(`.photo-item[data-category="plan5"][data-houmongi-sub="${targetSubType}"]`);
            } else if (targetCategory) {
                targetPhotos = document.querySelectorAll(`.photo-item[data-category="${targetCategory}"]`);
            } else {
                // 如果找不到目標，使用所有可見照片
                targetPhotos = document.querySelectorAll('.photo-item:not(.hidden)');
            }

            // 根據性別篩選
            targetPhotos.forEach(photo => {
                const photoGender = photo.dataset.gender || 'female'; // 默認為女士
                if (gender === 'all' || photoGender === gender) {
                    photo.classList.remove('hidden');
                } else {
                    photo.classList.add('hidden');
                }
            });
        }

        // 生成 Footer HTML
        function getFooterHTML() {
            return `
                <footer style="background-color: #859A93; color: #FFFCF7; width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; margin-top: 0; padding: 0; box-sizing: border-box;">
                    
                    <div style="max-width: 100%; padding: 4rem 3rem 2rem 4rem; box-sizing: border-box; margin: 0 auto;">
                        <!-- 上半部：品牌和導航 -->
                        <div class="footer-grid" style="display: grid; grid-template-columns: repeat(1, 1fr); gap: 3rem; margin-bottom: 3rem;">
                            <!-- 左側：品牌資訊 -->
                            <div>
                                <h3 style="font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 1.75rem; margin-bottom: 1rem; color: #FFFCF7;">
                                    ニコニコ着物レンタル<br><span style="font-size: 0.6em; font-weight: 400;">｜Niconico kimono rental</span>
                                </h3>
                            </div>
                            
                            <!-- 中間：快速連結 -->
                            <div>
                                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                    <a href="#kimono-plans" style="font-size: 0.875rem; color: #FFFCF7; opacity: 0.9; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">${t('和服方案')}</a>
                                    <a href="#hairstyle" style="font-size: 0.875rem; color: #FFFCF7; opacity: 0.9; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">${t('髮型設計')}</a>
                                    <a href="#photo-plans" style="font-size: 0.875rem; color: #FFFCF7; opacity: 0.9; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">${t('攝影方案')}</a>
                                    <a href="#tea-room" style="font-size: 0.875rem; color: #FFFCF7; opacity: 0.9; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">${t('茶室租借')}</a>
                                    <a href="#reviews" style="font-size: 0.875rem; color: #FFFCF7; opacity: 0.9; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">${t('照片庫')}</a>
                                    <a href="#faq" style="font-size: 0.875rem; color: #FFFCF7; opacity: 0.9; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">${t('常見問題')}</a>
                                    <a href="#access" style="font-size: 0.875rem; color: #FFFCF7; opacity: 0.9; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">${t('交通資訊')}</a>
                                    <a href="#" onclick="event.preventDefault(); openBookingModal(); return false;" style="font-size: 0.875rem; color: #FFFCF7; opacity: 0.9; text-decoration: none; transition: opacity 0.2s; cursor: pointer;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">${t('點我預約')}</a>
                                </div>
                            </div>
                            
                            <!-- 右側：店鋪資訊 -->
                            <div>
                                <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: #FFFCF7;">${t('店鋪資訊')}</h4>
                                <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.875rem;">
                                    <div>
                                        <p style="font-weight: 600; color: #FFFCF7; margin-bottom: 0.25rem;">${t('【祇園店】')}</p>
                                        <p style="color: #FFFCF7; opacity: 0.9; line-height: 1.6;">〒605-0066<br>${t('京都市東山區石橋町307-9')}</p>
                                    </div>
                                    <div>
                                        <p style="font-weight: 600; color: #FFFCF7; margin-bottom: 0.25rem;">${t('【清水寺店】')}</p>
                                        <p style="color: #FFFCF7; opacity: 0.9; line-height: 1.6;">〒605-0846<br>${t('京都府京都市東山區五條橋東6丁目583-70')}</p>
                                    </div>
                                    <div style="margin-top: 0.5rem;">
                                        <p style="font-weight: 600; color: #FFFCF7; margin-bottom: 0.25rem;">${t('營業時間')}</p>
                                        <p style="color: #FFFCF7; opacity: 0.9;">9:00 ～ 17:30<br>(${t('最早 6:00 可預約')})</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 分隔線 -->
                        <div style="border-top: 1px solid rgba(255, 252, 247, 0.3); padding-top: 1.5rem; margin-top: 2rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                                <!-- 社交媒體圖標 -->
                                <div style="display: flex; gap: 1.25rem; align-items: center;">
                                    <a href="https://www.instagram.com/Niconico_kimono" target="_blank" rel="noopener noreferrer" style="width: 3.5rem; height: 3.5rem; background: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; flex-shrink: 0;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.5rem; height:1.5rem; display: block;">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                        </svg>
                                    </a>
                                    <a href="https://line.me/ti/p/@922yxvwt" target="_blank" rel="noopener noreferrer" style="width: 3.5rem; height: 3.5rem; background: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; flex-shrink: 0;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                                        <svg viewBox="0 0 24 24" fill="white" style="width:1.5rem; height:1.5rem; display: block;">
                                            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.028 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                                        </svg>
                                    </a>
                                    <a href="https://xhslink.com/m/3AIAkChZ3Hd" target="_blank" rel="noopener noreferrer" style="width: 3.5rem; height: 3.5rem; background: #ff2442; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; flex-shrink: 0;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                                        <svg viewBox="0 0 24 24" style="width:1.5rem; height:1.5rem; display: block;" fill="none">
                                            <rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="white" stroke-width="2"/>
                                            <line x1="8" y1="8" x2="16" y2="8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                                            <line x1="8" y1="12" x2="16" y2="12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                                            <line x1="8" y1="16" x2="13" y2="16" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                                        </svg>
                                    </a>
                                </div>
                                
                                <!-- 版權資訊 -->
                                <div style="font-size: 0.875rem; color: #FFFCF7; opacity: 0.8;">
                                    © ${new Date().getFullYear()} Niconico Kimono Rental. All rights reserved.
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            `;
        }

        // Lightbox 相簿功能
        let currentLightboxImages = [];
        let currentLightboxIndex = 0;

        // 暴露到全局作用域
        window.openLightbox = function(images, startIndex = 0) {
            currentLightboxImages = images;
            currentLightboxIndex = startIndex;
            const lightbox = document.getElementById('lightbox');
            if (lightbox) {
                lightbox.classList.add('active');
                showLightboxImage();
                document.body.style.overflow = 'hidden';
                // 動態注入 Lightbox 預約按鈕（如尚未存在）
                if (!lightbox.querySelector('.lightbox-booking-btn')) {
                    var bookBtn = document.createElement('button');
                    bookBtn.className = 'lightbox-booking-btn';
                    bookBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' + t('立即預約');
                    bookBtn.onclick = function(e) { e.stopPropagation(); closeLightbox(); openBookingModal(); };
                    lightbox.appendChild(bookBtn);
                }
            }
        }

        window.closeLightbox = function() {
            const lightbox = document.getElementById('lightbox');
            const video = document.getElementById('lightbox-video');
            if (lightbox) {
                lightbox.classList.remove('active');
            }
            // 停止影片播放
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
            // 恢復頁面滾動
            document.body.style.overflow = '';
        }

        window.changeLightboxImage = function(direction) {
            currentLightboxIndex += direction;
            if (currentLightboxIndex >= currentLightboxImages.length) {
                currentLightboxIndex = 0;
            }
            if (currentLightboxIndex < 0) {
                currentLightboxIndex = currentLightboxImages.length - 1;
            }
            showLightboxImage();
        }

        function showLightboxImage() {
            const img = document.getElementById('lightbox-img');
            const video = document.getElementById('lightbox-video');
            const counter = document.getElementById('lightbox-counter');
            if (currentLightboxImages[currentLightboxIndex]) {
                const currentFile = currentLightboxImages[currentLightboxIndex];
                const isVideo = /\.(mov|mp4|webm|ogg)$/i.test(currentFile);
                
                if (isVideo) {
                    // 顯示影片，隱藏圖片
                    if (video) {
                        video.src = currentFile;
                        video.style.display = 'block';
                        video.classList.add('active');
                        video.play();
                    }
                    if (img) {
                        img.style.display = 'none';
                        img.classList.remove('active');
                    }
                } else {
                    // 顯示圖片，隱藏影片（Cloudinary 啟用時使用高解析度 URL）
                    if (img) {
                        img.src = cloudImg(currentFile, { width: 1920, crop: 'limit' });
                        img.style.display = 'block';
                        img.classList.add('active');
                    }
                    if (video) {
                        video.pause();
                        video.src = '';
                        video.style.display = 'none';
                        video.classList.remove('active');
                    }
                }
                
                if (counter) {
                    counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
                }
            }
        }

        // 全局振袖分類篩選功能（暴露到 window 对象）
        window.filterFurisode = function(type) {
            // 获取触发事件的元素（通过 window.event 或 arguments）
            const event = window.event || (arguments.length > 1 ? arguments[1] : null);
            const targetButton = event ? event.target || event.currentTarget : null;
            
            // 更新按鈕狀態
            const buttons = document.querySelectorAll('.furisode-category-btn');
            buttons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.backgroundColor = 'white';
                btn.style.color = '#859A93';
            });
            
            // 更新触发按钮的状态
            if (targetButton) {
                targetButton.classList.add('active');
                targetButton.style.backgroundColor = '#859A93';
                targetButton.style.color = 'white';
            } else {
                // 如果没有 event，找到对应的按钮
                buttons.forEach(btn => {
                    const onclickAttr = btn.getAttribute('onclick');
                    if (onclickAttr && onclickAttr.includes(`'${type}'`)) {
                        btn.classList.add('active');
                        btn.style.backgroundColor = '#859A93';
                        btn.style.color = 'white';
                    }
                });
            }

            // 篩選照片
            const photos = document.querySelectorAll('.furisode-photo');
            photos.forEach(photo => {
                if (type === 'all' || photo.dataset.furisodeType === type) {
                    photo.style.display = 'block';
                } else {
                    photo.style.display = 'none';
                }
            });
        }

        /**
         * 渲染 - 常見問題 (*** 完整版 ***)
         */
        function renderFaq() {
            const content = `
                

                <div class="faq-container">
                    <!-- 分類選擇按鈕 -->
                    <div class="faq-sidebar">
                        <div class="faq-category-filter">
                            <button class="faq-filter-btn active" data-category="全部" onclick="filterFaqCategory('全部')">${t('全部')}</button>
                            <button class="faq-filter-btn" data-category="預約相關資訊" onclick="filterFaqCategory('預約相關資訊')">${t('預約相關資訊')}</button>
                            <button class="faq-filter-btn" data-category="和服及髮型設計" onclick="filterFaqCategory('和服及髮型設計')">${t('和服及髮型設計')}</button>
                            <button class="faq-filter-btn" data-category="歸還相關資訊" onclick="filterFaqCategory('歸還相關資訊')">${t('歸還相關資訊')}</button>
                            <button class="faq-filter-btn" data-category="其他常見問題" onclick="filterFaqCategory('其他常見問題')">${t('其他常見問題')}</button>
                                </div>
                                </div>
                    
                    <div class="faq-list">
                        <div class="faq-content">
                    <!-- 預約相關資訊 -->
                        <div class="faq-category-section" data-category="預約相關資訊">
                            <h2 style="font-size: 1.25rem; font-weight: 600; color: #544739; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif; text-align: center;">${t('預約相關資訊')}</h2>
                            <div class="faq-item-wrapper" data-category="預約相關資訊">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('可以當日預約嗎')}</div>
                                        <div class="faq-arrow">›</div>
                            </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('建議提前預約！但若當天有空檔，也可接受預約。')}</p>
                                </div>
                            </div>
                            <div class="faq-item-wrapper" data-category="預約相關資訊">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('可以預留和服嗎')}</div>
                                        <div class="faq-arrow">›</div>
                                </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('非常歡迎！您可以提前預約並預留喜歡的和服款式。建議提前聯繫我們以確保您心儀的款式可用。')}</p>
                                </div>
                            </div>
                            <div class="faq-item-wrapper" data-category="預約相關資訊">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('最早可以預約幾點')}</div>
                                        <div class="faq-arrow">›</div>
                                    </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('我們最早可接受早上6:00的預約。')}</p>
                                </div>
                            </div>
                            <div class="faq-item-wrapper" data-category="預約相關資訊">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('取消預約會被收取額外費用嗎')}</div>
                                        <div class="faq-arrow">›</div>
                        </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('提前24小時取消預約不會收取費用。但當日取消將酌收部分費用。')}</p>
                                </div>
                            </div>
                            <div class="faq-item-wrapper" data-category="預約相關資訊">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('有什麼付款方式')}</div>
                                        <div class="faq-arrow">›</div>
                                </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('我們接受現金以及微信支付。')}</p>
                                </div>
                            </div>
                                </div>

                        <!-- 和服及髮型設計 -->
                        <div class="faq-category-section" data-category="和服及髮型設計">
                            <h2 style="font-size: 1.25rem; font-weight: 600; color: #544739; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif; text-align: center;">${t('和服及髮型設計')}</h2>
                            <div class="faq-item-wrapper" data-category="和服及髮型設計">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('穿著和服加做髮型需要多長時間')}</div>
                                        <div class="faq-arrow">›</div>
                                </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('穿著和服以及髮型設計約需1小時左右。')}</p>
                                </div>
                            </div>
                            <div class="faq-item-wrapper" data-category="和服及髮型設計">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('需要準備什麼東西嗎')}</div>
                                        <div class="faq-arrow">›</div>
                        </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('不需要特別準備！冬天建議可以穿著 V/U領發熱衣 及 七分發熱褲。')}</p>
                                </div>
                            </div>
                            <div class="faq-item-wrapper" data-category="和服及髮型設計">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('有幾種髮型可以選擇')}</div>
                                        <div class="faq-arrow">›</div>
                                </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('本店提供8種免費髮型，也有需要額外加購的日本髮型，如需加購請提前預約。')}</p>
                                </div>
                            </div>
                            <div class="faq-item-wrapper" data-category="和服及髮型設計">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('和服弄髒怎麼辦')}</div>
                                        <div class="faq-arrow">›</div>
                                </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('請在歸還和服時告知工作人員，如有輕微污漬，我們會協助處理。若造成嚴重損壞或無法清除的污漬，可能需要支付清潔費或賠償費用。')}</p>
                                </div>
                            </div>
                            <div class="faq-item-wrapper" data-category="和服及髮型設計">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('有化妝服務嗎')}</div>
                                        <div class="faq-arrow">›</div>
                        </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('本店提供日系淡妝服務¥5500，如需預約請提前告知。')}</p>
                                </div>
                            </div>
                                </div>

                        <!-- 歸還相關資訊 -->
                        <div class="faq-category-section" data-category="歸還相關資訊">
                            <h2 style="font-size: 1.25rem; font-weight: 600; color: #544739; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif; text-align: center;">${t('歸還相關資訊')}</h2>
                            <div class="faq-item-wrapper" data-category="歸還相關資訊" id="return-time-faq">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('最晚幾點前要歸還')}</div>
                                        <div class="faq-arrow">›</div>
                                </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('當日17:30前需歸還。如需隔日歸還，可免費隔日中午12:00前歸還（需付押金¥10,000）。')}</p>
                                </div>
                            </div>
                            <div class="faq-item-wrapper" data-category="歸還相關資訊" id="cross-store-return-faq">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('可以在不同店鋪歸還嗎')}</div>
                                        <div class="faq-arrow">›</div>
                                </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('可以！')}<a href="#access" onclick="renderAccess(); return false;" style="color: #7d2e2e; text-decoration: underline; font-weight: 700;">${t('祇園店')}</a>${t('和')}<a href="#access" onclick="renderAccess(); return false;" style="color: #7d2e2e; text-decoration: underline; font-weight: 700;">${t('清水寺店')}</a>${t('皆可歸還，讓您的行程安排更自由。')}</p>
                                </div>
                            </div>
                            <div class="faq-item-wrapper" data-category="歸還相關資訊">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('延遲歸還會被額外收費嗎')}</div>
                                        <div class="faq-arrow">›</div>
                        </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('若超過歸還時間未歸還且未提前聯繫，可能會收取延遲費用。請務必提前聯繫我們安排延遲歸還。')}</p>
                                </div>
                            </div>
                            <div class="faq-item-wrapper" data-category="歸還相關資訊">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('可以寄放行李在店裡嗎')}</div>
                                        <div class="faq-arrow">›</div>
                                </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('可以！我們提供行李寄存服務，讓您輕鬆享受和服體驗，無需擔心隨身物品的存放問題。')}</p>
                                </div>
                            </div>
                                </div>
                        
                        <!-- 其他常見問題 -->
                        <div class="faq-category-section" data-category="其他常見問題">
                            <h2 style="font-size: 1.25rem; font-weight: 600; color: #544739; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif; text-align: center;">${t('其他常見問題')}</h2>
                            <div class="faq-item-wrapper" data-category="其他常見問題">
                                <div class="faq-card" onclick="toggleFaqCard(this)">
                                    <div class="faq-card-content">
                                        <div class="faq-q-icon">Q</div>
                                        <div class="faq-question-text">${t('孕期可以租借和服嗎')}</div>
                                        <div class="faq-arrow">›</div>
                                </div>
                                </div>
                                <div class="faq-answer">
                                    <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0;">${t('不建議懷孕期間租借和服。和服穿著需要束腰，可能對孕婦造成不適。為了您的健康與安全，建議待產後再來體驗和服服務。')}</p>
                                </div>
                            </div>
                                </div>
                                </div>
                            </div>
                                </div>
                    
                    <!-- 底部聯繫信息 -->
                    <div class="faq-contact">
                        <span class="faq-contact-text">${t('如有其他問題，歡迎聯繫')}</span>
                        <a href="https://www.instagram.com/Niconico_kimono" target="_blank" rel="noopener noreferrer" class="faq-contact-link">@niconico_kimono</a>
                    </div>
                </div>
            `;
            renderStaticPage(t('常見問題'), content, 'FAQ', false, 'faq');
        }

        /**
         * 渲染 - 交通資訊
         */
        function renderAccess() {
            console.log('📝 開始渲染交通資訊...');
            const content = `
                

                <p style="text-align: center; font-size: 0.95rem; color: #544739; margin-bottom: 2.5rem; line-height: 2; font-family: 'Noto Serif TC', serif; letter-spacing: 0.05em;">
                    ${t('距離清水寺、八阪神社、二年坂、三年坂步行皆可達，地理位置極佳')}
                </p>

                <div class="access-card">
                    <div class="access-card-title">${t('【祇園店】')}</div>
                    <div class="access-info">
                        <p style="font-weight: 600; color: #544739; margin-bottom: 0.5rem;">${t('地址')}</p>
                        <p>〒605-0066<br>${t('京都市東山區石橋町307-9')}</p>
                    </div>
                    <div class="access-info" style="margin-bottom: 1.5rem;">
                        <iframe src="https://www.google.com/maps?q=京都市東山区石橋町307-9&output=embed&zoom=16&hl=${currentLang === 'en' ? 'en' : currentLang === 'ja' ? 'ja' : 'zh-TW'}" width="100%" height="300" style="border:0; border-radius: 8px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    <div class="access-info">
                        <p style="font-weight: 600; color: #544739; margin-bottom: 0.5rem;">${t('交通方式：')}</p>
                        <p>
                            <svg class="transport-icon" viewBox="0 0 24 24" fill="none" stroke="#859A93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                                <path d="M4 8h16M8 4v4"></path>
                            </svg>
                            <span class="transport-info">${t('搭乘巴士 46、86、201、202、203、206號，於「知恩院前」站下車，步行 1 分鐘。')}</span>
                        </p>
                        <p style="margin-top: 0.5rem;">
                            <svg class="transport-icon" viewBox="0 0 24 24" fill="none" stroke="#859A93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="3" x2="9" y2="21"></line>
                                <line x1="3" y1="9" x2="21" y2="9"></line>
                            </svg>
                            <span class="transport-info">${t('地下鐵東西線「東山駅」2號出口出站，步行約9分鐘。')}</span>
                        </p>
                    </div>
                </div>

                <div class="access-card">
                    <div class="access-card-title">${t('【清水寺店】')}</div>
                    <div class="access-info">
                        <p style="font-weight: 600; color: #544739; margin-bottom: 0.5rem;">${t('地址')}</p>
                        <p>〒605-0846<br>${t('京都府京都市東山區五條橋東6丁目583-70')}</p>
                    </div>
                    <div class="access-info" style="margin-bottom: 1.5rem;">
                        <iframe src="https://www.google.com/maps?q=京都府京都市東山区五条橋東6丁目583-70&output=embed&zoom=16&hl=${currentLang === 'en' ? 'en' : currentLang === 'ja' ? 'ja' : 'zh-TW'}" width="100%" height="300" style="border:0; border-radius: 8px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    <div class="access-info">
                        <p style="font-weight: 600; color: #544739; margin-bottom: 0.5rem;">${t('交通方式：')}</p>
                        <p>
                            <svg class="transport-icon" viewBox="0 0 24 24" fill="none" stroke="#859A93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                                <path d="M4 8h16M8 4v4"></path>
                            </svg>
                            <span class="transport-info">${t('搭乘巴士 80、86、106、202、206、207號，於「五條坂」站下車，步行 5 分鐘。')}</span>
                        </p>
                    </div>
                </div>
            `;
            renderStaticPage(t('交通資訊'), content, 'Access', true, 'access');
        }

        // 路由處理
        function handleRoute() {
            const hash = window.location.hash.slice(1);
            console.log('🔀 處理路由:', hash || '(首頁)');
            
            // 移除透明導航欄樣式和白色背景樣式（如果存在）
            const header = document.querySelector('header');
            if (header) {
                header.classList.remove('photo-plans-navbar-transparent');
            }
            const app = document.getElementById('app');
            const content = document.getElementById('content');
            if (app) {
                app.classList.remove('photo-plans-white-bg');
            }
            if (content) {
                content.classList.remove('photo-plans-white-bg');
            }
            
            if (hash.startsWith('plan/')) {
                const planId = hash.split('/')[1];
                console.log('📄 渲染方案詳情:', planId);
                renderPlanDetail(planId);
            } else if (hash.startsWith('album/')) {
                const albumId = hash.split('/')[1];
                console.log('📸 渲染相簿詳情:', albumId);
                renderAlbumDetail(albumId);
            } else if (hash === 'kimono-plans') {
                console.log('👘 渲染和服方案頁面');
                renderKimonoPlans();
            } else if (hash === 'photo-plans') {
                console.log('📷 渲染攝影方案頁面');
                renderPhotoPlans();
            } else if (hash === 'tea-room') {
                console.log('🍵 渲染茶室頁面');
                renderTeaRoom();
            } else if (hash === 'store-intro') {
                console.log('🏪 渲染店內介紹頁面');
                renderStoreIntro();
            } else if (hash === 'reviews') {
                console.log('📸 渲染照片庫頁面');
                renderReviews();
            } else if (hash === 'faq') {
                console.log('❓ 渲染常見問題頁面');
                renderFaq();
            } else if (hash === 'access') {
                console.log('📍 渲染交通資訊頁面');
                renderAccess();
            } else if (hash === 'hairstyle') {
                console.log('💇 渲染髮型設計頁面');
                renderHairstyle();
            } else {
                console.log('🏠 渲染首頁');
                renderHome();
            }
        }

        // 將 handleRoute、switchLanguage 和 initScrollFadeIn 暴露到全域作用域
        // 讓全域的 onclick 事件能夠呼叫
        window.handleRoute = handleRoute;
        window.switchLanguage = switchLanguage;

        // 手機版漢堡選單
        window.toggleMobileMenu = function() {
            var menu = document.getElementById('mobile-menu');
            var hamburger = document.getElementById('hamburger-icon');
            var closeIcon = document.getElementById('close-icon');
            if (!menu) return;
            var isOpen = menu.style.display !== 'none';
            menu.style.display = isOpen ? 'none' : 'block';
            if (hamburger) hamburger.style.display = isOpen ? 'block' : 'none';
            if (closeIcon) closeIcon.style.display = isOpen ? 'none' : 'block';
        };
        window.closeMobileMenu = function() {
            var menu = document.getElementById('mobile-menu');
            var hamburger = document.getElementById('hamburger-icon');
            var closeIcon = document.getElementById('close-icon');
            if (menu) menu.style.display = 'none';
            if (hamburger) hamburger.style.display = 'block';
            if (closeIcon) closeIcon.style.display = 'none';
        };

        // 滾動淡入淡出效果
        let scrollObserver = null;
        
        function initScrollFadeIn() {
            // 如果已經有觀察器，先斷開所有觀察
            if (scrollObserver) {
                scrollObserver.disconnect();
            }
            
            // 使用 Intersection Observer 來檢測元素進入視窗
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -50px 0px', // 當元素距離視窗底部 50px 時觸發
                threshold: 0.1 // 當元素 10% 可見時觸發
            };
            
            scrollObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, observerOptions);
            
            // 為所有需要淡入效果的元素添加觀察
            function observeElements() {
                const elementsToObserve = document.querySelectorAll('.content-section, .top5-section, .menu-price-section, .home-kimono-card, .kimono-plan-card, .feature-service-item, .photo-plans-about-section, .photo-plans-service-card, .photo-plans-about-container, .photo-plans-service-grid, #photo-plans-portfolio, .photo-bottom-carousel-container');
                elementsToObserve.forEach(el => {
                    // 重置狀態（如果之前已經淡入過）
                    el.classList.remove('fade-in');
                    if (!el.classList.contains('fade-in-on-scroll')) {
                        el.classList.add('fade-in-on-scroll');
                    }
                    scrollObserver.observe(el);
                });
            }
            
            // 延遲一下確保 DOM 已更新
            setTimeout(observeElements, 100);
        }

        window.initScrollFadeIn = initScrollFadeIn;

        // 重新綁定所有事件（在組件加載後調用）
        function rebindAllEvents() {
            console.log('重新綁定所有事件...');
            
            // 重新綁定導航欄事件（如果需要）
            // 導航欄使用 href 鏈接，不需要額外綁定
            
            // 確保所有全局函數都已定義
            // openLightbox, filterFurisode, toggleFaq 等已經在 window 對象上
            
            console.log('✓ 事件重新綁定完成');
        }
        
        // 初始化函數
        function initializeApp() {
            console.log('初始化應用程式...');
            
            // 啟動 Cloudinary MutationObserver（自動攔截所有新增的 img 標籤）
            _initCloudinaryObserver();
            if (isCloudinaryEnabled()) {
                console.log('☁️ Cloudinary 已啟用 — Cloud Name:', _cloudCfg.cloudName);
            }
            
            // 重新綁定事件
            rebindAllEvents();
            
            // 處理路由
            handleRoute();
            
            // Cloudinary：處理首次渲染中已存在的圖片
            cloudifyAllImages();
            
            // 初始化滾動淡入效果
            initScrollFadeIn();
            
            console.log('✓ 應用程式初始化完成');
        }
        
            // 監聽組件插入事件
            window.addEventListener('componentInserted', function() {
                rebindAllEvents();
            });

        // 監聽路由變化
        window.addEventListener('hashchange', function() {
            handleRoute();
            // 路由變化後處理 Cloudinary 圖片（MutationObserver 可能漏掉 innerHTML 替換的情況）
            setTimeout(cloudifyAllImages, 100);
            // 路由變化後重新初始化淡入效果
            initScrollFadeIn();
        });
        
            // 初始化預約 Modal
            initBookingModal();
            
            // 初始化應用
            initializeApp();
            
            console.log('✅ 應用程式初始化完成');
        }
        
        // ====================================================
        // 預約表單 Modal 功能
        // ====================================================
        
        // 打開預約 Modal
        window.openBookingModal = function() {
            const modal = document.getElementById('booking-modal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // 防止背景滾動
                
                // 設置日期輸入的最小值為今天
                const dateInput = document.getElementById('booking-date');
                if (dateInput) {
                    const today = new Date().toISOString().split('T')[0];
                    dateInput.setAttribute('min', today);
                }
                
                // 重置表單和顯示狀態
                const form = document.getElementById('booking-form');
                const formContent = document.getElementById('booking-form-content');
                const successMessage = document.getElementById('booking-success-message');
                
                if (form) {
                    form.reset();
                }
                if (formContent) {
                    formContent.style.display = 'block';
                }
                if (successMessage) {
                    successMessage.style.display = 'none';
                }
            } else {
                console.error('❌ 找不到預約 Modal 元素');
            }
        };
        
        // 關閉預約 Modal
        window.closeBookingModal = function() {
            const modal = document.getElementById('booking-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // 恢復滾動
                
                // 重置表單和顯示狀態
                const form = document.getElementById('booking-form');
                const formContent = document.getElementById('booking-form-content');
                const successMessage = document.getElementById('booking-success-message');
                
                if (form) {
                    form.reset();
                }
                if (formContent) {
                    formContent.style.display = 'block';
                }
                if (successMessage) {
                    successMessage.style.display = 'none';
                }
            }
        };
        
        // 處理表單提交 - 保證發送版
        window.handleBookingSubmit = function(event) {
            // 防卡死機制：阻止表單預設提交行為
            event.preventDefault();
            
            const form = event.target;
            const submitButton = form.querySelector('button[type="submit"]');
            const formContent = document.getElementById('booking-form-content');
            const successMessage = document.getElementById('booking-success-message');
            
            // 獲取表單數據
            const name = document.getElementById('booking-name').value.trim();
            const store = document.getElementById('booking-store').value;
            const date = document.getElementById('booking-date').value;
            const timeSelect = document.getElementById('booking-time');
            const timeValue = timeSelect.value;
            const people = document.getElementById('booking-people').value;
            const email = document.getElementById('booking-email').value.trim();
            const message = document.getElementById('booking-message').value.trim();
            
            // 將日期拆分為年、月、日
            const dateParts = date.split('-');
            const dateYear = dateParts[0];
            const dateMonth = dateParts[1];
            const dateDay = dateParts[2];
            
            // 將時間拆分為小時和分鐘（去除前導零）
            const [hourStr, minuteStr] = timeValue.split(':');
            const hour = parseInt(hourStr, 10).toString();
            const minute = parseInt(minuteStr, 10).toString();
            
            // Google Forms 提交網址
            const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf872SQo2I-uXkn0ryhR0kpkW8-RzA3aoZK14b-cetKAw7tAA/formResponse';
            
            // 構建 URLSearchParams（根據最新截圖的字段映射）
            const params = new URLSearchParams();
            params.append('entry.281622848', name); // 姓名
            params.append('entry.1525533651', store); // 預約店鋪
            params.append('entry.156307657_year', dateYear); // 日期-年
            params.append('entry.156307657_month', dateMonth); // 日期-月
            params.append('entry.156307657_day', dateDay); // 日期-日
            params.append('entry.1467094571_hour', hour); // 時間-小時
            params.append('entry.1467094571_minute', minute); // 時間-分鐘
            params.append('entry.309499366', people); // 人數
            params.append('entry.66004767', email); // 電子郵件
            if (message) {
                params.append('entry.1782942840', message); // 備註
            }
            
            // 調試日誌
            console.log('📤 準備提交到 Google Forms (保證發送版):');
            console.log('  URL:', googleFormUrl);
            console.log('  姓名 (entry.281622848):', name);
            console.log('  預約店鋪 (entry.1525533651):', store);
            console.log('  日期 (entry.156307657):', dateYear, dateMonth, dateDay);
            console.log('  時間 (entry.1467094571):', hour, minute);
            console.log('  人數 (entry.309499366):', people);
            console.log('  電子郵件 (entry.66004767):', email);
            console.log('  備註 (entry.1782942840):', message || '(無)');
            
            // 禁用提交按鈕
            submitButton.disabled = true;
            submitButton.textContent = t('送出中...');
            
            // 使用 fetch 提交（no-cors 模式）
            fetch(googleFormUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            })
            .then(() => {
                console.log('✓ Fetch 請求已發送');
            })
            .catch(error => {
                console.error('❌ Fetch 請求錯誤:', error);
            });
            
            // 保證發送版：不管 Google 回傳什麼，只要 fetch 指令發出去，就立刻顯示成功訊息
            console.log('✅ 立即顯示成功訊息（保證發送版）');
            
            // 隱藏表單，顯示成功訊息
            if (formContent) {
                formContent.style.display = 'none';
            }
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            
            // 清空表單
            form.reset();
            
            // 恢復按鈕狀態
            submitButton.disabled = false;

            submitButton.textContent = t('送出預約');
            
            // 3秒後自動關閉 Modal
            setTimeout(() => {
                closeBookingModal();
            }, 3000);
        };
        
        // 顯示預約訊息（成功/錯誤）
        function showBookingMessage(message, type) {
            // 移除現有的訊息
            const existingMessage = document.getElementById('booking-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // 創建訊息元素
            const messageDiv = document.createElement('div');
            messageDiv.id = 'booking-message';
            messageDiv.className = `booking-message booking-message-${type}`;
            messageDiv.textContent = message;
            
            // 插入到表單中
            const form = document.getElementById('booking-form');
            if (form) {
                form.insertBefore(messageDiv, form.firstChild);
                
                // 3秒後自動移除（成功訊息）或 5秒後移除（錯誤訊息）
                const timeout = type === 'success' ? 3000 : 5000;
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, timeout);
            }
        }
        
        // 初始化預約 Modal
        function initBookingModal() {
            // 點擊 Modal 外部關閉
            const modal = document.getElementById('booking-modal');
            if (modal) {
                // 按 ESC 鍵關閉
                document.addEventListener('keydown', function(event) {
                    if (event.key === 'Escape') {
                        const modal = document.getElementById('booking-modal');
                        if (modal && modal.classList.contains('active')) {
                            closeBookingModal();
                        }
                    }
                });
                
                console.log('✓ 預約 Modal 初始化完成');
            } else {
                console.warn('⚠️ 預約 Modal 元素尚未載入，將在組件載入後重新初始化');
            }
        }
        
        // 底部照片輪播功能
        function initPhotoBottomCarousel() {
            const carouselTrack = document.querySelector('.photo-bottom-carousel-track');
            if (!carouselTrack) return;
            
            let currentIndex = 0;
            const itemsPerView = 6; // 一次顯示 6 張
            const totalItems = carouselTrack.children.length;
            const itemWidth = 100 / itemsPerView; // 每張照片的寬度百分比
            
            // 自動輪播函數
            function slideNext() {
                currentIndex++;
                // 如果已經到最後一組，回到開頭（實現無限循環）
                if (currentIndex > totalItems - itemsPerView) {
                    currentIndex = 0;
                }
                const translateX = -(currentIndex * itemWidth);
                carouselTrack.style.transform = `translateX(${translateX}%)`;
            }
            
            // 每 2 秒自動切換
            let carouselInterval = setInterval(slideNext, 2000);
            
            // 當鼠標懸停時暫停自動輪播
            const carouselContainer = document.querySelector('.photo-bottom-carousel-container');
            if (carouselContainer) {
                carouselContainer.addEventListener('mouseenter', () => {
                    clearInterval(carouselInterval);
                });
                carouselContainer.addEventListener('mouseleave', () => {
                    carouselInterval = setInterval(slideNext, 2000);
                });
            }
        }
        
        // ====================================================
        // 等待組件完全加載後才初始化應用
        // ====================================================
        if (typeof window !== 'undefined') {
            // 監聽組件加載完成事件
            window.addEventListener('componentsLoaded', function(event) {
                console.log('📦 組件加載完成，開始初始化應用程式');
                if (event.detail && event.detail.errors && event.detail.errors.length > 0) {
                    console.warn('⚠️ 部分組件加載失敗:', event.detail.errors);
                    console.warn('   但將繼續初始化應用程式');
                }
                // 確保 DOM 完全準備好，且翻譯檔已載入
                setTimeout(async function() {
                    await translationsReady;
                    // 初始化 data-lang 和 html lang 屬性
                    const langMap = { 'ja': 'ja', 'en': 'en', 'zh-TW': 'zh-TW' };
                    document.documentElement.lang = langMap[currentLang] || 'zh-TW';
                    document.body.dataset.lang = currentLang;
                    initApp();
                    // 初始化語言狀態：翻譯靜態 HTML 組件並更新語言切換按鈕
                    updateLangToggleUI();
                    translateStaticComponents();
                }, 100);
            });
            
            // 備用方案：如果事件已經觸發（在監聯器註冊之前）
            if (document.readyState === 'complete') {
                setTimeout(async function() {
                    const contentDiv = document.getElementById('content');
                    if (contentDiv && contentDiv.innerHTML.includes('載入中')) {
                        console.log('⚠️ 檢測到載入中狀態，執行備用初始化');
                        // 檢查組件是否已加載
                        const navbar = document.querySelector('header');
                        if (navbar) {
                            console.log('✓ 檢測到組件已加載，執行初始化');
                            await translationsReady;
                            const langMap2 = { 'ja': 'ja', 'en': 'en', 'zh-TW': 'zh-TW' };
                            document.documentElement.lang = langMap2[currentLang] || 'zh-TW';
                            document.body.dataset.lang = currentLang;
                            initApp();
                            updateLangToggleUI();
                            translateStaticComponents();
                        } else {
                            console.log('⏳ 等待組件加載...');
                        }
                    }
                }, 1000);
            }
        }