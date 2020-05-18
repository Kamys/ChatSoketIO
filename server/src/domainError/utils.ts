export const concatSentences = (sentence: string, secondSentence?: string) => {

  if (secondSentence) {
    return `${sentence}. ${secondSentence}`
  }

  return sentence
}
