export * from './compose';
export * from './object';
export * from './json';
export * from './array';
export * from './mapping';
export * from './string';
export * from './helpers';

export type Encoder<T, U> = (val: T) => U;
export type EncoderInputType<T> = T extends Encoder<infer I, any> ? I : never;
export type EncoderOutputType<T> = T extends Encoder<any, infer O> ? O : never;

export function noop<T>(): Encoder<T, T> {
  return (v) => v;
}
