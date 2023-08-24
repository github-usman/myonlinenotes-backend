import express from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {fetchuser} from "../middleware/fetchuser.js";
const JWT_SECRET = "UsmanisGood#Coder";
// ROUTE 1: Create a user using : Post "/auth" Doesnt require Auth no log in required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {

    let success = false;
    // if there are errors return Bad message and all errors

    const error = validationResult(req);
    if (!error.isEmpty()) {
      
      return res.status(400).json({success, error: error.array() });
    }
    //   Check whether the user with the same mail exists already or not
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;

      res.json({ success,authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: Authenticate a  a user, using : Post "/login" Doesnt require Auth no log in required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // if there are errors return Bad message and all errors
    
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ success,error: error.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please, Enter correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({success, error: "Please, Enter correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success,authToken });
      
    } catch (error) {
    
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: get  loggedi user Details: Post "/getuser" require Auth Log in required

router.post(
  '/getuser',
  fetchuser
  ,
  async (req, res) => {
    
    try {
       const userId =  req.user.id
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
export default router;
