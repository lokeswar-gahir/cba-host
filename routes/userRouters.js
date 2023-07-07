const express = require('express');
const {registerUser, login, current, allusers} = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", login);

router.get("/current", validateToken, current);
// router.get("/current", current);

router.route("/all").get(allusers);

module.exports = router;
