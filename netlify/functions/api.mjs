// Netlify Function entry point for the live demo.
// Starts the Express app once per function instance on a local port and forwards each request to it.
import app from "../../src/app.js";

let baseUrl;
function start() {
  baseUrl ??= new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => resolve(`http://127.0.0.1:${server.address().port}`));
  });
  return baseUrl;
}

const SKIP_HEADERS = ["host", "connection", "content-length", "transfer-encoding", "content-encoding"];

export default async (req) => {
  const url = new URL(req.url);
  const headers = new Headers(req.headers);
  SKIP_HEADERS.forEach((h) => headers.delete(h));

  const res = await fetch((await start()) + url.pathname + url.search, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer(),
  });

  const outHeaders = new Headers(res.headers);
  SKIP_HEADERS.forEach((h) => outHeaders.delete(h));
  return new Response(res.body, { status: res.status, headers: outHeaders });
};

export const config = { path: ["/", "/api/*"] };
