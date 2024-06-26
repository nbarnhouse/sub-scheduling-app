const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

const {
  rejectUnauthenticated,
  // eslint-disable-next-line no-undef
} = require('../modules/authentication-middleware');

// GET route for all requests
router.get('/all', rejectUnauthenticated, (req, res) => {
  pool
    .query(
      `SELECT requests.*, "user".first_name, "user".last_name, "teacher".grade, "teacher".room_number FROM "requests"
      JOIN "teacher" ON requests.teacher_id = "teacher".id
      JOIN "user" ON "teacher".user_id = "user".id
      WHERE "status" = 'Requested' AND "request_start_date" >= CURRENT_DATE
      ORDER BY requests.request_start_date;`
    )
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.error('Error on GET Request Object', error);
      res.sendStatus(500);
    });
});

//GET route for specific substitute (ACCEPTED REQUESTS)
router.get('/accepted', rejectUnauthenticated, (req, res) => {
  pool
    .query(
      `SELECT requests.id, requests.request_start_date, requests.school, "user".first_name, "user".last_name, "teacher".grade, "teacher".room_number, requests.sub_notes FROM "requests"
      JOIN "teacher" ON requests.teacher_id = "teacher".id
      JOIN "user" ON "teacher".user_id = "user".id
      WHERE "status" = 'Accepted' AND "request_start_date" >= CURRENT_DATE AND "requests".user_id = $1
      ORDER BY requests.request_start_date;`,
      [req.user.id]
    )
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      console.error('Error fetching accepted requests:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//GET route for specific substitute (PAST ACCEPTED REQUESTS)
router.get('/accepted/past', rejectUnauthenticated, (req, res) => {
  pool
    .query(
      `SELECT "requests".* , "teacher".*, "user".first_name, "user".last_name FROM "requests"
      JOIN "teacher" ON requests.teacher_id = "teacher".id
      JOIN "user" ON "teacher".user_id = "user".id
      WHERE "status" = 'Accepted' AND "request_start_date" < CURRENT_DATE AND "requests".user_id = $1
      ORDER BY requests.request_start_date DESC;`,
      [req.user.id]
    )
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      console.error('Error fetching past accepted requests:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//GET route for specific teacher (SUBMITTED REQUESTS)
router.get('/submitted', rejectUnauthenticated, (req, res) => {
  pool
    .query(
      `SELECT requests.*, "user".first_name, "user".last_name, "teacher".grade, "teacher".room_number FROM "requests"
      JOIN "teacher" ON requests.teacher_id = "teacher".id
      JOIN "user" ON "teacher".user_id = "user".id
      WHERE "status" = 'Requested' AND "request_start_date" >= CURRENT_DATE
      ORDER BY requests.request_start_date;`
    )
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      console.error('Error fetching submitted requests:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//GET route for specific teacher (PAST SUBMITTED REQUESTS)
router.get('/submitted/past', rejectUnauthenticated, (req, res) => {
  pool
    .query(
      `SELECT requests.*, "user".first_name, "user".last_name, "teacher".grade, "teacher".room_number FROM "requests"
      JOIN "teacher" ON requests.teacher_id = "teacher".id
      JOIN "user" ON "teacher".user_id = "user".id
      WHERE "request_start_date" < CURRENT_DATE
      ORDER BY requests.request_start_date;`
    )
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      console.error('Error fetching submitted requests:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// POST route to ADD REQUEST
router.post('/', rejectUnauthenticated, (req, res) => {
  console.log('POST Request req.body', req.body);

  const newReq = req.body;
  const teacherId = req.params.teacher_id;

  const queryText = `
    INSERT INTO "requests" ("request_start_date", "reason", "admin_notes", "sub_notes", "teacher_id")
    VALUES ($1, $2, $3, $4, $5)
  `;
  const queryValues = [
    newReq.request_start_date,
    newReq.reason,
    newReq.admin_notes,
    newReq.sub_notes,
    teacherId,
  ];

  pool
    .query(queryText, queryValues)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error on POST Request Object', error);
      res.sendStatus(500);
    });
});

// PUT route to update SUB ACCEPTANCE OF Request
router.put('/:id', rejectUnauthenticated, (req, res) => {
  const acceptReq = req.body;
  const requestId = req.params.id;

  const queryValues = [acceptReq.user_id, requestId];

  pool
    .query(
      `UPDATE "requests" SET "status" = 'Accepted', user_id = $1 WHERE "requests".id = $2`,
      queryValues
    )

    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error on PUT Request Object', error);
      res.sendStatus(500);
    });
});

// PUT route to update SUB CANCELLATION OF Request
router.put('/cancel/:id', rejectUnauthenticated, (req, res) => {
  const requestId = req.params.id;

  pool
    .query(
      `UPDATE "requests" SET "status" = 'Requested', "user_id" = NULL WHERE "id" = $1`,
      [requestId]
    )
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error on PUT Request Object', error);
      res.sendStatus(500);
    });
});

// DELETE route
router.delete('/:id', rejectUnauthenticated, (req, res) => {
  pool
    .query('DELETE FROM "requests" WHERE id=$1', [req.params.id])
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error on DELETE Request Object', error);
      res.sendStatus(500);
    });
});

module.exports = router;
