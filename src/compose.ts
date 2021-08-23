/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Encoder } from '.';

export function compose<A, B>(ab: Encoder<A, B>): Encoder<A, B>;
export function compose<A, B, C>(
  ab: Encoder<A, B>,
  bc: Encoder<B, C>,
): Encoder<A, C>;
export function compose<A, B, C, D>(
  ab: Encoder<A, B>,
  bc: Encoder<B, C>,
  cd: Encoder<C, D>,
): Encoder<A, D>;
export function compose<A, B, C, D, E>(
  ab: Encoder<A, B>,
  bc: Encoder<B, C>,
  cd: Encoder<C, D>,
  de: Encoder<D, E>,
): Encoder<A, E>;
export function compose<A, B, C, D, E, F>(
  ab: Encoder<A, B>,
  bc: Encoder<B, C>,
  cd: Encoder<C, D>,
  de: Encoder<D, E>,
  ef: Encoder<E, F>,
): Encoder<A, F>;

export function compose<A, B, C, D, E, F>(
  ab: Encoder<A, B>,
  bc?: Encoder<B, C>,
  cd?: Encoder<C, D>,
  de?: Encoder<D, E>,
  ef?: Encoder<E, F>,
): unknown {
  switch (arguments.length) {
    case 1:
      return ab;
    case 2:
      return (val: A) => bc!(ab(val));
    case 3:
      return (val: A) => cd!(bc!(ab(val)));
    case 4:
      return (val: A) => de!(cd!(bc!(ab(val))));
    case 5:
      return (val: A) => ef!(de!(cd!(bc!(ab(val)))));
    default:
      throw new Error(`compose: too many arguments`);
  }
}
