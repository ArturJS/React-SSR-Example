export default function corsMiddleware(req, res, next) {
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Origin', req.get('origin'));
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	// intercept OPTIONS method
	if (req.method === 'OPTIONS') {
		res.sendStatus(200);
	}
	else {
		next();
	}
}