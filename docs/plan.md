# HIMTI KIT Development Plan

## Purpose of This Document

This file is the authoritative product and implementation handoff for HIMTI KIT. Future sessions must read it and `docs/references/README.md` before proposing or implementing work.

Use these evidence levels consistently:

- **Confirmed requirement:** explicitly requested by the product owner and safe to implement.
- **Reference observation:** visible in a supplied screenshot and authoritative for the visual implementation, but not proof of behavior that cannot be seen.
- **Implementation proposal:** a technical direction that still may change as the application is built.
- **Open decision:** unresolved and must not be guessed. Ask the product owner when the decision becomes necessary.

Do not turn placeholder screenshot content, sample names, sample IDs, displayed cohort values, or apparent visual behavior into permanent product rules unless this document marks them as confirmed. Update this document whenever the product owner confirms or changes a requirement.

## Product Summary

HIMTI KIT is a web application for HIMTI BINUS students. It provides learning materials and software resources appropriate to a student's Binusian cohort. Administrators maintain that content through a separate protected flow.

The application should reproduce the supplied interfaces closely on desktop while remaining usable on smaller screens. Minor changes are allowed only where necessary for responsiveness, accessibility, clear validation, or secure behavior.

## Confirmed Requirements

### Student Experience

- A student enters a student ID (NIM) to begin the student flow.
- Student content is cohort-specific.
- Students can browse lesson summaries.
- Students can open or download a lesson summary's resource.
- Students can browse software resources.
- Students can open or download a software resource.
- Lesson summaries and software resources have list and detail information, even if the first interface presents that information together on cards.
- Images associated with lesson summaries and software resources are provided as external URLs. The application must not implement image file uploads.
- Course summaries do not have semester data. Do not add a semester field, semester filtering, semester tabs, or a semester selector.
- Students can log out.
- Supported majors are Computer Science, Mobile Application and Technology, Game Application and Technology, Data Science, Cyber Security, Computer Science & Mathematics, Computer Science & Statistics, Computer Science - Software Engineering, Artificial Intelligence, and Digital Psychology.

### Admin Entry and Authentication

- Entering exactly `0000000000` in the agreed student-ID login field opens a separate admin login flow.
- The `0000000000` value is only a routing trigger. It must never authenticate or authorize an administrator.
- Administrators must authenticate separately and securely before accessing protected management actions.
- Admin routes and mutations must enforce authorization on the server. Hiding controls in the interface is not sufficient.
- Admin authentication is independent of cohorts. If no cohorts exist after login, the administrator must be directed to create the first cohort.

### Admin Content Management

- An administrator selects the Binusian cohort whose content is being managed.
- An administrator can create and remove cohorts from the admin panel; supported cohort values must not be hard-coded.
- A cohort must not be removed while any student, lesson summary, or software resource is associated with it. The admin interface must explain why removal is blocked.
- An administrator can create, view, edit, and delete lesson summaries.
- An administrator can create, view, edit, and delete software resources.
- Administrative input must be validated before persistence.
- Destructive actions must require clear confirmation.

### Visual and Interaction Direction

- The six PNG files listed in `docs/references/README.md` are the visual source of truth.
- Preserve the recognizable HIMTI KIT identity shown by the references: illustrated themed backgrounds, prominent welcome header, left-side identity/navigation panel on application screens, rounded controls, content cards, and clear active navigation states.
- Use `public/bg.png` and the dark navy, white, cyan, magenta, and purple palette from the futuristic references as the visual theme across the application. Use the later green screenshots for layout, information hierarchy, and behavior rather than their color palette.
- Preserve the information hierarchy and available actions shown in the corresponding reference screen.
- Implement responsive behavior rather than forcing the desktop canvases to overflow on mobile.
- Accessibility, security, validation, loading, empty, and error states may extend beyond what screenshots show because static images do not specify them.

## Reference-Derived Screen Inventory

The observations below describe visible evidence only. They do not settle open backend or product decisions.

### Student Entry

Source: `docs/references/Desktop - 1.png`

Visible requirements:

- Full-page illustrated futuristic city background.
- Centered `HIMTI KIT` heading and short product description.
- A prominent rounded student-ID input with a right-arrow submit action.
- Decorative HIMTI characters and artwork frame the content without replacing the form's usability.

Required behavior:

