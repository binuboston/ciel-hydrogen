import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {Card, CardHeader, CardTitle} from '~/components/ui/card';

export function CollectionCard({
  collection,
  eager = false,
}: {
  collection: CollectionFragment;
  eager?: boolean;
}) {
  return (
    <Link prefetch="intent" to={`/collections/${collection.handle}`}>
      <Card className="h-full overflow-hidden transition-colors hover:border-primary/50">
        {collection.image ? (
          <Image
            alt={collection.image.altText || collection.title}
            aspectRatio="1/1"
            className="h-auto w-full object-cover"
            data={collection.image}
            loading={eager ? 'eager' : undefined}
          />
        ) : null}
        <CardHeader>
          <CardTitle className="text-base">{collection.title}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
