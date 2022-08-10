

// All Categories
const bestsellersURL =
    "https://api.nytimes.com/svc/books/v3/lists/full-overview.json";

let bestsellersData = null;
const outputDiv = document.querySelector("#output");
const header = document.querySelector("header");
const catSelect = document.querySelector("#select-category");
const booksDiv = document.querySelector("#books-list");
const output = (text, addTo = false) => {
    const preText = addTo ? outputDiv.innerHTML + "<br />" : "";
    outputDiv.innerHTML = preText + text;
};

catSelect.addEventListener("change", (evt) => {
    // Select a category
    // get books list of that category
    const lists = bestsellersData.results.lists;
    const listIndex = lists.findIndex((element) => {
        return element.list_name_encoded === evt.target.value;
    });
    if (listIndex !== -1) {
        buildBooksList(lists[listIndex].books);
    }
});

const buildCategoryPulldown = (data) => {
    const lists = data.results.lists;
    let firstValue = null;
    for (const list of lists) {
        var opt = document.createElement("option");
        opt.value = list.list_name_encoded; // or maybe id?
        if (!firstValue) firstValue = opt.value;
        opt.innerHTML = list.list_name;
        catSelect.appendChild(opt);
    }
    catSelect.value = firstValue;
    catSelect.dispatchEvent(new Event("change"));
};

const buildBooksList = (books) => {
    let html = "";
    for (const book of books) {
        let bookHTML = `<div class="book">
        <!-- COVER -->
        <div class="book-cover-holder">
        <img src="${book.book_image}" class="book-cover" />
        <div class="ranking"><div>${book.rank}</div></div>
        </div>
        <div class="info">
            <!-- DESCRIPTION -->
            <p class="description">${book.description}</p>
            <!-- TITLE/AUTHOR -->
            <div class="title-author">
                <!-- TITLE -->
                <h3 class="title">${book.title}</h3>
                <!-- AUTHOR -->
                <h5 class="author">${book.author}</h5>
            </div>
            <!-- BUY -->`;
        // <h4 class="buy">At</h4>`;
        const sellers = book.buy_links;
        bookHTML += '<div class="buy"><div class="links">';
        for (const seller of sellers) {
            const linkHTML = `<a href="${seller.url}">${seller.name}</a>`;
            bookHTML += linkHTML;
        }

        bookHTML += `</div></div></div></div>`;
        html += bookHTML;
    }
    booksDiv.innerHTML = html;
};


// API call
const fetchAPILists = () => {
    const options = {
        method: "GET",
    };
    const authorizationString = "?api-key=2UPyDKf890Ht3EgGnxWlWsmDrAAYcrlV";
    
    const requestPromise = fetch(bestsellersURL + authorizationString, options);
    requestPromise
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            bestsellersData = data;
            buildCategoryPulldown(data);
        })
        .catch((err) => {
            output("There's an ERROR: " + err);
        });
}


// Sticky Menu
// header declared above
// using "helper" element because the pinned element, header, resizes on pinning, which messes up the Intersection Observer.  #helper doesn't change size, so we watch helper's scroll position and use it to change header's height
const helper = document.querySelector("#header-helper");
const observer = new IntersectionObserver(
    ([e]) => {

        const topStr = e.target.getBoundingClientRect().top + "px";
        // e.target.classList.toggle("is-pinned", e.intersectionRatio < 1);
        header.classList.toggle("is-pinned", e.intersectionRatio < 1);

    },
    { threshold: [1] }
);

observer.observe(helper);


fetchAPILists();