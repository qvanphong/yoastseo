import { includes, forIn } from 'lodash-es';
import getFunctionWordsLanguages from "../helpers/getFunctionWordsLanguages";
import getLanguage from "../helpers/getLanguage";
import { getSubheadingContentsTopLevel3 } from "../stringProcessing/getSubheadings";
import stripSomeTags from "../stringProcessing/stripNonTextTags";
import { findTopicFormsInString } from "./findKeywordFormsInString";

const functionWordLanguages = getFunctionWordsLanguages();

/**
 * Computes the amount of subheadings reflecting the topic.
 *
 * @param {Object}      topicForms      The main key phrase and its synonyms to check.
 * @param {string[]}    subheadings     The subheadings to check.
 * @param {boolean}     useSynonyms     Whether to match synonyms or only main keyphrase.
 * @param {string}      locale          The current locale.
 *
 * @returns {number} The amount of subheadings reflecting the topic.
 */
const numberOfSubheadingsReflectingTopic = function( subkeywords, subheadings) {
  result = {count: 0, matches: []}

  for (subheading of subheadings) {
    result.count += 1;
    for (let index = 0; index < subkeywords.length; index++) {
      if(subheadings.includes(subkeywords[index])){
        matches[index]  = matches[index] == null ? 1 : matches[index] + 1;
      }
    }
  }
	return result;
};

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the key phrase and the keywords' respective morphological forms in them.
 *
 * Also checks for synonyms.
 *
 * @param {Object}      paper       The paper object containing the text and keyword.
 * @param {Researcher}  researcher  The researcher object.
 *
 * @returns {Object} The result object.
 */
export default function( paper, researcher ) {
	const text = stripSomeTags( paper.getText() );
	let result = { count: 0, matches: []};
	const subheadings = getSubheadingContentsTopLevel3( text );

	if ( subheadings.length !== 0 ) {
		result.count = subheadings.length;
		result = numberOfSubheadingsReflectingTopic(paper.getSubKeywords(), subheadings)
	}

	return result;
}
