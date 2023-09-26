import metadata from "../../adventure/metadata.json"

function pageInit() {
    const gameTitleElement = document.getElementById("gameTitle")
    gameTitleElement.textContent = metadata.title
}

pageInit()