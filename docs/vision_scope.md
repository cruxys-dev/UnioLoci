# Vision & Scope

**Version:** 1.2  
**Date:** December 12th, 2025  
**Author:** Josué Cruz

# 1. Name: **UnioLoci**

The name blends two Latin roots: **Unio** (“union”) and **Loci** (“places”). Together they represent **“A unified space”**—a single shared environment where group scheduling and collaborative organization converge.

# 2. Purpose

1. **Provide a unified cooperative calendar**, where groups work from a single real-time schedule instead of fragmented, individually owned calendars.
2. **Serve as a didactic portfolio project** to practice architecture, real-time collaboration, and artificial intelligence using **NestJS** and **React**.

# 3. Product Vision

To become **“the shared document of scheduling.”**

UnioLoci reframes calendars as a **collaborative document**—not a collection of personal calendars layered on top of each other. Every member sees and edits the **exact same calendar**, removing friction, confusion, and permission complexity. All changes occur in real time.

# 4. Problem Statement

## 4.1 The Problem

Existing calendars (Google Calendar, Outlook, etc.) are built for individuals. Collaboration is an afterthought and introduces issues:

- **Ownership ambiguity:** Events belong to individual accounts, not groups.
- **Complex permissions:** Editing requires fragile, multi-step configuration.
- **Lack of synchronization:** Adding or removing group members requires event-by-event updates.
- **Multiple conflicting sources of truth:** Personal calendars overlap, creating confusion.

## 4.2 The Solution

**UnioLoci** treats the calendar as a **single shared entity** owned collectively by the group.

- Everyone can edit everything.
- All updates occur in real time.
- New members instantly see the full calendar with no setup.

It becomes the **one source of truth**.

# 5. Project Scope (MVP)

The MVP focuses on delivering a minimal but solid, fast, and collaborative shared calendar that demonstrates architectural clarity, real-time syncing, and AI-assisted actions.

## 5.1 In Scope

| Feature                             | Description                                                                                                                           | Justification                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Magic-Link Authentication           | Login via email-only magic link. No passwords.                                                                                        | Fast implementation; modern UX.                           |
| Calendar Creation                   | Create a shared calendar for a group.                                                                                                 | Core container for collaboration.                         |
| Join via Shareable Link             | Users can join a calendar through a unique URL.                                                                                       | Removes friction.                                         |
| Unified Event CRUD                  | Create, edit, move, and delete events.                                                                                                | Essential functionality.                                  |
| Real-Time Updates                   | WebSocket-based live sync for all event changes.                                                                                      | Delivers the collaborative "document" feel.               |
| User Presence Indicators            | Shows which users are viewing or editing events in real-time, including visual indicators (e.g., small avatars) for concurrent edits. | Enhances collaborative awareness and mitigates conflicts. |
| Calendar View (Month)               | A single, clean monthly view.                                                                                                         | Keeps MVP simple while meeting expectations.              |
| Desktop UI                          | A responsive interface.                                                                                                               | Practical usability.                                      |
| **AI: Natural Language → Event**    | Users can type text such as “Planning meeting next Friday at 3pm,” and the system generates the event.                                | Provides meaningful AI practice.                          |
| **AI: Auto-Generated Descriptions** | AI creates event descriptions based on the title or input text.                                                                       | Enhances UX and demonstrates AI integration.              |
| Reminders (Email)                   | Simple email notifications before an event.                                                                                           | Basic follow-up functionality.                            |

## 5.2 Out of Scope (MVP)

- Additional calendar views (Week, Day).
- Roles or permissions (everyone can edit everything).
- Private events.
- External integrations (Google, Outlook, .ics).
- Guests invitation system.
- Public display screens.
- Chat or comments.
- Advanced AI (documents/images → events, group availability suggestions, conflict detection).

# 6. Success Criteria (MVP)

The MVP is successful if:

1. A group of **3 users** can manage their weekly schedule exclusively with UnioLoci.
2. Event changes appear for other users within **3 seconds**.
3. The system maintains **full editability for all members** without confusion.
4. A user can join a calendar via link with zero friction.
5. AI can reliably convert natural text into a valid event.
6. AI automatically generates a helpful description for new events.
7. Navigation and editing remain smooth with a calendar containing **50+ events**.

# 7. Technical Overview

- **Backend:** NestJS (REST or GraphQL) + WebSockets
- **Frontend:** React (with Zustand or TanStack Query)
- **Real-Time:** WebSockets with minimal sync strategy
- **Database:** PostgreSQL
- **AI Integration:** Google Gemini API for text-to-event and description generation (using JSON for structured output)

---
