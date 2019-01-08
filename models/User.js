var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    usercreated: {
        type: Date,
        trim: true,
        default: Date.now()
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        validate: [validateEmail, 'Please provide a valid email address']
    },
    city: {
        type: String,
        trim: true
    },
    password:{
        type:String,
        required:true
    }
});




UserSchema.pre('save', function (next) {
    var user = this;
    console.log(user);
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);