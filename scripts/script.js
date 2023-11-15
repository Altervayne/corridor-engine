/* ------------------------- Data Handling Functions Block ------------------------- */

/* Function to fetch an area's json data */
async function fetchArea(areaName) {
    const areaData = await (await fetch(`public/adventure/areas/${areaName}.json`)).json()

    sessionStorage.setItem("areaData", JSON.stringify(areaData))

    return areaData
}

/* Function to parse the active area's json data from session storage */
async function getActiveArea() {
    try {
        const areaDataString = sessionStorage.getItem("areaData")

        const areaData = JSON.parse(areaDataString)

        return areaData
    } catch (error) {
        console.error(`Error parsing areaData from sessionStorage: ${error}`)
        return null
    }
}

/* Function to find the needed scene in the area data */
function findScene(areaData, id) {
    console.log(areaData)
    const scene = areaData.filter((scene) => scene.id === id)

    return scene[0]
}

/* Function to initialize new scene load */
async function loadScene(pageElements, scene) {
    pageElements.title.textContent = scene.name
    pageElements.description.textContent = scene.text
    pageElements.image.src = scene.image
    pageElements.choices.innerHTML = ""

    console.log(scene)

    /* Loop over each of the scene's choices */
    for(const choice of scene.choices) {
        let isDisabled = false

        /* Check if forbidden flags are on */
        for(const flag of choice.forbiddenFlags) {
            if(!isDisabled) {
                const hasForbiddenFlag = await flagHandler("check", flag)

                if(hasForbiddenFlag) {
                    isDisabled = true
                }
            }
        }
        /* Check if required flags are on */
        for(const flag of choice.requiresFlags) {
            if(!isDisabled) {
                const hasRequiredFlag = await flagHandler("check", flag)

                if(!hasRequiredFlag) {
                    isDisabled = true
                }
            }
        }

        /* Check if choice should be hidden or disabled */
        if(!(choice.isSecret && isDisabled)) {
            choice.disabled = isDisabled

            const button = await createChoiceButton(choice)

            pageElements.choices.appendChild(button)
        }
    }
}

/* Function to handle clicking a choice */
async function choiceHandler(choice) {
    const pageElements = getPageElements()
    const areaData = await getActiveArea()

    for(const flag of choice.addsFlags) {
        console.log(flag)
        const flagAlreadyExists = await flagHandler("check", flag.id)
        if(!flagAlreadyExists) {
            await flagHandler("set", flag)
        }
    }
    for(const flag of choice.removesFlags) {
        const flagAlreadyExists = await flagHandler("check", flag)
        if(flagAlreadyExists) {
            await flagHandler("remove", flag)
        }
    }

    const newScene = findScene(areaData, choice.id)
    loadScene(pageElements, newScene)
}



/* Function to initialize the landing page */
async function pageInit(pageElements) {
    const metadata = await (await fetch("public/adventure/metadata.json")).json()

    const gameTitleElement = document.getElementById("gameTitle")
    gameTitleElement.textContent = metadata.title

    await fetchArea(metadata.startingArea)
    const areaData = await getActiveArea()
    const firstScene = findScene(areaData, metadata.startingScene)

    loadScene(pageElements, firstScene)


    /* Handling first loading screen */
    const loadingScreen = document.getElementById("loadingScreen")
    loadingScreen.style.opacity = "0"

    setTimeout(function() {
        loadingScreen.style.display = "none";
    }, 500);
}



/* Function to handle flags */
async function flagHandler(action, flag) {
    if(action === "set") {
        const newFlag = {
            type: flag.type,
            id: flag.id,
            name: flag.name,
            icon: flag.icon
        }

        const flagJSON = JSON.stringify(newFlag)

        try {
            sessionStorage.setItem(newFlag.id, flagJSON)
        }
        catch(error) {
            console.error(`Error setting flag "${flag.id}": ${error}`)
        }
    }

    if(action === "check") {
        try {
            const flagValue = sessionStorage.getItem(flag)
        
            if(flagValue) {
                return true
            } else {
                return false
            }
        }
        catch (error) {
            console.error(`Error checking flag "${flag}": ${error}`)

            return false
        }
    }

    if(action === "remove") {
        try {
            sessionStorage.removeItem(flag)
        
            return flagValue !== null && flagValue !== undefined      
        }
        catch (error) {
            console.error(`Error removing flag "${flag}": ${error}`)

            return false
        }
    }
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
async function createChoiceButton(choice) {
    const button = document.createElement("button")
    button.classList.add("scene__choices__button")
    button.textContent = choice.title

    if(choice.disabled) {
        button.classList.add("scene__choices__button__disabled")

        return button
    }

    button.addEventListener("click", () => choiceHandler(choice))
    return button
}












/* ------------------------- Running Functions Block ------------------------- */

/* Initializing an object containing the game's HTML elements */
const pageElements = getPageElements()

/* Initializing page with base metadata info */
pageInit(pageElements)