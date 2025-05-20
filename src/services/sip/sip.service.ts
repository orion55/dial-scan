import { SipTrunkMap, SipUserMap } from "../types/telephony.types";
import { readFile, writeFile } from "node:fs/promises";
import path from "path";
import { SettingsDial } from "../types/settings.types";
import { removeComments } from "../helpers/removeComments";
import { parseConfig } from "./parseConfig";
import { logger } from "../logger.service";
import { isUserSection } from "./typeSection";

export const loadSip = async (
  filename: string,
  settings: SettingsDial,
): Promise<unknown> => {
  logger.info(`Читаем файл ${filename}`);

  const filePath = path.join(settings.asterisk_config, filename);
  let text = await readFile(filePath, {
    encoding: "utf-8",
  });

  const cleanedText = removeComments(text);
  const parsedText = parseConfig(cleanedText);

  const sipTrunks: SipTrunkMap<"context"> = new Map();
  const sipUsers: SipUserMap<"parent" | "context"> = new Map();

  for (const [key, value] of parsedText.entries()) {
    console.log(`Ключ: ${key}, Значение: ${value}`);
    console.log(`isUserSection: ${isUserSection(key, value)}`);
  }

  return undefined;
};
