# ADR 003: AI Technology Choice for UnioLoci

**Status:** Accepted  
**Date:** 2025-12-12

---

## Context

UnioLoci incorporates AI features to enhance the user experience:

- Creating events from natural language.
- Interpreting ambiguous or incomplete sentences.
- Suggesting schedules, categories, or reminders.
- (Future) Smart classification, conversational assistants, summaries.

AI is not the core of the project, but it is a **key differentiator**.  
Additionally, there is a goal to **practice advanced AI integration**, especially using modern structured formats like **JSON (JavaScript Object Notation)** to obtain clean, reliable, and processable data.

Given that this is a portfolio project, there is a strong emphasis on **minimizing costs**, particularly for AI services, to keep the project sustainable and accessible.

Technologies considered:

- OpenAI API
- Google Gemini
- Anthropic Claude
- Open-source models (Llama, Mixtral, Qwen, etc.)
- Local models
- Do not use AI

---

## Alternatives

### 1. OpenAI API

**Pros:**

- Very high accuracy in generating responses in **JSON** format.
- Mature SDKs and easy integration with NestJS.
- Excellent capabilities for interpreting natural language related to calendars.

**Cons:**

- Dependency on an external provider.
- Variable cost per use.
- Need to handle rate limits and security.

---

### 2. Google Gemini

**Pros:**

- Strong models in multimodal reasoning.
- Good ecosystem if using Google infrastructure.
- High accuracy in generating responses in **JSON** format.
- Offers free models, significantly reducing costs for portfolio projects.
- Good performance for natural language interpretation and event creation.
- Simple integration with modern web stacks.

**Cons:**

- Less polished Node SDK.
- Potential lower stability in complex structured outputs.

---

### 3. Anthropic Claude

**Pros:**

- Great clarity and reasoning.
- Excellent for long instructions.

**Cons:**

- JSON is less stable than with OpenAI.
- More limited ecosystem.
- Worse performance in extracting event data.

---

### 4. Open-Source Models

**Pros:**

- Full control; no external dependency.
- Privacy and predictable costs.
- Ability to customize models.

**Cons:**

- Complex infrastructure to maintain.
- Worse accuracy with JSON without fine-tuning.
- Fails much more often than OpenAI with ambiguous sentences.

---

## Decision

**We choose Google Gemini as the primary AI technology.**

- **Model:** Gemini 2.5 Flash or better.
- **Output Format:** **JSON (JavaScript Object Notation)** for structured data.

---

## Reason

Google Gemini is chosen due to its cost-effectiveness, offering free models that are suitable for a portfolio project where minimizing expenses is crucial. While it may have some limitations in stability for structured JSON output compared to other providers, it provides sufficient capabilities for the AI features in UnioLoci, such as natural language processing for event creation.

Furthermore, it allows practicing AI integration with a focus on budget constraints, which is important for real-world applications.

---

## Consequences

### Pros (+)

- Low to no cost due to free models.
- Good multimodal reasoning capabilities.
- Suitable for a portfolio project with limited budget.
- Integration with Google ecosystem if needed.

### Cons (-)

- Potential lower stability in producing structured JSON formats.
- May require more error handling for calendar data interpretation.
- Less mature Node SDK compared to some alternatives.

---
