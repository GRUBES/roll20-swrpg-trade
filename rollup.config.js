import json from "@rollup/plugin-json";

export default {
    input: "src/trade-api.js",
    output: [{
        file: "dist/swrpg-trade.js",
        format: "iife",
        globals: {}
    }],
    plugins: [json()]
}
