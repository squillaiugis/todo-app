import { defineConfig } from "vite";
import process from "process";

export default defineConfig({
  server: {
    host: process.env.ENVIRONMENT === "devcontainer" ? "0.0.0.0" : "localhost",
  },
});