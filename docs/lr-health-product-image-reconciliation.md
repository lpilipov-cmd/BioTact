# LR health product image reconciliation

## Scope and decision

This review covers all 50 inactive health products in `data/lr-health-products-review.json`. Images are used only for the protected local owner preview. No product was activated and no remote data was changed.

Only exact, attributable variants were accepted. A visually similar flavour, a family photograph for a specific SKU, or a crop containing several unrelated products was not accepted. For an LR multipack that is explicitly sold as multiple units of an individually verified product, the exact constituent image may represent the offer only when the quantity and constituent-image status are prominent and no special outer packaging is implied.

## Result

- Total candidates: **50**
- Verified unique/direct images: **40**
- Verified constituent-image presentations: **8**
- Accurate visual coverage: **48 of 50**
- Unresolved images: **2**
- LR Health Mission PDF: **24** verified images
- LR Serbian reference website: **11** verified images
- DE Collection 01/2026 PDF: **5** verified images
- Unrelated duplicate image-source reuse: **none**
- Generated or reconstructed packaging: **none**

For PDF images, the visible label and the image position beside the catalogue product name were checked. The canonical `article_number` was reconciled with the reviewed Serbian price-list dataset. For web images, the exact variant name or alt label on the approved LR reference page was checked against the same dataset. Source copies and optimized WebP derivatives are stored under `public/products/<article-number>/`.

## Targeted follow-up with the new owner sources

Both newly supplied sources were read in full and visually inspected. Their actual repository filenames include `(1)`: `BioTact_LR_Katalog_Redizajn_2026(1).pdf` and `DE_Collection012026(1).pdf`. Five of the 15 previously unresolved records are now verified:

| Article | Previous | New | Exact source | Acceptance reason |
| --- | --- | --- | --- | --- |
| 81100 | unresolved | verified | `DE_Collection012026(1).pdf`, page 16 | Açaí Pro Summer name, individual 1000 ml bottle and SKU 81100 appear together. |
| 81255 | unresolved | verified | `DE_Collection012026(1).pdf`, page 48 | Berry Dream Bowl package, 450 g content and SKU 81255 appear together. The reviewed Serbian price list uses the descriptive name “ovsena kaša sa šumskim voćem”. |
| 81249 | unresolved | verified | `DE_Collection012026(1).pdf`, page 49 | The official page directly labels the wrapped Berry Snack image as SKU 81249, sold as 6 x 35 g. The image represents one sealed unit from the six-unit sales package. |
| 81248 | unresolved | verified | `DE_Collection012026(1).pdf`, page 49 | The official page directly labels the wrapped Almond Snack image as SKU 81248, sold as 6 x 35 g. The image represents one sealed unit from the six-unit sales package. |
| 81260 | unresolved | verified | `DE_Collection012026(1).pdf`, page 43 | The LR BODY MISSION one-month free-choice composition and SKU 81260 appear together with the exact set image. |

## Multipack visual-resolution follow-up

Official LR Collection pages reconfirm the article number, exact variant and quantity for each of the eight multipacks below. These records use `verified_constituent_image`, not `verified_unique_image`: the image is the exact constituent product and is not evidence of a separate physical multipack box.

| Multipack SKU | Quantity | Verified constituent artwork | Official LR source confirmation |
| --- | --- | --- | --- |
| 80743 | 3 × 1.000 ml | 80700 Traditional Honey | Collection page 14: 80743 · 3 x 1000 ml |
| 81003 | 3 × 1.000 ml | 81000 Immune Plus | Collection page 14: 81003 · 3 x 1000 ml |
| 80783 | 3 × 1.000 ml | 80750 Peach | Collection page 15: 80783 · 3 x 1000 ml |
| 80883 | 3 × 1.000 ml | 80850 Active Freedom | Collection page 15: 80883 · 3 x 1000 ml |
| 80823 | 3 × 1.000 ml | 80800 Intense Sivera | Collection page 16: 80823 · 3 x 1000 ml |
| 81103 | 3 × 1.000 ml | 81100 Açaí Pro Summer | Collection page 16: 81103 · 3 x 1000 ml |
| 80935 | 5 × 500 ml, slobodan izbor Green / Red | 80900 Formula Green and 80950 Formula Red | Collection pages 26 and 28: 80935 · 5 x 500 ml, free choice Green/Red |
| 80945 | 5 × 500 ml | 80940 Formula Gold | Collection page 27: 80945 · 5 x 500 ml |

