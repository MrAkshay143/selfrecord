const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Ensure the 'uploads' directory exists
const uploadsDirectory = path.join(__dirname, 'uploads');

// Ensure the 'uploads' directory exists before starting the server
fs.promises.access(uploadsDirectory, fs.constants.F_OK)
    .catch(() => fs.promises.mkdir(uploadsDirectory))
    .then(() => {
        console.log(`'uploads' directory is ready at ${uploadsDirectory}`);
        
        // Set up storage for multer
        const storage = multer.memoryStorage();
        const upload = multer({ storage: storage });

        // Serve the HTML file
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });

        // Handle video upload
        app.post('/upload', upload.single('video'), (req, res) => {
            const videoData = req.file.buffer;
            const fileName = `video_${new Date().toISOString()}.webm`;
            const filePath = path.join(uploadsDirectory, fileName);

            // Save the video file on the server
            fs.writeFile(filePath, videoData, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    console.log(`Video saved: ${filePath}`);
                    res.status(200).send('Video uploaded successfully');
                }
            });
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.error(`Error setting up 'uploads' directory: ${error.message}`);
        process.exit(1);
    });
