# ADR 008: Email Templating Architecture

**Status:** Accepted  
**Date:** 2026-01-02

## Context

The application needs to send consistent, visually appealing, and responsive emails (e.g., magic links, notifications). Email clients (Outlook, Gmail, Apple Mail, etc.) have vastly different rendering engines, often requiring complex nested tables and inline CSS that are difficult to write and maintain manually. Additionally, we need a way to inject dynamic data (like user names, tokens, or links) into these templates while remaining agnostic of the SMTP provider used for delivery.

The goals for our templating system are:

1. **High Compatibility:** Emails must look good in all major email clients.
2. **Separation of Concerns:** Template logic should be independent of the delivery mechanism.
3. **Maintainability:** Efficiently manage layouts and dynamic content without manual table-hacking.
4. **Tool Agnosticism:** The solution should work regardless of whether we use Brevo, AWS SES, or any other SMTP service.

## Alternatives

- **Manual HTML/CSS (Table-based)**
  - Hand-coding templates using tables and inline styles.
  - _Pros:_ No additional dependencies.
  - _Cons:_ Extremely prone to errors, hard to maintain, and difficult to ensure cross-client compatibility.

- **React-Email**
  - A modern library to build emails using React components.
  - _Pros:_ Component-driven, uses familiar React syntax, good developer experience.
  - _Cons:_ Highly coupled to the React ecosystem; may introduce more complexity than needed for simple transactional templates.

- **MJML (Mailjet Markup Language) with Handlebars**
  - MJML is a markup language designed to reduce the pain of coding responsive emails. Handlebars is a logic-less templating engine for data injection.
  - _Pros:_ MJML solves responsiveness and client compatibility automatically. Handlebars allows clean dynamic data injection.
  - _Cons:_ Requires a "compilation" step from MJML/Handlebars to raw HTML.

## Decision

We will use **MJML** combined with **Handlebars** for our email templating strategy.

**Reason:** MJML provides a high-level abstraction that compiles into highly compatible, responsive table-based HTML, abstracting away the complexities of email client rendering. By layering Handlebars on top, we can inject dynamic data into these templates before they are sent. This combination allows us to generate the final HTML programmatically in our backend (or a dedicated service), making the rendering logic completely independent of the SMTP provider or the specific delivery method used.

## Consequences

### Pros (+)

- **Maximum Compatibility:** MJML handles the heavy lifting of ensuring emails look consistent across different email clients.
- **Dynamic & Scalable:** Handlebars makes it easy to create reusable layouts and inject variables.
- **Provider Agnostic:** Since we generate the final HTML, we can pipe it into any SMTP service's `content` field without relying on their proprietary template editors.
- **Clean Codebase:** Developers work with a high-level XML-like syntax rather than thousands of lines of nested tables.

### Cons (-)

- **Build/Processing Step:** We need to compile MJML to HTML and then process Handlebars. This adds a small overhead during development or at runtime (if compiled on the fly).
- **Learning Curve:** Developers need to learn MJML-specific tags (though they are intuitive).
- **Debugging:** If the compiled HTML breaks in a specific client, debugging the generated code can be tedious (though MJML is generally very reliable).
