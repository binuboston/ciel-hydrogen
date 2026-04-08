import {useMatches, NavLink} from '@remix-run/react';
import type {FooterQuery} from 'storefrontapi.generated';
import {cn} from '~/lib/utils';
import {BrandContainer} from '~/components/ui/brand';
import {buttonVariants} from '~/components/ui/button';

export function Footer({menu}: FooterQuery) {
  return (
    <footer className="mt-auto border-t bg-background">
      <BrandContainer>
        <div className="py-6">
          <FooterMenu menu={menu} />
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Powered by Shopify
          </p>
        </div>
      </BrandContainer>
    </footer>
  );
}

function FooterMenu({menu}: Pick<FooterQuery, 'menu'>) {
  const [root] = useMatches();
  const publicStoreDomain = root?.data?.publicStoreDomain;
  return (
    <nav className="flex flex-wrap items-center gap-0.5" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a
            className={cn(buttonVariants({size: 'sm', variant: 'ghost'}), 'rounded-none px-2 uppercase text-[11px] tracking-wide')}
            href={url}
            key={item.id}
            rel="noopener noreferrer"
            target="_blank"
          >
            {item.title}
          </a>
        ) : (
          <NavLink
            className={({isActive}) =>
              cn(
                buttonVariants({size: 'sm', variant: 'ghost'}),
                'rounded-none px-2 uppercase text-[11px] tracking-wide',
                isActive && 'bg-muted text-foreground',
              )
            }
            end
            key={item.id}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
