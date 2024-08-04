"use server";
import { sql } from "@/app/lib/sql-hack";
import { NextApiRequest, NextApiResponse } from "next";

async function createDiagram() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createTable = await sql`
            CREATE TABLE IF NOT EXISTS diagrams (
                key UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            )
        `;
    console.log(`Created "nodes" table`);
    // const insertedNodes = await Promise.all(
    //   nodes.map(
    //     (node) => sql`
    //   INSERT INTO nodes (key, name)
    //   VALUES (${node.key}, ${node.name})
    //   ON CONFLICT (key) DO NOTHING;
    //   `
    //   )
    // );
    // console.log(`Seeded ${insertedNodes.length} nodes`);
    // return {
    //   createTable,
    //   nodes: insertedNodes,
    // };
  } catch (error) {
    console.error(`Error seeding nodes:`, error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = {
      message: await createDiagram(),
    };
    return res.status(200).json(data);
  }
}
