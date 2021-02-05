const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const endpoint = 'https://enyz9n0ebmy3n.x.pipedream.net/pdfs';

const sendFile = file => {
    const formData = new FormData();
    formData.append(file, fs.ReadStream(file));
    
    axios.post(endpoint, formData, {'Content-Type': 'multipart/form-data'})
        .then((_, err) => {
	    if (err) console.error(err);
            fs.unlinkSync(file);
        })
        .catch(err => console.error(err));
};

const mainLoop = () => {
    fs.readdir('/', (err, files) => {
        if (err) console.error('Error occured.');
        const pdf = files.find(el => el.endsWith('.pdf'));
        if (pdf) {
            console.log(`Received and sending PDF: ${pdf}`);
            sendFile(pdf);
        }
    });
};

setInterval(mainLoop, 1000);
