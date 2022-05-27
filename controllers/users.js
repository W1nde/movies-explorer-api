require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const CastError = require('../errors/CastError');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NofFound');
const ValidationError = require('../errors/ValidationError');

const { JWT_SECRET = '2B4B6150645367566B5970337336763979244226452948404D6351655468576D' } = process.env;

