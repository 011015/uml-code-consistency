"use server";
import { sql } from "@/app/lib/sql-hack";
import { NodeData } from "@/app/lib/definitions";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_noStore as noStore } from "next/cache";

async function fetchNodes() {
  noStore();
  try {
    const data = await sql<Array<NodeData>>`
          SELECT json_agg(
            json_build_object(
              'key', nodes.key,
              'name', nodes.name,
              'properties', (
                  SELECT json_agg(
                      json_build_object(
                          'name', properties.name,
                          'type', properties.type,
                          'visibility', properties.visibility,
                          'default', properties.default
                      )
                  )
                  FROM properties
                  WHERE properties.node_id = nodes.key
              ),
              'methods', (
                  SELECT json_agg(
                      json_build_object(
                          'name', methods.name,
                          'type', methods.type,
                          'visibility', methods.visibility,
                          'parameters', (
                              SELECT json_agg(
                                  json_build_object(
                                      'name', parameters.name,
                                      'type', parameters.type
                                  )
                              )
                              FROM parameters
                              WHERE parameters.method_id = methods.id
                          )
                      )
                  )
                  FROM methods
                  WHERE methods.node_id = nodes.key
              )
            )
          )
          FROM nodes;
          `;
    return data.rows[0].json_agg;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch nodes");
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const data = {
      message: await fetchNodes(),
    };
    return res.status(200).json(data);
  }
}