- Accept a student ID and submit the student entry flow.
- Detect the exact `0000000000` trigger and navigate to the separate admin flow without granting admin access.
- Show accessible validation when the submitted value is invalid.

Not established by the screenshot:

- Valid student-ID format other than the confirmed admin trigger.
- Whether student access requires a password, external identity provider, roster lookup, or another verification mechanism.

### Student Course Dashboard

Primary source: `docs/references/Screenshot 2026-09-06 210216.png`

Visual-direction source: `docs/references/Desktop - 2.png`

Visible requirements:

- Header with welcome text, supporting tagline, and logout action.
- Left panel with student name, student ID, and navigation for Course and Software.
- Major selector near the top of the content area.
- The references show semester controls, but they must be omitted from the implementation because course summaries do not have semester data.
- A responsive grid of course/summary cards with image, title, supporting text, and an action.
- The active Course navigation item is visually distinct.
- A logout confirmation dialog appears before completing logout.

Notes:

- `Desktop - 2.png` is a stylized mockup with placeholders; the later screenshot demonstrates a more concrete card layout and logout state.
- The implementation should preserve the supplied HIMTI visual identity while following the later screenshot's clearer information hierarchy.
- `Computer Science`, `Game Application and Technology`, names, IDs, and course titles visible in screenshots are examples, not a complete approved data set.
- Semester labels in the references are intentionally not part of the product.

### Student Software Dashboard

Source: `docs/references/Screenshot 2026-09-06 210232.png`

Visible requirements:

- Reuse the authenticated student header and left navigation shell.
- Show Software as the active navigation item.
- Display software cards in a responsive grid.
- Each card visibly contains artwork or a logo, title, short description, and download action.
- Example cards include Dev-C++, Git, GitHub, Zoom, Visual Studio Code, and Microsoft Teams; these examples do not define required seeded content.

### Admin Login

Source: `docs/references/Screenshot 2026-09-06 210255.png`

Visible requirements:

- Reuse the application header, background, side identity panel, and admin navigation shell.
- Show an admin identity state separately from a student identity state.
- Provide management navigation for Course and Software.
- Present the confirmed admin credential controls and login action without a cohort selector.
- Cohort selection occurs after authentication in the management interface.

Security clarification:

- The screenshot's `0000000000`, `UserAdmin`, and displayed Binusian value are presentation examples and must not become credentials.
- The final credential mechanism remains an open decision.

### Admin Course Management

Source: `docs/references/Screenshot 2026-09-06 210312.png`

Visible requirements:

- Show which Binusian cohort is currently being managed.
- Provide Add Course and Change Binusian actions.
- Display managed course records with image, title, supporting text, Edit action, and Delete action.
- Show Manage Course as the active admin navigation item.
- Use the corresponding structure for software management, adapted to software resource fields and actions.

Not established by the screenshot:

- Exact create/edit form fields.
- Downloadable-resource formats and storage, pagination, sorting, or search.
- Whether changing Binusian occurs inline, in a dialog, or on a separate screen.

Confirmed extension beyond the screenshot:

- The admin panel must provide controls to add and remove cohorts.
- Cohort removal must be unavailable or rejected with a clear explanation while the cohort has associated students or content.

## Product Rules and Boundaries

- A student's cohort controls which lesson summaries and resources are available to that student.
- An admin's selected cohort controls which records are viewed and modified in the management interface.
- Cohorts are persisted, admin-managed records rather than a hard-coded list.
- Cohort removal is restricted while students or content reference that cohort; associated records must first be removed or reassigned.
- The student Course and Software areas are distinct views.
- The admin Manage Course and Manage Software areas are distinct views.
- Do not expose admin actions through the student flow.
- Do not treat a client-provided cohort, role, or identity as trusted without server-side verification.
- Do not hard-code screenshot sample people, IDs, passwords, cohorts, courses, or software as production truth.
- Store content image references as validated external URLs; do not add image-upload infrastructure.
- Do not introduce semester data or controls for course summaries, even though semester controls appear in the references.
- Do not add roles, social features, payments, analytics, notifications, search, comments, ratings, or other unrequested functionality.

## Current Technical Baseline

Confirmed repository state at the end of Stage 1:

