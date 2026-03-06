# User Stories

**Project:** UnioLoci  
**Version:** 1.0  
**Date:** December 12th, 2025  
**Author:** Josué Cruz

---

## Introduction

This document contains the **user stories** derived from the functional requirements defined in [`docs/srs.md`](docs/srs.md) and the MVP scope in [`docs/vision_scope.md`](docs/vision_scope.md). The stories follow the standard agile format: **"As [user type], I want [action] so that [benefit]"**. Each story includes acceptance criteria based on non-functional requirements and success criteria.

These stories cover only the MVP. For future expansions (e.g., additional views, roles), additional stories will be created in later ADRs.

Suggested prioritization: High for core functionalities (authentication, calendars, events, real-time sync); medium for AI and notifications.

---

## 1. Authentication

### US-1: Login with Magic Link

**As a user, I want to log in using only my email to access quickly without remembering passwords.**  
**Acceptance Criteria:**

- Enter a valid email.
- Receive a magic link via email.
- Click the link to authenticate and create a JWT.
- Session valid until automatic expiration.

### US-2: First Login Onboarding

**As a new user, I want to enter my name when I first log in so that my colleagues can identify me.**
**Acceptance Criteria:**

- System detects if it is the user's first login.
- "Complete Profile" screen appears immediately after clicking the magic link.
- User cannot proceed without entering a name.
- Upon saving, the user is redirected to the dashboard.

### US-3: Session Expiration

**As a user, I want my session to expire automatically to maintain security.**  
**Acceptance Criteria:**

- Magic links expire in 10-15 minutes.
- Session JWT expires after inactivity or time limit.

---

## 2. Calendar Management

### US-4: Create Calendar

**As a calendar creator, I want to create a shared calendar with a name to organize group events.**  
**Acceptance Criteria:**

- Field for calendar name.
- Automatic generation of a unique shareable link.
- Creator user added as a member automatically.

### US-5: Join Calendar

**As a user, I want to join a calendar using a shareable link to collaborate without manual invitations.**  
**Acceptance Criteria:**

- Click on the shareable link.
- Confirm joining (e.g., confirmation dialog).
- Immediate access to the full calendar.

### US-6: View List of Calendars

**As a calendar member, I want to see a list of all my calendars to navigate easily.**  
**Acceptance Criteria:**

- List accessible from the main interface.
- Display name and members of each calendar.

### US-7: Edit Calendar Name

**As a calendar creator, I want to edit the calendar name to keep it updated.**  
**Acceptance Criteria:**

- Edit option only for the creator.
- Update reflected for all members.

### US-8: Leave Calendar

**As a calendar member, I want to leave a calendar to stop receiving updates.**  
**Acceptance Criteria:**

- Leave option from the interface.
- User removal without affecting other members.
- **Restriction:** If the user is the **creator**, they cannot leave unless they transfer ownership first or delete the calendar.

### US-9: Transfer Calendar Ownership

**As a calendar creator, I want to transfer ownership to another member so that I can leave the calendar or delegate responsibility.**
**Acceptance Criteria:**

- Option to select a member from the list to transfer ownership.
- Confirmation dialog.
- Success message.
- Full permissions transfer to the new owner; previous owner becomes a regular member.

### US-10: Delete Calendar

**As a calendar creator, I want to delete a calendar so that it is no longer available.**
**Acceptance Criteria:**

- Delete option only for the creator.
- Soft-delete performed (not permanent immediately).
- Calendar becomes inaccessible to all members.

---

## 3. Event Management

### US-11: Create Event

**As a user, I want to create an event with title, date, time, and duration to schedule activities.**  
**Acceptance Criteria:**

- Required fields: title, date, time, duration.
- Data validation (e.g., future dates).
- Event visible immediately in the calendar.

### US-12: Edit Event

**As a user, I want to edit an existing event to correct details.**  
**Acceptance Criteria:**

- Modify title, date, time, duration, description.
- Changes synchronized in real-time.

### US-13: Move Event

**As a user, I want to move an event in the monthly view by dragging it to reorganize the calendar.**  
**Acceptance Criteria:**

- Functional drag-and-drop interface in monthly view.
- Automatic update of date/time.

### US-14: Delete Event

**As a user, I want to delete an event to cancel activities.**  
**Acceptance Criteria:**

- Soft delete for possible recovery.
- Confirmation before deletion.

### US-15: View Events in Monthly View

**As a user, I want to see all events of a calendar in a monthly view to plan weekly.**  
**Acceptance Criteria:**

- Monthly grid with events per day.
- Navigation between months.

---

## 4. Real-Time Synchronization

### US-16: View Real-Time Changes

**As a collaborative user, I want to see event changes in real-time to keep the calendar updated without refreshing.**  
**Acceptance Criteria:**

- Updates in <3 seconds for all connected members.
- Use of WebSockets for synchronization.

### US-17: Presence Indicators

**As a user, I want presence indicators for other members to know who is active in the calendar.**  
**Acceptance Criteria:**

- Show users joining, leaving, or editing events.
- Real-time updates via WebSockets.

---

## 5. AI Features

### US-18: Create Event from Natural Language

**As a user, I want to create an event by writing natural text (e.g., "Planning meeting next Friday at 3pm") to save time.**  
**Acceptance Criteria:**

- AI extracts title, date, time, duration.
- Suggestions if text is ambiguous.
- Event creation with extracted data.
- **Deduct 1 credit** from the user's `aiRequestsBalance` upon successful generation.

### US-19: Auto-Generate Description

**As a user, I want AI to automatically generate a description for new events to enrich the information.**  
**Acceptance Criteria:**

- Description generated based on title or input text.
- Integration with Google Gemini API using JSON for structured output.
- **Deduct 1 credit** from the user's `aiRequestsBalance` upon successful generation.

---

## 6. Notifications and Reminders

### US-20: Receive Email Reminders

**As a user, I want to receive email reminders before an event so I don't forget.**  
**Acceptance Criteria:**

- Email sent X minutes/hours before (default 30 min).
- Configurable per calendar.

### US-21: Change Reminder Time

**As a user, I want to change the reminder time for a specific calendar to customize it.**  
**Acceptance Criteria:**

- Configuration option per user and calendar.
- Update via API (e.g., PATCH /calendars/{id}/members/me).

---

---

## 7. User Management

### US-22: View Profile

**As a user, I want to view my profile details to verify my information.**
**Acceptance Criteria:**

- Display email and name.
- data accessible via simple UI.

### US-23: Update Profile

**As a user, I want to update my personal information (e.g., name) to keep it current.**
**Acceptance Criteria:**

- Edit form for name and other optional fields.
- Email cannot be changed (primary key/auth method).
- Immediate reflection of changes.

### US-24: Delete Account

**As a user, I want to delete my account to remove my data from the system.**
**Acceptance Criteria:**

- Confirmation dialog before deletion.
- Soft delete of user data.
- User removed from all calendars; calendars created by user might be transferred or deleted (business logic detail, simplified here to "user removed").
- Session terminated immediately.

---

## Final Notes

- **Estimation**: Each story can be estimated in story points during planning (e.g., 1-5 points based on complexity).
- **Testing**: Use acceptance criteria to write acceptance tests (e.g., with Cucumber or manual).
- **References**: Refer to [`docs/api-design.md`](docs/api-design.md) for technical details and [`docs/database-schema.md`](docs/database-schema.md) for data schemas.

**Approval:**  
Josué Cruz — Senior Full Stack Developer  
Date: December 12th, 2025
