//intents von JSON
const allIntents = require("./input.json")

function displayIntentOptions(intents) {

    if (intents.includes(allIntents.linkWord)) {
        return intents.split(allIntents.linkWord).map(displayIntentOptions).join("||")

    }


    intents = getIntentByTextName(intents)

    const result = {
        answer: intents.end || intents.answer,
        keywords: intents.keywords,
        intent: intents.intent
    }
    return convertResultToHTML(result)
}

function convertResultToHTML(result) {
    return `
        <p>${result.answer}</p>
        <ul>${result.keywords.map(keyword => {
        return `<li>${keyword[0].toUpperCase() + keyword.slice(1)}</li>`
    }).join("")
        }</ul>
    `
}
//intent nach Name
function getIntentByTextName(name) {
    return allIntents.answers.filter(item => item.intent == name).shift() || extractKeywordFromInput(name)
}

//String von User
function extractKeywordFromInput(input) {

    const excludedIntents = ['hallo', 'bestellen', 'bestellung']

    const fromIntents = allIntents.answers.map((intent) => {

        if (excludedIntents.includes(intent.intent)) {
            return 0; //damit werden hallo, bestellen rausgenommen 
        }

        return getCorelation(intent.keywords.concat(intent.intent), input)
    })
    const intentScore = fromIntents.lastIndexOf(Math.max(...fromIntents.filter(Boolean)))


    const score = allIntents.mappings.map(mapping => {

    }).filter(Boolean)
    const max = score.toSorted().pop()
    const mappingScore = allIntents.mappings[score.lastIndexOf(max)] || 0

    if (intentScore > mappingScore) {
        return allIntents.answers[intentScore] //beste Match 
    }

    if (mappingScore) {
        return getIntentByTextName(mappingScore.intent)
    }

    return allIntents.mappings[0]
}

/**
 * Zusammenhang zw. User Input und Keywörter
 * 
 * @param searchOptions keywörter, nachdem man sucht
 * @param input User Input
 * @returns Zahl, der die Zusammenhang zw. user input und keywörter anzeigt
 */
function getCorelation(searchData, input) {
    const intent = searchData[searchData.length - 1]
    const bias = input.includes(intent) ? intent.length : 0;
    //bias score wenn input enthält intent; intent wird als bias value benutzt, 
    //und bringt mehr kraft wenn input enthält intent

    if (searchData.length == 1) {
        return 0; //nichts da nur ein element
    }

    const result = searchData.filter(pattern => {
        return getCorelation(pattern.split(" "), input) + getCorelation(input.split(" "), pattern)
        //input- pattern wird in wörter geteilt und rechnet der zusammenhang mit input
        //patern- input wird in wörter geteilt und rechnet zusammenhang mit der pattern 
    });

    return result.length / searchData.length + bias; //Zusammenhang
}


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayIntentOptions = displayIntentOptions;