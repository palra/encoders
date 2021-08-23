import * as e from '.';

describe('Compose', () => {
  it('should compose encoders', () => {
    const json = {
      a: 1,
      b: '2',
    };

    const encode = e.compose(
      e.object<typeof json>().rename('a', 'new_a').encoder,
      e.json(),
    );

    expect(encode(json)).toEqual(`{"new_a":1,"b":"2"}`);
  });

  it('should have no effect on single argument', () => {
    const json = {
      a: 1,
      b: '2',
    };

    const encode = e.compose(e.json());

    expect(encode(json)).toEqual(JSON.stringify(json));
  });
});
