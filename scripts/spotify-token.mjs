#!/usr/bin/env node
/* One-time: gets the Spotify refresh token that /api/now-playing needs.
   Run on your own machine, signed in to Spotify in the browser:

     SPOTIFY_CLIENT_ID=… SPOTIFY_CLIENT_SECRET=… node scripts/spotify-token.mjs

   It opens the Spotify consent page, catches the redirect on
   http://127.0.0.1:8888/callback (add exactly that redirect URI to the
   app in the Spotify dashboard), and prints the refresh token to paste
   into Vercel as SPOTIFY_REFRESH_TOKEN. Nothing is written to disk. */
import { createServer } from "node:http";
import { exec } from "node:child_process";

const id = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET;
if (!id || !secret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}
const redirect = "http://127.0.0.1:8888/callback";
const scope = "user-read-currently-playing user-read-recently-played";
const consent = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  client_id: id,
  response_type: "code",
  redirect_uri: redirect,
  scope,
})}`;

const server = createServer(async (req, res) => {
  const url = new URL(req.url, redirect);
  if (url.pathname !== "/callback") return res.end();
  const code = url.searchParams.get("code");
  if (!code) {
    res.end("Spotify sent no code; close this tab and try again.");
    return;
  }
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirect }),
  });
  const data = await r.json();
  if (!data.refresh_token) {
    res.end("Spotify refused: " + JSON.stringify(data));
    console.error(data);
  } else {
    res.end("Done. The refresh token is in your terminal; you can close this tab.");
    console.log("\nSPOTIFY_REFRESH_TOKEN=" + data.refresh_token + "\n");
  }
  server.close();
});
server.listen(8888, "127.0.0.1", () => {
  console.log("Opening Spotify to ask for permission…\n" + consent + "\n");
  const open = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${open} "${consent}"`);
});
