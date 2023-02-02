require("dotenv").config()
const { render } = require("ejs")
const express = require("express")
const mongoose = require("mongoose")
const fs = require("fs")
path = require("path")
const Cart = require('./models/Cart')
const productUser = require("./models/User")
const Product = require("./models/Product")
const app = express()
const session = require("express-session")
const MongoDbStore = require("connect-mongo")(session)
const dbURL = "mongodb+srv://armanjeet:uvraaj123@cluster0.hdfibcb.mongodb.net/?retryWrites=true&w=majority"
// register view engine
app.use(express.urlencoded({ extended: true }))
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.json())

app.use(express.static(__dirname + "./uploads"))
app.use('/uploads', express.static('./uploads'))

app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})

app.use(bodyParser())
app.set("view engine", "ejs")
mongoose.set('strictQuery', false);
mongoose.connect(dbURL)
  .then(() => {
    console.log("mongo connected")
    app.listen(8080)
  }).catch((err) => {
    console.log(err)
  })

//registration
app.get("/", (req, res) => {
  res.render("login")
})
app.get("/signup", (req, res) => {
  res.render("signup")
})


app.post("/signup", (req, res) => {
  const newUser = new productUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  newUser.save()
    .then((result) => {
      res.send(result)
    }).catch((err) => {
      console.log(err)
    })
  res.render("login")
});

//LOGIN

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const useremail = await productUser.findOne({ email });
    if (useremail.password === password) {
      res.status(201).redirect("/home");
    } else {
      res.send("invalid email or password")
    }
  } catch (error) {
    res.status(400).send("invalid email or password")
  }
})

app.get('/home', (req, res) => {
  Product.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred', err);
    }
    else {
      res.render('home', { items: items });
    }
  });
});

app.post("/product/:id/addCart", async (req, res) => {
  const quantity = req.body;
  Product.findById(req.params.id, function (err, image) {
    if (err) {
      console.log(err);
    }
    const cart = new Cart({
      item: req.body.item,
      qty: req.body.qty,
      price: req.body.price * quantity
    })
    cart.save();
    res.redirect("/Cart");
  })
})

app.get("/Cart", function (req, res) {
  Cart.find({ owner: req.params.id }, function (err, userCart) {
    if (err) {
      console.log(err);
    }
    res.render("Cart", { cart: userCart });
  })
})



//session store
mongoStore = new MongoDbStore({
  mongooseConnection: mongoose.connection,
  collection: "sessions"
})

//creating session

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  store: mongoStore,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))


app.get('/userDetails', (req, res) => {
  productUser.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred', err);
    }
    else {
      res.render('userDetails', { items: items });
    }
  });
});

app.post('/userDetails', (req, res,) => {

  console.log(req.params.id);
  productUser.updateOne({ id: req.params.id }, {
    $set: {
      city: req.body.city,
      pinNo: req.body.pinNo,
      state: req.body.state,
      number: req.body.number,
    }
  }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Post Updated successfully");
      res.redirect('userDetails');
    }
  });
});



var multer = require('multer');
const { json } = require("express")
const { CallTracker } = require("assert")

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });

app.get('/productDetails', (req, res) => {
  Product.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred', err);
    }
    else {
      res.render('productDetails', { items: items });
    }
  });
});


app.post('/productDetails', upload.single('image'), (req, res, next) => {

  var obj = {
    productName: req.body.productName,
    productCatogary: req.body.productCatogary,
    price: req.body.price,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      contentType: 'image/png'
    }
  }
  Product.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    }
    else {
      // item.save();
      res.redirect('/home');
    }
  });
});


