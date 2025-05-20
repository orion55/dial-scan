import { SipTrunkMap, SipUserMap } from "../types/telephony.types";
import { readFile } from "node:fs/promises";
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

  const headerRegExp = /^\[([^'\]]+)](?:\(([^)]+)\))?$/;

  for (const [key, value] of parsedText.entries()) {
    if (key === "[general]") continue;
    // console.log(`Ключ: ${key}, Значение: ${value}`);
    // console.log(`isUserSection: ${isUserSection(key, value)}`);
    if (isUserSection(key, value)) {
      const headerMatch = key.match(headerRegExp);
      if (!headerMatch && headerMatch?.[1]) {
        const { callerId, relations, type, context } = value;

        return {
          callerId,
          relations,
          ...(type !== undefined ? { type } : {}),
          ...(context !== undefined ? { context } : {}),
        };
        /*sipUsers.set(headerMatch[1], {
          callerId: "",
          relations: [],
        });*/
      }
    }
  }

  return undefined;
};
