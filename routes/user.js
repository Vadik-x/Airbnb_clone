import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import passport from 'passport';
import { saveRedirectUrl } from '../middleware.js';
import { renderSignup, signupCheck, renderLogin, loginCheck, logout } from '../controllers/user.js';

const router = express.Router();

router.route("/signup")
    .get(wrapAsync(renderSignup))
    .post(wrapAsync(signupCheck));

router.route("/login")
    .get(wrapAsync(renderLogin))
    .post(
        saveRedirectUrl,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        wrapAsync(loginCheck)
    );

router.get("/logout", logout);

export default router;