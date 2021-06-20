const cors = require("cors");
const express = require("express");
const app = express();

const WorksData = require("./utils/WorksData.json");

require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Header", "Content-Type,Authorization");
  next();
});

app.get("/api", (req, res) => {
  res.send("API Status: Running 🏃");
});

app.get("/api/worksdata", (req, res) => {
  res.status(201).send(JSON.stringify(WorksData));
});

app.post("/api/email", (req, res, next) => {
  const { contactName, contactEmail, contactMob, contactSub, contactMsg } =
    req.body;

  //
  const myMail = "viveknishad99999@gmail.com";

  const from = {
    name: "ViveK Nishad",
    email: myMail,
  };

  const toServer = myMail;
  const toClient = contactEmail;

  const clientSubject = "Thank you for getting in touch!";
  const serverSubject = "New Contact Request";

  const clientOutput = `
<p>I have received your message and would like to thank you for writing to me. I will be in touch with you shortly.</p>
<br />
<p>Have a great day!</p>
`;
  const serverOutput = `
<p>You have a new Contact Request</p>
<h3>Contact Details</h3>
<ul>
  <li>Name : ${contactName}</li>
  <li>Phone Number : ${contactMob}</li>
  <li>Email : ${contactEmail}</li>
  <li>Subject : ${contactSub}</li>
  <li>Message : ${contactMsg}</li>
</ul>
`;

  const msg = [
    {
      to: toClient,
      from: from,
      subject: clientSubject,
      html: clientOutput,
    },
    {
      to: toServer,
      from: from,
      subject: serverSubject,
      html: serverOutput,
    },
  ];

  sgMail
    .send(msg)
    .then((response) => {
      console.log("success " + response[0].statusCode);
      return res.status(200).json({ success: true });
    })
    .catch((error) => {
      console.error("error " + error);
      return res.status(401).json({ success: false });
    });

  //
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
