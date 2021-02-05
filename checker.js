const fs = require("fs")
const FormData = require("form-data")
const axios = require("axios")

const args = {
	hostname: "httpbin.org",
	port: 80,
	path: "/post",
	headers: {
		"Content-Type": "multipart/form-data",
	},
}

const filesSent = []

const fileDir = "./"

const sendFile = file => {
	if (filesSent.find(sentFile => sentFile === file)) return

	filesSent.push(file)
	console.log(`sending ${file}`)

	const formData = new FormData()

	formData.append(file, fs.ReadStream(file))

	axios
		.post(`https://${args.hostname}${args.path}`, formData, args.headers)
		.then(() => {
			console.log("sent file")
			fs.readFile(file, error => {
				if (error) return
				fs.unlinkSync(file)
			})
		})
		.catch(error => console.error(error))
}

console.log("starting script...")

fs.readdir(fileDir, error => {
	if (error)
		return console.error(
			`Something went wrong while reading the dir, does it exist? \n \n ${error}`
		)
	main()
})

const main = () => {
	console.log("script initialized!")
	setInterval(() => {
		fs.readdir(fileDir, (error, files) => {
			if (error) {
				console.error("an error occured \n \n ", e)
			}

			if (files && files.length >= 1) {
				files.forEach(file => {
					if (file.endsWith("pdf")) {
						try {
							sendFile(file)
						} catch (err) {
							console.error(`ERROR OCCURED \n \n ${err}`)
						}
					}
				})
			} else console.log("No Files Detected")
		})
	}, 100)
}
