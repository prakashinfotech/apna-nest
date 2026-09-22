# Coding Standards

This document outlines the coding standards for the ApnaNest project. Adherence to these standards ensures consistency, maintainability, and quality across the codebase.

## General Principles

- **Clarity over Cleverness**: Write code that is easy to read and understand.
- **DRY (Don't Repeat Yourself)**: Extract common logic into reusable utilities or components.
- **KISS (Keep It Simple, Stupid)**: Avoid over-engineering.
- **Composition over Inheritance**: Especially in React and C# Domain models.
- **Consistent Naming**: Follow the [Naming Conventions](naming-conventions.md).

## Frontend (React/Next.js)

- **Components**: 
  - Use PascalCase for component files and names (e.g., `PropertyCard.tsx`).
  - One component per file.
  - Functional components with hooks are preferred.
  - Use `interface` for props, named `[ComponentName]Props`.
- **Hooks**:
  - Custom hooks should start with `use` (e.g., `useAuth.ts`).
  - Co-locate hooks with components if they are only used in one place.
- **Styling**:
  - Use **Tailwind CSS v4** utility classes.
  - Use the `cn()` helper for conditional classes.
  - Avoid inline styles unless absolutely necessary for dynamic values.
- **State Management**:
  - **Server State**: Use TanStack Query (React Query) for data fetching and caching.
  - **Client State**: Use Zustand for global or complex local state.
  - **Form State**: Use React Hook Form with Zod for validation.
- **Performance**:
  - Use Server Components by default.
  - Use `'use client'` only when necessary for interactivity or browser APIs.
  - Optimize images using `next/image`.

## Backend (.NET/C#)

- **Architecture**: Follow **Clean Architecture** (Domain -> Application -> Infrastructure -> Web).
- **Patterns**:
  - Use **CQRS** with MediatR.
  - Use the **Result pattern** for control flow (avoid throwing exceptions for expected errors).
  - Use **FluentValidation** for request validation.
- **Data Access**:
  - Use EF Core for most operations.
  - Use Dapper for performance-critical or complex SQL if needed.
  - Keep entities pure; use `IEntityTypeConfiguration` for mapping.
- **Async/Await**:
  - Use `Async` suffix for all asynchronous methods.
  - Always use `ConfigureAwait(false)` in library code (Infrastructure/Application), but not in Web API controllers.
- **Nullability**:
  - Enable nullable reference types and respect them. Avoid `!`.

## Testing

- **Frontend**: Use Vitest and React Testing Library.
- **Backend**: Use xUnit, FluentAssertions, and Moq.
- **General**:
  - Write tests for all new features.
  - Tests should be descriptive and follow the Arrange-Act-Assert (AAA) pattern.
  - Aim for high coverage in business logic (Application layer in backend, hooks/utils in frontend).
