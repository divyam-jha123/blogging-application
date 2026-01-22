const { Router } = require('express');
const Blog = require('../models/blog');
const multer = require('multer');
const path = require('path');
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()} - ${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get('/add-new', (req, res) => {
  return res.render('addBlogs', {
    user: req.user,
  });
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('createdBy');

  return res.render('blog', {
    user: req.user,
    blog,
  });
});

router.post('/', upload.single('coverImageUrl'), async (req, res) => {
  const { title, content } = req.body;

  // store the blog data in the data base.
  const blog = await Blog.create({
    title: title,
    body: content,
    createdBy: req.user._id,
    converImageUrl: `/uploads/${req.file.filename}`,
  });

  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;