import { Encoder } from 'src';
import * as _ from 'lodash';

export type BuiltInTransformers =
  | 'camelCase'
  | 'kebab-case'
  | 'Start Case'
  | 'lowercase'
  | 'snake_case'
  | 'UPPERCASE';

export type StringTransformer = ((val: string) => string) | BuiltInTransformers;

export function caseTransform(
  transformer: StringTransformer,
): Encoder<string, string> {
  if (typeof transformer === 'function') {
    return transformer;
  }

  switch (transformer) {
    case 'camelCase':
      return _.camelCase;
    case 'kebab-case':
      return _.kebabCase;
    case 'Start Case':
      return _.startCase;
    case 'lowercase':
      return _.lowerCase;
    case 'UPPERCASE':
      return _.upperCase;
    case 'snake_case':
      return _.snakeCase;
    default:
      return (s: string) => s;
  }
}
