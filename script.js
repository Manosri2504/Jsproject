const API = "https://fakestoreapi.com/products/";
const productsContainer = document.getElementById("products");
const statusText = document.getElementById("status");

const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sort");

let allProducts = [];

function fetchProducts() {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      statusText.innerText = "";
      populateCategories(data);
      displayProducts(data);
    })
    .catch(() => {
      statusText.innerText = "Failed to load data";
    });
}


function displayProducts(data) {
  productsContainer.innerHTML = "";

  data.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${product.image}" alt="product">
      <h3>${product.title.substring(0, 50)}</h3>
      <p>${product.description.substring(0, 60)}...</p>
      <div class="price">₹ ${product.price}</div>
      <button class="view-btn">View More</button>
      <button class="cart-btn">Add to Cart</button>
    `;

    
    card.querySelector(".view-btn").addEventListener("click", () => {
      alert(product.title + "\n\n" + product.description);
    });

    
    card.querySelector(".cart-btn").addEventListener("click", () => {
      addToCart(product);
    });

    productsContainer.appendChild(card);
  });
}


function populateCategories(data) {
  const categories = [...new Set(data.map(p => p.category))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}


function filterProducts() {
  let filtered = [...allProducts];

  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;
  const sortValue = sortSelect.value;

  
  filtered = filtered.filter(p =>
    p.title.toLowerCase().includes(searchValue)
  );

  
  if (categoryValue !== "all") {
    filtered = filtered.filter(p => p.category === categoryValue);
  }

  
  if (sortValue === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  displayProducts(filtered);
}


function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
sortSelect.addEventListener("change", filterProducts);


fetchProducts();