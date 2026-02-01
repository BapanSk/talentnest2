const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { body, param, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new sqlite3.Database('./job_applications.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Create Jobs table
    db.run(`
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            location TEXT NOT NULL,
            isActive BOOLEAN DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating jobs table:', err);
        } else {
            // Insert sample jobs if table is empty
            db.get('SELECT COUNT(*) as count FROM jobs', (err, row) => {
                if (!err && row.count === 0) {
                    const sampleJobs = [
                        {
                            title: 'Senior Full Stack Developer',
                            description: 'We are seeking an experienced Full Stack Developer to join our innovative team. You will work on cutting-edge web applications using modern technologies like React, Node.js, and cloud services. Strong problem-solving skills and 5+ years of experience required.',
                            location: 'San Francisco, CA (Remote)',
                            isActive: 1
                        },
                        {
                            title: 'UI/UX Designer',
                            description: 'Join our design team to create beautiful and intuitive user experiences. We\'re looking for someone with a strong portfolio, experience with Figma, and knowledge of user research methodologies. 3+ years of experience in product design.',
                            location: 'New York, NY (Hybrid)',
                            isActive: 1
                        },
                        {
                            title: 'DevOps Engineer',
                            description: 'Help us build and maintain scalable infrastructure. Experience with AWS, Docker, Kubernetes, and CI/CD pipelines is essential. You\'ll work closely with development teams to optimize deployment processes.',
                            location: 'Austin, TX (Remote)',
                            isActive: 1
                        }
                    ];

                    const stmt = db.prepare('INSERT INTO jobs (title, description, location, isActive) VALUES (?, ?, ?, ?)');
                    sampleJobs.forEach(job => {
                        stmt.run(job.title, job.description, job.location, job.isActive);
                    });
                    stmt.finalize();
                    console.log('Sample jobs inserted');
                }
            });
        }
    });

    // Create Candidates table
    db.run(`
        CREATE TABLE IF NOT EXISTS candidates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            resumeLink TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating candidates table:', err);
    });

    // Create Applications table
    db.run(`
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jobId INTEGER NOT NULL,
            candidateId INTEGER NOT NULL,
            status TEXT DEFAULT 'APPLIED' CHECK(status IN ('APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED')),
            appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (jobId) REFERENCES jobs(id),
            FOREIGN KEY (candidateId) REFERENCES candidates(id),
            UNIQUE(jobId, candidateId)
        )
    `, (err) => {
        if (err) console.error('Error creating applications table:', err);
    });
}

// Validation middleware
const validateApplication = [
    body('jobId').isInt().withMessage('Valid job ID is required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('resumeLink').isURL().withMessage('Valid resume link is required')
];

const validateStatusUpdate = [
    param('id').isInt().withMessage('Valid application ID is required'),
    body('status').isIn(['APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED']).withMessage('Invalid status')
];

// Helper function to check status transition validity
function isValidStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
        'APPLIED': ['SHORTLISTED', 'REJECTED'],
        'SHORTLISTED': ['SELECTED', 'REJECTED'],
        'SELECTED': [],
        'REJECTED': []
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
}

// ===== API ENDPOINTS =====

// 1. GET /api/jobs - List all active jobs
app.get('/api/jobs', (req, res) => {
    const query = 'SELECT * FROM jobs WHERE isActive = 1 ORDER BY createdAt DESC';
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching jobs:', err);
            return res.status(500).json({ 
                error: 'Failed to fetch jobs',
                message: err.message 
            });
        }
        res.json(rows);
    });
});

