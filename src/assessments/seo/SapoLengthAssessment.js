import Assessment from '../../assessment'
import { merge } from 'lodash-es'
import countSapoHeading from '../../stringProcessing/countSapoHeading'
import { AssessmentResult } from '../../..'
import { inRange } from '../../helpers/inRange'
class SapoLengthAssessment extends Assessment {
  constructor(config = {}) {
    super()

    const defaultConfig = {
      recommendedMaximum: 350,
      slightlyOverMaximum: 400,
      overMaximum: 450,

      scores: {
        recommendedMaximum: 9,
        slightlyOverMaximum: 6,
        overMaximum: 3,
      },
    }

    this.identifier = 'sapoLength'
    this._config = merge(defaultConfig, config)
  }
  /**
   * Get result of this assessment
   *
   * @param {paper} paper
   * @param {researcher} researcher
   * @param {i18n} i18n
   * @returns
   */
  getResult(paper, researcher, i18n) {
    const sapoWordCount = countSapoHeading(paper.getSapo())
    const assessmentResult = new AssessmentResult()
    const calculatedResult = this.calculatedResult(sapoWordCount)


    assessmentResult.setScore(calculatedResult.score)
    assessmentResult.setText(calculatedResult.resultText)

    return assessmentResult
  }

  /**
   * Calculate the score following rules
   * <= maximum => 9
   * maximum > count <= slightly => 6
   * slightly > count <= over => 3
   * count > over => -10 (bad!)
   *
   * @param {number} wordCount sapo words count
   * @param {Jed} i18n
   * @returns
   */
  calculatedResult(wordCount, i18n) {
    if(wordCount == 0) {
      return {
        score: -10,
        resultText: 'Chiều dài Sapo: Hãy nhập nội dung Sapo để đánh giá',
      }
    }
    // In recommend maximum range
    if (inRange(wordCount, 0, this._config.recommendedMaximum + 1)) {
      return {
        score: this._config.scores.recommendedMaximum,
        resultText: 'Chiều dài Sapo: Tốt!',
      }
    }

    // Slightly over a little bit from recommend range
    if (inRange(wordCount, this._config.recommendedMaximum, this._config.slightlyOverMaximum + 1)) {
      return {
        score: this._config.scores.slightlyOverMaximum,
        resultText: 'Chiều dài Sapo: Tương đối ổn, hãy tối ưu hơn nếu có thể!',
      }
    }

    // Far over from recommend range
    if (inRange(wordCount, this._config.slightlyOverMaximum, this._config.overMaximum + 1)) {
      return {
        score: this._config.scores.overMaximum,
        resultText: 'Chiều dài Sapo: Chưa tốt! Hãy tối ưu hóa để dễ đọc hơn. Khuyến khích trong khoảng ' + this._config.recommendedMaximum + ' từ',
      }
    }

    // Fail range
    if (wordCount > this._config.overMaximum) {
      return {
        score: -10,
        resultText:
          'Chiều dài Sapo: Tệ! Hãy tối ưu hóa để dễ đọc hơn. Khuyến khích trong khoảng ' +
          this._config.recommendedMaximum +
          ' từ',
      }
    }
  }

  isApplicable( paper ) {
    return paper.hasSapo();
  }
}

export default SapoLengthAssessment
