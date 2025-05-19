import {logger} from "./services/logger.service";
import {printGreeting} from "./services/helpers/greeting";
import {loadSettings} from "./services/settings/settings.service";

const main = async () => {
    try {
        printGreeting();
        const settings = loadSettings();
        console.log({ settings });
    } catch (error) {
        logger.error(error);
    }
};

main();
