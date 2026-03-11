import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
    if (req.user == null) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const body = req.body;
    const orderData = {
        orderId: "",
        email: req.user.email,
        name: body.name,
        address: body.address,
        phoneNumber: body.phoneNumber,
        billItems: [],
        total: 0
    };

    try {
        const lastBills = await Order.find().sort({ date: -1 }).limit(1);
        if (lastBills.length == 0) {
            orderData.orderId = "ORD0001";
        } else {
            const lastOrderId = lastBills[0].orderId;
            const lastOrderNumber = lastOrderId.replace("ORD", "");
            const lastOrderNumberInt = parseInt(lastOrderNumber);
            const newOrderNumberInt = lastOrderNumberInt + 1;
            const newOrderNumberStr = newOrderNumberInt.toString().padStart(4, '0');
            orderData.orderId = "ORD" + newOrderNumberStr;
        }

        for (let i = 0; i < body.billItems.length; i++) {
            const product = await Product.findOne({ productId: body.billItems[i].productId });
            if (product == null) {
                return res.status(404).json({
                    message: "Product with product id " + body.billItems[i].productId + " not found"
                });
            }
            orderData.billItems[i] = {
                productId: product.productId,
                productName: product.name,
                image: product.images[0],
                quantity: body.billItems[i].quantity,
                price: product.price
            };
            orderData.total = orderData.total + product.price * body.billItems[i].quantity;
        }

        const order = new Order(orderData);
        await order.save();
        res.status(201).json({ message: "Order saved successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Order not saved", error: err.message });
    }
}

export async function getOrders(req, res) {
    if (req.user == null) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        let orders;
        if (req.user.role == "admin") {
            orders = await Order.find();
        } else {
            orders = await Order.find({ email: req.user.email });
        }
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Orders not found", error: err.message });
    }
}

export async function updateOrder(req, res) {
    try {
        if (req.user == null) {
            return res.status(401).json({ message: "Unauthorized" }); // ✅ fix 2: req.status -> res.status
        }

        if (req.user.role != "admin") {
            return res.status(403).json({ message: "You are not authorized to update an order" });
        }

        const orderId = req.params.orderId;
        await Order.findOneAndUpdate(
            { orderId: orderId },
            { status: req.body.status } 
        );

        res.status(200).json({ message: "Order updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Order not updated", error: err.message });
    }
}