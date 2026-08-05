import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        raff: {
          ink: "#17130f",
          walnut: "#3a2117",
          leather: "#1f1a16",
          brass: "#c7a457",
          gold: "#a8842f",
          linen: "#eee3cc",
          paper: "#f7efd9",
          suede: "#0d0b0a",
          oxblood: "#7c241f"
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "SFMono-Regular", "Menlo", "monospace"]
      },
      boxShadow: {
        artifact: "0 24px 55px rgba(0,0,0,.42), 0 8px 18px rgba(0,0,0,.28)",
        brass: "0 0 0 1px rgba(199,164,87,.28), 0 18px 44px rgba(0,0,0,.32)"
      }
    }
  },
  plugins: []
};

export default config;
