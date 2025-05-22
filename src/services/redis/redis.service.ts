import { Graph } from "redisgraph.js";
import dotenv from "dotenv";
import { logger } from "../logger.service";
import { SipResult } from "../sip/sip.service";

dotenv.config();

const host = process.env.REDIS_HOST || "127.0.0.1";
const port = parseInt(process.env.REDIS_PORT || "6379", 10);

export const createGraph = async (graphName: string): Promise<Graph> => {
  const graph = new Graph(graphName, host, port);
  try {
    await graph.deleteGraph();
    logger.info(`Граф "${graphName}" удален.`);
  } catch {
    logger.info("Нет существующего графа, создание нового...");
  }

  logger.info(`Создание нового графа "${graphName}" на ${host}:${port}.`);
  return graph;
};

export const closeGraph = (graph: Graph) => {
  graph.close();
  logger.info("Соединение с графом закрыто.");
};

export const addTrunksAndUsers = async (
  graph: Graph,
  sipResult: SipResult,
): Promise<void> => {
  for (const [name, trunk] of sipResult.sipTrunks) {
    const props: Record<string, string | number> = { name, host: trunk.host };
    if (trunk.type !== undefined) props.type = trunk.type;
    if (trunk.port !== undefined) props.port = trunk.port;
    if (trunk.trunkname !== undefined) props.trunkname = trunk.trunkname;
    if (trunk.context !== undefined) props.context = trunk.context;

    const keys = Object.keys(props);
    const propsFragment = keys.map((key) => `${key}: $${key}`).join(", ");
    const query = `CREATE (t:SipTrunk {${propsFragment}})`;

    //@ts-ignore
    await graph.query(query, props);
  }

  for (const [name, user] of sipResult.sipUsers) {
    const props: Record<string, string> = { name };
    if (user.type !== undefined) props.type = user.type;
    if (user.callerid !== undefined) props.callerid = user.callerid;
    if (user.context !== undefined) props.context = user.context;

    const keys = Object.keys(props);
    const propsFragment = keys.map((k) => `${k}: $${k}`).join(", ");
    const query = `CREATE (u:SipUser {${propsFragment}})`;

    // @ts-ignore
    await graph.query(query, props);
  }
};

export const addRelations = async (
  graph: Graph,
  sipResult: SipResult,
): Promise<void> => {
  for (const [name, user] of sipResult.sipUsers) {
    const { relations } = user;
    if (relations.length === 0) continue;

    for (const relation of relations) {
      if (
        relation.type === "in" &&
        relation.key === "parent" &&
        relation.target
      ) {
        const sourceName = relation.target;
        const targetName = name;
        const query = `MATCH (a:SipUser {name: $sourceName}), (b:SipUser {name: $targetName})
          CREATE (a)-[r:${relation.key}]->(b)
          RETURN r`;
        // @ts-ignore
        await graph.query(query, { sourceName, targetName });
      }
    }
  }
};
