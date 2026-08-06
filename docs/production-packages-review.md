# BIOTACT production package review

Status: **CATALOGUE-VERIFIED LAUNCH SET APPROVED FOR PUBLICATION**
Prepared: 6 August 2026

## Final launch decision - 6 August 2026

The production launch is limited to four packages composed only of product codes that are visibly and unambiguously paired with products in the LR catalogue. All four records use `price_rsd: null`, are activated only by the guarded production import, and use public sort orders 1 through 4.

| Sort | Package | Category | Final verified product codes | Launch decision |
| ---: | --- | --- | --- | --- |
| 1 | Imunitet Start | `imunitet` | `80361-50`, `80325-50` | **PUBLISH** |
| 2 | Creva & Energija | `digestija` | `81180-99`, `80205-650` | **PUBLISH** |
| 3 | Pokret & Snaga | `pokret` | `80850-680`, `80190-50` | **PUBLISH** |
| 4 | Srce & Cirkulacija | `srce` | `80800-50`, `80338-699`, `80331-50` | **PUBLISH** |

Final public descriptions:

- **Imunitet Start:** Namenjen osobama koje žele podršku svakodnevnoj wellness rutini. Paket objedinjuje LR LIFETAKT Tečni Colostrum i Cistus Incanus Capsule iz kataloga.
- **Creva & Energija:** Namenjen osobama koje žele jednostavnu podršku svakodnevnoj wellness rutini i ishrani. Paket objedinjuje PRO 12+ i LR LIFETAKT Herbal Fasting Tea.
- **Pokret & Snaga:** Namenjen osobama koje žele podršku aktivnom načinu života. Paket objedinjuje Aloe Vera Drinking Gel Active Freedom i LR LIFETAKT Active Freedom Capsule.
- **Srce & Cirkulacija:** Namenjen osobama koje žele podršku svakodnevnoj wellness rutini usmerenoj na srce i cirkulaciju. Paket objedinjuje Aloe Vera Drinking Gel Intense Sivera, Super Omega Capsule i LR LIFETAKT Reishi Plus Capsules.

Catalogue verification used for this decision:

- Catalogue p. 13: LR LIFETAKT Tečni Colostrum (`80361-50`) and LR LIFETAKT Cistus Incanus Capsule (`80325-50`).
- Catalogue p. 7: PRO 12+ (`81180-99`) and LR LIFETAKT Herbal Fasting Tea (`80205-650`).
- Catalogue p. 15: Aloe Vera Drinking Gel Active Freedom (`80850-680`) and LR LIFETAKT Active Freedom Capsule (`80190-50`).
- Catalogue p. 11: Aloe Vera Drinking Gel Intense Sivera (`80800-50`), Super Omega Capsule (`80338-699`) and LR LIFETAKT Reishi Plus Capsules (`80331-50`).

Explicit exclusions:

- Body Mission and Lepota iznutra are not part of this launch.
- Aloe Vera Immune Plus and Traditional Aloe Vera Gel with Honey are not part of this launch.
- Conflicting code `80700-50`, every missing code, every `TEMP-*` code, prices and imagery are excluded.
- Earlier package proposals below remain as an audit trail and do not override this final launch decision.

This document reconciles the proposed BIOTACT packages against the committed product catalogue. It is a content-review artifact only. It must not be treated as a price list, medical recommendation, import script, or confirmation of current LR availability.

## Source hierarchy and reconciliation

Sources read in full:

1. `KATALOG_LR_HEALTH_MISSION_2026.pdf` - primary authority for product names, catalogue descriptions, visible packaging information and product codes.
2. `BIOTACT_Strategija_i_Plan_Prodaje.docx` - proposal for package groupings only. Product codes from this document are not treated as authoritative.
3. `BIOTACT_Tehnicka_Specifikacija.md (1).pdf` - authority for platform constraints, database categories, editable prices and content safety.

Repository note: `DE_CareerPlan2026_RZ.pdf` is an additional German LR career-plan document. It is not the BIOTACT strategy and was not used as a source for package composition, product codes, public claims or prices.

Material source issues:

