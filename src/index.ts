import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { generateAsciiArt } from './utils/generateAsciiArt';
import bodyParser from 'body-parser';
import multer from 'multer';
import { removeFile } from './utils/removeFile';

/** PORT */
const PORT = process.env.PORT || 3000;

/** Multer */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ dest: 'uploads/', storage });

/**
 * Create http and socket.io server
 */
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    }
});

/**
 * Middlewares
 */

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname +'/views');

// Serve static directory
app.use(express.static(path.join(__dirname, '../public')))

/**
 * Socket events and handlers
 */

// Listen for incoming connections
io.on('connection', (socket) => {
    console.log('Client connected: ', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected: ', socket.id);
    });
});


/**
 * Routes
 */
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Handle image uploads
app.post('/drawAscii', upload.single('file'), async (req, res) => {

    // const { base64Image } = req.body;
    // console.log(req.file);
    // const base64Image = req.file?.buffer.toString();

    if (!req.file) {
        res.status(400).json({
            message: "No file sent"
        })
    }
    else{
        try {
            // Call the Python script to process the image
            let filePath = req.file.path //path.join(__dirname,"../", req.file.path)
            const asciiArt = await generateAsciiArt(filePath);

            /**
             * Once art generated, remove the file
             */
            if (asciiArt) {
                removeFile(filePath);
            }
            
            // Return the ASCII art to the client
            res.send({ asciiArt });
    
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "An unknown error occured"
            })
        }
    }
});

/**
 * Listen on PORT
 */
server.listen(PORT, () => {
    console.log('listening on ', PORT);
});
