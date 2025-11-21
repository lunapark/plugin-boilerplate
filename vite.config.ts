import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig, type UserConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

import packageDefinition from "./package.json" with { type: "json" };

export default defineConfig(() => {
    const config: UserConfig = {
        build: {
            lib: {
                entry: "src/index.ts",
                fileName: "index",
                formats: ["es"],
                name: "@luna-park/plugin-boilerplate"
            },
            rollupOptions: {
                external: [...Object.keys(packageDefinition.peerDependencies || {})]
            }
        },
        plugins: [
            vue(),
            cssInjectedByJsPlugin()
        ],
        preview: {
            allowedHosts: [
                "localhost",
                "127.0.0.1",
                "https://luna-park.app"
            ],
            host: "127.0.0.1",
            port: 2084
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src")
            }
        }
    };

    return config;
});
