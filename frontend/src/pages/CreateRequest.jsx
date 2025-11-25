import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function CreateRequest() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: '',
        currency: 'USD'
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('amount', formData.amount);
        data.append('currency', formData.currency);
        
        if (file) {
            data.append('proforma_file', file);
        } else {
            setError("Please upload a proforma invoice (PDF).");
            setLoading(false);
            return;
        }

        try {
            await api.post('/requests/', data);
            
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(JSON.stringify(err.response.data));
            } else {
                setError('Failed to create request. Check console for details.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    New Purchase Request
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    Upload your proforma invoice. Our AI will extract the details automatically.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Request Title"
                        margin="normal"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    
                    <TextField
                        fullWidth
                        label="Description"
                        margin="normal"
                        multiline
                        rows={3}
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />

                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <TextField
                            label="Amount"
                            type="number"
                            required
                            fullWidth
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        />
                        <TextField
                            label="Currency"
                            value={formData.currency}
                            onChange={(e) => setFormData({...formData, currency: e.target.value})}
                            sx={{ width: 100 }}
                        />
                    </Box>

                    {/* File Upload Area */}
                    <Box sx={{ mt: 3, mb: 3, border: '1px dashed #ccc', p: 2, textAlign: 'center' }}>
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload Proforma (PDF)
                            <input
                                type="file"
                                hidden
                                accept="application/pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </Button>
                        {file && (
                            <Typography variant="body2" sx={{ mt: 1, color: 'green' }}>
                                Selected: {file.name}
                            </Typography>
                        )}
                    </Box>

                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        size="large"
                        disabled={loading}
                    >
                        {loading ? 'Processing AI Extraction...' : 'Submit Request'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}