import {Suspense} from 'react';
import {useEffect} from 'react';
import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {defer, redirect, type LoaderArgs} from '@shopify/remix-oxygen';
import type {FetcherWithComponents} from '@remix-run/react';
import {Await, Link, useLoaderData} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
  ProductVariantFragment,
} from 'storefrontapi.generated';

import {
  Money,
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/utils';
import {BrandContainer, BrandPageSection} from '~/components/ui/brand';
import {Card, CardContent} from '~/components/ui/card';
import {Badge} from '~/components/ui/badge';
import {SectionHeader} from '~/components/ui/commerce/section-header';
import {ProductMediaCarousel} from '~/components/ui/commerce/product-media-carousel';
import {cn} from '~/lib/utils';

export const meta: V2_MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data.product.title}`}];
};

export async function loader({params, request, context}: LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      return redirectToFirstVariant({product, request});
    }
  }
  return defer({product, variants});
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  throw redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('storefront:product_view', {
        detail: {
          handle: product.handle,
          variantId: selectedVariant?.id ?? null,
        },
      }),
    );
  }, [product.handle, selectedVariant?.id]);

  return (
    <BrandContainer>
      <BrandPageSection className="grid gap-8 md:grid-cols-2">
        <ProductMediaCarousel
          images={product.images.nodes}
          productTitle={product.title}
          selectedImageId={selectedVariant?.image?.id}
        />
        <ProductMain
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
        />
      </BrandPageSection>
    </BrandContainer>
  );
}

function ProductMain({
  selectedVariant,
  product,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
}) {
  const {title, descriptionHtml} = product;
  return (
    <div className="space-y-4 md:sticky md:top-24 md:self-start">
      <SectionHeader title={title} />
      <ProductPrice selectedVariant={selectedVariant} />
      <ProductTrustBar />
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
      <Card>
        <CardContent className="prose prose-sm max-w-none py-4 dark:prose-invert">
          <p className="mb-2 font-semibold">Description</p>
          <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
        </CardContent>
      </Card>
      <ProductFaq />
    </div>
  );
}

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div>
      {selectedVariant?.compareAtPrice ? (
        <>
          <div className="mb-2">
            <Badge className="rounded-none uppercase" variant="secondary">Sale</Badge>
          </div>
          <div className="flex items-center gap-2">
            {selectedVariant ? (
              <span className="font-medium">
                <Money data={selectedVariant.price} />
              </span>
            ) : null}
            <s className="text-muted-foreground">
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        <div className="space-y-1">
          {selectedVariant?.price && <Money data={selectedVariant?.price} />}
          {typeof selectedVariant?.quantityAvailable === 'number' ? (
            <p className="text-sm text-muted-foreground">
              {selectedVariant.quantityAvailable > 0
                ? `${selectedVariant.quantityAvailable} in stock`
                : 'Out of stock'}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  return (
    <div className="space-y-4">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#cart-aside';
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="space-y-2" key={option.name}>
      <h5 className="font-medium">{option.name}</h5>
      <div className="flex flex-wrap gap-2">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className={cn(
                'border px-3 py-1 text-sm uppercase tracking-wide transition-colors',
                isActive ? 'border-foreground' : 'border-transparent bg-muted',
                !isAvailable && 'opacity-40',
              )}
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('storefront:variant_change', {
                    detail: {
                      optionName: option.name,
                      value,
                    },
                  }),
                );
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            className={cn(
              'inline-flex h-10 items-center justify-center rounded-none bg-primary px-5 text-xs font-medium uppercase tracking-wide text-primary-foreground transition-opacity',
              (disabled ?? fetcher.state !== 'idle') && 'opacity-60',
            )}
            disabled={disabled ?? fetcher.state !== 'idle'}
            onClick={onClick}
            type="submit"
            onMouseDown={() => {
              window.dispatchEvent(
                new CustomEvent('storefront:add_to_cart', {
                  detail: {lines},
                }),
              );
            }}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

function ProductTrustBar() {
  return (
    <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
      <div className="rounded-md border p-2">Free shipping over $75</div>
      <div className="rounded-md border p-2">30-day returns</div>
      <div className="rounded-md border p-2">Secure checkout</div>
    </div>
  );
}

function ProductFaq() {
  return (
    <div className="space-y-2">
      <p className="font-medium">Frequently asked questions</p>
      <details className="rounded-md border p-3">
        <summary className="cursor-pointer font-medium">How long is shipping?</summary>
        <p className="mt-2 text-sm text-muted-foreground">
          Standard delivery takes 3-5 business days.
        </p>
      </details>
      <details className="rounded-md border p-3">
        <summary className="cursor-pointer font-medium">Can I return this item?</summary>
        <p className="mt-2 text-sm text-muted-foreground">
          Yes, returns are accepted within 30 days in original condition.
        </p>
      </details>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    quantityAvailable
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    images(first: 12) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
