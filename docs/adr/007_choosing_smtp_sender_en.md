# ADR 007: Choosing SMTP Sender

**Status:** Accepted  
**Date:** 2026-01-02

## Context

The application requires sending transactional emails, such as magic links for authentication, event notifications, and user communications. To handle email delivery reliably, we need an SMTP service provider that can manage sending emails from our backend. Key requirements include reliability, ease of integration with NestJS, cost-effectiveness, and a good free tier for development and initial production use.

We evaluated several SMTP providers based on their features, pricing, and suitability for our use case.

## Alternatives

- **SendGrid**

  - A popular email delivery service with robust features.
  - _Pros:_ High deliverability, extensive documentation, good integration options.
  - _Cons:_ Free tier is limited (100 emails/day), paid plans can be expensive for small-scale use.

- **Mailgun**

  - Focused on transactional emails with good API support.
  - _Pros:_ Strong API, good for developers, reliable delivery.
  - _Cons:_ Free tier is very limited (5,000 emails/month), setup can be complex.

- **Brevo (formerly Sendinblue)**

  - Email marketing and transactional email platform.
  - _Pros:_ Generous free tier (300 emails/day), easy integration, good documentation, supports SMTP and API.
  - _Cons:_ Primarily known for marketing emails, but suitable for transactional use.

- **AWS SES**

  - Amazon's email service, cost-effective for high volumes.
  - _Pros:_ Pay-as-you-go pricing, highly scalable.
  - _Cons:_ Requires AWS account, more complex setup, no free tier for new accounts.

- **Gmail SMTP**
  - Using Gmail's SMTP server.
  - _Pros:_ Free, familiar.
  - _Cons:_ Rate limits (500/day), not suitable for production, potential deliverability issues.

## Decision

We will use Brevo as our SMTP sender.

**Reason:** Brevo offers a generous free tier (300 emails per day) which is sufficient for our initial needs and development phase. It provides reliable delivery, easy integration with NestJS via SMTP or API, and good documentation. Compared to alternatives, it balances cost and features well for a startup or small application.

## Consequences

### Pros (+)

- Generous free tier allows development and small-scale production without immediate costs.
- Reliable email delivery with good reputation.
- Simple integration using standard SMTP protocol or REST API.
- Supports both transactional and marketing emails if needed in the future.

### Cons (-)

- Free tier limits may require upgrading as user base grows (300 emails/day).
- Dependency on a third-party service for critical email functionality.
- Potential vendor lock-in if switching providers later.
