# ADR 001: Technology Stack Choice for UnioLoci

**Status:** Accepted  
**Date:** 2025-12-12

---

## Context

UnioLoci is a collaborative calendar application that requires a modern web experience, AI integration for creating events from natural language, and real-time synchronization.
In addition to functional requirements, there is a significant personal goal: **to practice and deepen knowledge in specific technologies of the JavaScript/TypeScript ecosystem**, including modern architecture, frameworks, and a consistent stack across frontend and backend.

Different alternatives were evaluated considering:

- Ease of implementation for an MVP.
- Available ecosystem (libs, community, AI integrations).
- Development speed.
- Knowledge reuse.
- Real learning opportunity (a key motivation for the project).

Infrastructure/hosting is not decided in this ADR and will be defined in a later one.

## Alternatives

### **1. MERN (MongoDB, Express, React, Node)**

- Traditional full-JS stack with a good learning curve and a large community.

**Pros:**

- Well-known, abundant documentation.
- Rapid prototype development.
- WebSockets are easy to implement in Node.

**Cons:**

- MongoDB is not ideal for transactional relationships (calendars, users).
- Less robust backend structure.
- Requires more manual conventions.

---

### **2. PERN (PostgreSQL, Express, React, Node)**

- Similar to MERN, but with PostgreSQL as the relational database.

**Pros:**

- Robust SQL, suitable for calendar data.
- Maintains the simplicity of Express.

**Cons:**

- Express requires defining too much structure by hand.
- Does not offer modularity, decorators, or a strong opinion like NestJS.
- Backend scalability depends on manual discipline.

---

### **3. PostgreSQL + NestJS + React**

- A strongly structured, modern backend with native support for WebSockets.

**Pros:**

- Modular, testable, and scalable architecture.
- WebSockets are integrated and maintained by the framework.
- Easy integration with OpenAI and external services.
- Excellent DX for medium-to-large projects.
- PostgreSQL is ideal for relational data.
- React is an industry standard for the frontend.
- Facilitates growth into microservices if ever needed.

**Cons:**

- Slightly steeper learning curve than Express.
- More initial boilerplate.
- Requires a heavier build on the backend (TypeScript decorators).

---

## Decision

**We choose: PostgreSQL + NestJS + React**

This stack defines:

- **Backend:** NestJS
- **DB:** PostgreSQL
- **Frontend:** React
- **Real-time:** WebSockets (NestJS Gateway)

**Reason:**  
This stack provides significant benefits for the user and product by offering the best balance between future scalability, architectural robustness, real-time support, AI integration, and development productivity. Despite having a bit more boilerplate than Express, its organization and modularity increase speed and quality in the medium term. PostgreSQL is ideal for the type of data in a calendar, ensuring reliable handling of relational data like events, users, and permissions. React is an industry standard for the frontend, delivering a modern web experience.

Additionally, this choice aligns perfectly with the developer's objectives to practice and deepen knowledge in specific technologies of the JavaScript/TypeScript ecosystem, including modern architecture, frameworks, and a consistent stack across frontend and backend. NestJS provides an excellent opportunity for learning modular, testable, and scalable backend development, while React reinforces frontend skills in a popular framework.

---

## Consequences

### Pros (+)

- Clean and maintainable architecture from day one.
- Simple and controlled AI integration.
- Native and well-supported WebSockets.
- A relational database suitable for events, users, and permissions.
- Easy future recruitment and collaboration (popular stack).
- Clear scalability if the project grows.

### Cons (-)

- More boilerplate on the backend.
- Higher initial learning curve (NestJS).

---
