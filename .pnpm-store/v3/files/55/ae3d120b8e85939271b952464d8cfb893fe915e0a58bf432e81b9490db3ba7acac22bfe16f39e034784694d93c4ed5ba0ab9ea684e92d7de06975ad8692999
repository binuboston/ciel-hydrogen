import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import styles from "./assets/styles.css";
import favicon from "./assets/favicon.svg";
import { Layout } from "./components/Layout.jsx";
const links = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "icon", type: "image/svg+xml", href: favicon }
  ];
};
function App() {
  return <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Hydrogen</title>
      <meta name="description" content="A custom storefront powered by Hydrogen" />
      <Meta />
      <Links />
    </head>
    <body>
      <Layout><Outlet /></Layout>
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>;
}
export {
  App as default,
  links
};
