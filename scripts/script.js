/* Function to fetch an area's json data */
async function fetchArea(areaName) {
    const areaData = await (await fetch(`public/adventure/areas/${areaName}.json`)).json()

    return areaData
}


/* Function to initialize the landing page */
async function pageInit() {
    const metadata = await (await fetch("public/adventure/metadata.json")).json()

    const gameTitleElement = document.getElementById("gameTitle")
    gameTitleElement.textContent = metadata.title
}

pageInit()