# URLShortener

A lightweight self-hosted URL shortener built with `Express` and `Firebase Realtime Database`.
It supports both fast link creation and day-to-day link management from a built-in dashboard.

![URLShortener Overview / URLShortener 概覽](./static/img/overview.png)

## Introduction

`URLShortener` is designed to solve two problems in one service:

- Create short links quickly from the home page
- Manage links later from a dashboard (search, copy, delete, and view clicks)

This project is a practical starter for internal tools, campaign links, and personal side projects.

## Features

- Create short URLs: `POST /new` and `POST /new/`
- URL validation: only accepts `http://` and `https://`
- Unique short code generation with collision checks
- Redirect by short code: `GET /:shortURL`
- Click counting on each redirect
- Dashboard UI: `GET /dashboard`
- Management APIs:
  - List all URLs: `GET /api/urls`
  - Delete a URL: `DELETE /api/urls/:shortURL`

## Setup

1. Copy environment file:

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

Default server URL: `http://localhost:3000`

## Pages

- Home (create short URL): `GET /`
- Dashboard (manage URLs): `GET /dashboard`

## API Examples

### Create short URL

`POST /new`

Request body:

```json
{
  "originalURL": "https://example.com/article/123"
}
```

Success (`201`):

```json
{
  "shortURL": "abc123xyz0"
}
```

### List URLs

`GET /api/urls`

Success (`200`):

```json
{
  "items": [
    {
      "shortURL": "abc123xyz0",
      "originalURL": "https://example.com/article/123",
      "clicks": 5,
      "createdAt": 1730000000000,
      "lastAccessedAt": 1730000050000
    }
  ]
}
```

### Delete URL

`DELETE /api/urls/:shortURL`

Success: `204 No Content`

## Tech Stack

- Node.js
- Express
- Firebase Realtime Database
- Nano ID
