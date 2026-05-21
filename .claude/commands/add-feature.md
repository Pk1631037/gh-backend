Generate a complete end-to-end feature for this Node.js/TypeScript/Express/Mongoose project.

Feature name: $ARGUMENTS

Create ALL of the following files completely — no placeholders, no TODOs:

1. `src/models/<Feature>.ts`
   - Mongoose schema with proper TypeScript interfaces (IFeature, IFeatureMethods, FeatureDocument)
   - timestamps: true
   - Indexes on fields used in queries
   - Instance methods if needed

2. `src/validators/<feature>Validator.ts`
   - Zod schemas for create and update
   - validate() middleware wrapper that calls next(new AppError(..., 400)) on failure

3. `src/services/<feature>Service.ts`
   - getAll(page, limit) with Redis cache-aside using cache.key helpers
   - getById(id) with Redis cache
   - create(data, userId) — invalidates list cache
   - update(id, data, userId) — ownership check, invalidates item + list cache
   - remove(id, userId, userRole) — ownership + admin check, invalidates cache
   - Throw new AppError for all known failures (404, 403, 409)

4. `src/controllers/<feature>Controller.ts`
   - Thin controllers wrapping each service method in catchAsync
   - Proper req.user usage for auth
   - res.status(201) for create, 204 for delete, 200 for rest

5. `src/routes/<feature>Routes.ts`
   - Public GET routes (no auth)
   - Protected POST/PATCH/DELETE routes using protect middleware
   - Validators applied before controllers

6. Mount the route in `src/app.ts`:
   - Import and add: app.use('/api/v1/<feature>s', <feature>Routes)

Follow these project rules from docs/:
- catchAsync on every async controller — never write try/catch in controllers
- All errors thrown as AppError — never plain Error
- Services handle all DB + cache logic — controllers only call service and send response
- String(doc.field) === String(userId) for ObjectId comparisons
- .lean() on all read-only queries
- fetch → mutate → save pattern for updates (not findByIdAndUpdate) so hooks run
