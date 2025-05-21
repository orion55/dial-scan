import { logger } from "./services/logger.service";
import { printGreeting } from "./services/helpers/greeting";
import { loadSettings } from "./services/settings/settings.service";
import { loadSip } from "./services/sip/sip.service";
import {
  addRelations,
  addTrunksAndUsers,
  closeGraph,
  createGraph,
} from "./services/redis/redis.service";

const main = async () => {
  try {
    printGreeting();
    const settings = loadSettings();
    const sipResult = await loadSip("sip.conf", settings);
    const graph = await createGraph("asterisk");
    await addTrunksAndUsers(graph, sipResult);
    await addRelations(graph, sipResult);
    closeGraph(graph);
  } catch (error) {
    logger.error(error);
  }
};

main();
