import {useLoaderData, useSearchParams} from '@remix-run/react';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {Pagination, getPaginationVariables} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {BrandContainer, BrandPageSection} from '~/components/ui/brand';
import {SectionHeader} from '~/components/ui/commerce/section-header';
import {CollectionCard} from '~/components/ui/commerce/collection-card';
import {Button} from '~/components/ui/button';
import {Input} from '~/components/ui/input';

export async function loader({context, request}: LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return json({collections});
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  return (
    <BrandContainer>
      <BrandPageSection>
        <SectionHeader description="Shop all collections." title="Collections" />
        <Pagination connection={collections}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <div className="space-y-3">
              <div className="max-w-sm">
                <Input
                  aria-label="Search collections"
                  defaultValue={query}
                  onChange={(event) => {
                    const next = new URLSearchParams(searchParams);
                    if (event.target.value) {
                      next.set('q', event.target.value);
                    } else {
                      next.delete('q');
                    }
                    setSearchParams(next, {replace: true});
                  }}
                  placeholder="Search collections..."
                />
              </div>
              <PreviousLink>
                {isLoading ? (
                  'Loading...'
                ) : (
                  <Button className="rounded-none uppercase tracking-wide" type="button" variant="outline">
                    ↑ Load previous
                  </Button>
                )}
              </PreviousLink>
              <CollectionsGrid
                collections={nodes.filter((collection) =>
                  collection.title.toLowerCase().includes(query.toLowerCase()),
                )}
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

function CollectionsGrid({collections}: {collections: CollectionFragment[]}) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection, index) => (
        <CollectionItem key={collection.id} collection={collection} index={index} />
      ))}
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <CollectionCard collection={collection} eager={index < 3} />
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
