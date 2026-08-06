type InterestOption = Readonly<{ id: string; slug: string }>;

export function resolveContactInterest(
  packages: readonly InterestOption[],
  products: readonly InterestOption[],
  requestedPackageSlug?: string,
  requestedProductSlug?: string,
) {
  const packageInterestId = packages.find(
    (item) => item.slug === requestedPackageSlug,
  )?.id;
  const productInterestId = packageInterestId
    ? undefined
    : products.find((item) => item.slug === requestedProductSlug)?.id;

  return { packageInterestId, productInterestId };
}
