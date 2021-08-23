import { Encoder } from '.';

export function each<T, U>(
  valueEncoder: Encoder<T, U>,
): Encoder<Array<T>, Array<U>> {
  return (array) => array.map((val) => valueEncoder(val));
}
