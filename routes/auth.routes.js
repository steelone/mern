const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth
router.post(
  '/register',
  [
    check('email', 'Wrong email!').isEmail(),
    check('password', 'Minimal password length is 6 symbols').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Wrong data during the authorization'
        })
      }
      const { email, password } = req.body
      const candidate = await User.findOne({ email })

      if (candidate) {
        return res.status(400).json({ message: 'This user exist' })
      }
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword })

      await user.save()
      res.status(201).json({ message: "User was created" })


    } catch (e) {
      res.status(500).json({ message: "Something is wrong. Let's try again" })
      console.log("Express server listening on port %d", app.address().port)
    }
  })
// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Input correct email, please').normalizeEmail().isEmail(),
    check('password', 'Input password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Wrong data during the sing in'
        })
      }
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: `User wasn't found` })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: `The password is wrong. . Let's try again` })
      }

      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      )
      res.json({ token, userId: user.id })


    } catch (e) {
      console.log('error:', e)
      res.status(500).json({ message: "Something is wrong. Let's try again" })
    }
  })

// 1:30 !!!!!!!!!!!!!!!!!!!!!!!


module.exports = router
