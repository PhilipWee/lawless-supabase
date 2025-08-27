# Lawless Supabase CLI

A CLI tool for Lawless Supabase utilities.

## Installation

```bash
npm install
npm run build
```

## Usage

### Get Supabase Status

```bash
npx lawless-supabase status
```

This command retrieves the current status of your local Supabase instance, including database URLs, API keys, and other configuration.

### Generate Zod Types

```bash
npx lawless-supabase types
```

This command generates Zod schemas from your local Supabase database schema.

#### Options

- `-o, --output <file>`: Specify output file path (default: `./generated-types.ts`)
- `-i, --include-schemas <schemas>`: Comma-separated list of schemas to include
- `-e, --exclude-schemas <schemas>`: Comma-separated list of schemas to exclude

#### Examples

```bash
# Generate types with default settings
npx lawless-supabase types

# Generate types to a specific file
npx lawless-supabase types -o ./src/types/database.ts

# Generate types for specific schemas only
npx lawless-supabase types -i public,auth

# Exclude certain schemas
npx lawless-supabase types -e information_schema,pg_catalog
```

## Development

```bash
npm run dev
```

## Building

```bash
npm run build
```
