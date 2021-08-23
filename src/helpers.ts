import { json, JSONOpts, Encoder } from '.';

export function toJson<T>(
  encoder: Encoder<T, unknown>,
  value: T,
  { pretty }: JSONOpts = { pretty: false },
): string {
  return json({ pretty })(encoder(value));
}
