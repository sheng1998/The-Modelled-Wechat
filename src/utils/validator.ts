type TRule<T = string> = {
  required?: boolean;
  min?: number;
  max?: number;
  regular?: RegExp;
  reverse?: boolean;
  method?: (value: T) => boolean;
  message: string;
  [key: string]: unknown;
};

export default function <T extends string | number>(rule: TRule<T>, value: T): string | undefined {
  const { required, min, max, regular, reverse, method, message } = rule;
  if (!value && required) return message;
  const { length } = String(value);
  if (min && max && (length < min || length > max)) return message;
  if (min && length < min) return message;
  if (max && length > max) return message;
  if (regular) {
    const reg = new RegExp(regular);
    reg.lastIndex = 0;
    if (reg.test(String(value)) === Boolean(reverse)) return message;
  }
  if (typeof method === 'function' && !method(value)) return message;
  return undefined;
}

export type { TRule };
