import json from "@rollup/plugin-json";

export default {
    input: "src/swrpg-api.js",
    output: [{
        file: "dist/swrpg.js",
        format: "iife",
        globals: {}
    }],
    plugins: [json()]
}
