import Product from '../models/product.js';

export async function createProduct(req, res) {
    if (req.user == null) {
        return res.status(403).json({
            message: "You need to login first"
        });
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "You are not authorized to create a product"
        });
    }
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({
            message: "Product saved successfully"
        });
    } catch (err) {
        console.error("❌ Create product error:", err);
        res.status(500).json({
            message: "Product not created",
            error: err.message
        });
    }
}

export async function getProducts(req, res) {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        console.error("❌ Get products error:", err);
        res.status(500).json({
            message: "Products not found",
            error: err.message
        });
    }
}

export async function deleteProduct(req, res) {
    if (req.user == null) {
        return res.status(403).json({
            message: "You need to login first"
        });
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "You are not authorized to delete a product"
        });
    }
    try {
        await Product.findOneAndDelete({ productId: req.params.productId });
        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (err) {
        console.error("❌ Delete product error:", err);
        res.status(500).json({
            message: "Product not deleted",
            error: err.message
        });
    }
}

export async function updateProduct(req, res) {
    if (req.user == null) {
        return res.status(403).json({
            message: "You need to login first"
        });
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "You are not authorized to update a product"
        });
    }
    try {
        await Product.findOneAndUpdate(
            { productId: req.params.productId },
            req.body,
            { new: true }
        );
        res.status(200).json({
            message: "Product updated successfully"
        });
    } catch (err) {
        console.error("❌ Update product error:", err);
        res.status(500).json({
            message: "Product not updated",
            error: err.message
        });
    }
}