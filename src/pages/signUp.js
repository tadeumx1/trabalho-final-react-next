import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AuthContext } from '../contexts/AuthContext';
import * as yup from 'yup';
import { parseCookies } from 'nookies';

const theme = createTheme();

export default function SignUp() {
  const { signUp } = useContext(AuthContext);

  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const signUpSchema = yup.object().shape({
    passwordConfirm: yup
      .string()
      .required('Digite a senha para confirmar')
      .min(5, 'A senha é muito curta - Deve ter no mínimo 5 caracteres'),
    password: yup
      .string()
      .required('Digite uma senha')
      .min(5, 'A senha é muito curta - Deve ter no mínimo 5 caracteres'),
    phone: yup
      .string()
      .matches(
        /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))/,
        {
          message: 'Por favor preencha um celular correto',
          excludeEmptyString: false,
        }
      ),
    email: yup
      .string()
      .email('Por favor preencha um Email corretamente')
      .required('Preencha um email'),
    lastName: yup
      .string()
      .required('Preencha o sobrenome')
      .min(4, 'O nome é muito curto - Deve ter no mínimo 4 caracteres'),
    nameUser: yup
      .string()
      .required('Preencha o nome')
      .min(3, 'O nome é muito curto - Deve ter no mínimo 3 caracteres'),
  });

  const validateInput = async (dataInput) => {
    try {
      const { password, passwordConfirm } = dataInput;

      await signUpSchema.validate(dataInput);

      if (password !== passwordConfirm) {
        setVisible(true);
        setErrorMessage('As senhas estão diferentes, digite a mesma senha');

        return false;
      }

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

    const nameUser = data.get('name');
    const lastName = data.get('lastName');
    const phone = data.get('phone');
    const email = data.get('email');
    const password = data.get('password');
    const passwordConfirm = data.get('passwordConfirm');

    const validate = await validateInput({
      nameUser,
      lastName,
      phone,
      email,
      password,
      passwordConfirm,
    });

    const name = nameUser + ' ' + lastName;

    try {
      if (validate) {
        await signUp({
          name,
          phone,
          email,
          password,
        });
      }
    } catch (err) {
      if (err.message === 'Validation failed') {
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
            Cadastro
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Nome"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Sobrenome"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Telefone"
                  name="phone"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="Confirme a senha"
                  type="password"
                  id="passwordConfirm"
                />
              </Grid>
            </Grid>
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
              Cadastrar
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  <a style={{ color: '#000' }}>
                    Já possui conta uma conta ? Entre aqui
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
