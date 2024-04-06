const express = require("express");
const userController = require("./../controllers/userController"); //this format, instead of using path, helps intellisense
const authController = require("./../controllers/authController");
const router = express.Router();

// get basic details about a user
router.get("/test", (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "user test successful",
  });
});

router.post("/signup", authController.signup); //ok

router.get("/auth/google/url", authController.getGoogleUrl);
router.get("/auth/google/", authController.authGoogle);

router.post("/verifyEmail", authController.verifyEmail); //ok
router.post(
  "/updateDetails",
  authController.protect,
  userController.updateUserDetails
);

router.post("/login", authController.login); //ok

const { getRecommendations } = require("../controllers/recommendationAlgo");
const { likeUser, rejectUser } = require("../controllers/matchController");
router.get("/getRecommendations", getRecommendations);
router.put("/likeUser", authController.protect, likeUser);
router.put("/rejectUser", authController.protect, rejectUser);

module.exports = router;