// 2. POST /api/applications - Submit a job application
app.post('/api/applications', validateApplication, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed',
            errors: errors.array() 
        });
    }

    const { jobId, name, email, resumeLink } = req.body;

    // First, check if job exists and is active
    db.get('SELECT * FROM jobs WHERE id = ? AND isActive = 1', [jobId], (err, job) => {
        if (err) {
            return res.status(500).json({ 
                error: 'Database error',
                message: err.message 
            });
        }
        
        if (!job) {
            return res.status(404).json({ 
                error: 'Job not found or inactive' 
            });
        }

        // Check if candidate exists, if not create
        db.get('SELECT * FROM candidates WHERE email = ?', [email], (err, candidate) => {
            if (err) {
                return res.status(500).json({ 
                    error: 'Database error',
                    message: err.message 
                });
            }

            const insertOrUpdateCandidate = (callback) => {
                if (candidate) {
                    // Update existing candidate
                    db.run(
                        'UPDATE candidates SET name = ?, resumeLink = ? WHERE id = ?',
                        [name, resumeLink, candidate.id],
                        (err) => {
                            if (err) return callback(err);
                            callback(null, candidate.id);
                        }
                    );
                } else {
                    // Insert new candidate
                    db.run(
                        'INSERT INTO candidates (name, email, resumeLink) VALUES (?, ?, ?)',
                        [name, email, resumeLink],
                        function(err) {
                            if (err) return callback(err);
                            callback(null, this.lastID);
                        }
                    );
                }
            };

            insertOrUpdateCandidate((err, candidateId) => {
                if (err) {
                    return res.status(500).json({ 
                        error: 'Failed to process candidate',
                        message: err.message 
                    });
                }

                // Check if application already exists
                db.get(
                    'SELECT * FROM applications WHERE jobId = ? AND candidateId = ?',
                    [jobId, candidateId],
                    (err, existingApplication) => {
                        if (err) {
                            return res.status(500).json({ 
                                error: 'Database error',
                                message: err.message 
                            });
                        }

                        if (existingApplication) {
                            return res.status(400).json({ 
                                error: 'Duplicate application',
                                message: 'You have already applied for this job',
                                applicationId: existingApplication.id
                            });
                        }

                        // Create new application
                        db.run(
                            'INSERT INTO applications (jobId, candidateId, status) VALUES (?, ?, ?)',
                            [jobId, candidateId, 'APPLIED'],
                            function(err) {
                                if (err) {
                                    return res.status(500).json({ 
                                        error: 'Failed to create application',
                                        message: err.message 
                                    });
                                }

                                res.status(201).json({
                                    message: 'Application submitted successfully',
                                    applicationId: this.lastID,
                                    status: 'APPLIED'
                                });
                            }
                        );
                    }
                );
            });
        });
    });
});

// 3. GET /api/applications/:id - Get application status
app.get('/api/applications/:id', (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT 
            a.id,
            a.status,
            a.appliedAt,
            c.name as candidateName,
            c.email,
            c.resumeLink,
            j.title as jobTitle,
            j.location as jobLocation
        FROM applications a
        JOIN candidates c ON a.candidateId = c.id
        JOIN jobs j ON a.jobId = j.id
        WHERE a.id = ?
    `;

    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ 
                error: 'Database error',
                message: err.message 
            });
        }

        if (!row) {
            return res.status(404).json({ 
                error: 'Application not found' 
            });
        }

        res.json(row);
    });
});

// 4. PATCH /api/applications/:id/status - Update application status
app.patch('/api/applications/:id/status', validateStatusUpdate, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed',
            errors: errors.array() 
        });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Get current application
    db.get('SELECT * FROM applications WHERE id = ?', [id], (err, application) => {
        if (err) {
            return res.status(500).json({ 
                error: 'Database error',
                message: err.message 
            });
        }

        if (!application) {
            return res.status(404).json({ 
                error: 'Application not found' 
            });
        }

        // Check if transition is valid
        if (!isValidStatusTransition(application.status, status)) {
            return res.status(400).json({ 
                error: 'Invalid status transition',
                message: `Cannot transition from ${application.status} to ${status}`,
                currentStatus: application.status,
                validTransitions: {
                    'APPLIED': ['SHORTLISTED', 'REJECTED'],
                    'SHORTLISTED': ['SELECTED', 'REJECTED'],
                    'SELECTED': [],
                    'REJECTED': []
                }[application.status]
            });
        }

        // Update status
        db.run(
            'UPDATE applications SET status = ? WHERE id = ?',
            [status, id],
            function(err) {
                if (err) {
                    return res.status(500).json({ 
                        error: 'Failed to update status',
                        message: err.message 
                    });
                }

                res.json({
                    message: 'Status updated successfully',
                    applicationId: id,
                    newStatus: status,
                    previousStatus: application.status
                });
            }
        );
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Job Application Management API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Job Application Management System API',
        version: '1.0.0',
        endpoints: {
            jobs: 'GET /api/jobs',
            apply: 'POST /api/applications',
            status: 'GET /api/applications/:id',
            updateStatus: 'PATCH /api/applications/:id/status',
            health: 'GET /api/health'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        path: req.path 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║  Job Application Management System API                    ║
║  Server running on http://localhost:${PORT}                  ║
║                                                           ║
║  Available Endpoints:                                     ║
║  - GET    /api/jobs                                       ║
║  - POST   /api/applications                               ║
║  - GET    /api/applications/:id                           ║
║  - PATCH  /api/applications/:id/status                    ║
║  - GET    /api/health                                     ║
╚═══════════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('\nDatabase connection closed');
        }
        process.exit(0);
    });
});

module.exports = app;