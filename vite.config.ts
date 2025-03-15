import { defineConfig } from "vite";
import process from "process";

export default defineConfig({
  base: "/todo-app/",
  server: {
    host: process.env.ENVIRONMENT === "devcontainer" ? "0.0.0.0" : "localhost",
  },
});
