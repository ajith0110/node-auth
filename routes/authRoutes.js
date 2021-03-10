// const route = require('express').Router();

const {Router}=require('express');
const router= Router();

const authController = require('../controller/authController');



router.get('/login', authController.login_get);
router.get('/logout', authController.logout_get);
router.post('/login', authController.login_post);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);

module.exports = router;