import { SettingsDial } from "../types/settings.types";
import { logger } from "../logger.service";
import path from "path";
import { readAndClean } from "../helpers/prepareConfig";
import { DialContextMap, DialExtenMap } from "../types/telephony.types";
import { parseDialplan } from "./parseDialplan";

type DialType = "goto" | "gosub" | "gotoif" | "gotoiftime" | "include";

export type DialResult = {
  dialContexts: DialContextMap<DialType>;
  dialExtens: DialExtenMap<DialType>;
};

/*const parseDialConfig = (
  text: string,
  dialContexts: DialContextMap<"include">,
  dialExtens: DialExtenMap<DialType>,
) => {
  const parsed = parseDialplan(text);
  // console.log(parsed);
  for (const [name, values] of parsed.entries()) {
    console.log({ name, values });
    let includes: string[] = [];
    for (let i = 0; i < values.length; i++) {
      const directive = values[i][0];
      if (directive === "include") {
        const includeName = values[i][1];
        includes.push(includeName);
      }
    }
    // console.log({ name, includes });
  }
};*/

export function parseDialConfig(
  text: string,
  dialContexts: DialContextMap<DialType>,
  dialExtens: DialExtenMap<DialType>,
): void {
  const parsed = parseDialplan(text);

  for (const [ctxName, values] of parsed.entries()) {
    // --- Контекст ---
    const ctx = dialContexts.get(ctxName) ?? { include: [], relations: [] };
    // Текущий шаблон exten внутри этого контекста
    let currentExten: string | null = null;

    for (const cols of values) {
      // Первый элемент — всегда директива: 'exten', 'same', 'include' и т.д.
      const directive = cols[0].toLowerCase();

      // --- Работа с конекстом в целом ---
      switch (directive) {
        case "include":
          ctx.include!.push(cols[1]);
          break;
        case "mixmonitor":
          ctx.mixMonitor = true;
          break;
        case "dial":
          ctx.dial = cols[1].replace(/,$/, "");
          break;
        case "goto":
        case "gosub":
          ctx.relations.push({
            key: directive as "goto" | "gosub",
            target: cols[1],
          });
          break;
        case "gotoif":
        case "gotoiftime":
          {
            // cols[1] — строка вида "условие?ctx,exten,prio"
            const [cond, rest] = cols[1].split("?", 2);
            const [targetCtx] = rest.split(",", 1);
            ctx.relations.push({
              key: directive as "gotoif" | "gotoiftime",
              target: targetCtx,
              options: [cond],
            });
          }
          break;
      }

      // --- Работа с шаблонами exten и группировка same ---
      if (directive === "exten") {
        // cols = ['exten', pattern, priority, command...]
        currentExten = cols[1];
        if (!dialExtens.has(currentExten)) {
          dialExtens.set(currentExten, { relations: [] });
        }
      } else if (directive === "same" && currentExten) {
        // cols = ['same', label? or 'n', 'Command(args)', ...]
        // Разбираем команду из cols[2]
        const raw = cols[2]; // например 'Dial(PJSIP/alice,30)'
        const fn = raw.slice(0, raw.indexOf("(")).toLowerCase();
        const args = raw
          .slice(raw.indexOf("(") + 1, raw.lastIndexOf(")"))
          .split(",")
          .map((a) => a.trim());

        const ex = dialExtens.get(currentExten)!;

        switch (fn) {
          case "dial":
            ex.dial = args[0];
            break;
          case "mixmonitor":
            ex.mixMonitor = true;
            break;
          case "goto":
          case "gosub":
            ex.relations.push({
              key: fn as "goto" | "gosub",
              target: args[0],
            });
            break;
          case "gotoif":
          case "gotoiftime":
            {
              // у GotoIf внутри same весь условный блок уже в raw, но часто это 'cond?ctx,ext,prio'
              const [cond, rest] = raw
                .slice(raw.indexOf("(") + 1, raw.lastIndexOf(")"))
                .split("?", 2);
              const [targetCtx] = rest ? rest.split(",", 1) : "";
              ex.relations.push({
                key: fn as "gotoif" | "gotoiftime",
                target: targetCtx,
                options: [cond],
              });
            }
            break;
        }
      }
    }

    dialContexts.set(ctxName, ctx);
  }
  console.log({ dialContexts, dialExtens });
}

export const loadDial = async (
  filenames: string[],
  settings: SettingsDial,
): Promise<DialResult> => {
  const dialContexts: DialContextMap<DialType> = new Map();
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
