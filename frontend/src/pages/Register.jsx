import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Alert, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register/', { username, password });
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Username might be taken.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Create Account
                </Typography>
                {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal" required fullWidth label="Username"
                        value={username} onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal" required fullWidth label="Password" type="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign Up
                    </Button>
                    <Link component={RouterLink} to="/login" variant="body2">
                        {"Already have an account? Sign In"}
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}