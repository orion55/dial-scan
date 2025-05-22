import {
  RelationSip,
  SipTrunk,
  SipTrunkMap,
  SipUser,
  SipUserMap,
} from "../types/telephony.types";
import path from "path";
import { SettingsDial } from "../types/settings.types";
import { readAndClean } from "../helpers/prepareConfig";
import { parseConfig } from "../helpers/parseConfig";
import { logger } from "../logger.service";
import { isUserSection } from "./typeSection";

export type SipResult = {
  sipTrunks: SipTrunkMap<"context">;
  sipUsers: SipUserMap<"parent" | "context">;
};

const HEADER_RE = /^\[([^'\]]+)](?:\(([^)]+)\))?$/;

const buildRelations = <T extends string>(
  includeParent: boolean,
  context: string | undefined,
  parentName?: string | undefined,
  keyName?: string,
): RelationSip<T>[] => {
  const rel: RelationSip<T>[] = [];
  if (includeParent && parentName !== undefined && parentName !== "!") {
    rel.push({ type: "in", key: "parent" as T, target: parentName });
  }
  if (context) {
    rel.push({ type: "out", key: "context" as T, target: context });
  }
  if (includeParent && keyName && !context) {
    rel.push({ type: "out", key: "context" as T, target: keyName });
  }
  return rel;
};

const makeSipUser = (
  parentName: string,
  value: Record<string, string>,
  keyName?: string,
): SipUser<"parent" | "context"> => {
  const { callerid, type, context } = value;

  return {
    relations: buildRelations<"parent" | "context">(
      true,
      context,
      parentName,
      keyName,
    ),
    ...(type !== undefined && { type }),
    ...(callerid !== undefined && { callerid }),
    ...(context !== undefined && { context }),
  };
};

const makeSipTrunk = (value: Record<string, string>): SipTrunk<"context"> => {
  const { host, port, trunkname, type, context } = value;

  return {
    host,
    relations: buildRelations<"context">(false, context),
    ...(type !== undefined && { type }),
    ...(port !== undefined && { port: Number(port) }),
    ...(trunkname !== undefined && { trunkname }),
    ...(context !== undefined && { context }),
  };
};

const parseSipConfig = (text: string): SipResult => {
  const parsed = parseConfig(text);

  const sipTrunks: SipTrunkMap<"context"> = new Map();
  const sipUsers: SipUserMap<"parent" | "context"> = new Map();

  for (const [key, value] of parsed.entries()) {
    if (key === "[general]") continue;
    const headerMatch = key.match(HEADER_RE);
    if (!headerMatch) continue;

    const keyName = headerMatch[1];
    if (isUserSection(key, value)) {
      const parentName = headerMatch[2];
      const user = makeSipUser(parentName, value, keyName);
      sipUsers.set(keyName, user);
    } else {
      const trunk = makeSipTrunk(value);
      sipTrunks.set(keyName, trunk);
    }
  }
  return { sipTrunks, sipUsers };
};

export const loadSip = async (
  filename: string,
  settings: SettingsDial,
): Promise<SipResult> => {
  logger.info(`Читаем файл ${filename}`);
  const filePath = path.join(settings.asterisk_config, filename);
  const cleaned = await readAndClean(filePath);
  const result = parseSipConfig(cleaned);
  logger.info(`Закончили парсинг файла ${filename}`);
  return result;
};
