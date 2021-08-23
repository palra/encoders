import { Encoder } from '.';

type JSONOpts = {
  pretty?: number | boolean;
};

export function toJSON<T>(
  { pretty }: JSONOpts = { pretty: false },
): Encoder<T, string> {
  return (val) => {
    if (pretty) {
      const identation = typeof pretty === 'number' ? pretty : 2;
      return JSON.stringify(val, null, identation);
    }

    return JSON.stringify(val);
  };
}
