import { execSync } from "child_process";
import { getSupabaseStatus } from "./status";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

export interface GenerateTypesOptions {
  outputFile?: string;
  includedSchemas?: string[];
  excludedSchemas?: string[];
}

export async function generateZodTypes(
  options: GenerateTypesOptions = {}
): Promise<string> {
  // Get Supabase status to extract database URL
  const status = getSupabaseStatus();
  const dbUrl = status.urls.db;

  if (!dbUrl) {
    throw new Error("Could not get database URL from Supabase status");
  }

  console.log(`Using database URL: ${dbUrl}`);

  // Set up environment variables for postgres-meta
  const env = {
    ...process.env,
    PG_META_DB_URL: dbUrl,
    ...(options.includedSchemas &&
      options.includedSchemas.length > 0 && {
        PG_META_GENERATE_TYPES_INCLUDED_SCHEMAS:
          options.includedSchemas.join(","),
      }),
  };

  try {
    // Get the current directory using ES module equivalent
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Get the absolute path to the postgres-meta package
    const postgresMetaPath = join(__dirname, "..", "postgres-meta");
    console.log(`Postgres-meta path: ${postgresMetaPath}`);

    // Check if the postgres-meta directory exists
    if (!fs.existsSync(postgresMetaPath)) {
      throw new Error(
        `Postgres-meta directory not found at: ${postgresMetaPath}`
      );
    }

    // Check if package.json exists
    const packageJsonPath = join(postgresMetaPath, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`Package.json not found at: ${packageJsonPath}`);
    }

    console.log("Running postgres-meta type generation...");

    // Run the postgres-meta type generation using the existing script
    const result = execSync("npm run gen:types:zod", {
      cwd: postgresMetaPath,
      env,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      shell: "/bin/bash", // Explicitly use bash shell
    });

    return result;
  } catch (error: any) {
    console.error("Error details:", error);

    if (error.stdout) {
      console.log("stdout:", error.stdout);
    }
    if (error.stderr) {
      console.log("stderr:", error.stderr);
    }

    if (error.stdout) {
      // If there's stdout, it might contain the generated types
      return error.stdout;
    }
    throw new Error(`Failed to generate types: ${error.message}`);
  }
}

export function writeTypesToFile(types: string, outputFile: string): void {
  const fs = require("fs");
  const path = require("path");

  // Ensure the directory exists
  const dir = path.dirname(outputFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the types to file
  fs.writeFileSync(outputFile, types, "utf8");
  console.log(`Types written to: ${outputFile}`);
}
