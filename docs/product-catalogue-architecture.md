# BIOTACT product catalogue architecture

Status: Phase 1 architecture complete; product content is intentionally empty.

## Data ownership

- `public.products` contains public catalogue identity, neutral content, catalogue price, source references and publication state.
- `private.product_commercial_data` contains LR partner price and points. It is not granted to `anon` and is readable or writable only by an authenticated BIOTACT administrator through RLS.
- `public.package_products` is the canonical many-to-many relationship between BIOTACT packages and individual products.
- `public.leads.product_interest_id` records an optional individual-product interest. A public submission may reference one package, one product or neither, but never both.

All monetary database fields use `numeric(10,2)`. Admin forms transmit validated decimal strings without calculating, converting or rounding them. Public pages expose only `catalogue_price_eur`; partner prices and points are never selected by public queries.

## Compatibility

`public.packages.product_codes` remains in place as a temporary backwards-compatibility field for the already published package catalogue. New relationships must use `public.package_products`. Its removal requires a later reviewed migration after every production package has a verified relationship row and all callers use the join table.

The existing `public.submit_lead` RPC remains unchanged. Product submissions use `public.submit_product_lead`, which delegates consent, idempotency, durable rate limiting and PII handling to the existing RPC and then records the verified active product interest. Existing package clients therefore remain compatible.

## Publication and images

Products default to inactive. Anonymous clients can read only active rows. Missing images render a neutral fallback; an image path is accepted only below `/products/`. Exact official imagery must later be downloaded to `public/products/<article-number>/`, optimized without altering packaging branding, and accompanied by its source URL.

## Future import workflow

1. Reconcile the current Serbian price list with the LR catalogue and official product page.
2. Record the base `article_number` separately from `catalogue_source_code`; never infer equivalence silently.
3. Prepare a deterministic JSON review payload with exact decimal strings and source URLs.
4. Verify article-number uniqueness, descriptions and exact images.
5. Run a local-only, idempotent SQL import. Every imported product remains inactive.
6. Run database, unit, build and E2E validation.
7. Obtain a separate owner authorization before any production content insertion or activation.

No product rows, prices or images are part of this architecture step.
