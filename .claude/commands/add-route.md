Add a new route to this Node.js/TypeScript/Express project.

Route details: $ARGUMENTS

Create `src/routes/<feature>Routes.ts` and mount it in `src/app.ts`.

Rules:
- Public GET routes need no auth middleware
- Protected routes use the protect middleware from src/middlewares/auth.ts
- Validators from src/validators/ are applied before controllers
- Controllers are imported from src/controllers/
- Mount in app.ts: app.use('/api/v1/<resource>', <resource>Routes)
