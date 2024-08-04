const { db } = require("@vercel/postgres");
const { getClient } = require("./pg-local");
const {
  nodes,
  properties,
  methods,
  parameters,
  links,
} = require("../app/lib/placeholder-data.js");

async function seedNodes(client, nodes) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS nodes (
                key UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            )
        `;
    console.log(`Created "nodes" table`);
    const insertedNodes = await Promise.all(
      nodes.map(
        (node) => client.sql`
      INSERT INTO nodes (key, name)
      VALUES (${node.key}, ${node.name})
      ON CONFLICT (key) DO NOTHING;
      `
      )
    );
    console.log(`Seeded ${insertedNodes.length} nodes`);
    return {
      createTable,
      nodes: insertedNodes,
    };
  } catch (error) {
    console.error(`Error seeding nodes:`, error);
    throw error;
  }
}

async function seedProperties(client, properties) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS properties (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                visibility VARCHAR(255) NOT NULL,
                default_value VARCHAR(255),
                node_id UUID DEFAULT uuid_generate_v4() NOT NULL,
                FOREIGN KEY (node_id)
                  REFERENCES nodes (key)
                  ON DELETE CASCADE
                  ON UPDATE CASCADE
            )
        `;
    console.log(`Created "properties" table`);

    const insertedProperties = await Promise.all(
      properties.map(
        (properties) => client.sql`
      INSERT INTO properties(id, name, type, visibility, default_value, node_id)
      VALUES (${properties.id}, ${properties.name}, ${properties.type}, ${properties.visibility}, ${properties.default}, ${properties.node_id})
      ON CONFLICT (id) DO NOTHING;
        `
      )
    );
    console.log(`Seeded ${insertedProperties.length} properties`);
    return {
      createTable,
      properties: insertedProperties,
    };
  } catch (error) {
    console.error(`Error seeding properties:`, error);
    throw error;
  }
}

async function seedMethods(client, methods) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS methods (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                visibility VARCHAR(255) NOT NULL,
                node_id UUID DEFAULT uuid_generate_v4() NOT NULL,
                FOREIGN KEY (node_id)
                  REFERENCES nodes (key)
                  ON DELETE CASCADE
                  ON UPDATE CASCADE
            )
        `;
    console.log(`Created "methods" table`);

    const insertedMethods = await Promise.all(
      methods.map(
        (method) => client.sql`
      INSERT INTO methods(id, name, type, visibility, node_id)
      VALUES (${method.id}, ${method.name}, ${method.type}, ${method.visibility}, ${method.node_id})
      ON CONFLICT (id) DO NOTHING;
        `
      )
    );
    console.log(`Seeded ${insertedMethods.length} methods`);
    return {
      createTable,
      methods: insertedMethods,
    };
  } catch (error) {
    console.error(`Error seeding methods:`, error);
    throw error;
  }
}

async function seedParameters(client, parameters) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS parameters (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                method_id UUID DEFAULT uuid_generate_v4() NOT NULL,
                FOREIGN KEY (method_id)
                  REFERENCES methods (id)
                  ON DELETE CASCADE
                  ON UPDATE CASCADE
            )
        `;
    console.log(`Created "parameters" table`);

    const insertedParameters = await Promise.all(
      parameters.map(
        (parameter) => client.sql`
      INSERT INTO parameters(id, name, type, method_id)
      VALUES (${parameter.id}, ${parameter.name}, ${parameter.type}, ${parameter.method_id})
      ON CONFLICT (id) DO NOTHING;
        `
      )
    );
    console.log(`Seeded ${insertedParameters.length} parameters`);
    return {
      createTable,
      parameters: insertedParameters,
    };
  } catch (error) {
    console.error(`Error seeding parameters:`, error);
    throw error;
  }
}

async function seedLinks(client, links) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS links (
                key UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                relationship VARCHAR(255) NOT NULL,
                "from" UUID DEFAULT uuid_generate_v4() NOT NULL,
                "to" UUID DEFAULT uuid_generate_v4() NOT NULL,
                FOREIGN KEY ("from")
                  REFERENCES nodes (key)
                  ON DELETE CASCADE
                  ON UPDATE CASCADE,
                FOREIGN KEY ("to")
                  REFERENCES nodes (key)
                  ON DELETE CASCADE
                  ON UPDATE CASCADE
            )
        `;
    console.log(`Created "links" table`);

    const insertedLinks = await Promise.all(
      links.map(
        (link) => client.sql`
      INSERT INTO links(key, relationship, "from", "to")
      VALUES (${link.key}, ${link.relationship}, ${link.from}, ${link.to})
      ON CONFLICT (key) DO NOTHING;
        `
      )
    );
    console.log(`Seeded ${insertedLinks.length} links`);
    return {
      createTable,
      links: insertedLinks,
    };
  } catch (error) {
    console.error(`Error seeding links:`, error);
    throw error;
  }
}

async function main() {
  const client =
    process.env.LOCAL_VERCEL_POSTGRES === "true"
      ? await getClient()
      : await db.connect();
  await seedNodes(client, nodes);
  await seedProperties(client, properties);
  await seedMethods(client, methods);
  await seedParameters(client, parameters);
  await seedLinks(client, links);
  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
