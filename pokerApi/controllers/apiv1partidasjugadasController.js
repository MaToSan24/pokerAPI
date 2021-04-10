'use strict'

var varapiv1partidasjugadasController = require('./apiv1partidasjugadasControllerService');

module.exports.findPartidaByjugadas = function findPartidaByjugadas(req, res, next) {
  varapiv1partidasjugadasController.findPartidaByjugadas(req.swagger.params, res, next);
};

module.exports.deletePartida = function deletePartida(req, res, next) {
  varapiv1partidasjugadasController.deletePartida(req.swagger.params, res, next);
};

module.exports.updatePartida = function updatePartida(req, res, next) {
  varapiv1partidasjugadasController.updatePartida(req.swagger.params, res, next);
};