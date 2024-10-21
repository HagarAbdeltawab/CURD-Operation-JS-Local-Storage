let productContainer = JSON.parse(localStorage.getItem('products')) || [];
let updateIndex = null;

document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
});

function addProduct() {
    if (validateForm()) {
        const product = {
            name: document.getElementById('pName').value,
            price: parseFloat(document.getElementById('pPrice').value),
            category: document.getElementById('pCategory').value,
            description: document.getElementById('pDesc').value,
            image: document.getElementById('pImage').files[0]
                ? `images/${document.getElementById('pImage').files[0].name}`
                : 'images/placeholder-image.jpg'
        };

        if (!checkDuplicate(product.name)) {
            productContainer.push(product);
            localStorage.setItem('products', JSON.stringify(productContainer));
            displayProducts();
            clearForm();
        }
    }
}

function checkDuplicate(name) {
    const exists = productContainer.some(product => product.name === name);
    if (exists) {
        alert("Product name already exists");
        return true;
    }
    return false;
}

function clearForm() {
    document.getElementById('productForm').reset();
    document.getElementById('addBtn').classList.remove('d-none');
    document.getElementById('updateBtn').classList.add('d-none');
}

function deleteProduct(index) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
    }).then((result) => {
        if (result.isConfirmed) {
            productContainer.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(productContainer));
            displayProducts();
            Swal.fire("Deleted!", "Your product has been deleted.", "success");
        }
    });
}

function displayProducts() {
    const rowData = document.getElementById('rowData');
    rowData.innerHTML = productContainer.map((product, index) => `
        <div class="col-md-3">
            <div class="product">
                <img src="${product.image}" class="w-100" alt="${product.name}">
                <h2 class="text-center mt-3 h4">${product.name}</h2>
                <p class="text-secondary">${product.description}</p>
                <h4>Price: ${product.price}</h4>
                <h5>Category: ${product.category}</h5>
                <button class="btn btn-outline-danger w-100 my-2" onclick="deleteProduct(${index})">Delete</button>
                <button class="btn btn-outline-warning w-100 my-2" onclick="setFormUpdate(${index})">Update</button>
            </div>
        </div>
    `).join('');
}

function search() {
    const searchTerm = document.getElementById('searchId').value.toLowerCase();
    const filteredProducts = productContainer.filter(product => product.name.toLowerCase().includes(searchTerm));
    const rowData = document.getElementById('rowData');
    rowData.innerHTML = filteredProducts.map((product, index) => `
        <div class="col-md-3">
            <div class="product">
                <img src="${product.image}" class="w-100" alt="${product.name}">
                <h2 class="text-center mt-3 h4">${product.name}</h2>
                <p class="text-secondary">${product.description}</p>
                <h4>Price: ${product.price}</h4>
                <h5>Category: ${product.category}</h5>
                <button class="btn btn-outline-danger w-100 my-2" onclick="deleteProduct(${index})">Delete</button>
                <button class="btn btn-outline-warning w-100 my-2" onclick="setFormUpdate(${index})">Update</button>
            </div>
        </div>
    `).join('');
}

function setFormUpdate(index) {
    updateIndex = index;
    const product = productContainer[index];

    document.getElementById('pName').value = product.name;
    document.getElementById('pPrice').value = product.price;
    document.getElementById('pCategory').value = product.category;
    document.getElementById('pDesc').value = product.description;

    document.getElementById('addBtn').classList.add('d-none');
    document.getElementById('updateBtn').classList.remove('d-none');
}

function updateProduct() {
    if (validateForm()) {
        const product = productContainer[updateIndex];

        product.name = document.getElementById('pName').value;
        product.price = parseFloat(document.getElementById('pPrice').value);
        product.category = document.getElementById('pCategory').value;
        product.description = document.getElementById('pDesc').value;
        product.image = document.getElementById('pImage').files[0]
            ? `images/${document.getElementById('pImage').files[0].name}`
            : product.image;

        productContainer[updateIndex] = product;
        localStorage.setItem('products', JSON.stringify(productContainer));
        displayProducts();
        clearForm();
    }
}

function validateForm() {
    let valid = true;

    const nameField = document.getElementById('pName');
    const priceField = document.getElementById('pPrice');
    const categoryField = document.getElementById('pCategory');
    const descField = document.getElementById('pDesc');
    const imageField = document.getElementById('pImage');

    if (!/^[a-zA-Z0-9\s]+$/.test(nameField.value)) {
        nameField.classList.add('is-invalid');
        valid = false;
    } else {
        nameField.classList.remove('is-invalid');
    }

    if (!/^\d+(\.\d{1,2})?$/.test(priceField.value) || parseFloat(priceField.value) <= 0) {
        priceField.classList.add('is-invalid');
        valid = false;
    } else {
        priceField.classList.remove('is-invalid');
    }

    if (!['TV', 'Mobile', 'Laptop'].includes(categoryField.value)) {
        categoryField.classList.add('is-invalid');
        valid = false;
    } else {
        categoryField.classList.remove('is-invalid');
    }

    if (descField.value.length < 6 || descField.value.length > 100) {
        descField.classList.add('is-invalid');
        valid = false;
    } else {
        descField.classList.remove('is-invalid');
    }

    if (imageField.files.length > 0) {
        const file = imageField.files[0];
        if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
            imageField.classList.add('is-invalid');
            valid = false;
        } else {
            imageField.classList.remove('is-invalid');
        }
    }

    return valid;
}
