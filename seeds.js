var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var User = require('./models/user');
var Item = require('./models/item');
var Order = require('./models/order');
var Restaurant = require('./models/restaurant');

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
}
else {
  mongoose.connect('mongodb://localhost/orderup');
}
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
  }
);
mongoose.connection.once('open', function() {
  console.log("Mongoose has connected to MongoDB!");
});


// our script will not exit until we have disconnected from the db.
function quit() {
  mongoose.disconnect();
  console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
  console.log('ERROR:', err);
  quit();
  return err;
}

console.log('removing old items...');
Item.remove({})
.then(function() {
  console.log('removing old users...');
  return User.remove({})
})
.then(function() {
  console.log('removing old restaurants...');
  return Restaurant.remove({})
})
.then(function() {
  console.log('removing old orders...');
  return Order.remove({});
})
.then(function() {
  console.log('creating new users');
  let adele = new User();
  adele = {
    local:  {
      email: 'hello@itsme.com',
      password: adele.encrypt('123')
    },
    firstName: 'Adele',
    lastName: 'Adkins'
  };

  let andre = new User();
  andre = {
    local: {
      email: 'hey@ya.com',
      password: andre.encrypt('123')
    },
    firstName: 'Andre',
    lastName: '3000'
  };
  console.log(adele);
  console.log(andre);
  return User.create(adele, andre);
})
.then(function() {
  return User.findOne({ "local.email" : "hello@itsme.com" });
})
.then(function(owner) {
  console.log('creating some new restaurants...');
  let fellinis = new Restaurant();
  fellinis = {
    title: 'Fellinis',
    owner: owner._id,
    cuisine: 'Italian',
    address: '123 Ponce de Leon, Atlanta, GA 30308',
    phone: '404-123-4567',
    hours: 'M-F 10AM-2AM'
  };
  console.log(fellinis);
  return Restaurant.create(fellinis);
})
.then(function(restaurant) {
  let pizza = new Item();
  pizza = {
    title: "Pizza",
    price: 6,
    restaurant: restaurant._id,
    category: 'entree',
    description: 'Plain cheese pizza on NY style crust'
  }
  return Item.create(pizza);
})
.then(function() {
  return Restaurant.findOne({ "title" : "Fellinis" })
})
.then(function() {
  quit();
}),
// .then(function(restaurant) {
//   return User.findOne({ "local.email" : "hello@itsme.com" })
//   .then(function(owner) {
//     console.log("Before pushing:", owner);
//     console.log("id:", restaurant._id);
//     owner.restaurants.push(restaurant._id);
//     console.log("After pushing:", owner);
//     owner.save();
//     quit();
//   })
// }),
// .then(function(savedTodos) {
//   console.log('Just saved', savedTodos.length, 'todos.');
//   return Todo.find({}).populate('user');
// })
// .then(function(allTodos) {
//   console.log('Printing all todos:');
//   allTodos.forEach(function(todo) {
//     console.log(todo.toString());
//   });
 function(err) {
  return handleError(err);
}
