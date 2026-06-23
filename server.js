const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Mock Database (In-Memory Array)
let inventory = [
    { id: 1, name: "Wireless Mouse", quantity: 50, price: 29.99, category: "Electronics" },
    { id: 2, name: "Mechanical Keyboard", quantity: 30, price: 89.99, category: "Electronics" }
];

// --- API ENDPOINTS (CRUD) ---

// 1. READ ALL (Get all products)
app.get('/api/products', (req, res) => {
    res.status(200).json(inventory);
});

// 2. READ ONE (Get a product by ID)
app.get('/api/products/:id', (req, res) => {
    const product = inventory.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
});

// 3. CREATE (Add a new product)
app.post('/api/products', (req, res) => {
    const { name, quantity, price, category } = req.body;
    
    if (!name || quantity === undefined || price === undefined || !category) {
        return res.status(400).json({ message: "Please provide all required fields: name, quantity, price, category" });
    }

    const newProduct = {
        id: inventory.length > 0 ? inventory[inventory.length - 1].id + 1 : 1,
        name,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        category
    };

    inventory.push(newProduct);
    res.status(201).json({ message: "Product added successfully", product: newProduct });
});

// 4. UPDATE (Modify an existing product)
app.put('/api/products/:id', (req, res) => {
    const product = inventory.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, quantity, price, category } = req.body;

    if (name) product.name = name;
    if (quantity !== undefined) product.quantity = parseInt(quantity);
    if (price !== undefined) product.price = parseFloat(price);
    if (category) product.category = category;

    res.status(200).json({ message: "Product updated successfully", product });
});

// 5. DELETE (Remove a product)
app.delete('/api/products/:id', (req, res) => {
    const productIndex = inventory.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).json({ message: "Product not found" });

    const deletedProduct = inventory.splice(productIndex, 1);
    res.status(200).json({ message: "Product deleted successfully", product: deletedProduct[0] });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});