- The catalogue assigns `80700-50` to both **Tradicionalni gel za piće sa medom** and **Gel za piće Immune Plus** on catalogue page 4. Immune Plus is again shown as `80700-50` on page 12. This is a source conflict and requires written OWNER/LR verification. Neither product is treated as having a verified code in the import draft.
- The strategy says it presents five starter packages, but its package table contains six. This review follows the owner's requested six categories.
- The strategy proposes product codes for some items, but catalogue confirmation is missing for Fiber Boost, Colostrum capsules, 5 in 1 Natural Beauty Elixir and all named LR FIGUACTIVE variants. Those codes must not be inferred from packaging images or strategy text.
- The catalogue gives `80338-699 · 100 g` for Super Omega Capsule and separately says the container has 60 capsules. Both values are retained as catalogue information; availability and market-specific labeling still require owner confirmation.
- No source contains an approved Serbian 2026 retail price list. Every proposed record therefore uses `price_rsd: null` (`Cena na upit`).

## Status legend

- **VERIFIED FROM CATALOGUE** - product name and code are visibly paired in the catalogue.
- **MISSING FROM CATALOGUE** - a proposed product or variant is not identified in the catalogue.
- **CONFLICT IN SOURCE** - the catalogue contradicts itself.
- **OWNER/LR VERIFICATION REQUIRED** - the product appears, but a required value is absent or ambiguous.

---

## 1. Imunitet Start

- **Proposed public name:** Imunitet Start
- **Proposed slug:** `imunitet-start`
- **Database category:** `imunitet`
- **Safe public description:** Namenjen osobama koje žele podršku svakodnevnoj wellness rutini tokom različitih godišnjih doba. Proizvodi iz ovog paketa kombinuju aloe vera napitak, Cistus Incanus i kolostrum iz LR LIFETAKT portfolija.
- **price_rsd:** `null` - Cena na upit
- **active recommendation:** **KEEP INACTIVE UNTIL VERIFIED**
- **sort_order:** `10`

### Proposed product list

| Product | Catalogue packaging | Product code | Source | Verification status |
| --- | --- | --- | --- | --- |
| Gel za piće Immune Plus | 1.000 ml | `80700-50` in source, not approved for use | Catalogue p. 4, “Gelovi za piće”; p. 12, “Imuni sistem” | **CONFLICT IN SOURCE; OWNER/LR VERIFICATION REQUIRED** |
| LR LIFETAKT Cistus Incanus Capsule | 60 capsules; 33 g | `80325-50` | Catalogue p. 13, “Kolostrum i biljna snaga” | **VERIFIED FROM CATALOGUE** |
| LR LIFETAKT Colostrum kapsule | 60 capsules; net weight not stated | Not shown | Catalogue p. 13, “Kolostrum i biljna snaga” | **OWNER/LR VERIFICATION REQUIRED** |

### Notes and unresolved questions

- Obtain written LR confirmation for the Immune Plus code before activating or displaying its code.
- Confirm the Colostrum capsule code and net packaging quantity.
- Confirm that the owner intends capsules rather than the separately catalogued **LR LIFETAKT Tečni Colostrum** (`80361-50`, 125 ml).
- The JSON draft contains only the unambiguous Cistus code; it does not claim that this alone represents the final bundle.

---

## 2. Creva & Energija

- **Proposed public name:** Creva & Energija
- **Proposed slug:** `creva-energija`
- **Database category:** `digestija`
- **Safe public description:** Namenjen osobama koje žele jednostavnu podršku svakodnevnoj ishrani i unosu vlakana. Proizvodi iz ovog paketa obuhvataju PRO 12+ kapsule, Fiber Boost i LR LIFETAKT biljni čaj.
- **price_rsd:** `null` - Cena na upit
- **active recommendation:** **KEEP INACTIVE UNTIL VERIFIED**
- **sort_order:** `20`

### Proposed product list

| Product | Catalogue packaging | Product code | Source | Verification status |
| --- | --- | --- | --- | --- |
| PRO 12+ Capsules | 17 g | `81180-99` | Catalogue p. 7, “Podrška crevnoj flori” | **VERIFIED FROM CATALOGUE** |
| Fiber Boost | Not stated | Not shown | Catalogue p. 7, “Podrška crevnoj flori” | **OWNER/LR VERIFICATION REQUIRED** |
| LR LIFETAKT Herbal Fasting Tea | 250 g | `80205-650` | Catalogue p. 7, “Podrška crevnoj flori” | **VERIFIED FROM CATALOGUE** |

### Notes and unresolved questions

- Confirm the Fiber Boost code and packaging before activation.
- The strategy's “detoks” positioning was removed. Public wording is limited to everyday nutrition, fiber intake and the catalogue product names.
- Confirm whether “Energija” should remain in the public package name; the catalogue groups these products under digestive health, not a separately coded energy bundle.

---

