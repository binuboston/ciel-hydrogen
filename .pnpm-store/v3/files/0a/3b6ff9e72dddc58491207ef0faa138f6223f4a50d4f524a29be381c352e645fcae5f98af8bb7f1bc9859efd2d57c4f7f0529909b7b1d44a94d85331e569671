import { useCallback, useMemo } from "react";
import { CartQuery, CartCreate, CartLineAdd, CartLineUpdate, CartLineRemove, CartNoteUpdate, CartBuyerIdentityUpdate, CartAttributesUpdate, CartDiscountCodesUpdate } from "./cart-queries.mjs";
import { useCartFetch } from "./cart-hooks.mjs";
function useCartActions({
  numCartLines,
  cartFragment,
  countryCode = "US"
}) {
  const fetchCart = useCartFetch();
  const cartFetch = useCallback(
    (cartId) => {
      return fetchCart({
        query: CartQuery(cartFragment),
        variables: {
          id: cartId,
          numCartLines,
          country: countryCode
        }
      });
    },
    [fetchCart, cartFragment, numCartLines, countryCode]
  );
  const cartCreate = useCallback(
    (cart) => {
      return fetchCart({
        query: CartCreate(cartFragment),
        variables: {
          input: cart,
          numCartLines,
          country: countryCode
        }
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );
  const cartLineAdd = useCallback(
    (cartId, lines) => {
      return fetchCart({
        query: CartLineAdd(cartFragment),
        variables: {
          cartId,
          lines,
          numCartLines,
          country: countryCode
        }
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );
  const cartLineUpdate = useCallback(
    (cartId, lines) => {
      return fetchCart({
        query: CartLineUpdate(cartFragment),
        variables: {
          cartId,
          lines,
          numCartLines,
          country: countryCode
        }
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );
  const cartLineRemove = useCallback(
    (cartId, lines) => {
      return fetchCart({
        query: CartLineRemove(cartFragment),
        variables: {
          cartId,
          lines,
          numCartLines,
          country: countryCode
        }
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );
  const noteUpdate = useCallback(
    (cartId, note) => {
      return fetchCart({
        query: CartNoteUpdate(cartFragment),
        variables: {
          cartId,
          note,
          numCartLines,
          country: countryCode
        }
      });
    },
    [fetchCart, cartFragment, numCartLines, countryCode]
  );
  const buyerIdentityUpdate = useCallback(
    (cartId, buyerIdentity) => {
      return fetchCart({
        query: CartBuyerIdentityUpdate(cartFragment),
        variables: {
          cartId,
          buyerIdentity,
          numCartLines,
          country: countryCode
        }
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );
  const cartAttributesUpdate = useCallback(
    (cartId, attributes) => {
      return fetchCart({
        query: CartAttributesUpdate(cartFragment),
        variables: {
          cartId,
          attributes,
          numCartLines,
          country: countryCode
        }
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );
  const discountCodesUpdate = useCallback(
    (cartId, discountCodes) => {
      return fetchCart({
        query: CartDiscountCodesUpdate(cartFragment),
        variables: {
          cartId,
          discountCodes,
          numCartLines,
          country: countryCode
        }
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );
  return useMemo(
    () => ({
      cartFetch,
      cartCreate,
      cartLineAdd,
      cartLineUpdate,
      cartLineRemove,
      noteUpdate,
      buyerIdentityUpdate,
      cartAttributesUpdate,
      discountCodesUpdate,
      cartFragment
    }),
    [
      cartFetch,
      cartCreate,
      cartLineAdd,
      cartLineUpdate,
      cartLineRemove,
      noteUpdate,
      buyerIdentityUpdate,
      cartAttributesUpdate,
      discountCodesUpdate,
      cartFragment
    ]
  );
}
export {
  useCartActions
};
//# sourceMappingURL=useCartActions.mjs.map
