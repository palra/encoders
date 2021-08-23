import { Encoder, noop } from '.';
import { compose } from './compose';

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
  encoder: Encoder<T, U>;
}

function makeObjectEncoderBuilder<T extends { [key: string]: any }, U>(
  encoder: Encoder<T, U>,
): ObjectEncoderBuilder<T, U> {
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
    encoder,
  };
}

export function object<T>(): ObjectEncoderBuilder<T, T> {
  return makeObjectEncoderBuilder(noop());
}
