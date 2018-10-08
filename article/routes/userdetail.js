var express = require('express');
var bodyParser = require('body-parser');
const Router = express.Router();
Router.use(bodyParser.json());
var mongoose = require('mongoose');
var students = require('../models/userdetail');
var authenticate = require('../authenticate');

Router.route('/')
.post((req, res, next) => {
    students.create(req.body)
    .then((student) => {
        console.log('Student Created ', student);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(student);
    }, (err) => next(err))
    .catch((err) => next(err));
})