# Justification API

## Description

The Justification API is a RESTful service that justifies a given text input according to typographical standards. The service ensures that the lines of text are formatted to a maximum length of 80 characters. This project is built using Node.js with TypeScript and is designed to handle user authentication and rate limiting.

## Table of Contents

- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Rate Limiting](#rate-limiting)
- [Authentication](#authentication)
- [Testing](#testing)
- [License](#license)

## Features

- Justifies text input to 80-character lines.
- Authentication via unique token.
- Rate limiting of 80,000 words per day per token.
- No external libraries used for justification logic.
- Well-structured code with documentation and tests.

## API Endpoints

### 1. Generate Token

**Endpoint:** `/api/token`  
**Method:** `POST`  
**Content-Type:** `application/json`  
**Body:**

```json
{
  "email": "foo@bar.com"
}
```

**Response:**

- On success: Returns a unique token.
- On error: Returns an error message.

### 2. Justify Text

**Endpoint:** `/api/justify`

**Method:** `POST`

**Content-Type:** `text/plain`

**Body:** (plain text to be justified)

**Response:**

- On success: Returns justified text.
- On error (e.g., exceeding word limit): Returns error 402 Payment Required.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/NehemieMbg/text-justifier.git
   cd apps/server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Environment Variables:

   To configure the application, create a .env file in the root of the project with the following variables:

   ```env

   # Database variables
   DATABASE_URL
   # or
   DATABASE_HOST=
   DATABASE_PORT=
   DATABASE_USERNAME=
   DATABASE_PASSWORD=
   DATABASE=

   # JWT Token variables
   JWT_SECRET=
   # only for tests
   ACCESS_TOKEN=
   ```

## Usage

1. Start the server:

   ```bash
   npm run start
   ```

2. Use an API client like Postman or curl to interact with the endpoints.

## Rate Limiting

The API enforces a rate limit of 80,000 words per token per day. If a user exceeds this limit, the API will return a `402 Payment Required` error.

## Authentication

To access the `/api/justify` endpoint, you must first generate a token by calling the `/api/token` endpoint with your email. Include this token in the headers of your request to the justify endpoint.

## Testing

This project includes unit tests to ensure the functionality of the API. To run the tests, use:

```bash
npm run test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
