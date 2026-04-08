import { jsx } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "./CartProvider.mjs";
import { BaseButton } from "./BaseButton.mjs";
function BuyNowButton(props) {
  const { cartCreate, checkoutUrl } = useCart();
  const [loading, setLoading] = useState(false);
  const {
    quantity,
    variantId,
    onClick,
    attributes,
    children,
    ...passthroughProps
  } = props;
  useEffect(() => {
    if (loading && checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [loading, checkoutUrl]);
  const handleBuyNow = useCallback(() => {
    setLoading(true);
    cartCreate({
      lines: [
        {
          quantity: quantity ?? 1,
          merchandiseId: variantId,
          attributes
        }
      ]
    });
  }, [cartCreate, quantity, variantId, attributes]);
  return /* @__PURE__ */ jsx(
    BaseButton,
    {
      disabled: loading ?? passthroughProps.disabled,
      ...passthroughProps,
      onClick,
      defaultOnClick: handleBuyNow,
      children
    }
  );
}
export {
  BuyNowButton
};
//# sourceMappingURL=BuyNowButton.mjs.map
