'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Tag Schema
 */
var TagSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
  },
  articleIds: {
    type: [String],
    default: []
  }
});

/**
 * Validations
 */
TagSchema.path('name').validate(function (name) {
  return name.length;
}, 'Name cannot be blank');


mongoose.model('Tag', TagSchema);
