import { redactSensitiveText } from "./redaction";

export class Logger {
  static info(message: string): void {
    console.log(`[INFO] ${redactSensitiveText(message)}`);
  }

  static error(message: string): void {
    console.error(`[ERROR] ${redactSensitiveText(message)}`);
  }
}
