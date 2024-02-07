
import { isAuthenticated } from './modules/autentisering.mjs';
import path from 'path';

// Bruk middleware
// server.get('/meny.html', isAuthenticated, (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/meny.html'));
// });