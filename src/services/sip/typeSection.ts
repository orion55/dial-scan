const startsWithDigit = /^\d/;
const bracketWrapper = /^\[|\]$/g;

export function isUserSection(
  key: string,
  value: Record<string, string>,
): boolean {
  const normalizedKey = key.replace(bracketWrapper, "");

  if (value.host === "dynamic") {
    return true;
  } else if (value.trunkname !== undefined) {
    return false;
  } else if (value.port !== undefined) {
    return false;
  } else if (startsWithDigit.test(normalizedKey)) {
    return false;
  } else {
    return true;
  }
}
