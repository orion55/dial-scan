import { logger } from "./services/logger.service";
import { printGreeting } from "./services/helpers/greeting";
import { loadSettings } from "./services/settings/settings.service";
import { loadSip } from "./services/sip/sip.service";

const main = async () => {
  try {
    printGreeting();
    const settings = loadSettings();
    const sipResult = await loadSip("sip.conf", settings);
  } catch (error) {
    logger.error(error);
  }
};

main();
