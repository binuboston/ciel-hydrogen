import {CartForm, Image, Money} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';
import {Button} from '~/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '~/components/ui/card';
import {Input} from '~/components/ui/input';
import {Separator} from '~/components/ui/separator';
import {cn} from '~/lib/utils';

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: 'page' | 'aside';
};

export function CartMain({layout, cart}: CartMainProps) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);
  const className = withDiscount
    ? 'max-h-[calc(100vh-18.75rem)] overflow-y-auto'
    : 'max-h-[calc(100vh-15.625rem)] overflow-y-auto';

  return (
    <div className={cn(className, layout === 'page' && 'max-h-none')}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails cart={cart} layout={layout} />
    </div>
  );
}

function CartDetails({layout, cart}: CartMainProps) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="space-y-4">
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </div>
  );
}

function CartLines({
  lines,
  layout,
}: {
  layout: CartMainProps['layout'];
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines">
      <ul className="space-y-3">
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

function CartLineItem({
  layout,
  line,
}: {
  layout: CartMainProps['layout'];
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li key={id} className="flex gap-3 border-b pb-3">
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={100}
          loading="lazy"
          width={100}
        />
      )}

      <div className="min-w-0 flex-1 space-y-1">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              // close the drawer
              window.location.href = lineItemUrl;
            }
          }}
        >
          <p className="font-medium">{product.title}</p>
        </Link>
        <CartLinePrice line={line} as="span" />
        <ul className="space-y-0.5">
          {selectedOptions.map((option) => (
            <li className="text-muted-foreground" key={option.name}>
              <small>
                {option.name}: {option.value}
              </small>
            </li>
          ))}
        </ul>
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="space-y-2">
      <a href={checkoutUrl} target="_self">
        <Button
          className="w-full rounded-none uppercase tracking-wide"
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent('storefront:begin_checkout', {
                detail: {checkoutUrl},
              }),
            );
          }}
        >
          Continue to Checkout &rarr;
        </Button>
      </a>
      <p className="text-xs text-muted-foreground">
        Secure checkout with encrypted payment processing.
      </p>
    </div>
  );
}

export function CartSummary({
  cost,
  layout,
  children = null,
}: {
  children?: React.ReactNode;
  cost: CartApiQueryFragment['cost'];
  layout: CartMainProps['layout'];
}) {
  const className = layout === 'page' ? '' : '';

  return (
    <Card aria-labelledby="cart-summary" className={className}>
      <CardHeader className="pb-3">
        <CardTitle>Totals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <dl className="flex items-center justify-between">
          <dt>Subtotal</dt>
          <dd>
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </dl>
        <Separator />
        {children}
      </CardContent>
    </Card>
  );
}

function CartLineRemoveButton({lineIds}: {lineIds: string[]}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <Button size="xs" type="submit" variant="ghost">
        Remove
      </Button>
    </CartForm>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-1.5">
      <small>Quantity: {quantity}</small>
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <Button
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          name="decrease-quantity"
          size="icon-xs"
          type="submit"
          variant="outline"
          value={prevQuantity}
        >
          <span>&#8722;</span>
        </Button>
      </CartLineUpdateButton>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <Button
          aria-label="Increase quantity"
          name="increase-quantity"
          size="icon-xs"
          type="submit"
          variant="outline"
          value={nextQuantity}
        >
          <span>&#43;</span>
        </Button>
      </CartLineUpdateButton>
      <CartLineRemoveButton lineIds={[lineId]} />
    </div>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div>
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
    </div>
  );
}

export function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div className="space-y-3 py-2" hidden={hidden}>
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          className="inline-flex"
          to="/collections"
          onClick={() => {
            if (layout === 'aside') {
              window.location.href = '/collections';
            }
          }}
        >
          <Button className="rounded-none uppercase tracking-wide" variant="secondary">Continue shopping</Button>
        </Link>
        <Link
          className="inline-flex"
          to="/search"
          onClick={() => {
            if (layout === 'aside') {
              window.location.href = '/search';
            }
          }}
        >
          <Button className="rounded-none uppercase tracking-wide" variant="outline">Find products</Button>
        </Link>
      </div>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="mt-1 flex items-center gap-2">
              <code>{codes?.join(', ')}</code>
              <Button size="xs" type="submit" variant="ghost">
                Remove
              </Button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="mt-2 flex items-center gap-2">
          <Input name="discountCode" placeholder="Discount code" type="text" />
          <Button type="submit" variant="secondary">
            Apply
          </Button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