## 3. Body Mission

- **Proposed public name:** Body Mission
- **Proposed slug:** `body-mission`
- **Database category:** `forma`
- **Safe public description:** Namenjen osobama koje žele praktičnije planiranje nutritivno uravnoteženih obroka i podršku kontroli telesne mase. Predlog kombinuje izbor LR FIGUACTIVE obroka sa LR LIFETAKT Pro Balance proizvodom, uz konačan sastav koji vlasnik treba da potvrdi.
- **price_rsd:** `null` - Cena na upit
- **active recommendation:** **KEEP INACTIVE UNTIL VERIFIED**
- **sort_order:** `30`

### Proposed product list

| Product | Catalogue packaging | Product code | Source | Verification status |
| --- | --- | --- | --- | --- |
| LR FIGUACTIVE shakes - five flavors | Individual flavor names and sizes are not stated in catalogue text | Not shown | Catalogue pp. 20-21, “LR Body Mission” / “Šejkovi - 5 ukusa” | **OWNER/LR VERIFICATION REQUIRED** |
| LR FIGUACTIVE soups | Individual product names and sizes are not stated | Not shown | Catalogue p. 21, “Supe - jednostavno ukusne” | **OWNER/LR VERIFICATION REQUIRED** |
| LR FIGUACTIVE Crusty Raspberry Flakes | Packaging size not stated | Not shown | Catalogue p. 21, “Hrskave pahuljice” | **OWNER/LR VERIFICATION REQUIRED** |
| LR LIFETAKT Pro Balance | Packaging size not stated | `80102-50` | Catalogue p. 5, “Ciljane formule za srce i pokret” | **VERIFIED FROM CATALOGUE** |

### Notes and unresolved questions

- The catalogue confirms product families and images, but not the codes or package sizes required to define a precise FIGUACTIVE bundle.
- Owner must choose exact shake flavors, soups, quantities and whether Crusty Raspberry Flakes is included.
- Confirm that Pro Balance is intended in this bundle. Its code is verified independently, but the catalogue does not define it as a mandatory Body Mission component.
- The JSON draft contains only the verified Pro Balance code and must remain inactive.

---

## 4. Pokret & Snaga

- **Proposed public name:** Pokret & Snaga
- **Proposed slug:** `pokret-snaga`
- **Database category:** `pokret`
- **Safe public description:** Namenjen osobama koje žele podršku aktivnom načinu života. Proizvodi iz ovog predloga dolaze iz LR LIFETAKT portfolija za svakodnevnu rutinu pokreta i uključuju Active Freedom, Protein Power i Super Omega.
- **price_rsd:** `null` - Cena na upit
- **active recommendation:** **KEEP INACTIVE UNTIL VERIFIED**
- **sort_order:** `40`

### Proposed product list

| Product | Catalogue packaging | Product code | Source | Verification status |
| --- | --- | --- | --- | --- |
| Gel za piće Active Freedom | 1.000 ml | `80850-680` | Catalogue p. 15, “Sloboda kretanja” | **VERIFIED FROM CATALOGUE** |
| LR LIFETAKT Active Freedom Capsule | 60 capsules; 37,40 g | `80190-50` | Catalogue p. 15, “Sloboda kretanja” | **VERIFIED FROM CATALOGUE** |
| Protein Power - vanilla | 375 g | `80550-411` | Catalogue p. 15, “Sloboda kretanja” | **VERIFIED FROM CATALOGUE** |
| Super Omega Capsule | 60 capsules; catalogue also states 100 g | `80338-699` | Catalogue p. 11, “Nega za srce i krvne sudove” | **VERIFIED FROM CATALOGUE** |

### Notes and unresolved questions

- The strategy says Active Freedom gel **or** capsules. The owner must choose one format or explicitly approve both; the review does not silently resolve that alternative.
- The inactive JSON record lists all verified candidate codes so none is fabricated. It is not approval of a four-product final bundle.
- Confirm current LR availability and exact quantity of every component before activation.

---

## 5. Lepota iznutra

- **Proposed public name:** Lepota iznutra
- **Proposed slug:** `lepota-iznutra`
- **Database category:** `lepota`
- **Safe public description:** Namenjen osobama koje žele podršku svakodnevnoj rutini lepote iznutra. Predlog kombinuje 5 in 1 Natural Beauty Elixir i tradicionalni aloe vera gel za piće sa medom.
- **price_rsd:** `null` - Cena na upit
- **active recommendation:** **KEEP INACTIVE UNTIL VERIFIED**
- **sort_order:** `50`