- Next.js 16.3.4 using the App Router and `src/` directory.
- React 19.2.8 and TypeScript.
- Tailwind CSS 4.
- ESLint 9 with the Next.js configuration.
- npm with `package-lock.json`.
- Import alias `@/*`.
- Current scripts: `npm run dev`, `npm run build`, `npm run start`, and `npm run lint`.
- The application provides database-backed student Course and Software libraries, authenticated identity, logout confirmation, and persisted admin management interfaces.
- A verified local development Docker workflow runs Next.js and PostgreSQL with source hot reload and isolated dependency/build-cache volumes.
- PostgreSQL migrations, environment-configured admin credentials, signed role sessions, protected routes, cohort-scoped reads, validated content CRUD, focused tests, and a production GHCR image workflow are implemented.

Before changing Next.js code, read the relevant documentation in `node_modules/next/dist/docs/` as required by the repository-level `AGENTS.md`. Do not rely on conventions from older Next.js versions.

## Proposed Application Areas

Exact route names are implementation proposals, not public contracts. Prefer the smallest App Router structure that supports these areas:

- Public student-ID entry.
- Student Course view.
- Student Software view.
- Separate admin login view.
- Protected admin Course management.
- Protected admin Software management.
- Protected admin cohort management.
- Create/edit forms or dialogs for each managed content type.

Do not create route layers, APIs, shared abstractions, or component systems before the current stage needs them.

## Implementation Stages

### Stage 1: Initialize Next.js

Status: **Complete and verified natively; Docker verification pending**

Implemented:

- Next.js project with TypeScript, App Router, Tailwind CSS, ESLint, npm, and `src/`.
- Neutral HIMTI KIT placeholder and metadata.
- Initial setup documentation and reference directory.
- Local Docker development configuration and usage documentation.

Verification recorded on 2026-09-06:

- `npm run lint` passed.
- `npm run build` passed.

Remaining Docker verification:

- Enable Docker Desktop integration for this WSL distribution.
- Run `docker compose config`.
- Verify the app at `http://localhost:3000` with `docker compose up --build`.
- Confirm source edits trigger hot reload.

### Stage 2: Build the Reference-Driven Interface

Status: **Complete; further browser visual verification was declined**

Goal: implement the complete visual flow with temporary in-memory or static fixture data, without prematurely deciding database or authentication details.

Implemented:

- Responsive student-ID entry screen using `public/bg.png` and the dark futuristic reference palette.
- Empty-input validation and keyboard form submission.
- Exact `0000000000` routing to `/admin/login` without creating an authenticated session.
- Separate admin-entry screen that clearly remains disabled until the credential mechanism and cohorts are implemented.
- Responsive student dashboard shell with fixture student identity, Course/Software navigation, major selection, and external-image summary cards.
- Native accessible logout confirmation dialog that returns to the Student ID entry screen.
- Temporary non-admin Student ID routing to the fixture Course dashboard so the Stage 2 interface can be demonstrated before authentication exists.
- Shared responsive student layout that preserves header, identity, navigation, background, footer, and logout state across Course and Software routes.
- Student Software view with six reference-derived fixture cards, external logo URLs, and external product download links.
- Shared responsive admin preview shell with explicit unauthenticated status and navigation for Course, Software, and cohort management.
- Reference-driven disabled admin login form that does not create a fake authenticated session or require a cohort.
- Fixture Course and Software management lists with cohort selection and native add, edit, and delete dialog states.
- Local-only cohort management demonstrating creation, removal of an unused cohort, and a clear blocked-removal explanation for a referenced cohort.

Implementation steps:

1. Inventory reusable visual assets from the six references and identify which page artwork is available versus which must be represented with existing repository assets or CSS.
2. Establish only the shared visual tokens needed by the references: colors, typography, spacing, radii, content widths, and responsive breakpoints.
3. Build the student entry screen from `Desktop - 1.png`.
4. Build the shared application header, identity panel, navigation, illustrated background, and responsive shell.
5. Build the student Course view using `Screenshot 2026-09-06 210216.png` and the visual direction in `Desktop - 2.png`.
6. Build the logout confirmation interaction shown in `Screenshot 2026-09-06 210216.png`.
7. Build the Software view from `Screenshot 2026-09-06 210232.png`.
8. Build the admin login view from `Screenshot 2026-09-06 210255.png`, intentionally moving cohort selection into authenticated management.
9. Build Course management from `Screenshot 2026-09-06 210312.png`, including add, edit, delete, and cohort-change interface states using non-persistent fixtures.
10. Apply the same screenshot-backed shell and action pattern to Software management without inventing fields not yet approved.
11. Add cohort-management interface states for creating a cohort, removing an unused cohort, and explaining why an associated cohort cannot be removed.
12. Omit the semester controls shown in the references because the confirmed course-summary model has no semester data.
13. Render fixture card images from external URLs and provide URL inputs in applicable admin fixture forms; do not build image uploads.
14. Add loading, empty, validation, error, focus, hover, and disabled states consistent with the established design.
15. Verify desktop fidelity, mobile usability, keyboard access, focus visibility, semantic controls, readable contrast, and reduced-motion behavior if motion is introduced.

