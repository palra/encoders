import * as e from '.';
import { BuiltInTransformers } from './string';

describe('String Encoder', () => {
  it('should have built-in encoders', () => {
    const string = 'I Have lots of MixedCase';

    const resultMap: { [key in BuiltInTransformers]: string } = {
      'Start Case': 'I Have Lots Of Mixed Case',
      UPPERCASE: 'I HAVE LOTS OF MIXED CASE',
      lowercase: 'i have lots of mixed case',
      camelCase: 'iHaveLotsOfMixedCase',
      'kebab-case': 'i-have-lots-of-mixed-case',
      snake_case: 'i_have_lots_of_mixed_case',
    };

    for (const [key, value] of Object.entries(resultMap)) {
      expect(e.caseTransform(key as BuiltInTransformers)(string)).toBe(value);
    }
  });

  it('should accept custom string transformers', () => {
    expect(e.caseTransform((str) => `Hello ${str}!`)('World')).toBe(
      'Hello World!',
    );
  });
});
