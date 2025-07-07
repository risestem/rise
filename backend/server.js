/**
 * Workshop Signup Backend Server
 * 
 * To run this server locally:
 * 1. Install dependencies: npm install
 * 2. Start the backend: npm run backend
 * 3. Server will run on http://localhost:3001
 * 4. Make sure to also run the frontend with: npm run dev (in another terminal)
 * 
 * API Endpoints:
 * - POST /api/signup - Accepts workshop signup data and appends to signups.json
 */

import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path to the signups file
const SIGNUPS_FILE = path.join(__dirname, '..', 'signups.json');

// Ensure signups.json exists
async function ensureSignupsFile() {
  try {
    await fs.access(SIGNUPS_FILE);
  } catch (error) {
    // File doesn't exist, create it with an empty array
    await fs.writeFile(SIGNUPS_FILE, JSON.stringify([], null, 2));
    console.log('Created signups.json file');
  }
}

// POST /api/signup - Handle workshop signup submissions
app.post('/api/signup', async (req, res) => {
  try {
    console.log('Received signup request:', req.body);
    
    // Validate required fields
    const { participantName, ageGrade, guardianName, guardianEmail, emergencyContact, workshop } = req.body;
    
    if (!participantName || !ageGrade || !guardianName || !guardianEmail || !emergencyContact || !workshop) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }
    
    // Create signup entry with timestamp
    const signupEntry = {
      ...req.body,
      timestamp: new Date().toISOString(),
      id: Date.now() // Simple ID generation
    };
    
    // Read existing signups
    await ensureSignupsFile();
    const signupsData = await fs.readFile(SIGNUPS_FILE, 'utf-8');
    const signups = JSON.parse(signupsData);
    
    // Add new signup
    signups.push(signupEntry);
    
    // Write back to file
    await fs.writeFile(SIGNUPS_FILE, JSON.stringify(signups, null, 2));
    
    console.log(`New signup added for ${participantName} in ${workshop}`);
    
    res.json({ 
      success: true, 
      message: 'Signup recorded successfully',
      id: signupEntry.id
    });
    
  } catch (error) {
    console.error('Error processing signup:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Workshop signup backend running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/signup - Submit workshop signup');
  console.log('  GET /api/health - Health check');
  
  // Ensure signups file exists on startup
  ensureSignupsFile().catch(console.error);
});