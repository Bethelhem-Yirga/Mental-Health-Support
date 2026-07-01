const mongoose = require('mongoose');
const { logDatabaseQuery } = require('../utils/logger');

// Mongoose query logger middleware
mongoose.set('debug', (collectionName, method, query, doc) => {
  if (process.env.NODE_ENV === 'development') {
    logDatabaseQuery(collectionName, method, 0, query);
  }
});

// Query performance monitor
const monitorQueryPerformance = (schema) => {
  schema.pre('find', function() {
    this._startTime = Date.now();
  });
  
  schema.post('find', function(docs) {
    const duration = Date.now() - this._startTime;
    if (duration > 100) {
      logDatabaseQuery(this.model.collection.name, 'find', duration, this.getFilter());
    }
  });
  
  schema.pre('save', function() {
    this._startTime = Date.now();
  });
  
  schema.post('save', function(doc) {
    const duration = Date.now() - this._startTime;
    if (duration > 100) {
      logDatabaseQuery(this.constructor.collection.name, 'save', duration, { id: this._id });
    }
  });
};

module.exports = { monitorQueryPerformance };
