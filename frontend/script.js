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
    <a class="galleryBtn" href="gallery.html">Gallery</a>
    <form>
        <label for="date">Pick a date:</label>
        <input type="date" id="date" name="date">
    </form>
    <h1 class="title">${header}</h1>
    <div class="imageHolder">
        <img src="${img}" alt="test image" class="${imgShow} image">
        <iframe src="${img}" title="${header}" class="${iframeShow} iframe"></iframe>
    </div>
    <p class="date">(${date})</p>
    <p class="explanation">${explanation}</p>
    <button id="left" class="leftButton">&#8592;</button>
    <button id="right" class="rightButton">&#8594;</button>
    `
}

// Fetch data function
async function fetchFirst() {
    let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${apiParams.start_date}&end_date=${apiParams.end_date}`;
    const spinner = document.querySelector(".lds-spinner");

    showSpinner(spinner);
    await fetch (url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            landingPageLayout = generateHTML(data[data.length-1].title, data[data.length-1].url, data[data.length-1].date, data[data.length-1].explanation, data[data.length-1].media_type);
            todayNumber = data.length - 1;
            // For the click events
            fetchedData = data;
        })
        .catch(function (error) {
            console.log(error);
        })
    hideSpinner(spinner);
}

// Fetch single day for calendar
const fetchSingleDay = function (h1, image, iframe, date, explanation, input) {
    let requestedDate = input.target.value;
    let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${requestedDate}`;

    fetch (url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            h1.innerHTML = `${data.title}`;
            if (data.media_type === "image") {
                image.classList.remove("noShow");
                iframe.classList.add("noShow");
                image.src = `${data.url}`;
            } else {
                image.classList.add("noShow");
                iframe.classList.remove("noShow");
                iframe.src = `${data.url}`;
            }
            date.innerHTML = `(${data.date})`;
            explanation.innerHTML = `${data.explanation}`;
        })
        .catch(function (error) {
            console.log(error);
        })
}

// Spinner functions
const showSpinner = function (spinner) {
    spinner.classList.add("showSpinner");
}

const hideSpinner = function (spinner) {
    spinner.classList.remove("showSpinner");
}

async function loadEvent() {
    let rootElement = document.getElementById("root");
    rootElement.insertAdjacentHTML("beforeend", `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`)



    // Fill up the landingPageLayout variable with data
    await fetchFirst();

    // Insert landingPageLayout into HTML file
    rootElement.insertAdjacentHTML("beforeend", landingPageLayout);

    /* Get HTML elements */
    let leftButton = rootElement.querySelector(".leftButton");
    let rightButton = rootElement.querySelector(".rightButton");
    let h1 = rootElement.querySelector(".title");
    let iframe = rootElement.querySelector(".iframe");
    let image = rootElement.querySelector(".image");
    let date = rootElement.querySelector(".date");
    let explanation = rootElement.querySelector(".explanation");
    let counter = todayNumber;

    const clickedButton = function (buttonId) {
        if (buttonId.target.id === "left") {
            if (counter >= 1) {
                h1.innerHTML = `${fetchedData[counter - 1].title}`;
                if (fetchedData[counter - 1].media_type === "image") {
                    image.classList.remove("noShow");
                    iframe.classList.add("noShow");
                    image.src = `${fetchedData[counter - 1].url}`;
                } else {
                    image.classList.add("noShow");
                    iframe.classList.remove("noShow");
                    iframe.src = `${fetchedData[counter - 1].url}`;
                }
                date.innerHTML = `(${fetchedData[counter - 1].date})`;
                explanation.innerHTML = `${fetchedData[counter - 1].explanation}`;
                
                counter--;
            }
        } else {
            if (counter < todayNumber) {
                counter++;

                h1.innerHTML = `${fetchedData[counter].title}`;
                if (fetchedData[counter].media_type === "image") {
                    image.classList.remove("noShow");
                    iframe.classList.add("noShow");
                    image.src = `${fetchedData[counter].url}`;
                } else {
                    image.classList.add("noShow");
                    iframe.classList.remove("noShow");
                    iframe.src = `${fetchedData[counter].url}`;
                }
                date.innerHTML = `(${fetchedData[counter].date})`;
                explanation.innerHTML = `${fetchedData[counter].explanation}`;
            }
        }
    }

    leftButton.addEventListener("click", function (x) {
        clickedButton(x)
    });

    rightButton.addEventListener("click", function (x) {
        clickedButton(x)
    });

    // Calendar picker
    const input = rootElement.querySelector("#date");
    input.value = apiParams.end_date;

    input.addEventListener("input", function (input) {
        fetchSingleDay(h1, image, iframe, date, explanation, input);
    })
}

window.addEventListener("load", loadEvent);