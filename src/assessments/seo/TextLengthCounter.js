import { inRange, merge } from "lodash-es";

import Assessment from "../../assessment";
import AssessmentResult from "../../values/AssessmentResult";

/**
 * Assessment that will test if the text is long enough.
 */
export default class TextLengthCounter extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			score: 0
		};

		this._config = merge( defaultConfig, config );
	}

	/**
	 * Execute the Assessment and return a result.
	 *
	 * @param {Paper} paper The Paper object to assess.
	 * @param {Researcher} researcher The Researcher object containing all available researches.
	 * @param {Jed} i18n The locale object.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher, i18n ) {
		const wordCount = researcher.getResearch( "wordCountInText" );
		const assessmentResult = new AssessmentResult();
		const calculatedResult = this.calculateResult( wordCount, i18n );

		assessmentResult.setScore( this._config.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Returns the score and the appropriate feedback string based on the current word count.
	 *
	 * @param {number} wordCount The amount of words to be checked against.
	 * @param {Jed} i18n The locale object.
	 *
	 * @returns {Object} The score and the feedback string.
	 */
	calculateResult( wordCount, i18n ) {
			return {
        resultText: i18n.sprintf('Bài viết có %1$d từ.', wordCount),
      }
	}
}
