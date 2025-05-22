const HEADER_REGEX = /^\[([^\]]+)\]$/;

export const parseDialplan = (text: string): Map<string, string[][]> => {
  const result = new Map<string, string[][]>();
  let currentContext: string | null = null;

  // Разбиваем исходный текст на строки
  const lines = text.split(/\r?\n/);

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith(";") || line.startsWith("//")) {
      // Пропустить пустые строки и комментарии
      continue;
    }

    // Найти начало нового контекста: [context-name]
    const ctxMatch = line.match(HEADER_REGEX);
    if (ctxMatch) {
      currentContext = ctxMatch[1];
      if (!result.has(currentContext)) {
        result.set(currentContext, []);
      }
      continue;
    }

    if (!currentContext) {
      // Если ещё не встретили ни одного контекста — пропускаем
      continue;
    }

    // Разбор директивы вида "keyword => rest"
    const parts = line.split("=>");
    if (parts.length < 2) {
      // Нет разделителя '=>' — пропустим
      continue;
    }

    const keyword = parts[0].trim();
    const rest = parts.slice(1).join("=>").trim();

    let tokens: string[] = [keyword];

    if (keyword === "include") {
      // Формат: include => contextName
      tokens.push(rest);
    } else {
      // Остальные: args разделены запятыми
      const args = rest
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");
      tokens.push(...args);
    }

    result.get(currentContext)!.push(tokens);
  }

  return result;
};
