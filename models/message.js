const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const MessageSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, maxLength: 25 },
    text: { type: String, required: true, maxLength: 500 },
    timestamp: { type: Date, default: Date.now },
});

MessageSchema.virtual("timestamp_formatted").get(function () {
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_MED);
});

MessageSchema.virtual("author_name").get(function (){
    return;
});

module.exports = mongoose.model("Message", MessageSchema);