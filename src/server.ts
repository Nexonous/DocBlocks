import express from 'express'

const application = express()
application.use(express.static('public'))
application.use((_request, response) => { response.status(404).redirect('/Not-Found.html') })
application.listen(8080, () => { console.log('The test server is running on http://localhost:8080 (http://127.0.0.1:8080).') })
