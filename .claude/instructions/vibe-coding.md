# Vibe Coding Principles

Vibe Coding is a philosophy of working with AI where the developer focuses on high-level intent, architectural patterns, and iterative feedback, while letting the AI handle implementation details, boilerplate, and routine tasks.

## Core Tenets

1. **Intent over Implementation**: Describe *what* you want to achieve and *why*, rather than *how* to do every step.
2. **Iterative Loops**: Build in small, verifiable chunks. Provide immediate feedback on the AI's output.
3. **Verify, Don't Just Trust**: Use automated tests, linting, and manual verification to ensure the AI's "vibe" matches the requirements.
4. **Context is King**: Keep documentation like `CLAUDE.md` and these instruction files up to date so the AI always has the right context.
5. **Leverage AI Strengths**: Let the AI handle refactoring, writing tests, generating boilerplate, and explaining complex code.
6. **Human-in-the-Loop**: You are the architect and the quality gate. Guide the AI, correct its course, and make the final decisions.

## The Vibe Coding Workflow

### 1. Explore
- Use the AI to understand the existing codebase.
- Ask questions like "Where is the auth logic?" or "How do I add a new property field?".
- Let the AI summarize complex files or architectures.

### 2. Plan
- Describe your goal in natural language.
- Ask the AI to propose a plan.
- Refine the plan together before any code is written.
- Use "Think Hard" or "Ultrathink" for complex architectural decisions.

### 3. Code
- Let the AI implement the plan.
- If the output is too large, break it into smaller sub-tasks.
- Review the code for adherence to [Coding Standards](coding-standards.md) and [Naming Conventions](naming-conventions.md).

### 4. Verify
- Ask the AI to write tests for the new code.
- Run the tests and fix any issues.
- Use `OpenPreview` or local servers to verify UI changes.

### 5. Commit
- Use the AI to generate a [Conventional Commit](git-standards.md) message.
- Review and push.

## Best Practices for AI Interaction

- **Be Specific**: "Add a 'featured' badge to the PropertyCard component" is better than "Make the property card look better".
- **Provide Examples**: If you want a specific pattern, show an existing example in the codebase.
- **Correct Early**: If you see the AI going in the wrong direction, stop it and clarify your intent.
- **Use Skills**: Refer to project-specific skills in `.claude/skills/` to trigger complex behaviors.
