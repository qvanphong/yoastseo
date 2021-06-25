import { merge } from 'lodash-es'

import Assessment from '../../assessment'
import { createAnchorOpeningTag } from '../../helpers/shortlinker'
import { inRangeStartEndInclusive } from '../../helpers/inRange.js'
import { getSubheadingsTopLevel } from '../../stringProcessing/getSubheadings'
import AssessmentResult from '../../values/AssessmentResult'

/**
 * Represents the assessment that checks if the keyword is present in one of the subheadings.
 */
export default class SapoKeywordAssessment extends Assessment {
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
      scores: {
        noMatches: 3,
        matched: 9,
      },
    }

    this.identifier = 'sapoKeyword'
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
    this._sapo = researcher.getResearch('matchKeywordInSapo')

    const assessmentResult = new AssessmentResult()
    const calculatedResult = this.calculateResult()

    assessmentResult.setScore(calculatedResult.score)
    assessmentResult.setText(calculatedResult.resultText)

    return assessmentResult
  }

  calculateResult() {
    if (this._sapo > 0) {
      return { score: this._config.scores.matched, resultText: 'Từ khóa trong Sapo: Từ khóa có xuất hiện trong Sapo' }
    } else {
      return {
        score: this._config.scores.noMatches,
        resultText: 'Từ khóa trong Sapo: Từ khóa không xuất hiện trong Sapo, hãy thêm vào!',
      }
    }
  }

  /**
   * Checks whether the paper has a sapo
   *
   * @param {Paper} paper The paper to use for the assessment.
   *
   * @returns {boolean} True when there is text and a keyword.
   */
  isApplicable(paper) {
    return paper.hasSapo() && paper.getSapo != ''
  }
}
