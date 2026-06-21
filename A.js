const productsContainer = document.getElementById("products");
const template = document.getElementById("products-template");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
let products = [];
async function fetchProducts() {
    try {
        const response = await fetch("https://dummyjson.com/products?limit=16");
        const data = await response.json();
        products = data.products;
        populateCategories(products);
        renderProducts(products);
    } catch (error) {
        console.error(error);
        productsContainer.innerHTML = '<p class="error-message">Unable to load products. Please try again later.</p>';
    }
}
function populateCategories(items) {
    const categories = [...new Set(items.map(product => product.category).filter(Boolean))].sort();
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
}
function filterProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    return products.filter(product => {
        const matchesSearch = !query || product.title.toLowerCase().includes(query);
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
}
function renderProducts(items) {
    productsContainer.innerHTML = "";
    if (!items.length) {
        productsContainer.innerHTML = '<p class="empty-message">No products match your search.</p>';
        return;
    }
    items.forEach(product => {
        const clone = template.content.cloneNode(true);
        clone.querySelector("#title").textContent = product.title;
        clone.querySelector("#price").textContent = "$" + product.price;
        const image = clone.querySelector("#product-image");
        image.src = product.thumbnail || product.images?.[0] || "";
        image.alt = product.title;
        const link = clone.querySelector(".card-link");
        link.href = `A-detail.html?id=${product.id}`;
        productsContainer.appendChild(clone);
    });
}
function handleSearch() {
    renderProducts(filterProducts());
}
function handleCategoryChange() {
    renderProducts(filterProducts());
}
searchInput.addEventListener("input", handleSearch);
categoryFilter.addEventListener("change", handleCategoryChange);
fetchProducts();