const express = require('express')
const app = express()
// const mongoose = require('mongoose')
// const User = require('./users')

// mongoose.connect('mongodb://localhost/pagination', { useNewUrlParser: true, useUnifiedTopology: true })
// const db = mongoose.connection
// db.once('open', async () => {
//     if (await User.countDocuments().exec() > 0) return

//     Promise.all([
//         User.create({ name: 'User 1' }),
//         User.create({ name: 'User 2' }),
//         User.create({ name: 'User 3' }),
//         User.create({ name: 'User 4' }),
//         User.create({ name: 'User 5' }),
//         User.create({ name: 'User 6' }),
//         User.create({ name: 'User 7' }),
//         User.create({ name: 'User 8' }),
//         User.create({ name: 'User 9' }),
//         User.create({ name: 'User 10' }),
//         User.create({ name: 'User 11' }),
//         User.create({ name: 'User 12' })
//     ]).then(() => console.log('Added Users'))
// })

// app.get('/users', paginatedResults(User), (req, res) => {
//     res.json(res.paginatedResults)
// })

const users = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
    { id: 4, name: 'User 4' },
    { id: 5, name: 'User 5' },
    { id: 6, name: 'User 6' },
    { id: 7, name: 'User 7' },
    { id: 8, name: 'User 8' },
    { id: 9, name: 'User 9' },
    { id: 10, name: 'User 10' },
]

app.get('/users', paginatedResults(users), (req, res) => {
    res.json(res.paginatedResults)
})

function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        // if (endIndex < await model.countDocuments().exec()) {
        if (endIndex < users.length) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            // results.results = await model.find().limit(limit).skip(startIndex).exec()
            results.results = model.slice(startIndex, endIndex)
            res.paginatedResults = results
            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}

app.listen(3000, () => {
    console.log('listening on port 3000')
})