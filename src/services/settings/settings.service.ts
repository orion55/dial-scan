import * as fs from "fs";
import * as path from "path";
import { getDir } from "./pathUtils";
import { SettingsDial } from "../types/settings.types";

const SETTING_FILE = "settings.json";

const loadSettings = (): SettingsDial => {
  const settingDir = getDir("");
  const settingsPath = path.join(settingDir, SETTING_FILE);

  if (!fs.existsSync(settingsPath)) {
    throw new Error(`Файл настроек не найден: ${settingsPath}`);
  }

  const settingsContent = fs.readFileSync(settingsPath, "utf8");
  return JSON.parse(settingsContent);
};

export { loadSettings };
