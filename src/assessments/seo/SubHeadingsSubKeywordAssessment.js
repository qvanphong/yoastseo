import { merge, isEmpty } from 'lodash-es'

import Assessment from '../../assessment'
import { createAnchorOpeningTag } from '../../helpers/shortlinker'
import { inRangeStartEndInclusive } from '../../helpers/inRange.js'
import { getSubheadingsTopLevel3 } from '../../stringProcessing/getSubheadings'
import AssessmentResult from '../../values/AssessmentResult'

/**
 * Represents the assessment that checks if the keyword is present in one of the subheadings.
 */
export default class SubHeadingsSubKeywordAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {object} config The configuration to use.
   *
   * @returns {void}
   */
  constructor(config = {}) {
    super()

    const defaultConfig = {
      parameters: {
        lowerBoundary: 0.1,
        upperBoundary: 0.5,
      },
      scores: {
        noMatches: 3,
        tooFewMatches: 3,
        goodNumberOfMatches: 9,
        tooManyMatches: 3,
      },
      urlTitle: createAnchorOpeningTag('https://yoa.st/33m'),
      urlCallToAction: createAnchorOpeningTag('https://yoa.st/33n'),
    }

    this.identifier = 'subheadingsKeyword'
    this._config = merge(defaultConfig, config)
  }

  /**
   * Runs the matchKeywordInSubheadings research and based on this returns an assessment result.
   *
   * @param {Paper} paper             The paper to use for the assessment.
   * @param {Researcher} researcher   The researcher used for calling research.
   * @param {Object} i18n             The object used for translations.
   *
   * @returns {AssessmentResult} The assessment result.
   */
  getResult(paper, researcher, i18n) {
    this._subHeadings = researcher.getResearch('subkeywordsInHeadings')

    const assessmentResult = new AssessmentResult()

    this._minNumberOfSubheadings = Math.ceil(this._subHeadings.count * this._config.parameters.lowerBoundary)
    this._maxNumberOfSubheadings = Math.floor(this._subHeadings.count * this._config.parameters.upperBoundary)
    const calculatedResult = this.calculateResult(i18n)

    assessmentResult.setScore(calculatedResult.score)
    assessmentResult.setText(calculatedResult.resultText)

    return assessmentResult
  }

  /**
   * Checks whether the paper has a subheadings.
   *
   * @param {Paper} paper The paper to use for the check.
   *
   * @returns {boolean} True when there is at least one subheading.
   */
  hasSubheadings(paper) {
    const subheadings = getSubheadingsTopLevel3(paper.getText())
    return subheadings.length > 0
  }

  isApplicable(paper) {
    return paper.hasSubKeywords() && this.hasSubheadings(paper)
  }

  someKeywordHasTooFew() {
    for (let match of this._subHeadings.matches) {
      if (match < this._minNumberOfSubheadings) return true
    }
    return false
  }

  someKeywordHasTooMuch() {
    for (let match of this._subHeadings.matches) {
      if (match > this._maxNumberOfSubheadings) return true
    }
    return false
  }

  hasGoodNumberOfMatches() {
    return !this.someKeywordHasTooFew && !this.someKeywordHasTooMuch
  }

  /**
   * Determines the score and the Result text for the subheadings.
   *
   * @param {Object} i18n The object used for translations.
   *
   * @returns {Object} The object with the calculated score and the result text.
   */
  calculateResult(i18n) {
    if (this.someKeywordHasTooFew()) {
      return {
        score: this._config.scores.tooFewMatches,
        resultText: i18n.sprintf(
          /* Translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
          i18n.dgettext(
            'js-text-analysis',
            '%1$sT??? kh??a ph??? trong ti??u ????? nh???%2$s: M???t s??? k?? t??? c?? t???n su???t xu???t hi???n ??t h??n khuy???n kh??ch. (Khuy???n kh??ch xu???t hi???n trong kho???ng %3$s - %4$s ti??u ????? ph???)'
          ),
          this._config.urlTitle,
          '</a>',
          this._minNumberOfSubheadings,
          this._maxNumberOfSubheadings
        ),
      }
    }

    if (this.someKeywordHasTooMuch()) {
      return {
        score: this._config.scores.tooManyMatches,
        resultText: i18n.sprintf(
          /* Translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
          i18n.dgettext(
            'js-text-analysis',
            '%1$sT??? kh??a ph??? trong ti??u ????? nh???%2$s: M???t s??? k?? t??? c?? t???n su???t xu???t hi???n nhi???u h??n khuy???n kh??ch. (Khuy???n kh??ch xu???t hi???n trong kho???ng %3$s - %4$s ti??u ????? ph???)'
          ),
          this._config.urlTitle,
          '</a>',
          this._minNumberOfSubheadings,
          this._maxNumberOfSubheadings
        ),
      }
    }

    if (this.hasGoodNumberOfMatches()) {
      return {
        score: this._config.scores.goodNumberOfMatches,
        resultText: i18n.sprintf(
          /* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
					%3$d expands to the number of subheadings containing the keyphrase. */
          i18n.dngettext(
            'js-text-analysis',
            '%1$sT??? kh??a ph??? trong ti??u ????? nh???%2$s: Xu???t hi???n ?????y ????? v?? trong kho???ng khuy???n kh??ch. R???t t???t!'
          ),
          this._config.urlTitle,
          '</a>'
        ),
      }
    }
  }
}
