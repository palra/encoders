import { Encoder, compose, noop } from '.';

type Mapping<T> = { [key: string]: T };
interface MappingEncoderBuilder<T, U> {
  values<V>(encoder: Encoder<U, V>): MappingEncoderBuilder<T, V>;
  encoder: Encoder<Mapping<T>, Mapping<U>>;
}

function makeMappingEncoderBuilder<T, U>(
  encoder: Encoder<T, U>,
): MappingEncoderBuilder<T, U> {
  return {
    values(valueEncoder) {
      return makeMappingEncoderBuilder(compose(encoder, valueEncoder));
    },
    encoder: (value) => {
      const newObject: any = {};
      Object.keys(value).forEach((key) => {
        newObject[key] = encoder(value[key]);
      });

      return newObject;
    },
  };
}

export function mapping<T>(): MappingEncoderBuilder<T, T> {
  return makeMappingEncoderBuilder(noop());
}
