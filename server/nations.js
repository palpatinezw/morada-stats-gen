const Nation = require('./models/nation')

createNation = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Empty body',
        })
    }

    const nation = new Nation(body)
    if (!nation) {
        return res.status(400).json({ success: false, error: err })
    }

    nation.save().then(() => {
        return res.status(201).json({
            success: true,
            id: nation._id,
            message: 'Nation created!',
        })
    }).catch(error => {
        return res.status(400).json({
            error,
            message: 'Nation create failed!',
        })
    })
}

getNations = (req, res) => {
    // TODO: syntax ded
    Nation.find({}, (err, nations) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!nations.length) {
            return res
                .status(404)
                .json({ success: false, error: `Nations not found` })
        }
        return res.status(200).json({ success: true, data: nations })
    }).catch(err => console.log(err))
}

module.exports = {
    createNation,
    getNations
}