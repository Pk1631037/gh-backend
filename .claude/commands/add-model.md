Create only a Mongoose model for this Node.js/TypeScript project.

Model name: $ARGUMENTS

Create `src/models/<Model>.ts` with:
- IModel interface for document fields
- IModelMethods interface for instance methods (if any)
- ModelDocument type = Document & IModel & IModelMethods
- Schema with proper field types, validators, trim, required messages
- timestamps: true
- Indexes on fields that will be queried or sorted
- Pre-save hooks if needed (e.g. password hashing)
- Instance methods if needed
- Proper TypeScript model export

Follow mongoose rules from docs/mongoose-schema-and-crud.md.
