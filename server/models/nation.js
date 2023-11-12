const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Nation = new Schema(
    {
        name: { type: String, required: true },
        shortName: { type: String, required: false },
        stats: {type: String, required: true},
    }
)

module.exports = mongoose.model('nations', Nation)