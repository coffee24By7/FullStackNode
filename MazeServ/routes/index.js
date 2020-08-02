const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { catchErrors } = require('../handlers/errorHandlers');
const bodyParser = require('body-parser');

//router.get('/add', authController.isLoggedIn, mazeController.addMaze);

// router.post('/add',
//   mazeController.upload,
//   catchErrors(mazeController.resize),
//   catchErrors(mazeController.createMaze)
// );

// router.post('/add/:id',
//   mazeController.upload,
//   catchErrors(mazeController.resize),
//   catchErrors(mazeController.createMaze)
// );

router.get('/', catchErrors(userController.main));
router.post('/', catchErrors(userController.main));

// router.get('/maze/:id/edit', catchErrors(mazeController.editmaze));
// router.get('/maze/:slug', catchErrors(mazeController.getmazeBySlug));



router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);

// 1. Validate the registration data
// 2. register the user
// 3. we need to log them in
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

/*
  API
*/

module.exports = router;
