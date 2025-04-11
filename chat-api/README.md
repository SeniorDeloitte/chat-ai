# Chat AI API

This is a Chat AI API built using Hono, Stream Chat, and Google GenAI. It provides endpoints for user registration and chat interactions with an AI model.

## Prerequisites

- [Bun](https://bun.sh/) (for running the application)
- Node.js (for managing dependencies and environment variables)
- A Stream Chat account (API key and secret required)
- A Google GenAI API key

## Installation

To install dependencies:

```sh
bun install
```

## Running the Application

To start the development server:

```sh
bun run dev
```

The application will be available at:

```
http://localhost:3000
```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
STREAM_API_KEY=<your-stream-api-key>
STREAM_API_SECRET=<your-stream-api-secret>
GEMINI_API_KEY=<your-google-genai-api-key>
```

## API Endpoints

### 1. User Registration

**POST** `/user-register`

Registers a new user in the system.

#### Request Parameters:

- `name` (string): The name of the user.
- `email` (string): The email of the user.

#### Response:

- `200 OK`: User successfully registered.
- `400 Bad Request`: Missing required parameters.
- `500 Internal Server Error`: Error during user registration.

### 2. Chat with AI

**POST** `/chat`

Sends a message to the AI and receives a response.

#### Request Body:

```json
{
  "userId": "<user-id>",
  "message": "<message>"
}
```

#### Response:

- `200 OK`: AI response.
- `400 Bad Request`: Missing required parameters.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Error during message processing.

## Project Structure

```
chat-api/
├── src/
│   ├── database.ts
│   ├── index.ts
│   ├── users.ts
│   ├── features/
│   │   ├── users/
│   │   │   ├── usersApp.ts
│   │   │   └── userService.ts
│   └── services/
│       └── userService.ts
├── database.sqlite
├── package.json
├── tsconfig.json
└── README.md
```

## License

This project is licensed under the MIT License.