Stage 2 acceptance criteria:

- Every supplied screen has a corresponding implemented interface state.
- The primary hierarchy, navigation, controls, card structure, and visual identity match the references closely.
- All primary flows can be demonstrated with fixtures, but no fixture is presented as permanent production data.
- Layouts work at desktop and mobile widths without horizontal page overflow.
- Forms and dialogs are operable with a keyboard and expose appropriate labels.
- `npm run lint` and `npm run build` pass.

### Stage 3: Add PostgreSQL and Authentication

Status: **Complete**

Confirmed implementation choices:

- Students must exist in a PostgreSQL roster with an explicit cohort assignment.
- A bootstrap administrator is configured through server-only environment credentials.
- Lesson and software resources use external links; uploads are not implemented.

Implementation steps:

1. Select the smallest database access and migration approach compatible with the confirmed deployment target and existing stack.
2. Define data models only after authentication, cohorts, and downloadable-resource storage decisions are confirmed; model content images as validated external URLs and omit semester data.
3. Model cohorts as persisted records managed by administrators rather than fixed application values.
4. Model student identity/cohort mapping if required by the confirmed student-access mechanism.
5. Model lesson summaries and software resources with explicit cohort association.
6. Add foreign-key restrictions that prevent removal of a cohort while students or content reference it, along with other constraints, nullability, and indexes based on actual query paths.
7. Create migrations without seeding cohorts, students, courses, or software; bootstrap admin credentials remain environment-configured.
8. Implement student access and session handling according to the confirmed mechanism.
9. Implement the separate secure admin authentication flow.
10. Implement server-enforced route protection and authorization.
11. Add environment-variable documentation without committing secrets.
12. Add focused tests for the `0000000000` routing trigger, failed authentication, session handling, admin authorization, and restricted cohort removal.

Stage 3 acceptance criteria:

- Database state is created through migrations, not manual production changes.
- Student cohort resolution follows the confirmed product rule.
- Cohorts are persisted and cannot be removed while referenced by a student or content record.
- The trigger ID never creates an authenticated admin session.
- Unauthenticated and unauthorized users cannot access admin data or mutations.
- Secrets and private user data are not exposed to the browser or logs.
- Relevant tests, linting, and the production build pass.

### Stage 4: Connect Content and Admin CRUD

Status: **Complete**

Implemented:

- Student identity and content are resolved from the signed session and assigned cohort.
- Lesson summaries are filtered by cohort and one of the ten supported majors; software resources are cohort-wide.
- Resource cards use persisted titles, descriptions, validated external image URLs, and validated external resource URLs.
- Admin student allowlist management, cohort selection, cohort creation and restricted removal, and Course/Software create, edit, and confirmed delete operations persist to PostgreSQL.
- Manual and CSV allowlist input derives `Binusian XX` from the first two digits of each ten-digit NIM; missing cohorts are created automatically.
- CSV imports require `name,nim`, support standard quoted values, update existing NIMs, and reject invalid files transactionally without partial writes.
- Server Actions independently enforce admin authorization, input validation, and cohort-scoped update/delete predicates.
- Empty, loading, operation-status, and student query-failure states are implemented.
- Focused tests cover student CSV parsing and inference, student and content validation, unsafe URL rejection, allowlist updates, cohort isolation, scoped updates/deletes, restricted cohort removal, and session integrity.

Implementation steps:

