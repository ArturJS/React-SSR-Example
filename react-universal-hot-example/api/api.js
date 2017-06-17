import express from 'express';
import bodyParser from 'body-parser';
import config from '../src/config';
import shortid from 'shortid';
import corsMiddleware from './middlewares/cors.middleware';
import noCacheMiddleware from './middlewares/no-cache.middleware';

const router = express.Router();
const app = express();


app.use(bodyParser.json());
app.use(corsMiddleware);
app.use(noCacheMiddleware);


router.get('/packages', (req, res) => {
  res.json([
    {
      id: shortid.generate(),
      title: 'Package 1',
      description: `Lorem ipsum dolor sit amet, 
      tantas expetenda dissentiunt usu ex, eum id semper 
      iisque singulis, ut vix ubique gubergren accommodare.`
    },
    {
      id: shortid.generate(),
      title: 'Package 2',
      description: `Lorem ipsum dolor sit amet, 
      tantas expetenda dissentiunt usu ex, eum id semper 
      iisque singulis, ut vix ubique gubergren accommodare.`
    },
    {
      id: shortid.generate(),
      title: 'Package 3',
      description: `Lorem ipsum dolor sit amet, 
      tantas expetenda dissentiunt usu ex, eum id semper 
      iisque singulis, ut vix ubique gubergren accommodare.`
    },
  ]);
});

app.use('/api', router);

if (config.apiPort) {
  app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
