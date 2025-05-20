import { headerRegex } from "./util";

export const parseConfig = (
  configText: string,
): Map<string, Record<string, string>> => {
  const lines = configText.split(/\r?\n/);
  const sections = new Map<string, Record<string, string>>();

  let currentKey: string | null = null;
  let currentObj: Record<string, string> = {};

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith(";") || line.startsWith("#")) {
      // Пропускаем пустые строки и комментарии
      continue;
    }

    const headerMatch = line.match(headerRegex);
    if (headerMatch) {
      // Новая секция
      if (currentKey) {
        // Сохраняем предыдущую
        sections.set(currentKey, currentObj);
      }
      currentKey = headerMatch[1];
      currentObj = {};
    } else if (currentKey) {
      // Параметр внутри текущей секции
      const idx = line.indexOf("=");
      if (idx > 0) {
        const name = line.substring(0, idx).trim();
        currentObj[name] = line.substring(idx + 1).trim();
      }
    }
  }

  // Добавляем последнюю секцию
  if (currentKey) {
    sections.set(currentKey, currentObj);
  }

  return sections;
};
