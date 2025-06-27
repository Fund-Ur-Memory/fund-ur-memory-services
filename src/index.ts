/// <reference types="bun-types" />

import app from "./app";

const server = Bun.serve({
    port: process.env.PORT || 3000,
    fetch: app.fetch
});

console.log("FUM Vault Server Running ", server.port);