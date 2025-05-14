document.addEventListener("DOMContentLoaded", () => {
    const watchlistContainer = document.getElementById("watchlist")

    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || []

    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = `
            <div class="initial">               
                <h3 class="blank-list">Your watchlist is looking a little empty...</h3>
                <div class="features">
                    <a href="index.html" class="icon-plus"></a>                                         
                    <p class="action">Let’s add some movies!</p>
                </div>
            </div>
        `
        return
    }

    // Building the HTML-ul
    let html = ''
    watchlist.forEach(film => {
        const fullPlot = film.Plot
        const shortPlot = fullPlot.length > 133 ? fullPlot.substring(0, 133) + "..." : fullPlot
        const isLongPlot = fullPlot.length > 133

        html += `
            <div class="film-container">
                <img src="${film.Poster}" alt="${film.Title}" />
                <div class="film-info">
                    <div class="title">
                        <h3>${film.Title}</h3>
                        <i class="fas fa-star"></i>
                        <p>${film.imdbRating}</p>
                    </div>
                    <div class="features">
                        <p class="duration">${film.Runtime}</p>
                        <p class="genre">${film.Genre}</p>
                        <button class="add-remove remove-icon" data-id="${film.imdbID}"></button>
                        <p class="action">Remove</p>
                    </div>
                    <div class="text-container">
                        <p class="plot" data-full="${fullPlot}" data-short="${shortPlot}">
                        ${shortPlot} ${isLongPlot ? '<a href="#" class="read-more-link">Read more</a>' : ''}
                        </p>                       
                    </div>     
                </div>
            </div>
        `
    })

    watchlistContainer.innerHTML = html

    // Delegate the event for Read more/less + button Remove
    watchlistContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('read-more-link')) {
            e.preventDefault()
            const paragraph = e.target.parentElement
            const fullText = paragraph.dataset.full
            const shortText = paragraph.dataset.short
            const isExpanded = e.target.textContent === 'Read less'

            paragraph.innerHTML = isExpanded
                ? `${shortText} <a href="#" class="read-more-link">Read more</a>`
                : `${fullText} <a href="#" class="read-more-link">Read less</a>`
        }

        if (e.target.classList.contains("remove-icon")) {
            const filmID = e.target.getAttribute("data-id")
            const updatedWatchlist = watchlist.filter(film => film.imdbID !== filmID)
            localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist))
            location.reload()
        }
    })
})
