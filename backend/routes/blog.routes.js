const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { BlogModel } = require("../model/blog.model");

const blogRouter = express.Router();

blogRouter.use(auth);

//Get all blogs
blogRouter.get("/", async (req, res) => {
  const { q, sortBy, sortOrder, category } = req.query;

  try {
    const filter = {};
    if (category) {
      filter.category = category;
    }

    const query = BlogModel.find(filter);
    if (q) {
      query.or[{ title: new RegExp(q, "i") }];
    }

    if (sortOrder) {
      const sortCriteria = {};
      sortCriteria[sortBy] = sortOrder == "asc" ? 1 : -1;
      query.sort(sortCriteria);
    }

    //console.log("query",query)

    const blogs = await query;
    console.log("blogs", blogs);
    res.status(200).send(blogs);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

//Create new blog
blogRouter.post("/create", async (req, res) => {
  try {
    const newBlog = new BlogModel(req.body);
    await newBlog.save();
    res.status(200).send({ message: "New blog created", newBlog: newBlog });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

//Edit blog
blogRouter.patch("/edit/:blogId", async (req, res) => {
  const { blogId } = req.params;
  const blog = await BlogModel.findOne({ blogId });
  try {
    if (blog.userId == req.body.userId) {
      await BlogModel.findByIdAndUpdate({ _id: blogId }, req.body);
    }
    res
      .status(200)
      .send({ message: `Blog with ID ${blogId} has been updated` });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

//Delete blog
blogRouter.delete("/delete/:blogId", async (req, res) => {
  const { blogId } = req.params;
  const blog = await BlogModel.findOne({ blogId });
  try {
    if (blog.userId == req.body.userId) {
      await BlogModel.findByIdAndDelete({ _id: blogId });
    }
    res
      .status(200)
      .send({ message: `Blog with ID ${blogId} has been deleted` });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

module.exports = { blogRouter };
