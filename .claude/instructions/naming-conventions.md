# Naming Conventions

Consistent naming is one of the most important aspects of a maintainable codebase.

## General Rules

- Use descriptive names. Avoid abbreviations unless they are well-known (e.g., `id`, `url`, `api`).
- Use plural for collections (e.g., `properties`, `users`).
- Use boolean prefixes like `is`, `has`, `should`, `can` (e.g., `isActive`, `hasPermission`).

## Frontend (TypeScript/React)

- **Files & Folders**: 
  - Components: `PascalCase.tsx`
  - Non-component files: `kebab-case.ts`
  - Folders: `kebab-case`
- **Variables & Functions**: `camelCase`
- **Interfaces & Types**: `PascalCase`
- **Enums**: `PascalCase` for the enum name and `PascalCase` for members.
- **CSS Classes**: Tailwind utility classes (no custom class naming needed usually). If using CSS Modules, use `camelCase`.

## Backend (C#)

- **Classes, Records, Structs**: `PascalCase`
- **Interfaces**: `IPascalCase` (prefixed with `I`)
- **Methods**: `PascalCase`
- **Properties**: `PascalCase`
- **Parameters & Local Variables**: `camelCase`
- **Private Fields**: `_camelCase` (prefixed with underscore)
- **Constants**: `PascalCase` or `UPPER_SNAKE_CASE` (PascalCase is more common in modern .NET).
- **Namespaces**: `PascalCase` (e.g., `ApnaNest.Services.Properties`).

## Database (PostgreSQL)

- **Tables**: `snake_case`, plural (e.g., `property_listings`).
- **Columns**: `snake_case` (e.g., `created_at`).
- **Primary Keys**: `id` (usually UUID).
- **Foreign Keys**: `[table_singular]_id` (e.g., `user_id`).
- **Indexes**: `idx_[table]_[column]` (e.g., `idx_properties_price`).

## API Endpoints

- Use nouns, not verbs (e.g., `/api/properties` instead of `/api/getProperties`).
- Use `kebab-case` for multi-word segments.
- Use plural for resource collections.
- Versioning: `/api/v1/...` (if applicable).
