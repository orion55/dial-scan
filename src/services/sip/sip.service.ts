import { SipTrunkMap, SipUserMap } from "../types/telephony.types";
import { readFile } from "node:fs/promises";
import { parse } from "ini";
import path from "path";
import { SettingsDial } from "../types/settings.types";

export const loadSip = async (
  filename: string,
  settings: SettingsDial,
): Promise<unknown> => {
  const sipTrunks: SipTrunkMap<"name", "context"> = new Map();
  const sipUsers: SipUserMap<"parent", "context"> = new Map();

  const filePath = path.join(settings.asterisk_config, filename);
  let text = await readFile(filePath, {
    encoding: "utf-8",
  });

  const config = parse(text);
  console.log({ config });

  return undefined;
};
