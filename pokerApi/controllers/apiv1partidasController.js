'use strict'

var varapiv1partidasController = require('./apiv1partidasControllerService');

module.exports.getPartidas = function getPartidas(req, res, next) {
  varapiv1partidasController.getPartidas(req.swagger.params, res, next);
};

module.exports.addPartida = function addPartida(req, res, next) {
  varapiv1partidasController.addPartida(req.swagger.params, res, next);
};