The UI shows a restrained `MULTIPACK` badge, the exact quantity and an explanatory notice. SKU 80935 shows both verified variants and states that the composition is freely chosen rather than fixed. No label artwork is edited and no package is generated.

## Unresolved products

| Article | Reason |
| --- | --- |
| 95213 | The TurboKid honey set and SKU 95213 do not appear in either new PDF. |
| 96034 | The TurboKid peach set and SKU 96034 do not appear in either new PDF. |

## Source limitations

The initial pass did not have the two additional catalogues. The image follow-up used their actual filenames and the German collection supplied five unique-image matches. This later multipack follow-up does not claim those eight SKUs have unique packaging imagery: it records only a verified relationship to exact constituent artwork after LR's own article number and quantity were reconfirmed.

The German collection shows newer Açaí Pro Summer and Berry Dream Bowl packaging than the older Health Mission material. These newer, explicitly identified official packages were preferred. No existing public name, description, or price was changed; the image reconciliation records the naming/version difference.

The detailed record for every article, including source reference, dimensions, local path, and variant-verification note, is in `data/lr-health-product-images-review.json`.

## R2 image-quality upgrade

All 50 product records and all 40 unique image files were re-audited against the reviewed Serbian SKU list, the owner catalogues, the official Serbian LR reference site and exact product pages in the official LR online shop. The final local assets are never hotlinked.

- **33 unique images upgraded** to exact official LR CDN product assets at **884 × 1200 px**.
- **7 unique images retained** because the existing verified source remains appropriate: 80900, 81100, 81140, 81170, 81247, 81248 and 81249.
- **8 multipack relationships retained** without inventing outer packaging. Their constituent artwork benefits automatically when the underlying individual image was upgraded.
- **2 TurboKid sets remain unresolved** and continue to use the neutral BIOTACT fallback: 95213 and 96034.
- Official source domains used: `shop.lrworld.com`, `cdn.lrworld.com` and `srb.lr-world.info`.

Representative resolution improvements:

| Article | Previous source / derivative | New source / derivative | Decision |
| --- | --- | --- | --- |
| 80700 | 239 × 325 px | 884 × 1200 px | Exact Traditional Honey bottle from the official LR shop/CDN. |
| 80325 | 239 × 325 px | 884 × 1200 px | Exact Cistus Incanus capsules and matching short article number. |
| 80940 | 239 × 325 px | 884 × 1200 px | Exact Mind Master Formula Gold bottle. |
| 81245 | 1024 × 768 px recipe visual | 884 × 1200 px package visual | The exact Spicy Curry package replaces the earlier prepared-soup photograph. |
| 81260 | 679 × 473 px | 884 × 1200 px | Exact official LR BODY MISSION one-month free-choice set. |

The same exact-package correction was applied to the available FIGUACTIVE shakes and soups. Small retained snack images (81248 and 81249) are constrained to their useful native display size instead of being stretched on the detail page. Every record now carries its previous source and dimensions, upgraded URL and dimensions where applicable, local source and optimized paths, verification reason, and one explicit status: `upgraded_official`, `retained_verified` or `unresolved`.

## Safety confirmation

No substitute images were used. LR branding was not removed. Images and outer packaging were not generated. Public product content does not expose partner prices or points, article numbers remain relegated to technical details, and inactive records remain unavailable through public RLS.
