const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function getRandomId(): string {
  return Array.from({ length: 20 }).reduce(
    (acc: string) => acc + CHARS[Math.floor(Math.random() * CHARS.length)],
    ''
  ) as string;
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
