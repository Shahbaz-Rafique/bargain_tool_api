const Product = require('../models/product.js');
const Order = require('../models/order.js');
const Cart = require('../models/addtocart.js');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51ODt61AfAfK8PTh8KiaftQyr9KnpcIXCoVxv3L1v8pub5G9oMPC43N58JsrssGR7cVWthYXay5Y3z7ziEZf7sn2S00B70iJlmm');

// Controller to create a new product
exports.createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Controller to update a product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// Controller to get a single product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id)
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Controller to get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Controller to delete a product
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
      const categoryId = req.params.id; // Assuming category ID is passed as a URL parameter
      const products = await Product.find({ category: categoryId }).populate('category').exec();
      res.json(products);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.buyProduct = async (req, res) => {
  try {
      const productId = req.body.productId;
      const price = req.body.price;
      const image=req.body.img; 
      const userId = req.body.userId;
      const quantity=req.body.quantity;

      const product = await Product.find({_id:productId});

      if(product.length>0){
        try {
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: req.body.title,
                    images: [image],
                  },
                  unit_amount: price * 100,
                },
                quantity: quantity,
              },
            ],
            mode: 'payment',
            success_url: `http://localhost:4000/product/storebuy?data=${JSON.stringify(req.body)}`,
            cancel_url: 'http://localhost:3000',
          });
          console.log(session.url);
          res.json({ url: session.url, message:"success" });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
      else{
        res.json({  message:"lowQ" });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.storebuy = async (req, res) => {
  try {
    const data=JSON.parse(req.query.data);
    const product = await Product.findByIdAndUpdate(
      data.productId,
      { $inc: { quantity: -data.quantity } },
      { new: true } 
    );
    const order = new Order(JSON.parse(req.query.data));
    await order.save();
    res.redirect('http://localhost:5173/success')
  } catch (error) {
    next(error);
  }
}

exports.getOrders = async (req,res)=>{
  try{
    const orders = await Order.find({}).populate('productId').populate('userId');
    res.json(orders);
  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" }); 
  }
}

exports.addtoCart = async (req,res)=>{
  try{
    const myCart = await Cart.find({productId:req.body.productId,userId:req.body.userId});
    if(myCart.length>0){
      res.json({ message:"already" });
    }
    else{
      const cart = new Cart(req.body);
      await cart.save();
      res.json({ message:"success" });
    }
  }
  catch(error){
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" }); 
  }
}

exports.getCart = async (req,res)=>{
  const Id = req.params.id;
  try{
    const cart = await Cart.find({userId:Id}).populate('productId').populate('userId');
    res.json(cart);
  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" }); 
  }
}

exports.deleteCart = async (req,res)=>{
  const Id=req.params.id;
  try{
    await Cart.findByIdAndDelete(Id);
    res.status(200).json({ message: 'success' });
  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" }); 
  }
}