import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {Badge} from '~/components/ui/badge';

export function PriceBadge({price}: {price: MoneyV2}) {
  return (
    <Badge variant="secondary">
      <Money data={price} />
    </Badge>
  );
}
