import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {json, redirect, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, useSearchParams} from '@remix-run/react';
import {Pagination, getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';
import {BrandContainer, BrandPageSection} from '~/components/ui/brand';
import {SectionHeader} from '~/components/ui/commerce/section-header';
import {Card, CardContent, CardHeader, CardTitle} from '~/components/ui/card';
import {Button} from '~/components/ui/button';
import {PriceBadge} from '~/components/ui/commerce/price-badge';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '~/components/ui/sheet';
import {Badge} from '~/components/ui/badge';

export const meta: V2_MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data.collection.title} Collection`}];
};

export async function loader({request, params, context}: LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  const url = new URL(request.url);
  const sort = url.searchParams.get('sort') ?? 'featured';
  const sortMap = {
    featured: {sortKey: 'COLLECTION_DEFAULT', reverse: false},
    newest: {sortKey: 'CREATED', reverse: true},
    priceLow: {sortKey: 'PRICE', reverse: false},
    priceHigh: {sortKey: 'PRICE', reverse: true},
  } as const;
  const selectedSort = sortMap[sort as keyof typeof sortMap] ?? sortMap.featured;

  if (!handle) {
    return redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables, ...selectedSort},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  return json({collection});
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const inStockOnly = searchParams.get('inStock') === '1';
  const sort = searchParams.get('sort') ?? 'featured';
  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, {replace: true});
  };

  return (
    <BrandContainer>
      <BrandPageSection>
        <SectionHeader
          description={collection.description}
          title={collection.title}
        />
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="rounded-none uppercase tracking-wide" size="sm" variant="outline">Filters & Sort</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Browse controls</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Sort</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {id: 'featured', label: 'Featured'},
                      {id: 'newest', label: 'Newest'},
                      {id: 'priceLow', label: 'Price: Low to high'},
                      {id: 'priceHigh', label: 'Price: High to low'},
                    ].map((item) => (
                      <Button
                        key={item.id}
                        onClick={() => setParam('sort', item.id)}
                        size="sm"
                        type="button"
                        variant={sort === item.id ? 'default' : 'outline'}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Filter</p>
                  <Button
                    onClick={() => setParam('inStock', inStockOnly ? null : '1')}
                    size="sm"
                    type="button"
                    variant={inStockOnly ? 'default' : 'outline'}
                  >
                    In stock only
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Badge className="rounded-none uppercase" variant="secondary">Browsing</Badge>
          {inStockOnly ? (
              <Button
                className="rounded-none uppercase tracking-wide"
              onClick={() => setParam('inStock', null)}
              size="sm"
              type="button"
              variant="ghost"
            >
              Clear stock filter
            </Button>
          ) : null}
        </div>
        <Pagination connection={collection.products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <div className="space-y-4">
              <PreviousLink>
                {isLoading ? (
                  'Loading...'
                ) : (
                  <Button className="rounded-none uppercase tracking-wide" type="button" variant="outline">
                    ↑ Load previous
                  </Button>
                )}
              </PreviousLink>
              <ProductsGrid
                products={nodes.filter((product) => {
                  if (!inStockOnly) return true;
                  return Boolean(product.variants.nodes[0]?.availableForSale);
                })}
              />
              <NextLink>
                {isLoading ? (
                  'Loading...'
                ) : (
                  <Button className="rounded-none uppercase tracking-wide" type="button" variant="outline">
                    Load more ↓
                  </Button>
                )}
              </NextLink>
            </div>
          )}
        </Pagination>
      </BrandPageSection>
    </BrandContainer>
  );
}

function ProductsGrid({products}: {products: ProductItemFragment[]}) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        );
      })}
    </div>
  );
}

function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link
      className="block"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <Card className="h-full overflow-hidden transition-colors hover:border-primary/50">
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="1/1"
            className="h-auto w-full object-cover"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        )}
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{product.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceBadge price={product.priceRange.minVariantPrice} />
          <span className="sr-only">
            <Money data={product.priceRange.minVariantPrice} />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        availableForSale
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
        }
      }
    }
  }
` as const;
