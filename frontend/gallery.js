/* Create variables for innerHTML values */
let galleryTag = "";
let fetchedData = {};
const modalHTML = `<div class="modal"></div>`;

const generateModal = function (modalDiv, index) {
    let imgShow = "";
    let iframeShow = "";

    // Check if video or image
    if (fetchedData[index].media_type === "image") {
        iframeShow = "noShow";
    } else {
        imgShow = "noShow";
    }

    // Modal show
    modalDiv.classList.add("showModal");

    return `
    <div class="modal-content">
        <h1 class="title">${fetchedData[index].title}</h1>
        <div class="imageHolder">
            <img src="${fetchedData[index].url}" alt="test image" class="${imgShow} image">
            <iframe src="${fetchedData[index].url}" title="${fetchedData[index].title}" class="${iframeShow} iframe"></iframe>
        </div>
        <p class="date">(${fetchedData[index].date})</p>
        <p class="explanation">${fetchedData[index].explanation}</p>
    </div>
    `
}

let fetchGallery = async function () {

    let today = new Date();
    let apiParams = {
        start_date: "2022-02-01",
        end_date: today.getFullYear().toString() + "-" + (today.getMonth()+1).toString().padStart(2, "0") + "-" + today.getDate().toString().padStart(2, "0")
    }
    let url = `https://api.nasa.gov/planetary/apod?api_key=MQDFPbyygp3ONA3J2zcHkIqLbdYEJcU0ss2MDhqH&start_date=${apiParams.start_date}&end_date=${apiParams.end_date}`

    await fetch (url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            fetchedData = data;
            for (const item of data) {
                if (item.media_type === "image") {
                    galleryTag += `<div><img src="${item.url}" alt="test image" class="galleryImage clickable"></div>`;
                } else {
                    galleryTag += `<div><iframe src="${item.url}" title="${item.title}" class="iframe clickable"></iframe></div>`
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

async function loadEvent() {
    const galleryElement = document.getElementById("gallery");

    // Fill up the galleryTag variable
    await fetchGallery();
    // Load content
    galleryElement.insertAdjacentHTML("beforeend", galleryTag);
    galleryElement.insertAdjacentHTML("beforeend", modalHTML);

    // Create modal on click
    const modalDiv = document.querySelector(".modal");

    const galleryImages = galleryElement.querySelectorAll(".clickable");

    for (let i = 0; i < galleryImages.length; i++) {
        galleryImages[i].addEventListener("click", function () {
            modalDiv.innerHTML = generateModal(modalDiv, i);
        })
    }

    // Remove modal on click
    modalDiv.addEventListener("click", function (event) {
        event.target.classList.remove("showModal");
    })

}

window.addEventListener("load", loadEvent);