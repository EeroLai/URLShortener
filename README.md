# URLShortener

A lightweight self-hosted URL shortener built with `Express` and `Firebase Realtime Database`.

English | [繁體中文](./README.zh-TW.md)

![URLShortener Overview](./static/img/overview.png)

## Introduction

`URLShortener` solves two practical needs in one service:

- Create short links quickly on the home page
- Manage links later in a dashboard (search, copy, delete, and view clicks)

## Features

- Create short URLs: `POST /new`, `POST /new/`
- URL validation: only accepts `http://` and `https://`
- Unique short code generation with collision checks
- Redirect by short code: `GET /:shortURL`
- Click counting on each redirect
- Dashboard page: `GET /dashboard`
- Management APIs:
  - List URLs: `GET /api/urls`
  - Delete URL: `DELETE /api/urls/:shortURL`

## Setup

1. Copy env file:

```bash
cp .env.example .env
```

2. Fill Firebase settings in `.env`
3. Install dependencies:

```bash
npm install
```

## Run

Development:

```bash
npm run dev
```

Production:

```bash
npm run start
```

Default URL: `http://localhost:3000`

## Pages

- Home: `GET /`
- Dashboard: `GET /dashboard`

## API Example

Create:

```http
POST /new
```

```json
{
  "originalURL": "https://example.com/article/123"
}
```

```json
{
  "shortURL": "abc123xyz0"
}
```

List:

```http
GET /api/urls
```

Delete:

```http
DELETE /api/urls/:shortURL
```

## Tech Stack

- Node.js
- Express
- Firebase Realtime Database
- Nano ID
