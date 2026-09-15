/**
 * Runs once per server process, before any application code.
 *
 * Setting the DNS servers here rather than in payload.config.ts matters in a
 * production build: the config module is bundled and may be evaluated in a
 * different process from the one that opens the database connection, so the
 * override did not always take. `register` is Next's documented hook for
 * exactly this kind of process-level setup.
 *
 * Only does anything when MONGODB_DNS_SERVERS is set, which is a workaround for
 * networks that refuse the SRV lookups an Atlas mongodb+srv:// URI needs. On a
 * normal network, including Vercel, it is unset and this is a no-op.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const servers = process.env.MONGODB_DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (!servers?.length) return;

  const dns = await import("dns");
  dns.setServers(servers);
  console.log(`[dns] resolving through ${servers.join(", ")}`);
}
