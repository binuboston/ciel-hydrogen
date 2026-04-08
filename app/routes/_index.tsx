import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {BrandContainer, BrandPageSection} from '~/components/ui/brand';
import {SectionHeader} from '~/components/ui/commerce/section-header';
import {ProductCard} from '~/components/ui/commerce/product-card';
import {Button} from '~/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '~/components/ui/card';
import {Skeleton} from '~/components/ui/skeleton';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: LoaderArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <BrandContainer>
      <BrandPageSection>
        <HeroValueStrip />
      </BrandPageSection>
      <BrandPageSection>
        <FeaturedCollection collection={data.featuredCollection} />
      </BrandPageSection>
      <BrandPageSection>
        <RecommendedProducts products={data.recommendedProducts} />
      </BrandPageSection>
      <BrandPageSection>
        <TrustHighlights />
      </BrandPageSection>
    </BrandContainer>
  );
}

function HeroValueStrip() {
  return (
    <Card className="border bg-background">
      <CardContent className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">New arrivals</p>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Spring '26 essentials
          </h2>
        </div>
        <Link to="/collections">
          <Button className="rounded-none uppercase tracking-wide">Shop collections</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  const image = collection.image;
  return (
    <Link
      className="group block overflow-hidden border bg-card transition-colors hover:border-primary/50"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="aspect-square md:aspect-[16/9]">
          <Image className="h-full w-full object-cover" data={image} sizes="100vw" />
        </div>
      )}
      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Midweight Classics</p>
        <h1 className="text-2xl font-semibold tracking-tight">{collection.title}</h1>
        <p className="text-sm text-muted-foreground">
          Discover curated picks, ready to ship.
        </p>
      </div>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div>
      <SectionHeader
        description="Fresh picks from your catalog."
        title="Recommended Products"
      />
      <Suspense fallback={<RecommendedProductsSkeleton />}>
        <Await resolve={products}>
          {({products}) => (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {products.nodes.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function RecommendedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({length: 4}).map((_, idx) => (
        <Card key={idx}>
          <Skeleton className="aspect-square w-full" />
          <CardContent className="space-y-2 py-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TrustHighlights() {
  const items = [
    {title: 'Free shipping', description: 'Free on orders over $75'},
    {title: 'Easy returns', description: '30-day hassle-free returns'},
    {title: 'Secure checkout', description: 'Encrypted and trusted payments'},
  ];
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <Card className="rounded-none" key={item.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">
            {item.description}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
