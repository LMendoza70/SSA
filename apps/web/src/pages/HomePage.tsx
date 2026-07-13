import { Container, Typography, Box } from '@mui/material';

export function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Jurisdicción Sanitaria de Huejutla
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Información oficial de salud pública
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Portal en construcción. Pronto encontrarás aquí información confiable
          sobre campañas, enfermedades, programas y servicios de salud.
        </Typography>
      </Box>
    </Container>
  );
}
