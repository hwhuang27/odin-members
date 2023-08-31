const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 50 },
    last_name: { type: String, required: true, maxLength: 50 },
    username: { type: String, required: true, maxLength: 50 },
    password: { type: String, required: true },
    membership_status: {
        type: String,
        required: true,
        enum: ["Member", "Non-Member"],
        default: "Non-Member",
    },
    admin_status: {
        type: String,
        enum: ["Admin", "Non-Admin"],
        default: "Non-Admin",
    },
});

UserSchema.virtual("name").get(function () {
    let fullname = "";
    if (this.first_name && this.last_name){
        fullname = `${this.first_name} ${this.last_name}`;
    }
    return fullname;
})

UserSchema.virtual("url").get(function () {
    return `/users/${this._id}`;
})

module.exports = mongoose.model("User", UserSchema);