import {Await, useMatches} from '@remix-run/react';
import {Suspense} from 'react';
import type {CartQueryData} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {type ActionArgs, json} from '@shopify/remix-oxygen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartMain} from '~/components/Cart';
import {BrandContainer, BrandPageSection} from '~/components/ui/brand';
import {SectionHeader} from '~/components/ui/commerce/section-header';
import {Card, CardContent, CardHeader, CardTitle} from '~/components/ui/card';

export const meta: V2_MetaFunction = () => {
  return [{title: `Hydrogen | Cart`}];
};

export async function action({request, context}: ActionArgs) {
  const {session, cart} = context;

  const [formData, customerAccessToken] = await Promise.all([
    request.formData(),
    session.get('customerAccessToken'),
  ]);

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryData;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
        customerAccessToken,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);
  const {cart: cartResult, errors} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return json(
    {
      cart: cartResult,
      errors,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export default function Cart() {
  const [root] = useMatches();
  const cart = root.data?.cart as Promise<CartApiQueryFragment | null>;

  return (
    <BrandContainer>
      <BrandPageSection className="space-y-4">
        <SectionHeader title="Cart" />
        <Suspense fallback={<p>Loading cart ...</p>}>
          <Await errorElement={<div>An error occurred</div>} resolve={cart}>
            {(cart) => {
              return <CartMain layout="page" cart={cart} />;
            }}
          </Await>
        </Suspense>
        <CartTrustPanel />
      </BrandPageSection>
    </BrandContainer>
  );
}

function CartTrustPanel() {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Secure payments</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Encrypted checkout with major payment providers.
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Fast shipping</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Most orders ship within 24 hours.
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Easy returns</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          30-day returns with no restocking fees.
        </CardContent>
      </Card>
    </div>
  );
}
