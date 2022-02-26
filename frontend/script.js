async function loadEvent() {
    let rootElement = document.getElementById("root");
    let galleryElement = document.getElementById("gallery");

    let fetchFirst = async function (x) {

        let today = new Date();
        let apiParams = {
            start_date: "2022-02-01",
            end_date: today.getFullYear().toString() + "-" + (today.getMonth()+1).toString().padStart(2, "0") + "-" + today.getDate().toString().padStart(2, "0")
        }
        let url = `https://api.nasa.gov/planetary/apod?api_key=MQDFPbyygp3ONA3J2zcHkIqLbdYEJcU0ss2MDhqH&start_date=${apiParams.start_date}&end_date=${apiParams.end_date}`
    
        /* Create variables for innerHTML values */
        let headerTag = "";
        let imgTag = "";
        let dateTag = "";
        let explanationTag = "";
        let todayNumber = 0;
        let fetchedData = {};
        let galleryTag = "";
    
        
        await fetch (url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                headerTag = `<h1 class="title">${data[data.length-1].title}</h1>`;
                if (data[data.length-1].media_type === "image") {
                    imgTag = `
                    <img src="${data[data.length-1].url}" alt="test image" class="image">
                    <iframe src="${data[data.length-1].url}" title="${data[data.length-1].title}" class="noShow iframe"></iframe>
                    `;
                } else {
                    imgTag = `
                    <img src="${data[data.length-1].url}" alt="test image" class="noShow image">
                    <iframe src="${data[data.length-1].url}" title="${data[data.length-1].title}" class="iframe"></iframe>
                    `;;
                }
                dateTag = `<p class="date">(${data[data.length-1].date})</p>`;
                explanationTag = `<p class="explanation">${data[data.length-1].explanation}</p>`;
                todayNumber = data.length - 1;
                fetchedData = data;
                /* for (const item of data) {
                    galleryTag += `<img src="${item.url}" alt="test image" class="galleryImage">`;
                } */
            })
            .catch(function (error) {
                console.log(error);
            })
    
        
        let landingPageLayout = `
            <a class="galleryBtn" href="gallery.html">Gallery</a>
            <form>
                <label for="date">Pick a date:</label>
                <input type="date" id="date" name="date">
            </form>
            ${headerTag}
            <div class="imageHolder">
                ${imgTag + dateTag}
            </div>
            ${explanationTag}
            <button id="left" class="leftButton">&#8592;</button>
            <button id="right" class="rightButton">&#8594;</button>
        `;
        
        rootElement.insertAdjacentHTML("beforeend", landingPageLayout);
        /* console.log(galleryElement);
        galleryElement.insertAdjacentHTML("beforeend", galleryTag); */
    
        /* Get HTML elements */
        let leftButton = rootElement.querySelector(".leftButton");
        let rightButton = rootElement.querySelector(".rightButton");
        let h1 = rootElement.querySelector(".title");
        let iframe = rootElement.querySelector(".iframe");
        let image = rootElement.querySelector(".image");
        let date = rootElement.querySelector(".date");
        let explanation = rootElement.querySelector(".explanation");
        let counter = todayNumber;
        
        let clickedButton = function (buttonId) {
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
        })
        rightButton.addEventListener("click", function (x) {
            clickedButton(x)
        })
    
        let input = rootElement.querySelector("#date");
        input.value = apiParams.end_date;
    
        let fetchSingleDay = function (input) {
            let requestedDate = input.target.value;
            let url = `https://api.nasa.gov/planetary/apod?api_key=MQDFPbyygp3ONA3J2zcHkIqLbdYEJcU0ss2MDhqH&date=${requestedDate}`;
    
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
    
        input.addEventListener("input", function (x) {
            fetchSingleDay(x);
        })
    }
    fetchFirst();

}

window.addEventListener("load", loadEvent);