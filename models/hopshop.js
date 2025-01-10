const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
      text: {
        type: String,
        required: true
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      completed: {
        type: Boolean,
        default: false
      },
      deadline: {
        type: Date,
        required: false
      }
    },
    { timestamps: true }
);

const hopshopSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
        enum: [
            'Auto',
            'Beauty', 
            'Beverages', 
            'Electronics',
            'Family',
            'Fashion', 
            'Furniture',
            'Holidays & Gifts',
            'Grocery',
            'Health',
            'Household',
            'School / Work',
            'Pets'
        ],
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comments: [commentSchema]
    },
    { timestamps: true }
);

const Hopshop = mongoose.model('HopShop', hopshopSchema);

module.exports = Hopshop;
