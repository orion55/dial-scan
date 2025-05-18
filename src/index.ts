import { logger } from "./services/logger.service";
import { printGreeting } from "./services/helpers/greeting";

const main = async () => {
  try {
    printGreeting();
    // const settings = loadSettings();
  } catch (error) {
    logger.error(error);
  }
};

main();
