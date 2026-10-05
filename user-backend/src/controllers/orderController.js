const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, source } = req.body;

    // Validate source
    if (!source || !["cart", "buyNow"].includes(source)) {
      return res.status(400).json({
        message: "Invalid order source",
      });
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "At least one product is required",
      });
    }

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        message: "Complete shipping address is required",
      });
    }

    /*
      ------------------------------------------------
      BUY NOW
      ------------------------------------------------
      Buy Now does not use the cart.
    */

    if (source === "buyNow") {
      const orderProducts = [];
      let totalAmount = 0;

      for (const item of items) {
        if (!item.productId || !Number.isInteger(item.quantity) || item.quantity < 1) {
          return res.status(400).json({
            message: "Invalid product or quantity",
          });
        }

        const product = await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({
            message: "Product not found",
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name}`,
          });
        }

        orderProducts.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });

        totalAmount += product.price * item.quantity;
      }

      const order = await Order.create({
        user: req.userId,
        products: orderProducts,
        totalAmount,
        shippingAddress,
        paymentStatus: "Pending",
        orderStatus: "Pending",
      });

      // Reduce stock
      for (const item of orderProducts) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      return res.status(201).json({
        message: "Order created successfully",
        order,
      });
    }

    /*
      ------------------------------------------------
      CART CHECKOUT
      ------------------------------------------------
      Only selected cart items will be ordered.
    */

    const cart = await Cart.findOne({
      user: req.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const orderProducts = [];
    let totalAmount = 0;

    for (const item of items) {
      if (!item.productId || !Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({
          message: "Invalid product or quantity",
        });
      }

      const cartItem = cart.items.find(
        (cartItem) =>
          cartItem.product &&
          cartItem.product._id.toString() === item.productId.toString()
      );

      if (!cartItem) {
        return res.status(400).json({
          message: "Selected product is not in the cart",
        });
      }

      if (item.quantity > cartItem.quantity) {
        return res.status(400).json({
          message: `You cannot order more than ${cartItem.quantity} quantity of ${cartItem.product.name}`,
        });
      }

      if (cartItem.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${cartItem.product.name}`,
        });
      }

      orderProducts.push({
        product: cartItem.product._id,
        quantity: item.quantity,
        price: cartItem.product.price,
      });

      totalAmount += cartItem.product.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      user: req.userId,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    // Reduce product stock
    for (const item of orderProducts) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Remove/update ONLY the ordered items from cart
    for (const item of items) {
      const cartItemIndex = cart.items.findIndex(
        (cartItem) =>
          cartItem.product &&
          cartItem.product._id.toString() === item.productId.toString()
      );

      if (cartItemIndex === -1) continue;

      const cartItem = cart.items[cartItemIndex];

      if (item.quantity === cartItem.quantity) {
        cart.items.splice(cartItemIndex, 1);
      } else {
        cartItem.quantity -= item.quantity;
      }
    }

    await cart.save();

    return res.status(201).json({
      message: "Order created successfully",
      order,
      cart,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.userId,
    })
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.userId,
    }).populate("products.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the order belonging to the logged-in user
    const order = await Order.findOne({
      _id: id,
      user: req.userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check if the order can be cancelled
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        message: "Order is already cancelled",
      });
    }

    if (
      order.orderStatus === "Shipped" ||
      order.orderStatus === "Delivered"
    ) {
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage",
      });
    }

    // Restore product stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
        },
      });
    }

    // Update order status
    order.orderStatus = "Cancelled";

    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
};