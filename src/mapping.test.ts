import * as e from '.';

describe('Mapping encoder', () => {
  it('should map every key to the same encoder', () => {
    type Values = { a: number };
    const mapping: { [key: string]: Values } = {
      key1: { a: 1 },
      key2: { a: 2 },
      key3: { a: 3 },
    };

    const encoder = e
      .mapping<Values>()
      .values(e.object<Values>().rename('a', 'new_a').encoder).encoder;

    expect(encoder(mapping)).toEqual({
      key1: { new_a: 1 },
      key2: { new_a: 2 },
      key3: { new_a: 3 },
    });
  });
});
