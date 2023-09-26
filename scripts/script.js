/* ------------------------- Data Handling Functions Block ------------------------- */

/* Function to fetch an area's json data */
async function fetchArea(areaName) {
    const areaData = await (await fetch(`public/adventure/areas/${areaName}.json`)).json()

    return areaData
}

/* Function to find the needed scene in the area data */
function findScene(areaData, id) {
    const scene = areaData.find((scene) => scene.id === id)

    return scene
}

/* Function to initialize new scene load */
function loadScene(pageElements, scene) {
    pageElements.title.textContent = scene.name
    pageElements.description.textContent = scene.text
    pageElements.image.src = scene.image
    pageElements.choices.innerHTML = ""
}

/* Function to initialize the landing page */
async function pageInit(pageElements) {
    const metadata = await (await fetch("public/adventure/metadata.json")).json()

    const gameTitleElement = document.getElementById("gameTitle")
    gameTitleElement.textContent = metadata.title

    const areaData = await fetchArea(metadata.startingArea)
    const firstScene = findScene(areaData, metadata.startingScene)

    loadScene(pageElements, firstScene)


    /* Handling first loading screen */
    const loadingScreen = document.getElementById("loadingScreen")
    loadingScreen.style.opacity = "0"

    setTimeout(function() {
        loadingScreen.style.display = "none";
    }, 500);
}



/* ------------------------- Elements Creation Functions Block ------------------------- */

/* Function to fetch the page's elements and return them in an object */
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

/* Function to create a choice button */
function createChoiceButton(choice) {
    const button = document.createElement("button")
    button.classList.add("scene__choices__button")
    button.textContent = choice.title

    if(choice.disabled) {
        button.classList.add("scene__choices__button__disabled")

        return button
    }

    button.addEventListener("click", loadScene(choice.id))
    return button
}



/* ------------------------- Running Functions Block ------------------------- */

/* Initializing an object containing the game's HTML elements */
const pageElements = getPageElements()

/* Initializing page with base metadata info */
pageInit(pageElements)

/* Initializing page with starting area */
fetchArea()
