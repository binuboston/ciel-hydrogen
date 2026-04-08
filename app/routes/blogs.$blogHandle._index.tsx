import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {Image, Pagination, getPaginationVariables} from '@shopify/hydrogen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {BrandContainer, BrandPageSection} from '~/components/ui/brand';
import {SectionHeader} from '~/components/ui/commerce/section-header';
import {Card, CardContent, CardHeader, CardTitle} from '~/components/ui/card';
import {Button} from '~/components/ui/button';

export const meta: V2_MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data.blog.title} blog`}];
};

export const loader = async ({
  request,
  params,
  context: {storefront},
}: LoaderArgs) => {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, {status: 404});
  }

  const {blog} = await storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: params.blogHandle,
      ...paginationVariables,
    },
  });

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  return json({blog});
};

export default function Blog() {
  const {blog} = useLoaderData<typeof loader>();
  const {articles} = blog;

  return (
    <BrandContainer>
      <BrandPageSection>
        <SectionHeader title={blog.title} />
        <Pagination connection={articles}>
          {({nodes, isLoading, PreviousLink, NextLink}) => {
            return (
              <div className="space-y-4">
                <PreviousLink>
                  {isLoading ? (
                    'Loading...'
                  ) : (
                    <Button type="button" variant="outline">
                      ↑ Load previous
                    </Button>
                  )}
                </PreviousLink>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {nodes.map((article, index) => {
                    return (
                      <ArticleItem
                        article={article}
                        key={article.id}
                        loading={index < 2 ? 'eager' : 'lazy'}
                      />
                    );
                  })}
                </div>
                <NextLink>
                  {isLoading ? (
                    'Loading...'
                  ) : (
                    <Button type="button" variant="outline">
                      Load more ↓
                    </Button>
                  )}
                </NextLink>
              </div>
            );
          }}
        </Pagination>
      </BrandPageSection>
    </BrandContainer>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));
  return (
    <div key={article.id}>
      <Link to={`/blogs/${article.blog.handle}/${article.handle}`}>
        <Card className="h-full overflow-hidden transition-colors hover:border-primary/50">
        {article.image && (
            <div className="aspect-[3/2]">
            <Image
              alt={article.image.altText || article.title}
              aspectRatio="3/2"
                className="h-full w-full object-cover"
              data={article.image}
              loading={loading}
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        )}
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{article.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <small className="text-muted-foreground">{publishedAt}</small>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
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
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;
