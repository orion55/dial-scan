const startsWithDigit = /^\d/;
const bracketWrapper = /^\[|\]$/g;

export function isUserSection(
  key: string,
  value: Record<string, string>,
): boolean {
  const normalizedKey = key.replace(bracketWrapper, "");

  return (
    value.host === "dynamic" ||
    (value.trunkname === undefined && !startsWithDigit.test(normalizedKey))
  );
}
