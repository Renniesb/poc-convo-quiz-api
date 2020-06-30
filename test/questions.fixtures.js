function makeQuestionsArray() {
    return [
        {
            id: 1,
            answers: 'largeolders',
            questiontext: 'Tell me something about your family.',
            responsetext: 'I have a <input autoComplete="off"> family. There is my mother and father. Plus I have two <input autoComplete="off"> brothers and a younger sister.',
            correcttext: '<span class="incorrect">Incorrect</span><div class="correct-answer">Correct Answer: I have a <u>large</u> family. There is my mother and father. Plus I have two <u>older</u> brothers and a sister.</div>',
            audio: 'audio1'
          },
          {
            id: 2,
            answers: 'smallunclescousinslarge',
            questiontext: 'Tell me something about your family.',
            responsetext: 'I have a <input autoComplete="off" > family, just me and my mother and father. But my <input autoComplete="off"> and aunts and <input autoComplete="off" > live very nearby, so we seem like a <input autoComplete="off" > family.',
            correcttext: '<span class="incorrect">Incorrect</span><div class="correct-answer"> Correct Answer: I have a <u>small</u> family, just me and my mother and father. But my <u>uncles</u> and aunts and <u>cousins</u> live very nearby, so we seem like a <u>large</u> family.</div>',
            audio: 'audio2'
          },
    ]
}

module.exports =  makeQuestionsArray