# Car+ 二手精品車

以行動裝置為主的二手車展示與商家管理 Web App。買家可像短影音一樣垂直滑動瀏覽車輛、搜尋篩選與收藏；車商可在後台新增、編輯與下架車源，變更會即時反映在用戶端。

## 功能概覽

### 用戶端（`/`）

| 分頁 | 說明 |
|------|------|
| **瀏覽** | 全螢幕垂直滑動車輛牆（類短影音體驗），支援左右滑動切換多張圖片、收藏、點擊進入詳情 |
| **搜尋** | 關鍵字與價格、變速箱、燃料、車況等條件篩選 |
| **收藏** | 收藏清單（資料存於瀏覽器 `localStorage`） |

車輛詳情頁提供規格、配備、圖片輪播，以及聯絡／洽詢入口（示範用 UI）。

### 商家後台（`/merchant`）

| 分頁 | 說明 |
|------|------|
| **儀表板** | 車輛總數、可售／已售、總瀏覽、平均售價等統計 |
| **車輛管理** | 列表檢視、編輯、刪除、切換可售狀態 |
| **新增車輛** | 表單建立或編輯車源（含圖片 URL、配備等） |

示範登入密碼：`dealer168`（定義於 `components/merchant/MerchantLogin.tsx`）。

## 技術棧

- **前端：** React 19、TypeScript、Vite 6
- **路由：** react-router-dom
- **圖示：** lucide-react
- **樣式：** Tailwind CSS（CDN，`index.html`）
- **資料：** 瀏覽器 `localStorage`（車輛清單與收藏），內建示範車輛資料

## 專案結構

```
├── App.tsx                 # 路由、車輛狀態、localStorage 同步
├── types.ts                # Car、FilterState 型別
├── index.tsx / index.html
├── components/
│   ├── customer/
│   │   ├── CustomerApp.tsx   # 用戶端主殼層與分頁
│   │   ├── CarGallery.tsx    # 垂直滑動車輛牆
│   │   ├── CarDetail.tsx     # 車輛詳情
│   │   └── SearchFilter.tsx  # 搜尋與篩選
│   └── merchant/
│       ├── MerchantLogin.tsx
│       ├── MerchantApp.tsx
│       ├── MerchantDashboard.tsx
│       ├── MerchantListings.tsx
│       └── CarForm.tsx
└── railway.json              # Railway 建置與啟動設定
```

### 資料儲存鍵名

| 鍵名 | 用途 |
|------|------|
| `usedCarSales_v1` | 全站車輛清單（商家編輯後持久化） |
| `carSales_favs` | 用戶收藏車輛 ID 列表 |

首次載入若無本地資料，會使用 `App.tsx` 中的 `DEMO_CARS` 示範資料。

## 本地開發

**需求：** Node.js（建議 18+）

```bash
npm install
npm run dev
```

開發伺服器預設為 `http://localhost:3000`（見 `vite.config.ts`）。

| 指令 | 說明 |
|------|------|
| `npm run dev` | 開發模式 |
| `npm run build` | 建置至 `dist/` |
| `npm run preview` | 預覽建置結果 |
| `npm start` | 以 `serve` 提供靜態檔（供部署，埠號由 `$PORT` 決定） |

## 路由

| 路徑 | 說明 |
|------|------|
| `/` | 用戶端（瀏覽／搜尋／收藏） |
| `/merchant` | 商家登入或後台（登入狀態僅存於目前工作階段） |

## 部署（Railway）

專案已設定 `railway.json`：

1. 建置：`npm run build`
2. 啟動：`npx serve -s dist -l $PORT`

將 repo 連結至 Railway 後，推送即可自動建置與部署靜態站點。

## 車輛資料模型（摘要）

每筆 `Car` 包含：品牌、型號、年份、價格、里程、顏色、變速箱、燃料、車況、描述、圖片陣列、配備、是否可售、建立時間、瀏覽次數等。完整定義見 `types.ts`。

## 備註

- 根目錄下仍有早期 **Cofit 營養 App** 相關檔案（如 `geminiService.ts`、`components/LogFood.tsx`、`AICoach.tsx` 等），**目前未接入** `App.tsx` 主流程，執行 Car+ 不需設定 `GEMINI_API_KEY`。
- `metadata.json` 中的名稱與描述仍為舊專案文案，若用於 AI Studio 等平台可另行更新。
