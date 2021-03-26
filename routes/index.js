const router = require('express').Router();

const authRouter = require("./authRouter");
/* const profileRouter = require("./profileRouter");
const categoryRouter = require("./categoryRouter");
const itemRouter = require("./itemRouter");
const cartRouter = require("./cartRouter");
const orderRouter = require("./orderRouter"); */

router.use("/auth", authRouter);
/* app.use("/profile", profileRouter);
app.use("/category", categoryRouter);
app.use("/item", itemRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter); */

module.exports = router;
