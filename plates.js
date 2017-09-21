'use strict';
module.exports = function(app) {
  var mongoose = require('mongoose');

  const mongoURL = process.env.MONGO_DB_URL || "mongodb://localhost/regnumbers";
  mongoose.connect(mongoURL);

  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
  });

  var plateSchema = mongoose.Schema({
    plate: String,
    plateCount: Number
  });
  var regnumbers = mongoose.model('regnumbers', plateSchema);

  var plates = [];
  var plateList = {};
  for (var i = 0; i < plateList.length; i++) {}

  //search if plate already exists in the database
  function managePlates(enteredPlate, fn) {
    regnumbers.findOne({
      plate: enteredPlate
    }, function(err, plateFound) {
      if (plateFound) {
        regnumbers.update({
          plate: enteredPlate,
          $inc: {
            plateCount: 1
          }
        }, fn);
        return;
      } else {
        regnumbers.create({
          plate: enteredPlate,
          plateCount: 1
        }, fn);
        return;
      }
    });
  }

  var filteredPlates = [];
  var DatabasePlates = [];

  function reloadPlates() {
    regnumbers.find({}, function(err, plate) {
      for (var i = 0; i < plate.length; i++) {
        var dbPlate = plate[i].plate;
        plateList[dbPlate] = 1;
        DatabasePlates.push(dbPlate);
      }
      console.log(DatabasePlates);
    });
  }

  reloadPlates();

  function getPlates(city) {
    filteredPlates = [];

    for (var i = 0; i < DatabasePlates.length; i++) {
      var curPlate = DatabasePlates[i];
      if (city === 'Stellenbosch' && curPlate.startsWith('cl')) {
        filteredPlates.push(curPlate);
      } else if (city === 'Cape Town' && curPlate.startsWith('ca')) {
        filteredPlates.push(curPlate);
      } else if (city === 'Bellville' && curPlate.startsWith('cy')) {
        filteredPlates.push(curPlate);
      } else if (city === 'Paarl' && curPlate.startsWith('cj')) {
        filteredPlates.push(curPlate);
      } else if (city === 'All') {
        filteredPlates = DatabasePlates;
      }
    }
    return filteredPlates;
  }

// rendering to the form
  app.get('/', function(req, res) {
    res.render('registration_numbers', {
      // plate: DatabasePlates
    });
  });


  app.post('/reg_numbers', function(req, res, next) {
    var enteredPlate = req.body.regNumberInput;
    var add = req.body.add;
    var city = req.body.city;

// When the user clicks on add button
    if (add) {
      // this will be if the user doesn't enter anything..
      if (plateList[enteredPlate] === undefined && enteredPlate !== "") {
        enteredPlate = enteredPlate.toLowerCase();
        managePlates(enteredPlate, function(err) {
          if (err) {
            console.log(err);
          }
        });
        plateList[enteredPlate] = 1;
        DatabasePlates.push(enteredPlate);
        console.log(DatabasePlates);
        res.render('registration_numbers', {
          plate: DatabasePlates
        });
      } else {
        res.render('registration_numbers', {
          plate: DatabasePlates
        });
      }
   } else if (filter) {
      if (city) {
        var getPlatesResults = getPlates(city);
        res.render('registration_numbers', {
          plate: getPlatesResults
        });
      } else {
        res.render('registration_numbers', {
          plate: DatabasePlates
        });
      }
    }
  });
};
