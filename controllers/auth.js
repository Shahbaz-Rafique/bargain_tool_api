const User = require('../models/User');
const Code = require('../models/code');
const bcrypt = require('bcryptjs');
const { createError } = require('../utils/error');
const jwt = require('jsonwebtoken');
const { transporter } = require('../utils/nodemailer');
const { randomNumber } = require('../utils/randNo');

exports.register = async (req, res, next) => {
  try {
    // Hash the password using bcrypt
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Create a new user
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    // Save the new user to the database
    await newUser.save();
    const responseData = { message: 'data added', responseData: newUser};
    const mailOptions = {
      from: 'Bargain Tools',
      to: req.body.email,
      subject: 'You have been registered',
      html: 'Now you can access our portal',
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ error: 'Failed to send email' });
      } else {
        res.status(200).json(responseData);
      }
      transporter.close();
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect" });
    }

    const token = GenerateToken(user);
    res.status(200).json({ user: user, token: token, success:"true" });
  } catch (err) {
    next(err);
  }
};


exports.verifyUser = async (req, res, next) => {
  try {
    // Get the email from the query parameters
    const email = req.query.email;
    // Validate the presence of the email parameter
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Search for a user with the provided email
    const user = await User.findOne({ email });
    // Check if the user was found
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const responseData = { message: 'Success', responseData: user };
    // Sending email logic...
    const mailOptions = {
      from: 'GreenStride',
      to: email,
      subject: 'Verification code (GreenStride)',
      html: `Here is your 6-digit code ${randomNumber}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ error: 'Failed to send email' });
      } else {
        const newCode = new Code({
          user: user._id, // Assuming user ID is provided in the request body
          code: randomNumber,
        });

        // Save the new document to the database
        const savedCode = newCode.save();
        res.status(200).json(responseData);
      }
      transporter.close();
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyLatestCode = async (req, res, next) => {
  try {
    // Get the user ID from the request (assuming it is passed as a parameter)
    const userId = req.query.Id;
    const userCode = parseInt(req.query.code);

    console.log(userId);
    // Validate the presence of the user ID
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Find the latest code associated with the user ID
    const latestCodeEntry = await Code.findOne({ user: userId })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .limit(1);

    // Check if a code was found
    if (latestCodeEntry) {
      // Compare the provided code with the latest code in the database
      if (latestCodeEntry.code === userCode) {
        // Code matches, return success
        return res.status(200).json({ message: 'Success: Code verified.' });
      } else {
        // Code does not match, return error
        return res.status(400).json({ message: 'Error: Code does not match.' });
      }
    } else {
      // No code found for the specified user
      return res.status(404).json({ message: 'No code found for the specified user.' });
    }
  } catch (err) {
    // Pass any errors to the next middleware
    next(err);
  }
};

exports.validateUser = async (req, res) => {
  let token = req.query.token;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, "2334rw53texhjdhjfhjdhfjhdskfjhdkjfhdkjshfkjdshf", (err, decoded) => {

    if (err) {
      return res.status(403).json({ message: 'invalid' });
    }
    else {
      return res.status(201).json({ message: 'valid' });
    }
  });
}

function GenerateToken(user) {
  const payload = {
    role: user.isAdmin,
    id: user._id,
  };
  const token = jwt.sign(payload, "2334rw53texhjdhjfhjdhfjhdskfjhdkjfhdkjshfkjdshf");
  return token;
};