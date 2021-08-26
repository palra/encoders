import * as e from '.';

describe('Encode Objects', () => {
  it('should encode an object with no effects', () => {
    const json = {
      a: 1,
      b: '2',
      c: true,
    };

    const encode = e.object<typeof json>().encoder;
    expect(encode(json)).toEqual(json);
  });

  it('should rename fields', () => {
    const json = {
      a: 1,
      b: '2',
      c: true,
    };

    const encode = e
      .object<typeof json>()
      .rename('a', 'new_a')
      .rename('b', 'new_b').encoder;

    expect(encode(json)).toEqual({
      new_a: 1,
      new_b: '2',
      c: true,
    });
  });

  it('should preserve order', () => {
    const toEncode = {
      a: 1,
      b: '2',
      c: true,
    };

    const encode = e.compose(
      e.object<typeof toEncode>().rename('b', 'new_b').encoder,
      e.json(),
    );
    expect(encode(toEncode)).toEqual(`{"a":1,"new_b":"2","c":true}`);
  });

  it('should map property to encoder', () => {
    const toEncode = {
      a: 1,
      b: { c: '2' },
    };

    const encode = e.object<typeof toEncode>().map('b', e.json()).encoder;
    expect(encode(toEncode)).toEqual({ a: 1, b: `{"c":"2"}` });
  });

  it('should parse nested collections', () => {
    type Item = { a: number };
    const toEncode = {
      items: [{ a: 1 }, { a: 2 }] as Item[],
    };

    const itemEncoder = e.object<Item>().map('a', e.json()).encoder;
    const encode = e
      .object<typeof toEncode>()
      .map('items', e.each(itemEncoder)).encoder;

    expect(encode(toEncode)).toEqual({ items: [{ a: '1' }, { a: '2' }] });
  });

  it('should transform keys to snake_case', () => {
    const toEncode = {
      encodeTest: true,
      no: 'change',
      shouldTransformAllKeys: 'please',
    };

    const encoder = e
      .object<typeof toEncode>()
      .transformKeys('snake_case').encoder;

    expect(encoder(toEncode)).toEqual({
      encode_test: true,
      no: 'change',
      should_transform_all_keys: 'please',
    });
  });
});
