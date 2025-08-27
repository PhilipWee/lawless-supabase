#!/usr/bin/env node

import { Command } from "commander";
import { getSupabaseStatus } from "./status";
import { generateZodTypes } from "./types";

const program = new Command();

program
  .name("lawless-supabase")
  .description("CLI for Lawless Supabase utilities")
  .version("1.0.0");

program
  .command("hello")
  .description("Say hello")
  .action(() => {
    console.log("Hello from Lawless Supabase CLI!");
  });

program
  .command("meta")
  .description("PostgreSQL metadata utilities")
  .action(() => {
    console.log("PostgreSQL metadata functionality - coming soon!");
  });

program
  .command("status")
  .description("Get Supabase local development status")
  .action(() => {
    const status = getSupabaseStatus();
    console.log(JSON.stringify(status, undefined, 2));
  });

program
  .command("zodtypes <outputFile>")
  .description("Generate Zod types from local Supabase database")
  .option(
    "-i, --include-schemas <schemas>",
    "Comma-separated list of schemas to include"
  )
  .option(
    "-e, --exclude-schemas <schemas>",
    "Comma-separated list of schemas to exclude"
  )
  .action(async (outputFile, options) => {
    try {
      const types = await generateZodTypes({
        outputFile,
        includedSchemas: options.includeSchemas
          ?.split(",")
          .map((s: string) => s.trim()),
        excludedSchemas: options.excludeSchemas
          ?.split(",")
          .map((s: string) => s.trim()),
      });
    } catch (error) {
      console.error("❌ Failed to generate types:", error);
      process.exit(1);
    }
  });

program.parse();
