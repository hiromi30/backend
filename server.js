const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/", router);
app.listen( process.env.PORT || 5000, () => console.log("Server running"));


const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_USER_TOKEN,
    pass: process.env.AUTH_USER_PASS,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const mail = {
    from: name,
    to: process.env.MAILTO,
    subject: "Contact Form Submission",
    html: `
    <p>Name: ${name}</p>
    <p>Email: ${email}</p>
    <p>Message: ${message}</p>
    `,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "Error" });
    } else {
      res.json({ status: "Message Sent" });
    }
  });
});
