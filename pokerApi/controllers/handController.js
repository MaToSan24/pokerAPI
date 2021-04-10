'use strict'

var varhandController = require('./handControllerService');

module.exports.evaluateGames = function evaluateGame(req, res, next) {
  varhandController.evaluateGame(req.swagger.params, res, next);
};