#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║            🚀 Niconico Kyoto — 一鍵部署腳本                  ║
# ╠══════════════════════════════════════════════════════════════╣
# ║                                                              ║
# ║  使用方式：./deploy.sh                                       ║
# ║  可選參數：./deploy.sh "自訂 commit 訊息"                    ║
# ║                                                              ║
# ║  執行流程：                                                  ║
# ║    1. 壓縮圖片（新圖片自動縮至 1920px / ~500KB）             ║
# ║    2. 更新照片資料庫（photos.js）                            ║
# ║    3. Git add → commit → push                               ║
# ║                                                              ║
# ╚══════════════════════════════════════════════════════════════╝

set -e  # 任何步驟失敗就立即停止

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🚀 Niconico Kyoto 一鍵部署            ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"
echo ""

# 切換到腳本所在目錄（確保從任何位置執行都能正常運作）
cd "$(dirname "$0")"

# ─── Step 1：壓縮圖片 ───────────────────────────────
echo -e "${YELLOW}[1/4]${NC} 🖼️  壓縮新增圖片..."
node scripts/optimize-images.js
echo ""

# ─── Step 2：更新照片資料庫 ──────────────────────────
echo -e "${YELLOW}[2/4]${NC} 📋 更新照片資料庫 (photos.js)..."
node update-photos.js
echo ""

# ─── Step 3：Git 提交 ───────────────────────────────
COMMIT_MSG="${1:-Auto update photos and content}"

echo -e "${YELLOW}[3/4]${NC} 📦 Git 提交..."
git add .

# 檢查是否有變更需要提交
if git diff --cached --quiet; then
    echo -e "${GREEN}   ✓ 沒有新的變更需要提交${NC}"
else
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}   ✓ 已提交：${COMMIT_MSG}${NC}"
fi
echo ""

# ─── Step 4：推送到遠端 ─────────────────────────────
echo -e "${YELLOW}[4/4]${NC} ☁️  推送到 GitHub..."
git push -u origin main 2>/dev/null || git push
echo ""

# ─── 完成 ───────────────────────────────────────────
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ 部署完成！                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
