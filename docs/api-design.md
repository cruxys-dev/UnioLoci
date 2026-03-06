# API Design

**Project:** UnioLoci  
**Version:** 1.0  
**Date:** December 12th, 2025  
**Author:** Josué Cruz

---

## 1. Guiding Principles

The UnioLoci API is designed following standard RESTful principles to ensure predictability, consistency, and ease of use.

- **Stateless:** Every request from a client must contain all the information needed by the server to fulfill it. The server will not store any client context between requests.
- **Resource-Oriented:** The API is structured around resources (Calendars, Events, Users) that can be manipulated via standard HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`).
- **JSON for Communication:** All data exchange between the client and server will use JSON.
- **Consistent Naming:** Endpoints and properties use `camelCase` for consistency.
- **Clear Error Messages:** Errors return standard HTTP status codes and a consistent JSON body with a descriptive message.

---

## 2. Authentication

The API is protected and requires a **JSON Web Token (JWT)** for all requests, except for the authentication endpoints themselves.

The token must be sent in the `Authorization` header using the `Bearer` scheme:
`Authorization: Bearer <your_jwt_token>`

The authentication flow is as follows:

1.  The user requests a magic link via `POST /api/v1/auth/magic-link`.
2.  The server sends an email with a single-use, time-limited token.
3.  The user clicks the link, which hits `GET /api/v1/auth/callback?token=<magic_token>`.
4.  The server validates the magic token and returns a session JWT to the client.
5.  The client stores this JWT and uses it for all subsequent API calls.

---

## 3. Versioning

The API is versioned via the URL prefix. The current version is `v1`.

**Base URL:** `/api/v1`

---

## 4. API Endpoints

### Authentication (`/auth`)

- **`POST /auth/magic-link`**
  - **Description:** Initiates the login process by sending a magic link to the user's email.
  - **Body:** `{ "email": "user@example.com" }`
  - **Response (200 OK):** `{ "message": "Login link sent to your email." }`

- **`GET /auth/callback?token={magic_token}`**
  - **Description:** Validates the magic token from the email link and returns a session JWT.
  - **Response (200 OK):** `{ "success": true, "entries": "your_session_jwt" }`

### Users (`/users`)

- **`GET /users/me`**
  - **Description:** Retrieves the authenticated user's profile.
  - **Response (200 OK):** `{ "id": "...", "email": "...", "name": "...", "aiRequestsBalance": 50 }`

- **`PATCH /users/me`**
  - **Description:** Updates the authenticated user's profile.
  - **Body:** `{ "name": "New Name" }`
  - **Response (200 OK):** The updated user object.

- **`DELETE /users/me`**
  - **Description:** Soft-deletes the user's account and removes them from all calendars.
  - **Response (204 No Content):**

### Calendars (`/calendars`)

- **`POST /calendars`**
  - **Description:** Creates a new calendar. The creator is automatically added as a member.
  - **Body:** `{ "name": "Team Sync" }`
  - **Response (201 Created):** The full calendar object.

- **`GET /calendars`**
  - **Description:** Retrieves a list of all calendars the authenticated user is a member of.
  - **Response (200 OK):** `[ { calendar_object_1 }, { calendar_object_2 } ]`

- **`GET /calendars/{calendarId}`**
  - **Description:** Retrieves a single calendar's details.
  - **Response (200 OK):** The full calendar object, including its members.

- **`PATCH /calendars/{calendarId}`**
  - **Description:** Updates a calendar's properties (e.g., its name).
  - **Body:** `{ "name": "New Team Name" }`
  - **Response (200 OK):** The updated calendar object.

- **`DELETE /calendars/{calendarId}`**
  - **Description:** Soft-deletes a calendar. Only the creator can do this.
  - **Response (204 No Content):**

- **`POST /calendars/join`**
  - **Description:** Allows a user to join a calendar using its share token.
  - **Body:** `{ "shareToken": "unique-share-token" }`
  - **Response (200 OK):** The calendar object the user has joined.

- **`POST /calendars/{calendarId}/transfer`**
  - **Description:** Transfers ownership of the calendar to another member. Only the current creator can perform this.
  - **Body:** `{ "newOwnerId": "uuid-of-new-owner" }`
  - **Response (200 OK):** The updated calendar object with the new owner.

- **`DELETE /calendars/{calendarId}/members/me`**
  - **Description:** Allows a user to leave a calendar.
  - **Response (204 No Content):**

- **`PATCH /calendars/{calendarId}/members/me`**
  - **Description:** Updates the authenticated user's settings for this calendar, such as reminder preferences.
  - **Body:** `{ "reminderMinutesBefore": 30 }`
  - **Response (200 OK):** The updated member object.

### Events (`/calendars/{calendarId}/events`)

Events are always nested under a calendar.

- **`POST /calendars/{calendarId}/events`**
  - **Description:** Creates a new event in a specific calendar.
  - **Body:** `{ "title": "...", "startTime": "...", "endTime": "..." }`
  - **Response (201 Created):** The new event object.

- **`POST /calendars/{calendarId}/events/ai`**
  - **Description:** Creates an event from a natural language string.
  - **Body:** `{ "text": "Sprint planning next Thursday at 2 pm" }`
  - **Response (201 Created):** The new event object, including the AI-generated description.
  - **Response (429 Too Many Requests):** `{ "message": "AI request limit exceeded." }`

- **`GET /calendars/{calendarId}/events?from={iso_date}&to={iso_date}`**
  - **Description:** Retrieves all events for a given calendar within a specific date range.
  - **Response (200 OK):** `[ { event_object_1 }, { event_object_2 } ]`

- **`PATCH /events/{eventId}`**
  - **Description:** Updates an event's details.
  - **Body:** `{ "title": "Updated Title", "startTime": "..." }`
  - **Response (200 OK):** The updated event object.

- **`DELETE /events/{eventId}`**
  - **Description:** Soft-deletes an event.
  - **Response (204 No Content):**

---

## 5. Real-time Communication (WebSockets)

For real-time updates and user presence, clients will connect to a WebSocket endpoint. The backend will push messages to all connected members of a calendar for event changes and user activities.

- **Event:** `event:created`
  - **Payload:** The full new event object.
- **Event:** `event:updated`
  - **Payload:** The full updated event object.
- **Event:** `event:deleted`
  - **Payload:** `{ "eventId": "...", "calendarId": "..." }`

- **Event:** `user:joined_calendar`
  - **Payload:** `{ "userId": "...", "calendarId": "...", "userName": "..." }`
- **Event:** `user:left_calendar`
  - **Payload:** `{ "userId": "...", "calendarId": "...", "userName": "..." }`

- **Event:** `event:opened`
  - **Payload:** `{ "eventId": "...", "calendarId": "...", "userId": "..." }`
- **Event:** `event:editing_started`
  - **Payload:** `{ "eventId": "...", "calendarId": "...", "userId": "..." }`
- **Event:** `event:editing_cancelled`
  - **Payload:** `{ "eventId": "...", "calendarId": "...", "userId": "..." }`
- **Event:** `event:creating_started`
  - **Payload:** `{ "calendarId": "...", "userId": "..." }`
- **Event:** `event:creating_cancelled`
  - **Payload:** `{ "calendarId": "...", "userId": "..." }`

---

## 6. Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request.

- `2xx`: Success
- `4xx`: Client Error (e.g., bad request, unauthorized, not found)
- `5xx`: Server Error

All error responses will have a consistent JSON body:

```json
{
  "statusCode": 404,
  "message": "Calendar with ID 'some-uuid' not found.",
  "error": "Not Found"
}
```
