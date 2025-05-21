import { SettingsDial } from "../types/settings.types";
import { logger } from "../logger.service";
import path from "path";
import { readAndClean } from "../helpers/removeComments";
import { readFile, writeFile } from "node:fs/promises";

export const loadDial = async (
  filenames: string[],
  settings: SettingsDial,
): Promise<void> => {
  for (const filename of filenames) {
    logger.info(`Читаем файл ${filename}`);
    const filePath = path.join(settings.asterisk_config, filename);
    const cleaned = await readAndClean(filePath);
    // await writeFile("extensions01.conf", cleaned);
    logger.info(`Закончили парсинг файла ${filename}`);
    // return result;
  }
};
