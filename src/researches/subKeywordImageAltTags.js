/** @module researches/imageAltTags */

import imageInText from '../stringProcessing/imageInText'
import imageAlttag from '../stringProcessing/getAlttagContent'
import { findTopicFormsInString } from '../researches/findKeywordFormsInString'

import { isEmpty } from 'lodash-es'

/**
 * Matches the alt-tags in the images found in the text.
 * Returns an object with the totals and different alt-tags.
 *
 * @param {Array} imageMatches Array with all the matched images in the text
 * @param {Object} topicForms The object with the keyphrase and the synonyms forms from the paper.
 * @returns {object} altProperties Object with all alt-tags that were found.
 */
const matchAltProperties = function(imageMatches, subKeywords) {
  const altProperties = {
    noAlt: 0,
    withAlt: 0,
    withAltKeyword: 0,
    withAltNonKeyword: 0,
    matches: []
  }

  for (let i = 0; i < imageMatches.length; i++) {
    const alttag = imageAlttag(imageMatches[i])

    // If no alt-tag is set
    if (alttag === '') {
      altProperties.noAlt++
      continue
    }

    // If no keyword is set, but the alt-tag is
    if (isEmpty(subKeywords)) {
      altProperties.withAlt++
      continue
    }

    // If the keyword is matched in the alt tag
    if (findInTag(subKeywords, alttag, altProperties.matches)) {
      altProperties.withAltKeyword++
      continue
    }

    altProperties.withAltNonKeyword++
  }

  return altProperties
}

function findInTag(keywords, alttag, matches) {
  let found = false
  for (let index = 0; index < keywords.length; index++) {
    if(alttag.toLowerCase().includes(keywords[index].toLowerCase())){
      matches[index] = matches[index] == null ? 1 : matches[index] + 1
      found = true
    }
    else
      matches[index] = matches[index] == null ? 0 : matches[index]
  }
  return found
}

/**
 * Checks the text for images, checks the type of each image and alt attributes for containing keywords
 *
 * @param {Paper} paper The paper to check for images.
 * @param {Researcher} researcher The researcher to use for analysis.
 *
 * @returns {object} Object containing all types of found images
 */
export default function(paper, researcher) {
  const images = imageInText(paper.getText())
  return matchAltProperties(images, paper.getSubKeywords())
}
