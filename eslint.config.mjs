import nextConfig from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier";

const config = [
  ...nextConfig,
  prettier,
  {
    rules: {
      "no-console": "warn",
      // SSR hydration pattern: localStorage unavailable during server render,
      // so we intentionally set state inside a mount-only effect.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    ignores: [".next/**", "node_modules/**"],
  },
];

export default config;
