const express = require('express')

const app = express()

app.listen(3000)

app.use(express.json())

app.use((req, res, next) => {
    console.log('in the first middleware')
    console.log(req.path, req.method)
    next()
})