1. Replace Stage 2 fixtures with cohort-filtered database reads.
2. Connect student Course and Software cards and detail actions to persisted records.
3. Connect admin cohort selection to management queries.
4. Implement authorized, validated cohort creation and removal in the admin panel.
5. Block removal of referenced cohorts and clearly identify that associated students or content must first be removed or reassigned.
6. Implement validated create and edit operations for lesson summaries.
7. Implement validated create and edit operations for software resources.
8. Implement confirmed deletion with expected-error handling and user feedback.
9. Enforce authorization and cohort scope inside every server mutation.
10. Implement downloadable-resource links or file handling according to the confirmed storage decision; continue to use external URLs for images.
11. Add useful empty, loading, success, not-found, and failure states.
12. Add focused regression tests for cohort isolation, cohort creation and restricted removal, validation, content CRUD, and resource access.

Stage 4 acceptance criteria:

- Students see only content allowed for their resolved cohort.
- Admins can view and manage both content types for the selected cohort.
- Admins can add cohorts and remove only cohorts with no associated students or content.
- Attempts to remove an associated cohort preserve the cohort and return a clear explanation.
- Invalid data is rejected at the system boundary and does not create partial records.
- Delete operations require confirmation and produce clear outcomes.
- Downloadable-resource actions work according to their confirmed delivery contract, and content images load from validated external URLs.
- Relevant tests, linting, and the production build pass.

### Stage 5: Prepare and Verify Deployment

Status: **Implemented; automatic deployment verification pending**

Implementation steps:

1. Extend the existing development Docker workflow with only the production image and runtime configuration needed by the confirmed hosting environment.
2. Configure production-safe build and runtime settings; use Next.js standalone output only if the deployment approach benefits from it.
3. Document required environment variables and secret provisioning.
4. Document database migration and deployment procedures.
5. Add health or operational checks only if required by the chosen host.
6. Verify production authentication, authorization, cohort isolation, CRUD, resource delivery, and logout behavior.
7. Verify responsive layouts and accessibility in the production build.
8. Run linting, tests, and a clean production build.

Stage 5 acceptance criteria:

- A new developer can run the documented local workflow.
- Deployment does not embed secrets in source code or client bundles.
- Migrations have a documented, repeatable execution path.
- The production service starts successfully in the target environment.
- Critical student and admin flows pass deployment smoke testing.

## Open Decisions

These questions are intentionally unresolved. Do not choose defaults silently.

| Decision | Why it matters | Needed by |
| --- | --- | --- |
| What is the production hosting platform? | Determines Docker, runtime, database connectivity, storage, and deployment instructions. | Stage 5 |

## Explicit Non-Decisions

The following are not currently approved requirements:

- A particular ORM, authentication library, form library, component library, test framework, or storage provider.
- A specific route naming scheme.
- Public registration, password reset, email verification, or social login.
- Multiple admin roles or permissions beyond authenticated administration.
- Search, filtering beyond confirmed cohort/major controls, pagination, analytics, notifications, comments, or ratings.
- Semester fields, filters, tabs, or selectors for course summaries.
- Image file uploads; content images are external URLs.
- Offline support, native mobile applications, or localization.
- Permanent use of screenshot sample records or credentials.

## Verification Strategy

Run the narrowest relevant checks during implementation, followed by broader checks when a stage is complete.

Baseline commands:

```bash
npm run lint
npm run build
```

Add test commands to this document and `README.md` when a test framework is actually introduced. Do not claim a flow works based only on linting or compilation; behavior requiring a browser, database, authentication, or deployment must be tested in that environment.

For visual work, verify at minimum:

- The desktop composition against each reference image.
- A narrow mobile viewport and an intermediate tablet viewport.
- Keyboard navigation and visible focus.
- Form labels, validation, dialogs, and logout confirmation.
- Loading, empty, error, and long-content states.

For data and authentication work, verify at minimum:

- Normal student access.
- Invalid student access.
- Exact admin-trigger behavior.
- Failed and successful admin authentication.
- Direct unauthorized access to protected routes and mutations.
- Cohort isolation for reads and writes.
- Cohort creation, successful removal of an unused cohort, and blocked removal of an associated cohort.
- Create, edit, delete, and resource-access success and failure paths.
- Student allowlist creation, reassignment, duplicate/reserved NIM rejection, and removal.

## Project Definition of Done

The project is complete only when:

