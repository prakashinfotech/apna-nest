# Debugging Guide

This guide covers common issues and debugging techniques for the ApnaNest project.

## General Tips

- **Check the Logs**: 
  - Backend: Check the console output or Serilog logs (if configured).
  - Frontend: Check the browser console and the Next.js server logs.
- **Inspect Network Traffic**: Use the browser's Network tab to inspect API requests and responses.
- **Verify Database State**: Use a database client (like pgAdmin or DBeaver) to check the data in PostgreSQL.

## Backend Debugging

- **API Errors**: If an endpoint returns 500, check for unhandled exceptions in the backend logs.
- **Validation Errors**: If an endpoint returns 400, check the validation error messages.
- **EF Core Issues**: Enable sensitive data logging in `appsettings.Development.json` to see the generated SQL.
- **MediatR Pipelines**: Use breakpoints in your handlers and behaviors to trace the request flow.

## Frontend Debugging

- **Hydration Errors**: Usually caused by server/client HTML mismatch. Check for `window` or `document` usage in server components.
- **Zustand State**: Use the Redux DevTools extension to inspect Zustand state.
- **TanStack Query**: Use the React Query DevTools to inspect queries and mutations.
- **Styling Issues**: Use the browser's element inspector to verify Tailwind classes.

## Common Issues

- **CORS Errors**: Ensure the backend allows requests from the frontend origin (usually `http://localhost:3000`).
- **Authentication**: 
  - Check if the JWT token is present in the `Authorization` header.
  - Verify token expiration and signature.
- **Database Connection**: Ensure the Docker container for Postgres is running and the connection string is correct.
