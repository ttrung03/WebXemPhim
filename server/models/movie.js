const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const Schema = mongoose.Schema;
mongoose.plugin(slug);

const Movies = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    trailerCode: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    backdrop_path: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
      required: true,
    },
    genres: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: String,
    },
    ibmPoints: {
      type: Number,
    },
    country: {
      type: String,
    },
    overview: {
      type: String,
      required: true,
    },
    seasons: {
      type: Number,
      required: false,
    },
    episodes: {
      type: Number,
      required: false,
    },
    episodeDuration: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'upcoming'],
      required: false,
    },
    type: {
      type: String,
      enum: ['movie', 'tv'],
      required: true,
    },
    tmdb_id: {
      type: String,
      required: true,
      unique: true,
    },
    viewed: { 
      type: Number, 
      required: false, 
      default: 0 
    },
    is_Series: {
      type: Boolean,
      default: false,
    },
    is_TopList: {
      type: Boolean,
      default: false,
    },
    is_Top10: {
      type: Boolean,
      default: false,
    },
    slug: { 
      type: String, 
      slug: "name", 
      unique: true 
    },
  },
  {
    timestamps: true,
  }
);

// Tạo chỉ mục
Movies.index(
  { 
    name: "text",
    overview: "text",
    country: "text",
  }
);

// Tạo chỉ mục cho tmdb_id và type
Movies.index({ tmdb_id: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("movies", Movies);
