const mongoose = require("mongoose");

// Counter schema for auto-incrementing
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 },
});

const Counter = mongoose.model("Counter", counterSchema);

// Note schema
const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  _id: {
    type: Number,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// Middleware to auto-increment _id before saving
noteSchema.pre("save", function (next) {
  const doc = this;
  Counter.findByIdAndUpdate(
    { _id: "noteId" }, // Unique identifier for your note schema
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
    function (error, counter) {
      if (error) return next(error);
      doc._id = counter.seq;
      next();
    }
  );
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
