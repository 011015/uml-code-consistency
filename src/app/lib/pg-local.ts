"use server";
import { Pool } from "pg";
import type { QueryResult, QueryResultRow } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
});

export async function sql<O extends QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: Primitive[]
): Promise<QueryResult<O>> {
  const [query, params] = await sqlTemplate(strings, ...values);

  // @ts-ignore
  const res = await pool.query(query, params);

  // @ts-ignore
  return res as unknown as Promise<QueryResult<O>>;
}

export type Primitive = string | number | boolean | undefined | null;

export async function sqlTemplate(
  strings: TemplateStringsArray,
  ...values: Primitive[]
) {
  if (!isTemplateStringsArray(strings) || !Array.isArray(values)) {
    throw new Error(
      "It looks like you tried to call `sql` as a function. Make sure to use it as a tagged template.\n\tExample: sql`SELECT * FROM users`, not sql('SELECT * FROM users')"
    );
  }

  let result = strings[0] ?? "";

  for (let i = 1; i < strings.length; i++) {
    result += `$${i}${strings[i] ?? ""}`;
  }

  return [result, values];
}

function isTemplateStringsArray(
  strings: unknown
): strings is TemplateStringsArray {
  return (
    Array.isArray(strings) && "raw" in strings && Array.isArray(strings.raw)
  );
}
