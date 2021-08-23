import * as e from '.';

describe('Array encoder', () => {
  it('should apply encoder to every item of the array', () => {
    const array = [{ a: 1 }, { a: 2 }];
    const encoder = e.each(
      e.object<typeof array[number]>().rename('a', 'new_a').encoder,
    );

    expect(encoder(array)).toEqual([{ new_a: 1 }, { new_a: 2 }]);
  });

  it('should have no effect on empty arrays', () => {
    const array: any[] = [];
    const encoder = e.each(e.json());

    expect(encoder(array)).toEqual([]);
  });
});
