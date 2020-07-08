const express = require('express');
const db = require('./data/db');

const router = express.Router();

//post endpoints
router.get('/', (req, res) => {
  db.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => res.status(500).json({ error: 'The posts information could not be retrieved.' }));
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then((post) => {
      if (!post) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => res.status(500).json({ error: 'The post information could not be retrieved.' }));
});

router.post('/', (req, res) => {
  const data = req.body;
  db.insert(data)
    .then((id) => {
      if (!data.title || !data.contents) {
        res.status(404).json({ errorMessage: 'Please provide title and contents for the post.' });
      } else {
        res.status(201).json({ 'New post created with id': id });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'There was an error while saving the post to the database' });
    });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then((post) => {
      if (!post) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      } else {
        db.update(id, req.body)
          .then((num) => {
            res.status(201).json({ 'Ammount of posts updated': num });
          })
          .catch((err) => {
            res.status(500).json({ error: 'The post information could not be modified.' });
          });
      }
    })
    .catch((err) => res.status(500).json({ error: 'The post information could not be retrieved.' }));
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then((post) => {
      if (!post) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      } else {
        db.remove(id)
          .then((ammount) => res.status(200).json({ Ammount_of_posts_deleted: ammount }))
          .catch((err) => res.status(500).json({ error: 'The post could not be removed' }));
      }
    })
    .catch((err) => res.status(500).json({ error: 'The post information could not be retrieved.' }));
});

// comment endpoints
router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const data = req.body;
  data.post_id = id;
  db.findById(id)
    .then((post) => {
      if (!post) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      } else if (!data.text) {
        res.status(400).json({ errorMessage: 'Please provide text for the comment.' });
      } else {
        db.insertComment(data)
          .then((id) => {
            res.status(201).json({ 'comment created with id': id });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'There was an error while saving the comment to the database' });
          });
      }
    })
    .catch((err) => res.status(500).json({ error: 'The post information could not be retrieved.' }));
});

router.get('/:id/comments', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then((post) => {
      if (!post) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      } else {
        db.findPostComments(id)
          .then((comments) => {
            res.status(200).json(comments);
          })
          .catch((err) => res.status(500).json({ error: 'The comments information could not be retrieved.' }));
      }
    })
    .catch((err) => res.status(500).json({ error: 'The post information could not be retrieved.' }));
});

router.get('/comments/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then((post) => {
      if (!post) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      } else {
        db.findCommentById(id)
          .then((comments) => {
            res.status(200).json(comments);
          })
          .catch((err) => res.status(500).json({ error: 'The comments information could not be retrieved.' }));
      }
    })
    .catch((err) => res.status(500).json({ error: 'The post information could not be retrieved.' }));
});

module.exports = router;
