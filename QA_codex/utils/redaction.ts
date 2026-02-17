function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function maskValue(value: string): string {
  if (!value) {
    return value;
  }

  if (value.length <= 4) {
    return "*".repeat(value.length);
  }

  return `${value.slice(0, 2)}***${value.slice(-2)}`;
}

function maskKnownSecrets(message: string): string {
  const possibleSecrets = [
    process.env.LOGIN_USERNAME,
    process.env.LOGIN_PASSWORD,
    process.env.API_TOKEN
  ].filter(
    (item) => item && item.trim().length > 0
  );

  let masked = message;
  for (const secret of possibleSecrets) {
    const escapedSecret = escapeForRegExp(secret);
    masked = masked.replace(new RegExp(escapedSecret, "g"), maskValue(secret));
  }
  return masked;
}

export function redactSensitiveText(rawMessage: string): string {
  let safeMessage = rawMessage;

  // Mask IPv4 values in logs to avoid exposing internal server addresses.
  safeMessage = safeMessage.replace(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g, "[REDACTED_IP]");

  // Mask common auth and secret patterns.
  safeMessage = safeMessage.replace(
    /\b(Bearer|Token)\s+[A-Za-z0-9\-._~+/]+=*/gi,
    "$1 [REDACTED]"
  );
  safeMessage = safeMessage.replace(/(password|passwd|pwd)\s*[:=]\s*[^,\s]+/gi, "$1=[REDACTED]");
  safeMessage = safeMessage.replace(
    /(authorization)\s*[:=]\s*[^,\s]+/gi,
    "$1=[REDACTED]"
  );

  // Finally, mask exact secret values loaded from env.
  safeMessage = maskKnownSecrets(safeMessage);
  return safeMessage;
}
