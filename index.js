const express = require('express');
const app = express();

app.use(express.json());

const { body, validationResult } = require('express-validator');

let candidates = [];

app.post(
  '/candidates',
  body('id').notEmpty().isString().isLength({ min: 1, max: 100 }),
  body('name').notEmpty().isLength({ min: 1, max: 100 }),
  body('skills').notEmpty().isArray({ min: 1, max: 100 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ success: false, error: errors.array() });
    }

    const { id, name, skills } = req.body;
    const candidate = { id, name, skills };

    try {
      candidates.push(candidate);

      res.status(201).json({
        success: true,
        data: candidate,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

app.get('/candidates/search', async (req, res) => {
  const { skills } = req.query;
  if (!skills || skills === '')
    return res.status(404).send('please pass skills parameters');

  const _skills = skills.split(',');
  const result = candidates
    .filter((c) => c.skills.some((s) => _skills.includes(s)))
    .filter((c) => c.skills.some((s) => !_skills.includes(s)));

  res.status(200).json({ success: true, data: result });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: candidates,
  });
});

app.listen(3005, () => console.log('Server running on port 3005 ...'));
