import { Encoder, noop } from '.';
import { compose } from './compose';
import { caseTransform, StringTransformer } from './string';
import {
  SnakeCasedProperties,
  KebabCasedProperties,
  CamelCasedProperties,
} from 'type-fest';

type Rename<T, K extends keyof T, N extends string> = Pick<
  T,
  Exclude<keyof T, K>
> &
  { [P in N]: T[K] };
type ChangeType<T, K extends keyof T, U> = Pick<T, Exclude<keyof T, K>> &
  { [P in K]: U };

export function keyRename<
  T extends { [key: string]: any },
  OldKey extends keyof T,
  NewKey extends string,
>(oldKey: OldKey, newKey: NewKey): Encoder<T, Rename<T, OldKey, NewKey>> {
  return (value) => {
    const newValue: any = {};
    Object.keys(value).forEach((key) => {
      if (key === oldKey) {
        newValue[newKey] = value[oldKey];
      } else {
        newValue[key] = value[key];
      }
    });

    return newValue;
  };
}

export function map<T extends { [key: string]: any }, K extends keyof T, U>(
  mapKey: K,
  encoder: Encoder<T[K], U>,
): Encoder<T, ChangeType<T, K, U>> {
  return (value) => {
    const newValue: any = {};
    Object.keys(value).forEach((key) => {
      if (key === mapKey) {
        newValue[mapKey] = encoder(value[mapKey]);
      } else {
        newValue[key] = value[key];
      }
    });

    return newValue;
  };
}
interface ObjectEncoderBuilder<T extends { [key in string]: any }, U> {
  rename<Old extends keyof U, New extends string>(
    oldKey: Old,
    newKey: New,
  ): ObjectEncoderBuilder<T, Rename<U, Old, New>>;
  map<Key extends keyof U, NewVal>(
    key: Key,
    encoder: Encoder<U[Key], NewVal>,
  ): ObjectEncoderBuilder<T, ChangeType<U, Key, NewVal>>;
  transformKeys<KT extends StringTransformer>(
    transformer: KT,
  ): ObjectEncoderBuilder<
    T,
    KT extends 'snake_case'
      ? SnakeCasedProperties<U>
      : KT extends 'kebab-case'
      ? KebabCasedProperties<U>
      : KT extends 'camelCase'
      ? CamelCasedProperties<U>
      : { [key: string]: any }
  >;
  encoder: Encoder<T, U>;
}

function makeObjectEncoderBuilder<
  T extends { [key: string]: any },
  U extends { [key: string]: any },
>(encoder: Encoder<T, U>): ObjectEncoderBuilder<T, U> {
  return {
    rename: (oldKey, newKey) => {
      return makeObjectEncoderBuilder(
        compose(encoder, keyRename(oldKey, newKey)),
      );
    },
    map: (mapKey, mapEncoder) => {
      return makeObjectEncoderBuilder(
        compose(encoder, map(mapKey, mapEncoder)),
      );
    },
    transformKeys(transformer) {
      return makeObjectEncoderBuilder(
        compose(encoder, (obj) => {
          const newObject: any = {};
          Object.keys(obj).forEach((key) => {
            newObject[caseTransform(transformer)(key)] = obj[key];
          });
          return newObject;
        }),
      );
    },
    encoder,
  };
}

export function object<T>(): ObjectEncoderBuilder<T, T> {
  return makeObjectEncoderBuilder(noop());
}
