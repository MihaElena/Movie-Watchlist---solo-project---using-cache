const search = document.getElementById("search");
const getFilmBtn = document.getElementById("get-film");
const populatedList = document.getElementById("populated-list");

// 🧠 Păstrăm obiectele film în memorie
const filmCache = new Map();

getFilmBtn.addEventListener("click", function (event) {
    event.preventDefault();
    console.log(search.value);
    populatedList.innerHTML = ""; // Curățăm containerul

    fetch(`https://www.omdbapi.com/?s=${search.value}&apikey=22949cc9`)
        .then((res) => res.json())
        .then((data) => {
            if (data.Search) {
                data.Search.forEach((film) => {
                    fetch(`https://www.omdbapi.com/?i=${film.imdbID}&apikey=22949cc9`)
                        .then((res) => res.json())
                        .then((data) => {
                            // Stocăm obiectul complet în memorie
                            filmCache.set(data.imdbID, data);

                            const fullPlot = data.Plot;
                            const shortPlot =
                                fullPlot.length > 133 ? fullPlot.substring(0, 133) + "..." : fullPlot;
                            const isLongPlot = fullPlot.length > 133;

                            const filmHTML = `
                                <div class="film-container">
                                    <img src="${data.Poster}" alt="${data.Title}" />
                                    <div class="film-info">
                                        <div class="title">
                                            <h3>${data.Title}</h3>
                                            <i class="fas fa-star"></i>
                                            <p>${data.imdbRating}</p>
                                        </div>
                                        <div class="features">
                                            <p class="duration">${data.Runtime}</p>
                                            <p class="genre">${data.Genre}</p>    
                                            <button class="add-remove add-icon" data-id="${data.imdbID}"></button>
                                            <p class="action">Watchlist</p>
                                        </div>
                                        <div class="text-container">
                                            <p class="plot" data-full="${fullPlot}" data-short="${shortPlot}">
                                            ${shortPlot} ${isLongPlot ? '<a href="#" class="read-more-link">Read more</a>' : ''}
                                            </p>                       
                                        </div>                                      
                                    </div>
                                </div>                                 
                            `;
                            populatedList.innerHTML += filmHTML;
                        });
                });
            } else {
                populatedList.innerHTML = `
                    <div class="initial">
                        <h3 class="blank-list">Unable to find what you’re looking for. Please try another search.</h3>
                    </div>
                `;
            }
        })
        .catch((err) => console.error("Eroare la fetch:", err));
});

// 🎯 Delegăm clickuri pentru "Read more" și "Add to Watchlist"
populatedList.addEventListener("click", function (e) {
    // 📖 Read more / Read less
    if (e.target.classList.contains("read-more-link")) {
        e.preventDefault();
        const paragraph = e.target.parentElement;
        const full = paragraph.dataset.full;
        const short = paragraph.dataset.short;
        const isExpanded = e.target.textContent === "Read less";

        paragraph.innerHTML = isExpanded
            ? `${short} <a href="#" class="read-more-link">Read more</a>`
            : `${full} <a href="#" class="read-more-link">Read less</a>`;
    }

    // ➕ Add film to Watchlist
    if (e.target.classList.contains("add-remove")) {
        const button = e.target;
        const filmID = button.getAttribute("data-id");
        const filmData = filmCache.get(filmID);

        if (!filmData) {
            alert("Eroare: datele filmului nu au fost găsite.");
            return;
        }

        let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
        const alreadyAdded = watchlist.some((f) => f.imdbID === filmData.imdbID);

        if (!alreadyAdded) {
            watchlist.push(filmData);
            localStorage.setItem("watchlist", JSON.stringify(watchlist));
            alert(`${filmData.Title} a fost adăugat în watchlist!`);

            // Schimbăm clasa butonului și textul
            button.classList.remove("add-icon");
            button.classList.add("checked-icon");

            const actionText = button.parentElement.querySelector(".action");
            if (actionText) {
                actionText.textContent = "Saved";
            }
        } else {
            alert(`${filmData.Title} este deja în watchlist.`);
        }
    }
});
