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
  keys: { anon: string; service_role: string };
  storage: { access_key: string; secret_key: string; region: string };
}

export function getSupabaseStatus(): SupabaseStatus {
  const out = execSync("npx supabase status -o json", { encoding: "utf8" });
  return parseSupabaseStatus(out);
}

export function parseSupabaseStatus(output: string): SupabaseStatus {
  const json = JSON.parse(output);

  return {
    urls: {
      api: json.API_URL,
      graphql: json.GRAPHQL_URL,
      storage: json.STORAGE_S3_URL,
      db: json.DB_URL,
      studio: json.STUDIO_URL,
      inbucket: json.INBUCKET_URL || json.MAILPIT_URL,
    },
    keys: {
      anon: json.ANON_KEY || json.PUBLISHABLE_KEY,
      service_role: json.SERVICE_ROLE_KEY || json.SECRET_KEY,
    },
    storage: {
      access_key: json.S3_PROTOCOL_ACCESS_KEY_ID,
      secret_key: json.S3_PROTOCOL_ACCESS_KEY_SECRET,
      region: json.S3_PROTOCOL_REGION,
    },
  };
}
