import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import api from '../config/api';
import { validateName, validateAge } from '../utils/validation';

interface FamilyMember {
  _id: string;
  name: string;
  relationship: string;
  age?: number;
}

const Home = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    age: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      const response = await api.get('/family');
      // Ensure response.data is always an array
      const members = Array.isArray(response.data) ? response.data : [];
      setFamilyMembers(members);
    } catch {
      setError('Failed to load family members');
      // Set empty array on error to prevent map errors
      setFamilyMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (member?: FamilyMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        relationship: member.relationship,
        age: member.age?.toString() || '',
      });
    } else {
      setEditingMember(null);
      setFormData({ name: '', relationship: '', age: '' });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMember(null);
    setFormData({ name: '', relationship: '', age: '' });
    setError('');
  };

  const handleSubmit = async () => {
    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.valid) {
      setError(nameValidation.error || 'Invalid name');
      return;
    }

    if (!formData.relationship) {
      setError('Relationship is required');
      return;
    }

    // Validate age if provided
    if (formData.age) {
      const ageValidation = validateAge(formData.age);
      if (!ageValidation.valid) {
        setError(ageValidation.error || 'Invalid age');
        return;
      }
    }

    try {
      const payload = {
        name: formData.name.trim(),
        relationship: formData.relationship,
        ...(formData.age && { age: parseInt(formData.age, 10) }),
      };

      if (editingMember) {
        await api.put(`/family/${editingMember._id}`, payload);
      } else {
        await api.post('/family', payload);
      }

      handleCloseDialog();
      fetchFamilyMembers();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to save family member');
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || typeof id !== 'string') {
      setError('Invalid family member ID');
      return;
    }

    if (
      !window.confirm('Are you sure you want to delete this family member?')
    ) {
      return;
    }

    try {
      await api.delete(`/family/${id}`);
      fetchFamilyMembers();
    } catch {
      setError('Failed to delete family member. Please try again.');
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Family Management
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.name}
          </Typography>
          <IconButton
            color="inherit"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4" component="h1">
              Welcome, {user?.name}!
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Family Member
            </Button>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
            Your Profile
          </Typography>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="body1">
                <strong>Name:</strong> {user?.name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {user?.email}
              </Typography>
            </CardContent>
          </Card>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
            Family Members
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Typography>Loading...</Typography>
          ) : !Array.isArray(familyMembers) || familyMembers.length === 0 ? (
            <Typography color="text.secondary">
              No family members added yet. Click "Add Family Member" to get
              started.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {familyMembers.map(member => (
                <Grid item xs={12} sm={6} md={4} key={member._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{member.name}</Typography>
                      <Typography color="text.secondary">
                        {member.relationship}
                      </Typography>
                      {member.age && (
                        <Typography color="text.secondary">
                          Age: {member.age}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(member)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(member._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingMember ? 'Edit Family Member' : 'Add Family Member'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="Relationship"
            fullWidth
            variant="outlined"
            value={formData.relationship}
            onChange={e =>
              setFormData({ ...formData, relationship: e.target.value })
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="Spouse">Spouse</MenuItem>
            <MenuItem value="Child">Child</MenuItem>
            <MenuItem value="Parent">Parent</MenuItem>
            <MenuItem value="Sibling">Sibling</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Age (Optional)"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.age}
            onChange={e => {
              const value = e.target.value;
              // Only allow positive integers
              if (value === '' || /^\d+$/.test(value)) {
                setFormData({ ...formData, age: value });
              }
            }}
            inputProps={{
              min: 0,
              max: 150,
            }}
            helperText="Must be between 0 and 150"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingMember ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;
