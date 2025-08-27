import { execSync } from "child_process";

export interface SupabaseStatus {
  urls: {
    api: string;
    graphql: string;
    storage: string;
    db: string;
    studio: string;
    inbucket: string;
  };
  keys: { jwt: string; anon: string; service_role: string };
  storage: { access_key: string; secret_key: string; region: string };
}

const ANSI = /\x1B\[[0-9;]*m/g;
const KV_RE = /^([A-Za-z0-9 _-]+):\s*(.+)$/; // matches "Key: Value" (keeps spaces in key)

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim(); // compact spaces, lowercased keys

type KVMap = Record<string, string>;

function parseLinesToKVMap(output: string) {
  const map: KVMap = {};
  const lines = (output ?? "").replace(ANSI, "").split(/\r?\n/);

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const m = line.match(KV_RE);
    if (m) {
      const key = normalize(m[1]);
      map[key] = m[2].trim();
    }
  }
  return map;
}

function getOrThrow(map: KVMap, aliases: string[]) {
  for (const a of aliases) {
    const k = normalize(a);
    if (map[k]) return map[k];
  }
  throw new Error(`Missing required field: ${aliases[0]}`);
}

export function getSupabaseStatus(): SupabaseStatus {
  const out = execSync("npx supabase status", { encoding: "utf8" });
  return parseSupabaseStatus(out);
}

export function parseSupabaseStatus(output: string): SupabaseStatus {
  const kv = parseLinesToKVMap(output);

  return {
    urls: {
      api: getOrThrow(kv, ["API URL"]),
      graphql: getOrThrow(kv, ["GraphQL URL", "Graphql URL"]),
      storage: getOrThrow(kv, ["S3 Storage URL", "Storage URL"]),
      db: getOrThrow(kv, ["DB URL", "Database URL"]),
      studio: getOrThrow(kv, ["Studio URL"]),
      inbucket: getOrThrow(kv, ["Inbucket URL", "InBucket URL"]),
    },
    keys: {
      jwt: getOrThrow(kv, ["JWT secret", "JWT Secret"]),
      anon: getOrThrow(kv, ["anon key", "Anon key"]),
      service_role: getOrThrow(kv, ["service_role key", "Service role key"]),
    },
    storage: {
      access_key: getOrThrow(kv, ["S3 Access Key", "Access Key"]),
      secret_key: getOrThrow(kv, ["S3 Secret Key", "Secret Key"]),
      region: getOrThrow(kv, ["S3 Region", "Region"]),
    },
  };
}
