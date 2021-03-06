import { inherits } from 'util'

import SapoLengthAssessment from './assessments/seo/SapoLengthAssessment'
import SapoKeywordAssessment from './assessments/seo/SapoKeywordAssessment'
import TextImagesSubKeywordAssessment from './assessments/seo/TextImagesSubKeywordAssessement'
import SubHeadingsSubKeywordAssessment from './assessments/seo/SubHeadingsSubKeywordAssessment';
import Assessor from './assessor'

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const EMagazineSEO = function(i18n, options) {
  Assessor.call(this, i18n, options)
  this.type = 'EmagazineSEO'

  this._assessments = [
    new SapoLengthAssessment(),
    new SapoKeywordAssessment(),
    new TextImagesSubKeywordAssessment(),
    new SubHeadingsSubKeywordAssessment(),
  ]
}

inherits(EMagazineSEO, Assessor)

export default EMagazineSEO
