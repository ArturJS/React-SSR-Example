let api = 'http://eprusarw1168.saratov.epam.com:3333/api';
if (process.env.type === 'qa') {
	api = 'http://ecse001008fa.epam.com:8765';
}
else if (process.env.type === 'java') {
	api = 'http://localhost:8765';
}
else if (process.env.type === 'dev') {
	api = 'http://ecse00100756.epam.com:8765';
}
else if (process.env.type === 'local') {
	api = 'http://localhost:3333/api';
}

export const config = {
	baseURL: api
};
