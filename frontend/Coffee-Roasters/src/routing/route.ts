import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Spinner from "@/components/ui/spinner";
import Cart from "@/pages/Cart";

const Home = React.lazy(() => import("@/pages/Home"));
const About = React.lazy(() => import("@/pages/About"));
const Contact = React.lazy(() => import("@/pages/Contact"));
const Shop = React.lazy(() => import("@/pages/Shop"));
const Details = React.lazy(() => import("@/pages/Details"));
const Checkout = React.lazy(() => import("@/pages/Checkout"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: React.createElement(App),
    children: [
      {
        index: true,
        element: React.createElement(
          Suspense,
          { fallback: React.createElement(Spinner) },
          React.createElement(Home)
        ),
      },
      {
        path: "home",
        element: React.createElement(
          Suspense,
          { fallback: React.createElement(Spinner) },
          React.createElement(Home)
        ),
      },
      {
        path: "about",
        element: React.createElement(
          Suspense,
          { fallback: React.createElement(Spinner) },
          React.createElement(About)
        ),
      },
      {
        path: "shop",
        element: React.createElement(
          Suspense,
          { fallback: React.createElement(Spinner) },
          React.createElement(Shop)
        ),
      },
      {
        path: "contact",
        element: React.createElement(
          Suspense,
          { fallback: React.createElement(Spinner) },
          React.createElement(Contact)
        ),
      },
      {
        path: "details/:id",
        element: React.createElement(
          Suspense,
          { fallback: React.createElement(Spinner) },
          React.createElement(Details)
        ),
      },
      {
        path: "cart",
        element: React.createElement(
          Suspense,
          { fallback: React.createElement(Spinner) },
          React.createElement(Cart)
        ),
      },
      {
        path: "checkout",
        element: React.createElement(
          Suspense,
          { fallback: React.createElement(Spinner) },
          React.createElement(Checkout)
        ),
      },
    ],
  },
]);
