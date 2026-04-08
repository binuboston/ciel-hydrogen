import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {Card, CardContent, CardHeader, CardTitle} from '~/components/ui/card';
import {PriceBadge} from '~/components/ui/commerce/price-badge';

type ProductItem = RecommendedProductsQuery['products']['nodes'][number];

export function ProductCard({product}: {product: ProductItem}) {
  return (
    <Link prefetch="intent" to={`/products/${product.handle}`}>
      <Card className="h-full overflow-hidden transition-colors hover:border-primary/50">
        {product.images.nodes[0] ? (
          <Image
            aspectRatio="1/1"
            className="h-auto w-full object-cover"
            data={product.images.nodes[0]}
            sizes="(min-width: 45em) 20vw, 50vw"
          />
        ) : null}
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{product.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceBadge price={product.priceRange.minVariantPrice} />
        </CardContent>
      </Card>
    </Link>
  );
}
