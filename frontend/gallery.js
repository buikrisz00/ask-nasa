async function loadEvent() {
    let galleryElement = document.getElementById("gallery");

    let fetchGallery = async function (x) {

        let today = new Date();
        let apiParams = {
            start_date: "2022-02-01",
            end_date: today.getFullYear().toString() + "-" + (today.getMonth()+1).toString().padStart(2, "0") + "-" + today.getDate().toString().padStart(2, "0")
        }
        let url = `https://api.nasa.gov/planetary/apod?api_key=MQDFPbyygp3ONA3J2zcHkIqLbdYEJcU0ss2MDhqH&start_date=${apiParams.start_date}&end_date=${apiParams.end_date}`
    
        /* Create variables for innerHTML values */
        let galleryTag = "";
    
        
        await fetch (url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                for (const item of data) {
                    if (item.media_type === "image") {
                        galleryTag += `<div><img src="${item.url}" alt="test image" class="galleryImage"></div>`;
                    } else {
                        galleryTag += `<div><iframe src="${item.url}" title="${item.title}" class="iframe"></iframe></div>`
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            })
        
        galleryElement.insertAdjacentHTML("beforeend", galleryTag);
    }

    fetchGallery();

    

}

window.addEventListener("load", loadEvent);