/**
 * Google Places API (New) checks for the First Bite score: the practice's Google profile, its
 * reviews, and where it shows up on Google Maps searches in its town.
 *
 * Needs GOOGLE_PLACES_API_KEY in the environment (a key restricted to "Places API (New)"). The key
 * is passed to curl as an argument, never printed or logged.
 *
 * What the API can't tell us (so those checks stay "not measured", never guessed): whether the
 * profile is verified, posts, the booking link, owner replies to reviews, and more than 10 photos
 * or 5 reviews.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const KEY = process.env.GOOGLE_PLACES_API_KEY;
export const placesAvailable = !!KEY;

async function call(method, path, body, fields) {
  const argv = ["-sS", "--max-time", "25", "-X", method, `https://places.googleapis.com/v1/${path}`, "-H", `X-Goog-Api-Key: ${KEY}`, "-H", `X-Goog-FieldMask: ${fields}`];
  if (body) argv.push("-H", "Content-Type: application/json", "-d", JSON.stringify(body));
  const { stdout } = await run("curl", argv, { maxBuffer: 10e6 });
  const json = JSON.parse(stdout);
  if (json.error) throw new Error(`Places API: ${json.error.status} ${json.error.message}`.slice(0, 200));
  return json;
}
const search = (textQuery, fields, extra = {}) => call("POST", "places:searchText", { textQuery, pageSize: 20, ...extra }, fields).then((r) => r.places ?? []);
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
const digits = (s) => (s ?? "").replace(/\D/g, "").slice(-10);

/**
 * @param {{ siteHost: string, name: string, sitePhones: string[] }} site
 */
export async function placesChecks(site) {
  // 1. Find the practice: search its name, prefer the result whose website is this site.
  const found = await search(site.name, "places.id,places.displayName,places.websiteUri,places.formattedAddress");
  const match = found.find((p) => host(p.websiteUri) === site.siteHost) ?? null;
  if (!match) return { found: false, why: `No Google listing found that links to ${site.siteHost} (searched "${site.name}").` };

  // 2. Its profile.
  const p = await call(
    "GET",
    `places/${match.id}`,
    null,
    "id,displayName,primaryType,primaryTypeDisplayName,types,formattedAddress,addressComponents,location,nationalPhoneNumber,websiteUri,regularOpeningHours,rating,userRatingCount,reviews,photos,editorialSummary,businessStatus,accessibilityOptions,googleMapsUri",
  );
  const comp = (t) => p.addressComponents?.find((c) => c.types?.includes(t));
  const town = comp("locality")?.longText ?? comp("postal_town")?.longText ?? "";
  const state = comp("administrative_area_level_1")?.shortText ?? "";

  // 3. Map searches from the practice's own town, biased to its location.
  const bias = p.location ? { locationBias: { circle: { center: p.location, radius: 15000 } } } : {};
  const rank = async (q) => {
    const list = await search(q, "places.id,places.displayName,places.userRatingCount", bias);
    const i = list.findIndex((x) => x.id === p.id);
    return { query: q, rank: i >= 0 ? i + 1 : null, top: list.slice(0, 3).map((x) => ({ name: x.displayName?.text, reviews: x.userRatingCount ?? 0, self: x.id === p.id })) };
  };
  const [dentist, implants, emergency] = await Promise.all([rank(`dentist in ${town}, ${state}`), rank(`dental implants ${town} ${state}`), rank(`emergency dentist ${town} ${state}`)]);

  const now = Date.now();
  const newest = Math.max(0, ...(p.reviews ?? []).map((r) => Date.parse(r.publishTime) || 0));
  const daysSinceNewest = newest ? Math.round((now - newest) / 864e5) : null;
  const competitors = dentist.top.filter((x) => !x.self).map((x) => x.reviews).sort((a, b) => a - b);
  const medianCompetitor = competitors.length ? competitors[Math.floor(competitors.length / 2)] : null;
  const phoneMatches = site.sitePhones.map(digits).includes(digits(p.nationalPhoneNumber));
  const websiteMatches = host(p.websiteUri) === site.siteHost;
  const hasHours = !!p.regularOpeningHours?.periods?.length;
  const alwaysOpen = !!p.regularOpeningHours?.periods?.some((x) => !x.close); // "Open 24 hours"
  const dentalType = /dentist|dental/i.test(`${p.primaryType} ${p.primaryTypeDisplayName?.text}`);
  const photos = p.photos?.length ?? 0; // the API returns at most 10

  return {
    found: true,
    place: { name: p.displayName?.text, address: p.formattedAddress, town, state, mapsUrl: p.googleMapsUri, status: p.businessStatus },
    raw: { rating: p.rating ?? null, reviews: p.userRatingCount ?? 0, daysSinceNewest, medianCompetitor, phoneMatches, websiteMatches, hasHours, alwaysOpen, dentalType, type: p.primaryTypeDisplayName?.text ?? p.primaryType, photos, hasSummary: !!p.editorialSummary?.text, accessibility: !!p.accessibilityOptions, rankings: { dentist, implants, emergency } },
  };
}
