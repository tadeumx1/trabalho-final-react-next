import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import Box from '@mui/material/Box';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { AuthContext } from '../contexts/AuthContext';
import * as yup from 'yup';
import { parseCookies } from 'nookies';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function Login() {
  const { signIn } = useContext(AuthContext);

  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const signInSchema = yup.object().shape({
    email: yup
      .string()
      .email('Por favor preencha um Email corretamente')
      .required('Preencha um email'),
    password: yup
      .string()
      .required('Digite uma senha')
      .min(5, 'A senha é muito curta - Deve ter no mínimo 5 caracteres'),
  });

  const validateInput = async ({ email, password }) => {
    try {
      await signInSchema.validate({ email, password });
      setVisible(false);

      return true;
    } catch (err) {
      if (err.name == 'ValidationError') {
        const error = err.errors[0];
        setVisible(true);
        setErrorMessage(error);
      } else {
        alert('Ocorreu um erro na validação dos campos, tente novamente');
      }

      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email');
    const password = data.get('password');

    const validate = await validateInput({ email, password });

    try {
      if (validate) {
        await signIn({ email, password });
      }
    } catch (err) {
      if (err.message === 'User Not Found') {
        setVisible(true);
        setErrorMessage('Usuário não encontrado');
      } else if (err.message === 'Validation failed') {
        setVisible(true);
        setErrorMessage('Preencha os campos corretamente');
      } else {
        alert('Erro ao fazer login tente novamente mais tarde');
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <LockOutlinedIcon />
          <Typography
            style={{ marginTop: 10, marginBottom: 10 }}
            component="h1"
            variant="h5"
          >
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {visible && (
              <Alert style={{ marginTop: 30 }} severity="error">
                <AlertTitle>Erro</AlertTitle>
                {errorMessage}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signUp">
                  <a style={{ color: '#000' }}>
                    {'Não tem uma conta ? Faça seu cadastro'}
                  </a>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  const { ['next.token']: token } = parseCookies(ctx);

  if (token) {
    return {
      redirect: {
        destination: '/products',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
