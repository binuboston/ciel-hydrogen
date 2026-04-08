import {Await, NavLink, useMatches} from '@remix-run/react';
import {Suspense} from 'react';
import type {LayoutProps} from './Layout';
import {cn} from '~/lib/utils';
import {BrandContainer} from '~/components/ui/brand';
import {buttonVariants} from '~/components/ui/button';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="sticky top-0 z-20 border-b bg-background">
      <BrandContainer className="flex h-16 items-center gap-4">
        <NavLink className="text-sm font-semibold tracking-wide uppercase" prefetch="intent" to="/" end>
          {shop.name}
        </NavLink>
        <HeaderMenu menu={menu} viewport="desktop" />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </BrandContainer>
    </header>
  );
}

export function HeaderMenu({
  menu,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  viewport: Viewport;
}) {
  const [root] = useMatches();
  const publicStoreDomain = root?.data?.publicStoreDomain;
  const className =
    viewport === 'desktop'
      ? 'ml-6 hidden items-center gap-0.5 md:flex'
      : 'flex flex-col gap-1';

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          className={({isActive}) =>
            cn(
              buttonVariants({size: 'sm', variant: 'ghost'}),
              'justify-start',
              isActive && 'bg-muted text-foreground',
            )
          }
          end
          onClick={closeAside}
          prefetch="intent"
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className={({isActive}) =>
              cn(
                buttonVariants({size: 'sm', variant: 'ghost'}),
                'rounded-none uppercase text-[11px] tracking-wide',
                viewport === 'mobile' && 'justify-start text-sm',
                isActive && 'bg-muted text-foreground',
              )
            }
            end
            key={item.id}
            onClick={closeAside}
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

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="ml-auto flex items-center gap-0.5" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink
        className={({isActive}) =>
          cn(
            buttonVariants({size: 'sm', variant: 'ghost'}),
            'rounded-none uppercase text-[11px] tracking-wide',
            isActive && 'bg-muted text-foreground',
          )
        }
        prefetch="intent"
        to="/account"
      >
        {isLoggedIn ? 'Account' : 'Sign in'}
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a
      className={cn(buttonVariants({size: 'icon-sm', variant: 'ghost'}), 'rounded-none md:hidden')}
      href="#mobile-menu-aside"
    >
      <span className="text-lg leading-none">☰</span>
      <span className="sr-only">Open menu</span>
    </a>
  );
}

function SearchToggle() {
  return (
    <a className={cn(buttonVariants({size: 'sm', variant: 'ghost'}), 'rounded-none uppercase text-[11px] tracking-wide')} href="#search-aside">
      Search
    </a>
  );
}

function CartBadge({count}: {count: number}) {
  return (
    <a className={cn(buttonVariants({size: 'sm', variant: 'ghost'}), 'rounded-none uppercase text-[11px] tracking-wide')} href="#cart-aside">
      Cart {count}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

export const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};
