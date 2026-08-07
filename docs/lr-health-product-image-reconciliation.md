# LR health product image reconciliation

## Scope and decision

This review covers all 50 inactive health products in `data/lr-health-products-review.json`. Images are used only for the protected local owner preview. No product was activated and no remote data was changed.

Only exact, attributable variants were accepted. A visually similar flavour, a single bottle for a three-pack, a family photograph for a specific SKU, or a crop containing several products was not accepted as a replacement.

## Result

- Total candidates: **50**
- Verified images: **40**
- Unresolved images: **10**
- LR Health Mission PDF: **24** verified images
- LR Serbian reference website: **11** verified images
- DE Collection 01/2026 PDF: **5** verified images
- Duplicate image-source reuse: **none**
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

## Unresolved products

| Article | Reason |
| --- | --- |
| 80743 | Page 14 lists SKU 80743 but shows only one 80700 bottle, not a three-bottle honey package. |
| 81003 | Page 14 lists SKU 81003 but shows only one 81000 bottle, not a three-bottle Immune Plus package. |
| 80783 | Page 15 lists SKU 80783 but shows only one 80750 bottle, not a three-bottle peach package. |
| 80883 | Page 15 lists SKU 80883 but shows only one 80850 bottle, not a three-bottle Freedom package. |
| 80823 | Page 16 lists SKU 80823 but shows only one 80800 bottle, not a three-bottle Sivera package. |
| 81103 | Page 16 lists SKU 81103 but shows only one 81100 bottle, not a three-bottle Açaí package. |
| 95213 | The TurboKid honey set and SKU 95213 do not appear in either new PDF. |
| 96034 | The TurboKid peach set and SKU 96034 do not appear in either new PDF. |
| 80935 | Pages 26 and 28 list the Green/Red free-choice five-set, but each page shows one bottle of only one variant. Neither is an exact mixed-set image. |
| 80945 | Page 27 lists the Gold five-set but shows only one 80940 bottle, not a five-bottle set. |

## Source limitations

The initial pass did not have the two additional catalogues. The follow-up used their actual filenames and did not silently map single-bottle artwork to multipack SKUs. The redesigned BioTact PDF did not provide additional SKU-specific images for the remaining records; the German collection supplied the five accepted matches above.

The German collection shows newer Açaí Pro Summer and Berry Dream Bowl packaging than the older Health Mission material. These newer, explicitly identified official packages were preferred. No existing public name, description, or price was changed; the image reconciliation records the naming/version difference.

The detailed record for every article, including source reference, dimensions, local path, and variant-verification note, is in `data/lr-health-product-images-review.json`.

## Safety confirmation

No substitute images were used. LR branding was not removed. Images were not generated. Public product content does not expose partner prices or points, and inactive records remain unavailable through public RLS.
