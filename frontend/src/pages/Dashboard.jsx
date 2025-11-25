import React, { useEffect, useState } from 'react';
import { 
    Container, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Chip, Button, Box, CircularProgress 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/requests/');
            setRequests(response.data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusChip = (status) => {
        const colors = {
            'PENDING': 'warning',
            'APPROVED_L1': 'info',
            'APPROVED_L2': 'success',
            'REJECTED': 'error'
        };
        return <Chip label={status.replace('_', ' ')} color={colors[status] || 'default'} size="small" />;
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    My Requests
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => navigate('/create')}
                >
                    New Request
                </Button>
            </Box>

            {/* Loading State */}
            {loading ? (
                <Box display="flex" justifyContent="center"><CircularProgress /></Box>
            ) : (
                /* Data Table */
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Title</strong></TableCell>
                                <TableCell><strong>Amount</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow key={req.id} hover>
                                    <TableCell>#{req.id}</TableCell>
                                    <TableCell>{req.title}</TableCell>
                                    <TableCell>{req.currency} {req.amount}</TableCell>
                                    <TableCell>{getStatusChip(req.status)}</TableCell>
                                    <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <Button size="small" onClick={() => navigate(`/requests/${req.id}`)}>
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {requests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No requests found. Create one to get started!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}