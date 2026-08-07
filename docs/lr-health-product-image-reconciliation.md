# LR health product image reconciliation

## Scope and decision

This review covers all 50 inactive health products in `data/lr-health-products-review.json`. Images are used only for the protected local owner preview. No product was activated and no remote data was changed.

Only exact, attributable variants were accepted. A visually similar flavour, a single bottle for a three-pack, a family photograph for a specific SKU, or a crop containing several products was not accepted as a replacement.

## Result

- Total candidates: **50**
- Verified images: **35**
- Unresolved images: **15**
- LR Health Mission PDF: **24** verified images
- LR Serbian reference website: **11** verified images
- Duplicate image-source reuse: **none**
- Generated or reconstructed packaging: **none**

For PDF images, the visible label and the image position beside the catalogue product name were checked. The canonical `article_number` was reconciled with the reviewed Serbian price-list dataset. For web images, the exact variant name or alt label on the approved LR reference page was checked against the same dataset. Source copies and optimized WebP derivatives are stored under `public/products/<article-number>/`.

## Unresolved products

| Article | Reason |
| --- | --- |
| 80743 | Exact three-bottle honey package image was not found. |
| 81003 | Exact three-bottle Immune Plus package image was not found. |
| 80783 | Exact three-bottle peach package image was not found. |
| 80883 | Exact three-bottle Freedom package image was not found. |
| 80823 | Exact three-bottle Sivera package image was not found. |
| 81100 | No exact, clearly labelled Acai image was available in the supplied catalogue or approved LR page. |
| 81103 | Exact three-bottle Acai package image was not found. |
| 95213 | The available family/set imagery did not prove the exact reviewed set composition. |
| 96034 | The available family/set imagery did not prove the exact reviewed set composition. |
| 80935 | A generic Mind Master family image was not assigned to the exact mixed five-pack. |
| 80945 | An exact Gold five-pack image was not found. |
| 81255 | An exact, clearly labelled forest-fruit oatmeal image was not found. |
| 81249 | An exact Berry Snack six-pack image was not found. |
| 81248 | An exact Almond Snack six-pack image was not found. |
| 81260 | The available Body Mission family image did not prove the exact monthly-package composition. |

## Source limitations

`BioTact_LR_Katalog_Redizajn_2026.pdf` and `DE_Collection012026.pdf` were not present in the repository under those names during this step. Their absence was not filled by assumptions. The available owner-provided `KATALOG_LR_HEALTH_MISSION_2026.pdf` and approved LR reference pages were sufficient for the 35 verified records above.

The detailed record for every article, including source reference, dimensions, local path, and variant-verification note, is in `data/lr-health-product-images-review.json`.

## Safety confirmation

No substitute images were used. LR branding was not removed. Images were not generated. Public product content does not expose partner prices or points, and inactive records remain unavailable through public RLS.
