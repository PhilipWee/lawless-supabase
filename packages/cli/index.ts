#!/usr/bin/env node

import { Command } from "commander";
import { getSupabaseStatus } from "./status";

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

program.parse();
