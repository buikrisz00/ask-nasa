let landingPageLayout = "";
let fetchedData = {};
let todayNumber = 0;
// Set API start- and end-date parameters
const today = new Date();
const apiParams = {
    start_date: "2022-02-01",
    end_date: today.getFullYear().toString() + "-" + (today.getMonth()+1).toString().padStart(2, "0") + "-" + today.getDate().toString().padStart(2, "0")
}
const apiKey = "MQDFPbyygp3ONA3J2zcHkIqLbdYEJcU0ss2MDhqH";
let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${apiParams.start_date}&end_date=${apiParams.end_date}`;

// Generate HTML function
function generateHTML(header, img, date, explanation, media_type) {
    let imgShow = "";
    let iframeShow = "";
    if (media_type === "image") {
        iframeShow = "noShow";
    } else {
        imgShow = "noShow";
    }
    return `
    <h1 class="title">${header}</h1>
    <div class="imageHolder">
        <img src="${img}" alt="test image" class="${imgShow} image">
        <iframe src="${img}" title="${header}" class="${iframeShow} iframe"></iframe>
    </div>
    <p class="date">(${date})</p>
    <p class="explanation">${explanation}</p>
    `
}

function loadEvent() {
    let fetchedData = {};

    fetch (url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            fetchedData = data;
            console.log(fetchedData); // Itt megvárja a console.log, hogy a fetchedData feltöltődjön adattal
        })

    console.log(fetchedData); // Ez lefut mielőtt a fetch végezne, ezért egy üres objectet fog kiírni
}

window.addEventListener("load", loadEvent);