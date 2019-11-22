/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
const { app, db } = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  before(function(done) {
    db.once('open', () => {
      done();
    });
  })
  suite("POST /api/issues/{project} => object with issue data", function() {
    test("Every field filled in", function(done) {
      let body = {
        issue_title: "Title",
        issue_text: "text",
        created_by: "Functional Test - Every field filled in",
        assigned_to: "Chai and Mocha",
        status_text: "In QA"
      };
      chai
        .request(app)
        .post("/api/issues/test")
        .send(body)
        .end(function(err, res) {
          assert.equal(res.status, 200);

          //fill me in too!
          assert.equal(body.issue_text, res.body.issue_text);
          assert.equal(body.issue_title, res.body.issue_title);
          assert.equal(body.created_by, res.body.created_by);
          assert.equal(body.assigned_to, res.body.assigned_to);
          assert.equal(body.status_text, res.body.status_text);
          assert.property(res.body, '_id');
          done();
        });
    });

    test("Required fields filled in", function(done) {
      let body = {
        issue_title: "Title",
        issue_text: "text"
      };

      chai
        .request(app)
        .post("/api/issues/test")
        .send(body)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_text, body.issue_text);
          assert.equal(res.body.issue_title, body.issue_title);
          done();
        });
    });

    test("Missing required fields", function(done) {
      let body = {
        created_by: "Saud",
        status_text: "In QA"
      };
      chai
        .request(app)
        .post("/api/issues/test")
        .send(body)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required fields");
          done();
        });
    });
  });

  suite("PUT /api/issues/{project} => text", function() {
    test("No body", function(done) {
      let body = {
        issue_title: "Title",
        issue_text: "text",
        created_by: "Functional Test - Every field filled in",
        assigned_to: "Chai and Mocha",
        status_text: "In QA"
      };
      chai
        .request(app)
        .post("/api/issues/test")
        .send(body)
        .end(function(err, res) {
          let updateBody = {
            _id: res.body._id
          };
          chai
            .request(app)
            .put("/api/issues/test")
            .send(updateBody)
            .end(function(req, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "no updated field sent");
              done();
            });
        });
    });

    test("One field to update", function(done) {
      let body = {
        issue_title: "Title",
        issue_text: "text",
        created_by: "Functional Test - Every field filled in",
        assigned_to: "Chai and Mocha",
        status_text: "In QA"
      };
      chai
        .request(app)
        .post("/api/issues/test")
        .send(body)
        .end(function(err, res) {
          let updateBody = {
            _id: res.body._id,
            status_text: "updated status text"
          };
          chai
            .request(app)
            .put("/api/issues/test")
            .send(updateBody)
            .end(function(req, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.status_text, updateBody.status_text);
              done();
            });
        });
    });

    test("Multiple fields to update", function(done) {
      let body = {
        issue_title: "Title",
        issue_text: "text",
        created_by: "Functional Test - Every field filled in",
        assigned_to: "Chai and Mocha",
        status_text: "In QA"
      };
      chai
        .request(app)
        .post("/api/issues/test")
        .send(body)
        .end(function(err, res) {
          let updateBody = {
            _id: res.body._id,
            status_text: "updated status text",
            assigned_to: "updated assigned to"
          };
          chai
            .request(app)
            .put("/api/issues/test")
            .send(updateBody)
            .end(function(req, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.status_text, updateBody.status_text);
              assert.equal(res.body.assigned_to, updateBody.assigned_to);
              done();
            });
        });
    });
  });

  suite(
    "GET /api/issues/{project} => Array of objects with issue data",
    function() {
      test("No filter", function(done) {
        chai
          .request(app)
          .get("/api/issues/test")
          .query({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
      });

      test("One filter", function(done) {
        let body = {
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        };
        chai
          .request(app)
          .post("/api/issues/test")
          .send(body)
          .end(function(err, res) {
            chai
              .request(app)
              .get("/api/issues/test")
              .query({ issue_title: res.body.issue_title })
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.property(res.body[0], "issue_title");
                assert.property(res.body[0], "issue_text");
                assert.property(res.body[0], "created_on");
                assert.property(res.body[0], "updated_on");
                assert.property(res.body[0], "created_by");
                assert.property(res.body[0], "assigned_to");
                assert.property(res.body[0], "open");
                assert.property(res.body[0], "status_text");
                assert.property(res.body[0], "_id");
                done();
              });
          });
      });

      test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
        let body = {
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        };
        chai
          .request(app)
          .post("/api/issues/test")
          .send(body)
          .end(function(err, res) {
            chai
              .request(app)
              .get("/api/issues/test")
              .query({
                issue_title: res.body.issue_title,
                issue_text: res.body.issue_text
              })
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.property(res.body[0], "issue_title");
                assert.property(res.body[0], "issue_text");
                assert.property(res.body[0], "created_on");
                assert.property(res.body[0], "updated_on");
                assert.property(res.body[0], "created_by");
                assert.property(res.body[0], "assigned_to");
                assert.property(res.body[0], "open");
                assert.property(res.body[0], "status_text");
                assert.property(res.body[0], "_id");
                done();
              });
          });
      });
    }
  );

  suite("DELETE /api/issues/{project} => text", function() {
    test("No _id", function(done) {
      chai
        .request(app)
        .delete("/api/issues/test")
        .send({ _id: "1234567" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "could not delete 1234567");
          done();
        });
    });

    test("Valid _id", function(done) {
      let body = {
        issue_title: "Title",
        issue_text: "text",
        created_by: "Functional Test - Every field filled in",
        assigned_to: "Chai and Mocha",
        status_text: "In QA"
      };
      chai
        .request(app)
        .post("/api/issues/test")
        .send(body)
        .end(function(err, res) {
          chai
            .request(app)
            .delete("/api/issues/test")
            .send({ _id: res.body._id })
            .end(function(err, res2) {
              assert.equal(res2.status, 200);
              assert.equal(res2.text, "deleted " + res.body._id);
              done();
            });
        });
    });
  });
});
