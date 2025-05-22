import { SettingsDial } from "../types/settings.types";
import { logger } from "../logger.service";
import path from "path";
import { readAndClean } from "../helpers/prepareConfig";
import {
  DialContext,
  DialContextMap,
  DialExten,
  DialExtenMap,
} from "../types/telephony.types";
import { parseConfig } from "../helpers/parseConfig";

type DialType = "goto" | "gosub";

export type DialResult = {
  dialContexts: DialContextMap<"include">;
  dialExtens: DialExtenMap<DialType>;
};

const parseDialConfig = (text: string) => {
  const parsed = parseConfig(text);
  // console.log(parsed);
};

export const loadDial = async (
  filenames: string[],
  settings: SettingsDial,
): Promise<DialResult> => {
  const dialContexts: DialContextMap<"include"> = new Map();
  const dialExtens: DialExtenMap<DialType> = new Map();

  for (const filename of filenames) {
    logger.info(`Читаем файл ${filename}`);
    const filePath = path.join(settings.asterisk_config, filename);
    const cleaned = await readAndClean(filePath);
    parseDialConfig(cleaned);
    logger.info(`Закончили парсинг файла ${filename}`);
  }

  return { dialContexts, dialExtens };
};
