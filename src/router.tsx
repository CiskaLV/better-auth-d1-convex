import { createRouter } from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";

export type RouterContext = {};

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    context: {},
  });
  return router;
};
