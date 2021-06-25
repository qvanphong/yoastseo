import Assessment from '../../assessment'
import { merge, inRange } from 'lodash-es';
import { AssessmentResult } from '../../..';
import wordCountInTitle from '../../researches/wordCountInTitle';

class TitleLengthAssessment extends Assessment {
  /**
   * Set the identifier and config.
   *
   * @param {Object} [config] The configuration to use.
   *
   * @returns {void}
   */
  constructor (config = {}) {
    super()

    const defaultConfig = {
      recommendedMinimum: 3,
      recommendedMaximum: 7,
      slightlyOverMaximum: 8,
      farOverMaximum: 9,

      scores: {
        good: 9,
        ok: 6,
        bad: -2
      }
    }

    this.identifier = 'titleLength'
    this._config = merge(defaultConfig, config)
  }

  getResult (paper, researcher, i18n) {
    const wordCount = researcher.getResearch('wordCountInTitle')
    const assessmentResult = new AssessmentResult();
    const calculatedResult = this.calculatedResult(wordCount, i18n);

    assessmentResult.setScore( calculatedResult.score );
    assessmentResult.setText( calculatedResult.resultText );

    return assessmentResult;
  }

  /**
   * Calculate result based on config. Following the rules:
   * min <= wordCount >= max => good
   * wordCount < min => bad
   * wordCount >= farOverMaximum => bad
   * wordCount == slightlyOverMaximum => ok
   *
   * */
  calculatedResult( wordCount, i18n ) {
    if(wordCount == 0) {
      return {
        score: 0,
        resultText: 'Chiều dài tiêu đề: Hãy nhập tiêu đề để đánh giá.'
      }
    }
    if (wordCount >= this._config.recommendedMinimum && wordCount <= this._config.recommendedMaximum) {
      return {
        score: this._config.scores.good,
        resultText:'Chiều dài tiêu đề: Chiều dài tiêu đề có độ dài thích hợp. Tốt lắm!',
      }
    }

    if(wordCount < this._config.recommendedMinimum || wordCount >= this._config.farOverMaximum) {
      return {
        score: this._config.scores.bad,
        resultText: i18n.sprintf("Chiều dài tiêu đề: Chiều dài tiêu đề chưa đạt, chứa %1$d từ. Khuyến khích ít nhất %2$d từ và nhiều nhất %3$d - %4$d từ.",
        wordCount,
        this._config.recommendedMinimum,
        this._config.recommendedMaximum,
        this._config.slightlyOverMaximum
        )
      }
    }

    if (wordCount > this._config.recommendedMinimum && wordCount <= this._config.slightlyOverMaximum) {
      return {
        score: this._config.scores.ok,
        resultText: 'Chiều dài tiêu đề: Chiều dài tiêu đề tương đối ổn.',
      }
    }
  }
}

export default TitleLengthAssessment;
