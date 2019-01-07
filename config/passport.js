var JWTStrategy=require('passport-jwt').Strategy;
var ExtractJWT=require('passport-jwt').ExtractJwt;

var User=require('../models/User');
var settings=require('./settings');

module.exports=(passport)=>{
    var opts={}
    opts.jwtFromRequest=ExtractJWT.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey=settings.secret;
    passport.use(new JWTStrategy(opts, (jwt_payload, done)=>{
        User.findOne({id:jwt_payload.id},(err, user)=>{
            if(err){
                return done(err, false);
            }
            if(user){
                done(null, user);
            }
            else{
                done(null, false);
            }
        });
    }))
};