- All confirmed student and admin flows are implemented.
- All six references have corresponding, responsive interface states.
- Any intentional visual deviation is documented and justified by usability, accessibility, responsiveness, or security.
- PostgreSQL migrations and required environment variables are documented.
- Authentication and authorization are enforced on the server.
- Cohort-scoped content and both admin CRUD areas work with persisted data.
- Admin cohort creation and protected removal work with persisted data.
- Admin student allowlist creation, reassignment, and removal work with persisted data.
- The selected resource delivery approach works safely.
- Relevant automated checks pass.
- The production build and deployment smoke tests pass.
- `README.md`, this plan, and operational documentation match the shipped behavior.

## Progress

- [x] Stage 1 implementation: Initialize Next.js
- [x] Local Docker development configuration
- [x] Stage 1 native verification: Lint and production build
- [x] Docker verification: Compose configuration, startup, migration, seed, and runtime smoke checks
- [x] Stage 2: Build the reference-driven interface (additional browser visual/accessibility verification declined)
- [x] Stage 3: Add PostgreSQL and authentication
- [x] Stage 4: Connect content and admin CRUD
- [ ] Stage 5: Prepare and verify deployment (production rollout complete; automatic deployment verification pending)

## Next Action

Push the automatic deployment workflow to `main`, then confirm its VPS health check and production URL check pass.

## Decision Log

Record future product-owner decisions here with the date and enough context to prevent reinterpretation.

| Date | Decision | Impact |
| --- | --- | --- |
| 2026-09-06 | Entering exactly `0000000000` in the student-ID field opens the separate admin login flow but does not authenticate the admin. | Student entry routing and admin security behavior. |
| 2026-09-06 | Supplied screenshots are the visual source of truth; deviations should be limited to minor usability, accessibility, responsive, and security needs. | Stage 2 implementation and visual review. |
| 2026-09-06 | Lesson-summary and software images are supplied as external links, not uploaded files. | Content fields, admin forms, validation, and storage scope. |
| 2026-09-06 | Course summaries have no semester data, and semester controls shown in references must be omitted. | Course data model, student interface, filtering, and intentional reference deviation. |
| 2026-09-06 | Admins can add and remove persisted cohorts; removal is blocked while students or content reference the cohort. | Admin scope, database constraints, management UI, validation, and tests. |
| 2026-09-06 | Local Docker uses a development container with source hot reload; PostgreSQL and production containerization are deferred until their requirements are confirmed. | Local setup, documentation, and deployment scope. |
| 2026-09-06 | `public/bg.png` and the dark futuristic reference palette define the application theme; later green screenshots define layout and behavior where needed. | Resolves visual precedence for all Stage 2 screens. |
| 2026-09-06 | The student major selector contains the ten majors listed in the confirmed student requirements. | Student selector fixtures and future persisted major validation. |
| 2026-09-06 | Admin authentication does not require a cohort; cohort selection and first-cohort setup happen after authentication. | Prevents bootstrap deadlock and separates identity verification from management scope. |
| 2026-09-06 | Lesson summaries use title, description, external image URL, external resource URL, cohort, and major; software uses the same fields except major and is cohort-wide. | Finalizes the Stage 4 content contract and filtering behavior. |
| 2026-09-06 | Administrators manage the student NIM allowlist with a name and cohort assignment; `0000000000` remains reserved for the admin trigger. | Makes student access operational without weakening the separate admin authentication flow. |
| 2026-09-06 | Ten-digit NIM prefixes infer shortened cohort names such as `28` to `Binusian 28`; CSV imports use `name,nim`, create missing cohorts, update existing NIMs, and commit only when every row is valid. | Removes manual cohort assignment and defines deterministic bulk allowlist behavior. |
| 2026-09-06 | Use a PostgreSQL student roster with explicit cohort assignment, environment-configured bootstrap administrator credentials, and external resource links only. | Resolves Stage 3 identity, cohort mapping, and resource-storage decisions. |
| 2026-09-07 | Keep the database seed free of cohorts, students, courses, and software; administrator credentials remain environment-configured. | New installations start with empty managed content and no sample student access. |
| 2026-09-07 | Publish an amd64 production image to GHCR after PostgreSQL-backed checks pass on `main`; the VPS pulls the image rather than storing application source. | Establishes the first half of the production CI/CD path while keeping deployment configuration centralized on the VPS. |
| 2026-09-07 | After a successful `main` image publication, deploy over SSH by recreating only `himti-kit-prod`, then verify container health and the public URL. | Completes automatic production deployment without copying source, rewriting VPS secrets, or restarting Caddy. |
