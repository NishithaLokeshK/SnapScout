const form = document.querySelector(".search-form");

const searchInput = document.getElementById("image-search");

const results = document.getElementById("results");

const resultCount = document.getElementById("result-count");

const emptyState = document.getElementById("empty-state");


form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const query = searchInput.value.trim();

    if (query === "") {
        return;
    }

    results.innerHTML = "";

    emptyState.style.display = "none";

    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json&origin=*`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch images");
    }

    const data = await response.json();

    const pages = data.query?.pages || {};

    const items = Object.values(pages);

    resultCount.textContent = `Showing ${items.length} results for "${query}"`;

    if (items.length === 0) {
        emptyState.textContent = "No images found. Try another search.";
        emptyState.style.display = "block";
        return;
    }

    items.forEach((item) => {

        const card = document.createElement("article");

        card.className = "image-card";

        const image = document.createElement("img");

        image.src = item.imageinfo?.[0]?.thumburl || item.imageinfo?.[0]?.url;

        image.alt = item.title.replace("File:", "");

        const title = document.createElement("h3");

        title.textContent = item.title.replace("File:", "");

        card.appendChild(image);

        card.appendChild(title);

        results.appendChild(card);
    });
});