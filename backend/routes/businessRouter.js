const express = require('express');
const {checkBusiness} = require('../checkBusiness');

const Router = express.Router();

Router.route('/checkBusiness').get(checkBusiness)

module.exports =Router;