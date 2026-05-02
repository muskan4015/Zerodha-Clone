const { OrdersModel } = require("../model/OrdersModel");
const { HoldingsModel } = require("../model/HoldingsModel");
const { UserModel } = require("../model/UserModel");

module.exports.create = async (req, res) => {
  const qty = Number(req.body.qty);
  const price = Number(req.body.price);
  const mode = req.body.mode;

  if (!req.body.name || !qty || !price || !["BUY", "SELL"].includes(mode)) {
    return res.status(400).json({ error: "Invalid order details" });
  }

  const user = await UserModel.findOne({ email: req.user.email }).populate("holdings");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const existingHolding = user.holdings.find((holding) => holding.name === req.body.name);

  if (mode === "BUY") {
    if (existingHolding) {
      const totalQty = existingHolding.qty + qty;
      const totalCost = existingHolding.avg * existingHolding.qty + price * qty;

      existingHolding.qty = totalQty;
      existingHolding.avg = totalCost / totalQty;
      existingHolding.price = price;
      existingHolding.net = `${(((price - existingHolding.avg) / existingHolding.avg) * 100).toFixed(2)}%`;
      existingHolding.day = "0.00%";

      await existingHolding.save();
    } else {
      const newHolding = new HoldingsModel({
        name: req.body.name,
        qty,
        avg: price,
        price,
        net: "0.00%",
        day: "0.00%",
      });

      const savedHolding = await newHolding.save();
      user.holdings.push(savedHolding._id);
    }
  }

  if (mode === "SELL") {
    if (!existingHolding || existingHolding.qty < qty) {
      return res.status(400).json({ error: "Not enough holdings to sell" });
    }

    existingHolding.qty -= qty;
    existingHolding.price = price;
    existingHolding.net = `${(((price - existingHolding.avg) / existingHolding.avg) * 100).toFixed(2)}%`;
    existingHolding.day = "0.00%";

    if (existingHolding.qty === 0) {
      await HoldingsModel.deleteOne({ _id: existingHolding._id });
      user.holdings = user.holdings.filter((holding) => !holding._id.equals(existingHolding._id));
    } else {
      await existingHolding.save();
    }
  }

  let newOrder = new OrdersModel({
    name: req.body.name,
    qty,
    price,
    mode,
  });

  let savedOrder = await newOrder.save();

  user.orders.push(savedOrder._id);
  await user.save();

  res.json({ status: "Done" });
};

module.exports.index = async (req, res) => {
  let user = await UserModel.findOne({ email: req.user.email }).populate("orders");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user.orders);
};
