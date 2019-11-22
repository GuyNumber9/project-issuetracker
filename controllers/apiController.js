const mongoose = require("mongoose");
const Project = require("../models/project").model;
const Issue = require("../models/issue").model;

function getController(req, res) {
  let name = req.params.project;
  let query = cleanBodyAndMakeSet("issues.", req.query);
  Project.aggregate(
    [
      {
        $match: {
          name: name
        }
      },
      {
        $unwind: {
          path: "$issues"
        }
      },
      {
        $match: query
      },
      {
        $group: {
          _id: "$name",
          issues: {
            $push: "$issues"
          }
        }
      }
    ],
    (err, doc) => {
      if (err) {
        res.send(err);
      } else {
        res.json(doc.length > 0 ? doc[0].issues : []);
      }
    }
  );
}

function postController(req, res) {
  var project = req.params.project;
  if (!req.body.issue_title || !req.body.issue_text) {
    res.send("missing required fields");
  } else {
    let date = new Date();
    let issue = new Issue({
      issue_title: req.body.issue_title,
      issue_text: req.body.issue_text,
      created_by: req.body.created_by,
      created_on: date,
      updated_on: date,
      assigned_to: req.body.assigned_to,
      open: true,
      status_text: req.body.status_text
    });
    Project.findOneAndUpdate(
      {
        name: project
      },
      {
        $addToSet: {
          issues: issue
        }
      },
      {
        upsert: true,
        useFindAndModify: false
      },
      (err, doc) => {
        if (err) {
          res.send(err);
        } else {
          res.json(issue);
        }
      }
    ).catch(ex => {
      res.send(ex);
    });
  }
}

function putController(req, res) {
  var name = req.params.project;
  if (Object.getOwnPropertyNames(req.body).length < 2) {
    res.send("no updated field sent");
  } else {
    let cleanAndSet = cleanBodyAndMakeSet("issues.$.", req.body);
    cleanAndSet["issues.$.updated_on"] = new Date();
    Project.findOneAndUpdate(
      {
        name: name,
        "issues._id": req.body._id
      },
      {
        $set: cleanAndSet
      },
      {
        new: true,
        omitUndefined: true,
        useFindAndModify: false
      },
      (err, doc) => {
        if (err) {
          res.send(err);
        } else if (doc) {
          res.json(doc.issues.id(req.body._id));
        } else {
          res.send("wut?!");
        }
      }
    ).catch(ex => {
      res.send(ex);
    });
  }
}

function deleteController(req, res) {
  let id = req.body._id;
  let name = req.body.project;
  Project.findOneAndUpdate(
    {
      name
    },
    {
      $pull: {
        issues: { _id: id }
      }
    },
    {
      useFindAndModify: false
    },
    (err, doc) => {
      if (err) {
        res.send("could not delete " + id);
      } else {
        res.send("deleted " + id);
      }
    }
  );
}

function cleanBodyAndMakeSet(prepend, body) {
  let cleaned = {};
  let props = Object.getOwnPropertyNames(body);
  props.forEach(prop => {
    if (body[prop]) {
      cleaned[prepend + prop] = body[prop];
    }
  });
  return cleaned;
}

module.exports = {
  getController,
  postController,
  putController,
  deleteController
};
