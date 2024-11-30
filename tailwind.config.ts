import type { Config } from "tailwindcss";
import catppuccin from "@catppuccin/tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#ba43f7"
      },
    },
  },
  plugins: [
    catppuccin({
      defaultFlavour: "mocha",
    }),
  ],
} satisfies Config;
