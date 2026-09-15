// Local development helper.
//
// Some networks refuse the SRV lookups an Atlas mongodb+srv:// URI needs. Next's
// instrumentation hook does not cover every worker process a production server
// spawns, so this is loaded with NODE_OPTIONS=--require, which every child
// process inherits.
//
//   NODE_OPTIONS="--require ./scripts/dns-preload.cjs" npm run start
//
// No-op unless MONGODB_DNS_SERVERS is set, so it is inert in production.
const servers = (process.env.MONGODB_DNS_SERVERS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (servers.length) {
  require("dns").setServers(servers);
}
