const { Pizza } = require('../models');
const { db } = require('../models/Pizza');

const pizzaController = {
  // the functions will go in here as methods

  // get all pizzas - this will serve as the callback function for GET /api/pizzas
  // this uses the mongoose .find() method which is similar to sequelize .findAll()
  getAllPizza(req, res) {
      Pizza.find({})
      .populate({
          path: 'comments',
          select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
          console.log(err);
          res.status(400).json(err);
      });
  },

  // get one pizza by id
  // thos uses mongoose .findOne() to find a single pizza by id.  
  // instead of accessing the entire req, we've destructured params out of it
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .populate({
        path: 'comments',
        select: '-__v'
      })
      .select('-__v')
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // create Pizza
  //Destructure the info out of the body section from the express.js req object
  createPizza({ body }, res) {
      Pizza.create(body)
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.status(400).json(err));
  },

  // update pizza by id
  // this is the mongoose version of find one with the id and update
  // need the third arguement with { new: true }, otherwise, it will send back the original statement
  updatePizza({ params, body }, res) {
      Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbPizzaData => {
          if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
          }
          res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete pizza
  // this mongoose function will find the document to be returned and also delete it from the database
  deletePizza({ params }, res) {
      Pizza.findOneAndDelete({ _id: params.id })
      .then(dbPizzaData => {
          if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
          }
          res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  }

};

module.exports = pizzaController;