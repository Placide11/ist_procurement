import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton, Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
    const navigate = useNavigate();
    const username = "User";
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #334155' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}>
                        Procurement-To-Pay
                    </Typography>
                    {/* Desktop actions */}
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                        <Button color="error" onClick={handleLogout} sx={{ ml: 2 }}>Logout</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Container maxWidth="lg" sx={{ mt: 4, pb: 4, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                    {children}
                </Container>
            </Box>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ display: { md: 'none' } }}
            >
                <Box sx={{ width: 240 }} role="presentation" onClick={handleDrawerToggle}>
                    <List>
                        <ListItemButton onClick={() => navigate('/dashboard')}>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}