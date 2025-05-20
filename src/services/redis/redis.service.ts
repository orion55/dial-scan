import { Graph, ResultSet } from "redisgraph.js";
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
  console.log("!");
};
