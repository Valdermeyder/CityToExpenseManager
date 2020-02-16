const express = require('express')
const path = require('path')
const fileUpload = require('express-fileupload');
const cityConverter = require('./converters/cityConverter')
const pkoConverter = require('./converters/pkoConverter')
const bankApi = require('./bankApi')

const app = express()
const port = process.env.PORT || 3000

const getHttpErrorHandler = response => err => {
	console.error(err)
	response.status(500).send('Something is broken. Details: ' + err)
}
app.use((err, request, response, next) => getHttpErrorHandler(response)(err))
app.use(fileUpload())

app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname, 'index.html'))
})

const getCategoriesMapping = (file = {}) => file.data && JSON.parse(file.data)

app.post('/', ({ files, body: { bank, username, password } }, response) => {
	if (files && files.file) {
		const converter = bank === 'pko' ? pkoConverter : cityConverter
		response.set({
			'Content-Type': 'text/plain; charset=utf-8'
		})
		converter
			.convertCvsFileData(files.file.data, getCategoriesMapping(files.categoriesMapping))
			.on('finish', () => setTimeout(() => response.end()))
			.on('error', getHttpErrorHandler(response))
			.pipe(response);
	} else if (username && password) {
		bankApi.callBankApi(username, password)
			.on('error', getHttpErrorHandler(response))
			.pipe(response)
	} else {
		response.status(400).send('Neither file was uploaded nor credentials are provided.')
	}
})

const server = app.listen(port, err => {
	if (err) {
		return console.error(err)
	}
	console.info(`City to ExpenseManager converter is running at http://${server.address().address}:${port}/`)
})
