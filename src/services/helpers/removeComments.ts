export const removeComments = (text: string): string => {
  const lines = text.split(/\r?\n/);
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trimStart();

    // если строка целиком — комментарий, пропускаем
    if (trimmed.startsWith(";")) {
      continue;
    }

    // ищем первый ';' в строке
    const idx = line.indexOf(";");
    if (idx !== -1) {
      // сохраняем часть до ';', обрезая лишние пробелы справа
      result.push(line.slice(0, idx).replace(/\s+$/u, ""));
    } else {
      // строка без комментариев — сохраняем как есть
      result.push(line);
    }
  }

  return result.join("\n");
};
