import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

export default (app) => {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    // app.use('/assets',express.static(appDir+"/public"))

    // allow cross origin
    app.use((req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,x-accesstoken');
        next();
    });
};
