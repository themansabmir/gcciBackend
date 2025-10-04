# AGENTS.md

## Project Context
This is a [**e.g., Node.js backend API, React single-page app, Python data processing tool**]. The primary purpose is to [**briefly describe what the project does**]. The main codebase is structured as a [**e.g., monorepo, standard project**].

### Key Directories
*   `/src`: Contains all the main source code.
*   `/src/auth`: Authentication and authorization logic.
*   `/src/features`: Contains all the different modules and each module have model, controller, router, service and dto and types file in it.
*   `/middleware`: Contains all the middleware functions.
*   `/lib`: Contains all the abstraction layers of external packages so we can replace easily in future if required.
*   `/config`: Configuration files for the project.

## Development Environment
### Setup
*   **Dependencies:** Use `[**e.g., npm install**]` to install all project dependencies.
*   **Environment Variables:** The project uses a `.env` file for environment-specific variables. A template is available in `[**e.g., .env.example**]`.

### Common Commands
*   **Run Dev Server:** `[**e.g., npm run dev**]`
*   **Build Production:** `[**e.g., npm run build**]`


## Coding Conventions
### General Guidelines
*   Follow the [**e.g., Airbnb, PEP8, StandardJS**] style guide for formatting.
*   Use `[**e.g., camelCase**]` for function names.
*   Use `[**e.g., snake_case**]` for variable names.
*   Use `[**e.g., PascalCase**]` for class names.
*   Always add JSDoc/docstrings to public functions and components.
*   Always use functional programming approach.
*   Use `[**e.g., TypeScript**]` for type safety.

### Best Practices
*   **IMPORTANT:** Avoid introducing new heavy dependencies without approval.
*   **IMPORTANT:** Always use functional programming approach.
*   **Do not** hardcode sensitive information like API keys or tokens. Use environment variables instead.
*   Follow the existing architectural patterns. For example, [**e.g., "all database access should go through the repository layer"**].

## Security Considerations
*   Sanitize and validate all user inputs on the server side to prevent vulnerabilities.
*   Ensure that any new endpoints or features are checked for common security pitfalls.

## Pull Request Instructions
*   **Title Format:** Use a conventional commit style: `feat(scope): brief description`.
*   **Automated Checks:** All linting and test checks must pass in CI before merging.
*   **Verification:** Confirm that the changes are working as expected and do not introduce any regressions.
