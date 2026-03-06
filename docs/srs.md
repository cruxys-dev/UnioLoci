# Software Requirements Specification (SRS)

**Project:** UnioLoci  
**Version:** 1.0  
**Date:** December 12th, 2025  
**Author:** Josué Cruz

---

# 1. Introduction

## 1.1 Purpose of the Document

This SRS defines all functional and non-functional requirements for **UnioLoci**, a real-time collaborative calendar platform.  
It serves as the official reference for development, testing, and architectural planning.

## 1.2 Intended Audience

- Developers (Frontend, Backend)
- QA Engineers
- Designers
- Project stakeholders
- Future contributors

## 1.3 Project Overview

UnioLoci is a **shared calendar as a collaborative document**.  
All members share and modify the same calendar in real time.  
The system includes AI-assisted event creation and description generation.

---

# 2. System Description

## 2.1 Product Perspective

UnioLoci is a standalone web application.  
It does not integrate with external calendars (Google/Outlook) in the MVP.  
It consists of:

- **Backend**: API + WebSockets (NestJS)
- **Frontend**: React web application (Desktop)
- **Database**: PostgreSQL
- **AI Integration**: OpenAI API (text → event + auto-description)

## 2.2 Product Features (High Level)

- Shared calendars
- Real-time event collaboration
- AI-assisted event creation
- AI-generated event descriptions
- Magic-link authentication
- Email reminders

## 2.3 User Classes

### _Member_

- Can join a calendar
- Can leave a calendar
- Can create/edit/delete any event
- Can view all events
- Receives reminders

### _Calendar Creator_

- Creates the calendar.
- Can remove members.
- Has the same permissions as a Member (no hierarchy in MVP).

---

# 3. Functional Requirements

## 3.1 Authentication

### FR-1 Magic Link Login

- User enters email.
- System sends login link.
- Clicking link logs the user in.
- No password required.
- No registration required.

### FR-1.1 First Login Setup

- If the user is logging in for the first time, the system must prompt for their **Full Name**.
- Access to other features is restricted until this information is provided.

### FR-2 Session Persistence

- User remains logged in until token expires or logs out.

---

## 3.2 Calendar Management

### FR-3 Create Calendar

- User can create a new shared calendar.
- System generates a unique shareable link.

### FR-4 Join Calendar

- User can join via shareable link.
- System asks the user if they want to join the calendar.

### FR-5 View Calendar

- User can view a **Monthly** calendar grid.
- Events are shown by day.

### FR-5.1 Transfer Ownership

- The calendar creator can transfer ownership to another member of the calendar.
- Upon transfer, the original creator becomes a regular member.

### BR-1 Creator Restrictions

- The creator **cannot leave** the calendar.
- To leave, the creator must first **transfer ownership** to another member OR **permanently delete** the calendar.

### BR-2 Unrestricted Member Access

- **All members** of a calendar have full **read and write access** to all events within that calendar.
- There are no "read-only" members in the MVP.

### BR-3 AI Rate Limiting

- To control costs, each user is limited to **50 AI requests** (Natural Language Event Creation or Auto-Description) **lifetime** for the MVP.
- If the limit is exceeded, the user must wait or create events manually.

## 3.3 Event Management

### FR-6 Create Event

- User can create an event with:
  - Title
  - Date & Time
  - Duration
  - Optional description

### FR-6.1 Timezone Handling

- Events are stored reflecting the creator's timezone (or normalized to UTC).
- For every user, the event date and time are displayed converted to their own local timezone.

### FR-7 Edit Event

- User can modify any event fields.

### FR-7.1 Partial Event Updates

- When updating an event, only the fields that have changed are sent to the server.
- This prevents conflicts with concurrent edits by other users, allowing simultaneous modifications as long as different fields are affected.
- Conflicts only occur if the same field is updated by multiple users at the same time.

### FR-8 Move Event

- Drag-and-drop repositioning on the monthly grid.

