/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;

var ObjectId = require("mongodb").ObjectID;

const apiController = require('../controllers/apiController');

module.exports = function(app, db) {
  app
    .route("/api/issues/:project")

    .get(apiController.getController)

    .post(apiController.postController)

    .put(apiController.putController)

    .delete(apiController.deleteController);
};
