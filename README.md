# URLShortener

使用 `Express` + `Firebase Realtime Database` 的短網址服務。

## Features

- 建立短網址（`POST /new` 或 `POST /new/`）
- 驗證輸入網址（只接受 `http://`、`https://`）
- 自動產生短碼並檢查碰撞
- 依短碼導向原始網址（`GET /:shortURL`）
- 前端頁面可直接輸入網址並取得短連結（`GET /`）

## Getting Started

1. 複製環境變數：

```bash
cp .env.example .env
```

2. 設定 Firebase 相關參數到 `.env`

3. 安裝套件：

```bash
npm install
```

## Run

開發模式：

```bash
npm run dev
```

正式模式：

```bash
npm run start
```

## API

### `POST /new`

Request body:

```json
{
  "originalURL": "https://example.com"
}
```

成功回應（201）：

```json
{
  "shortURL": "generatedCode"
}
```

### `GET /:shortURL`

- 成功：302 redirect 到原始網址
- 失敗：回傳 404 JSON 錯誤
