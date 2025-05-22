import { SettingsDial } from "../types/settings.types";
import { logger } from "../logger.service";
import path from "path";
import { readAndClean } from "../helpers/prepareConfig";
import { DialContextMap, DialExtenMap } from "../types/telephony.types";
import { parseDialplan } from "./parseDialplan";

type DialType = "goto" | "gosub";

export type DialResult = {
  dialContexts: DialContextMap<"include">;
  dialExtens: DialExtenMap<DialType>;
};

const parseDialConfig = (
  text: string,
  dialContexts: DialContextMap<"include">,
  dialExtens: DialExtenMap<DialType>,
) => {
  const parsed = parseDialplan(text);
  // console.log(parsed);
  for (const [name, values] of parsed.entries()) {
    let includes: string[] = [];
    for (let i = 0; i < values.length; i++) {
      const directive = values[i][0];
      if (directive === "include") {
        const includeName = values[i][1];
        includes.push(includeName);
      }
    }
    console.log({ name, includes });
  }
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
    parseDialConfig(cleaned, dialContexts, dialExtens);
    logger.info(`Закончили парсинг файла ${filename}`);
  }

  return { dialContexts, dialExtens };
};
