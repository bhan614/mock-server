'use strict';

var Config = require('../config'),
  ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (DataModel) {
  if (!DataModel) {
    throw new Error('DataModel is empty');
  }

  let notFound = {message: 'Not Found', status: 404};

  return {
    find: function (query, options, callback) {
      options = options || {};

      let limit = Config.pageSize,
        skip = limit * ((options.page || 1) - 1),
        tmp;

      if (!callback) {
        callback = options;
      }

      options = Object.assign({}, {
        sort: {_id: -1}
      }, options)

      tmp = DataModel.find(query);

      if (options.populate) {
        tmp = tmp.populate(options.populate)
      }

      tmp.select(options.select)
        .skip(skip)
        .limit(limit)
        .sort(options.sort)
        .lean()
        .exec(callback);
    },

    findAll: function (query, options, callback) {
      options = options || {};

      let tmp;

      if (!callback) {
        callback = options;
      }

      options = Object.assign({}, {
        sort: {update: -1}
      }, options)

      tmp = DataModel.find(query);


      if (options.select) {
        tmp = tmp.select(options.select)
      }

      if (options.populate) {
        tmp = tmp.populate(options.populate)
      }

      if (options.skip) {
        tmp = tmp.skip(options.skip)
      }

      if (options.limit) {
        tmp = tmp.limit(options.limit)
      }

      tmp.sort(options.sort)
        .lean()
        .exec(callback);
    },

    count: function (query, callback) {
      query = query || {};
      DataModel.count(query, callback);
    },

    findById: function (id, callback) {
      if (ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id)) {
      } else {
        return callback(notFound)
      }

      DataModel.findById(id).exec(function (err, doc) {
        if (err) return callback(err);

        if (!doc) {
          callback(notFound)
        } else {
          callback(null, doc)
        }
      });
    },

    delete: function (id, callback) {
      if (!ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id)) {
        return callback(notFound)
      }

      DataModel.findOneAndRemove({_id: id}, function (err, doc) {
        if (err) return callback(err);
        if (!doc) {
          callback(notFound)
        } else {
          callback(null, doc)
        }
      });
    }

  }
}