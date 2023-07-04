import { Router } from 'express';
import path from 'node:path';

const router = Router();

router.get('/README.md', (req, res) => res.sendFile(path.resolve(__dirname, '..', '..', 'README.md')));
router.get('/style.css', (req, res) => res.sendFile(path.resolve(__dirname, 'style.css')));
router.get('/github.svg', (req, res) => res.sendFile(path.resolve(__dirname, 'github.svg')));
router.get('/', (req, res) => res.sendFile(path.resolve(__dirname, 'index.html')));

export default router;
