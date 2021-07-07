import { inherits } from 'util'

import Assessor from './assessor'
import TextLengthCounter from './assessments/seo/TextLengthCounter';

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const WordCounterSEO = function(i18n, options) {
  Assessor.call(this, i18n, options)
  this.type = 'WordCounterSEO'

  this._assessments = [
    new TextLengthCounter(),
  ]
}

inherits(WordCounterSEO, Assessor)

export default WordCounterSEO
