import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        brand: {
          50: "#fff1f1",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c"
        }
      }
    }
  },
  plugins: []
};

export default config;