### FR-9 Delete Event

- User can delete any event.

### FR-10 Real-Time Sync

- All event actions and user presence updates update to all connected users within **3 seconds**.

---

## 3.4 AI Features

### FR-11 Event Creation from Natural Language

Input example:

> “Sprint planning next Thursday at 2 pm.”

Output:

- Title
- Date
- Time
- Duration (if detected)
- Optional location or link

### FR-12 Auto-Generated Event Description

- When an event is created (normal or AI-assisted),  
  AI generates a recommended description based on the title/text.

### FR-13 AI Error Handling

- If text is unclear, system prompts user with suggestions.
- If text is unclear, the system notifies the user.

---

## 3.5 Notifications

### FR-14 Email Reminders

- User receives an email X minutes/hours before the event.
- Default reminder: 30 minutes.
- User can change reminder value.

---

---

## 3.6 User Management

### FR-15 View Profile

- User can view their own profile details (Email, Name).

### FR-16 Update Profile

- User can update their name.
- Email is immutable as it is the primary identity.

### FR-17 Delete Account

- User can request account deletion.
- System soft-deletes the user record.
- User is removed from all joined calendars.
- Session is invalidated immediately.

---

# 4. Non-Functional Requirements

## 4.1 Performance

### NFR-1 Real-Time Latency

- Event updates propagate to other users in **< 3 seconds**.

### NFR-2 Calendar Responsiveness

- Calendar with **50+ events** must scroll and update smoothly.

## 4.2 Security

### NFR-3 Authentication Security

- Magic links must expire after a short time (e.g., 10–15 min).
- Tokens must be single-use.

### NFR-4 Data Isolation

- Users can only access calendars they explicitly joined.

### NFR-6 Data Privacy (Right to be Forgotten)

- Upon account deletion, all Personally Identifiable Information (PII) must be soft-deleted such that it is no longer visible to other users.

## 4.3 Reliability

### NFR-5 Data Integrity

- No event should be overwritten incorrectly during real-time edits.

## 4.4 Usability

### NFR-7 Responsive Design

- Application must work seamlessly on desktop.

### NFR-8 Simple Interface

- Users should create an event in **≤ 3 steps**.

### NFR-9 Conflict Mitigation in Editing

- The interface must display, in a clear and non-intrusive manner, when another user is modifying a resource (event, calendar, etc.).
- This helps users avoid conflicts by providing awareness of concurrent edits.

---

# 5. System Architecture (Overview)

## 5.1 Backend (NestJS)

- REST API
- WebSockets for real-time updates
- PostgreSQL for persistence
- AI microservice or direct SDK calls.

## 5.2 Frontend (React)

- React + Zustand / TanStack Query
- Monthly calendar grid
- Real-time event rendering

## 5.4 AI Integration

- OpenAI API
- Prompt templates for:
  - Natural language → event (using JSON for structured output)
  - Description generation

---

# 6. Constraints & Dependencies

- Internet connection required (real-time sync + AI).
- AI features require OpenAI API key.

---

# 7. Acceptance Criteria

1. A group of **3 users** can fully manage their weekly schedule.
2. All edits sync in **<3 seconds**.
3. AI reliably converts natural text into a valid event.
4. AI generates descriptions without failures on common inputs.
5. Calendar stays responsive with **50+ events**.
6. Joining via shareable link works with zero friction.
7. No permission conflicts exist (everyone can edit everything).

---

# 8. Future Enhancements (Post-MVP)

- Weekly and Daily views
- Roles/permissions
- Google Calendar / Outlook integrations
- Private events
- Public display mode
- Chat/comments inside events
- AI suggestions for best meeting times: Suggests at least 3 time slots that fit the team's preferences
- AI can add a meeting template
- AI conflict detection
- Event creation from documents or images

---

# 9. Approval

**Author:**  
Josué Cruz — Senior Full Stack Developer  
Date: December 12th, 2025
