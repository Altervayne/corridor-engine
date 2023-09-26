/* Function to fetch an area's json data */
async function fetchArea(areaName) {
    const areaData = await (await fetch(`public/adventure/areas/${areaName}.json`)).json()

    return areaData
}

function getPageElements() {
    const sceneTitleElement = document.getElementById("sceneTitle")
    const sceneDescriptionElement = document.getElementById("sceneDescription")
    const sceneImageElement = document.getElementById("sceneImage")
    const sceneChoicesContainer = document.getElementById("sceneChoices")

    return {
        title: sceneTitleElement,
        description: sceneDescriptionElement,
        image: sceneImageElement,
        choices: sceneChoicesContainer
    }
}

/* Function to initialize the landing page */
async function pageInit() {
    const metadata = await (await fetch("public/adventure/metadata.json")).json()

    const gameTitleElement = document.getElementById("gameTitle")
    gameTitleElement.textContent = metadata.title
}



/* ------------------------- Running Functions Block ------------------------- */

/* Initializing page with base metadata info */
pageInit()

/* Initializing an object containing the game's HTML elements */
const pageElements = getPageElements()
