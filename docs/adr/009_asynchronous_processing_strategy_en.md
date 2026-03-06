# ADR 009: Asynchronous Task Processing Strategy

**Status:** Accepted  
**Date:** 2026-01-03

## Context

As the application grows, we need to handle operations that should not block the main execution thread or the user's request-response cycle. These operations include:

1. Sending transactional emails (magic links, notifications).
2. Processing complex AI scheduling requests.
3. Managing recurring calendar synchronizations.
4. Handling resource-intensive data exports or cleanups.

We need a system that ensures these tasks are executed reliably, supports retries in case of failure, and can scale horizontally as the load increases.

## Alternatives

- **NestJS In-Memory Queue**

  - Uses simple in-memory arrays or maps to manage tasks.
  - _Pros:_ Zero setup, no external dependencies.
  - _Cons:_ Tasks are lost if the server restarts; lacks persistence and advanced features like retries or delayed execution.

- **Agenda (MongoDB-based)**

  - A light-weight job scheduling library for Node.js using MongoDB.
  - _Pros:_ Persistent, easy to use if already using MongoDB.
  - _Cons:_ Requires MongoDB; can be slower than memory-based stores for high-throughput messaging.

- **RabbitMQ**

  - A traditional, robust message broker.
  - _Pros:_ Language agnostic, extremely powerful, industry standard for complex architectures.
  - _Cons:_ Significant setup and management complexity; may be "overkill" for our current requirements.

- **BullMQ / Bull (Redis-based)**
  - A Node.js message queue library backed by Redis.
  - _Pros:_ Built specifically for Node/TypeScript; excellent integration with NestJS via `@nestjs/bullmq`; supports priorities, parent-child jobs, and robust retry logic.
  - _Cons:_ Requires a Redis instance as a dependency.

## Decision

We will implement **BullMQ** using **Redis** as the message store for handling asynchronous tasks and background jobs.

**Reason:** BullMQ provides the best balance between performance, reliability, and developer experience within the NestJS ecosystem. Its native support for delayed jobs, automatic retries with backoff strategies, and the ability to handle distributed processing makes it the most suitable choice for our requirements. Being Redis-based also allows for extremely fast operation compared to database-backed queues.

## Consequences

### Pros (+)

- **Reliability:** Background tasks will survive application restarts as they are persisted in Redis.
- **Scalability:** We can easily spin up multiple worker instances to process the queue in parallel.
- **Rich Feature Set:** Built-in support for job priorities, delays, cron-like scheduling, and parent/child dependencies.
- **Monitoring:** Compatible with tools like BullBoard for real-time queue monitoring.
- **Excellent NestJS Support:** Native integration through standard modules simplifies implementation.

### Cons (-)

- **Infrastructure Dependency:** Adds Redis as a mandatory part of our stack, requiring maintenance and resources in both development and production.
- **Data Persistence Nuance:** Redis is primarily an in-memory store; we must ensure its persistence configuration (RDB/AOF) is appropriately set to avoid losing queue data in rare failure scenarios.
- **Learning Curve:** Developers need to understand producer/worker patterns and the BullMQ lifecycle.
