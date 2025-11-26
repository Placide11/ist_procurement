import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Chip, Divider, Button, Grid, CircularProgress, Alert } from '@mui/material';
import api from '../api';

export default function RequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await api.get(`/requests/${id}/`);
                setRequest(response.data);
            } catch (err) {
                setError('Failed to load request.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleApprove = async () => {
        try {
            await api.patch(`/requests/${id}/approve/`);
            const response = await api.get(`/requests/${id}/`);
            setRequest(response.data);
        } catch (err) {
            alert("Approval failed");
        }
    };

    const handleReject = async () => {
        const reason = prompt("Please enter the reason for rejection:");
        if (!reason) return;

        try {
            await api.patch(`/requests/${id}/reject/`, { reason });
            const response = await api.get(`/requests/${id}/`);
            setRequest(response.data);
        } catch (err) {
            alert("Failed to reject request");
        }
    };

    if (loading) return <Container sx={{mt:5}}><CircularProgress /></Container>;
    if (error) return <Container sx={{mt:5}}><Alert severity="error">{error}</Alert></Container>;
    if (!request) return null;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Button onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>
                &larr; Back to Dashboard
            </Button>
            
            <Paper sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">Request #{request.id}</Typography>
                    <Chip 
                        label={request.status} 
                        color={request.status === 'PENDING' ? 'warning' : 'success'} 
                    />
                </Box>
                
                <Typography variant="h6" sx={{ mt: 2 }}>{request.title}</Typography>
                <Typography color="textSecondary" paragraph>{request.description}</Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2">Amount</Typography>
                        <Typography variant="h5">{request.currency} {request.amount}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2">Requester</Typography>
                        <Typography variant="body1">{request.requester_name || "Me"}</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, p: 2, bgcolor: '#033f7aff', borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">AI Extracted Data</Typography>
                    {request.extracted_data ? (
                        <pre style={{ overflowX: 'auto' }}>
                            {JSON.stringify(request.extracted_data, null, 2)}
                        </pre>
                    ) : (
                        <Typography variant="body2" color="textSecondary">No AI data extracted.</Typography>
                    )}
                </Box>

                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    
                    {request.status === 'PENDING' && (
                        <Button variant="contained" color="success" onClick={handleApprove}>
                            Approve Level 1 (Manager)
                        </Button>
                    )}

                    {request.status === 'APPROVED_L1' && (
                        <Button variant="contained" color="warning" onClick={handleApprove}>
                            Approve Level 2 (Director)
                        </Button>
                    )}

                    {request.status === 'APPROVED_L2' && request.purchase_order_file && (
                        <Button 
                            variant="contained" 
                            color="primary"
                            component="a" 
                            href={request.purchase_order_file} 
                            target="_blank"
                        >
                            Download Purchase Order
                        </Button>
                    )}

                    {(request.status === 'PENDING' || request.status === 'APPROVED_L1') && (
                        <Button variant="outlined" color="error" onClick={handleReject}>
                            Reject
                        </Button>
                    )}

                    {request.proforma_file && (
                        <Button 
                            variant="outlined" 
                            component="a" 
                            href={request.proforma_file} 
                            target="_blank"
                        >
                            View Proforma PDF
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}