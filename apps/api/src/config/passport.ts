import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { UserModel } from '../models/User'
import { env } from './env'
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0].value
          if (!email) return done(new Error('No email from Google'))
          let user = await UserModel.findOne({ $or: [{ googleId: profile.id }, { email }] })

          if (!user) {
            user = await UserModel.create({
              name: profile.displayName,
              email,
              googleId: profile.id,
              avatar: profile.photos?.[0].value,
              isVerified: true,
            })
          } else if (!user.googleId) {
            user.googleId = profile.id
            if (!user.avatar) user.avatar = profile.photos?.[0].value
            await user.save()
          }

          done(null, user.toObject() as unknown as Express.User)
        } catch (err) {
          done(err as Error)
        }
      }
    )
  )
}

passport.serializeUser((user, done) => done(null, (user as Express.User)._id))
passport.deserializeUser(async (id: string, done) => {
  const user = await UserModel.findById(id)
  done(null, user ? (user.toObject() as unknown as Express.User) : null)
})

export default passport
