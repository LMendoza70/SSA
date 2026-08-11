import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { useMediaResources } from '../../hooks/useMediaResources';

interface MediaSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (ids: string[]) => void;
  selectedIds?: string[];
}

export function MediaSelector({ open, onClose, onSelect, selectedIds = [] }: MediaSelectorProps) {
  const { data } = useMediaResources({ limit: 100 });
  const [selected, setSelected] = useState<string[]>(selectedIds);

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Seleccionar recursos multimedia</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {(data?.data || []).map((item: any) => {
            const isSelected = selected.includes(item.id);
            const isImage = item.type === 'IMAGE' || item.type === 'INFOGRAPHIC';
            return (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.id}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    borderColor: isSelected ? 'primary.main' : undefined,
                    borderWidth: isSelected ? 2 : 1,
                    opacity: item.isActive ? 1 : 0.5,
                  }}
                  onClick={() => handleToggle(item.id)}
                >
                  {isImage && item.url ? (
                    <CardMedia
                      component="img"
                      height="100"
                      image={item.url}
                      alt={item.altText || item.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'action.hover',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {item.type}
                      </Typography>
                    </Box>
                  )}
                  <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                    <Typography variant="caption" noWrap>
                      {item.title}
                    </Typography>
                    {item.mimeType && (
                      <Chip label={item.mimeType} size="small" variant="outlined" sx={{ mt: 0.5, height: 18, '& .MuiChip-label': { fontSize: 10 } }} />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
          {(data?.data || []).length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No hay recursos multimedia disponibles. Sube recursos desde el gestor multimedia.
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleConfirm}>
          Asociar ({selected.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
}