### Proposed product list

| Product | Catalogue packaging | Product code | Source | Verification status |
| --- | --- | --- | --- | --- |
| 5 in 1 Natural Beauty Elixir | Not stated | Not shown | Catalogue p. 18, “Tajna prave lepote” | **OWNER/LR VERIFICATION REQUIRED** |
| Tradicionalni gel za piće sa medom | 1.000 ml | `80700-50` in source, not approved for use | Catalogue p. 4, “Gelovi za piće” | **CONFLICT IN SOURCE; OWNER/LR VERIFICATION REQUIRED** |

### Notes and unresolved questions

- This proposal has **no unambiguous verified product code**. The current database requires at least one product code, so no valid import record has been fabricated.
- It appears only in the JSON document's `blocked_packages` section.
- Obtain written codes for both products and confirm current package sizes before creating an importable record.

---

## 6. Srce & Cirkulacija

- **Proposed public name:** Srce & Cirkulacija
- **Proposed slug:** `srce-cirkulacija`
- **Database category:** `srce`
- **Safe public description:** Namenjen osobama koje žele podršku svakodnevnoj wellness rutini usmerenoj na srce i cirkulaciju. Proizvodi iz ovog paketa su Super Omega Capsule, Aloe Vera Drinking Gel Intense Sivera i LR LIFETAKT Reishi Plus Capsules.
- **price_rsd:** `null` - Cena na upit
- **active recommendation:** **READY FOR OWNER REVIEW**
- **sort_order:** `60`

### Proposed product list

| Product | Catalogue packaging | Product code | Source | Verification status |
| --- | --- | --- | --- | --- |
| Super Omega Capsule | 60 capsules; catalogue also states 100 g | `80338-699` | Catalogue p. 11, “Nega za srce i krvne sudove” | **VERIFIED FROM CATALOGUE** |
| Aloe Vera Drinking Gel Intense Sivera | 1.000 ml | `80800-50` | Catalogue p. 11, “Nega za srce i krvne sudove” | **VERIFIED FROM CATALOGUE** |
| LR LIFETAKT Reishi Plus Capsules | 15,60 g | `80331-50` | Catalogue p. 11, “Nega za srce i krvne sudove” | **VERIFIED FROM CATALOGUE** |

### Notes and unresolved questions

- All proposed codes are visibly paired with these products in the catalogue.
- “45+” from the strategy was removed because the owner requested the public name “Srce & Cirkulacija” and the catalogue does not present this as an age-restricted bundle.
- Ready for owner review does not mean ready for activation: the owner still needs to confirm composition, current availability, Serbian labeling and price.

---

## Content safety review

The proposed public descriptions were rewritten to avoid treatment, prevention, diagnosis and guaranteed-result language. Corrections include:

| Source concept | Safe treatment in draft |
| --- | --- |
| “Jačanje imuniteta / prevencija” | Rewritten as support for an everyday wellness routine during different seasons. |
| “Varenje, energija, detoks” | Removed “detoks” and limited wording to everyday nutrition and fiber intake. |
| “Mršavljenje” and catalogue weight-loss wording | Rewritten as practical meal planning and support for weight management; no promised result or amount. |
| “Prevencija, srce, energija” | Removed prevention wording; retained neutral support for an everyday wellness routine. |
| Catalogue phrases such as “jača”, “sprečava” and result-oriented claims | Not carried into the public descriptions. |

All six final descriptions avoid: `leči`, `izleči`, `sprečava`, `prevencija bolesti`, `terapija`, `dijagnoza`, `zamena za lek`, `garantovano`, medical “detoks” claims and guaranteed weight loss. They are within the application's 2,000-character description limit and pass the existing prohibited-claim patterns.

## Owner approval checklist

Before any production import or activation, the owner should obtain or confirm:

1. Written LR resolution of the `80700-50` conflict.
2. Codes and package sizes for Colostrum capsules, Fiber Boost, 5 in 1 Natural Beauty Elixir and every selected FIGUACTIVE variant.
3. Exact Body Mission variants and quantities.
4. Gel-versus-capsule decision for Pokret & Snaga.
5. Current availability and Serbian-market labeling for every item.
6. Official 2026 Serbian retail prices; until then every price remains `null` / “Cena na upit”.
7. Explicit owner approval of each public description and final bundle composition.

The companion JSON is a draft only. It must not be executed, seeded or imported without completing this checklist and a separate implementation authorization.
