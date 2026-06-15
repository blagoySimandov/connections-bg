import { serve } from "bun";
import index from "./index.html";

const isDevelopment = process.env.NODE_ENV !== "production";

const server = serve({
  routes: {
    "/*": index,
  },

  ...(isDevelopment && {
    development: {
      hmr: true,
      console: true,
    },
  }),
});

console.log(`Server running at ${server.url}`);
