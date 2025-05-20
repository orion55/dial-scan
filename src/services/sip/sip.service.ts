import { SipTrunkMap, SipUserMap } from "../types/telephony.types";
import { readFile, writeFile } from "node:fs/promises";
import path from "path";
import { SettingsDial } from "../types/settings.types";
import { removeComments } from "../helpers/removeComments";

export const loadSip = async (
  filename: string,
  settings: SettingsDial,
): Promise<unknown> => {
  const sipTrunks: SipTrunkMap<"context"> = new Map();
  const sipUsers: SipUserMap<"parent" | "context"> = new Map();

  const filePath = path.join(settings.asterisk_config, filename);
  let text = await readFile(filePath, {
    encoding: "utf-8",
  });

  const cleanedText = removeComments(text);
  // await writeFile("d:\\config-clean.conf", cleanedText, "utf-8");

  return undefined;
};
