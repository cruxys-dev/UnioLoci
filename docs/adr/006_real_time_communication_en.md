# ADR 006: Real-Time Communication Strategy

**Status:** Accepted
**Date:** 2025-12-29

## Context

The application requires real-time communication features to enable live updates for calendars, events, and user interactions. This is essential for a collaborative platform where users need to see changes instantly, such as event updates or calendar modifications. The backend is built with NestJS, and we need a reliable, scalable solution for WebSocket-based communication that integrates well with the existing architecture.

Key requirements:

- Support for bidirectional communication
- Fallback mechanisms for older browsers
- Easy integration with NestJS modules
- Scalability for multiple concurrent connections
- Security considerations for authentication and authorization

## Alternatives

- **Native WebSockets**

  - Using the built-in WebSocket API in Node.js and NestJS WebSocketGateway.
  - _Pros:_ Lightweight, no additional dependencies, direct control over protocol.
  - _Cons:_ No built-in fallbacks for older browsers, requires more boilerplate for reconnection and error handling, less feature-rich for complex scenarios.

- **Socket.IO**

  - A library that builds on WebSockets with automatic fallbacks to HTTP long-polling.
  - _Pros:_ Automatic fallbacks, built-in reconnection, rooms and namespaces for organization, rich ecosystem and community support, seamless integration with NestJS via @nestjs/websockets.
  - _Cons:_ Additional dependency, slightly higher overhead compared to native WebSockets.

- **Other Libraries (e.g., ws library or uWebSockets)**
  - Low-level WebSocket libraries for more performance.
  - _Pros:_ High performance, fine-grained control.
  - _Cons:_ Lack of high-level features like fallbacks, more complex integration, potential security risks if not handled properly.

## Decision

We will use Socket.IO for real-time communication in the NestJS backend.

**Reason:** Socket.IO provides a robust, feature-rich solution that meets our requirements for real-time features while offering excellent integration with NestJS. Its automatic fallback mechanisms ensure broad browser compatibility, and the built-in reconnection and room management features reduce development time and potential bugs. Although it adds a dependency, the benefits outweigh the minimal overhead, especially for a collaborative application where reliability and ease of use are critical.

## Consequences

### Pros (+)

- Enables seamless real-time updates for calendars and events, improving user experience.
- Automatic fallbacks ensure compatibility across different browsers and network conditions.
- Simplifies implementation of features like live notifications and collaborative editing.
- Strong community support and extensive documentation for troubleshooting.

### Cons (-)

- Introduces an additional dependency, increasing bundle size slightly.
- Potential for slightly higher latency compared to native WebSockets due to abstraction layer.
- Requires learning Socket.IO-specific APIs, though integration with NestJS is straightforward.
