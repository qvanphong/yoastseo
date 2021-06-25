import { merge, isEmpty } from 'lodash-es';

import Assessment from '../../assessment'
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
      minMatched: 1,
      maxMatched: 2,
      scores: {
        inBoundary: 9,
        notItBoundary: 3,
        noMatches: -10,
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
    if (this._sapo >= this._config.minMatched && this._sapo <= this._config.maxMatched) {
      return {
        score: this._config.scores.inBoundary,
        resultText: 'Từ khóa trong Sapo: Tốt!',
      }
    }

    if (this._sapo == 0) {
      return {
        score: this._config.scores.noMatches,
        resultText: 'Từ khóa trong Sapo: Hãy thêm từ khóa chính vào Sapo.',
      }
    }

    if (this._sapo > this.maxMatched) {
      return {
        score: this._config.scores.notItBoundary,
        resultText: `Từ khóa trong Sapo: Từ khóa xuất hiện quá nhiều trong Sapo! Hãy giảm số lần từ khóa xuất hiện trong khoảng ${this._config.minMatched} - ${this._config.maxMatched} lần.`,
      }
    }

    if (this._sapo < this.maxMatched) {
      return {
        score: this._config.scores.notItBoundary,
        resultText: `Từ khóa trong Sapo: Từ khóa xuất hiện quá ít trong Sapo! Hãy tăng số lần từ khóa xuất hiện trong khoảng ${this._config.minMatched} - ${this._config.maxMatched} lần.`,
      }
    }
  }

  /**
   * Checks whether the paper has a sapo
   *
   * @param {Paper} paper The paper to use for the assessment.
   *
   * @returns {boolean} True when there is sapo.
   */
  isApplicable(paper) {
    return paper.hasSapo() && isEmpty(paper.getSapo())
  }
}
