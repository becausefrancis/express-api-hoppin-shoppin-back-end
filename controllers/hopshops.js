const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Hopshop = require('../models/hopshop.js');
const router = express.Router();

router.use(verifyToken);

router.get('/', async (req, res) => {
    try {
      const hopshops = await Hopshop.find({})
        .populate('author')
        .sort({ createdAt: 'desc' });
      res.status(200).json(hopshops);
    } catch (error) {
      res.status(500).json(error);
    }
});

router.get('/:hopshopId', async (req, res) => {
    try {
      const hopshop = await Hopshop.findById(req.params.hopshopId).populate('author');
      res.status(200).json(hopshop);
    } catch (error) {
      res.status(500).json(error);
    }
});

router.post('/', async (req, res) => {
    try {
      req.body.author = req.user._id;
      const hopshop = await Hopshop.create(req.body);
      hopshop._doc.author = req.user;
      res.status(201).json(hopshop);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
});

router.post('/:hopshopId/comments', async (req, res) => {
    try {
      req.body.author = req.user._id;
      const hopshop = await Hopshop.findById(req.params.hopshopId);
      hopshop.comments.push(req.body);
      await hopshop.save();
      const newComment = hopshop.comments[hopshop.comments.length - 1];
      newComment._doc.author = req.user;
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json(error);
    }
});

router.put('/:hopshopId', async (req, res) => {
    try {
      const hopshop = await Hopshop.findById(req.params.hopshopId);
      if (!hopshop.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
      const updatedHopshop = await Hopshop.findByIdAndUpdate(
        req.params.hopshopId,
        req.body,
        { new: true }
      );
      updatedHopshop._doc.author = req.user;
      res.status(200).json(updatedHopshop);
    } catch (error) {
      res.status(500).json(error);
    }
});

router.put('/:hopshopId/comments/:commentId', async (req, res) => {
    try {
      const hopshop = await Hopshop.findById(req.params.hopshopId);
      const comment = hopshop.comments.id(req.params.commentId);
      comment.text = req.body.text;
      await hopshop.save();
      res.status(200).json(comment);
    } catch (err) {
      res.status(500).json(err);
    }
});

router.delete('/:hopshopId', async (req, res) => {
    try {
      const hopshop = await Hopshop.findById(req.params.hopshopId); 
      if (!hopshop.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
      const deletedHopshop = await Hopshop.findByIdAndDelete(req.params.hopshopId);
      res.status(200).json(deletedHopshop);
    } catch (error) {
      res.status(500).json(error);
    }
});

router.delete('/:hopshopId/comments/:commentId', async (req, res) => {
    try {
      const hopshop = await Hopshop.findById(req.params.hopshopId);
      hopshop.comments.remove({ _id: req.params.commentId });
      await hopshop.save();
      res.status(200).json(hopshop.comments);
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;

