const { Router } = require("express");
const responseService = require("../middlewares/responseService");

const router = Router();

router.get("/", (req, res) => {
  responseService.success(res, "Welcome to the API");
});

module.exports = router;
