# Architecture Documentation

**Project:** UnioLoci  
**Version:** 1.0  
**Date:** November 17th, 2025  
**Author:** Josué Cruz

---

## 1. Philosophy: Diagrams as Code

This project uses **Mermaid.js** to create and maintain architecture diagrams directly within Markdown files. This approach, known as "Diagrams as Code," has several key advantages:

- **Version Control Friendly:** Diagrams are plain text, making them easy to track, diff, and review in Git pull requests.
- **Easy to Edit:** No special software is needed. Anyone can edit the diagram by changing a few lines of text.
- **Single Source of Truth:** The architecture documentation lives alongside the code and other documents, reducing the risk of it becoming outdated.
- **Automatic Rendering:** Platforms like GitHub, GitLab, and many Markdown editors automatically render Mermaid code into visual diagrams.

---

## 2. System Context Diagram (C4 Model - Level 1)

This diagram shows a high-level view of UnioLoci, its users, and the external systems it interacts with. It answers the question: **What are the key systems and actors involved in our ecosystem?**

```mermaid
C4Context
  title System Context diagram for UnioLoci

  Person(user, "User", "A person managing a shared schedule with a group.")

  System_Ext(email_service, "Email Service", "External service for sending magic links and event reminders (e.g., SendGrid, Mailgun).")
  System_Ext(openai_api, "OpenAI API", "Provides natural language processing for event creation and description generation.")

  System(unioloci_system, "UnioLoci", "The collaborative calendar system. Allows users to manage shared schedules in real time with AI assistance.")

  Rel(user, unioloci_system, "Uses")
  Rel(unioloci_system, email_service, "Sends emails for authentication and reminders")
  Rel(unioloci_system, openai_api, "Processes natural language for events and descriptions")
```

### Diagram Components:

- **User:** The end-user of the application.
- **UnioLoci System:** Our entire application, treated as a single black box.
- **Email Service:** External dependency for sending transactional emails.
- **OpenAI API:** External AI service for natural language processing.

---

## 3. Container Diagram (C4 Model - Level 2)

This diagram zooms into the "UnioLoci System" box from the context diagram. It shows the main deployable/runnable components (containers) that make up the system and how they interact.

```mermaid
C4Container
  title Container diagram for UnioLoci

  Person(user, "User", "A person managing a shared schedule.")

  System_Boundary(c1, "UnioLoci System") {
    Container(frontend, "Web Application", "React", "The single-page application (SPA) providing the user interface in the browser.")
    Container(backend, "API / Backend", "NestJS", "Handles all business logic, authentication, and real-time updates.")
    ContainerDb(database, "Database", "PostgreSQL", "Stores all user, calendar, and event data.")
  }

  System_Ext(email_service, "Email Service", "e.g., SendGrid, Mailgun")
  System_Ext(openai_api, "OpenAI API", "Processes natural language.")

  Rel(user, frontend, "Uses", "HTTPS")

  Rel(frontend, backend, "Makes API calls", "HTTPS/WSS")

  Rel(backend, database, "Reads/Writes", "TCP")
  Rel(backend, email_service, "Sends emails", "API")
  Rel(backend, openai_api, "Processes text", "API")
```
