# Generated database types

`database.types.ts` is generated from the applied local Supabase schema and must
not be written or edited by hand.

After starting a Docker-compatible runtime, run:

```bash
npm run db:reset
npm run db:types
```

Regenerate and commit the type file after every schema migration.
