import countWords from './countWords';
/**
 * Count sapo text.
 * Following the rule that Sapo will be H2 and have only one
 *
 * @returns {text} sapo text word count.
 *  */
import { isEmpty } from 'lodash-es';

export default function countSapoHeading(text) {
  if (!isEmpty(text)) {
    return countWords(text);
  }

  return 0;
}
