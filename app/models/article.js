'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  // Tag = mongoose.model('Tag'),
  Schema = mongoose.Schema;


/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  tags: {
    type: [String],
    default: [],
    set: function (tags) {
      // var articleId = this._id;

      // tags.forEach(function (tagName, index) {
      //   Tag.findOne({name: tagName}, function (err, tag) {
      //     if (tag) {
      //       // tag.articleIds.$push(article_id);
      //       // tag.save();
      //     } else {
      //       Tag.create({name: tagName, articleIds: [articleId]});
      //     }
      //   });
      // });

      return tags;
    }
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Validations
 */
ArticleSchema.path('title').validate(function (title) {
  return title.length;
}, 'cannot be blank');

// ArticleSchema.virtual('tags')
  // .set(function (tags) {
    // var article_id = this.id;
    // tags = tags.split(',');
//
//     (this.tags - tags).each(function (tag) {
//       Tag.find({name: name}, function (err, tag) {
//         tag.article_ids.slice(tag.article_ids.indexOf(article_id), 1)
//         if (tag.article_id.length == 0) {
//           tag.remove();
//         }
//       });
//     });
//
//     (tags - this.tags).each(function (tag) {
//       Tag.find({name: tag}, function (err, tag) {
//         if (!tag) {
//           Tag.create({name: tag, article_ids: [article_id]});
//         } else {
//           tag.article_ids.push(article_id);
//           tag.save();
//         }
//       });
//     });
//
  //   this.tagArray = tags;


/**
 * Statics
 */
ArticleSchema.statics.load = function (id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Article', ArticleSchema);
