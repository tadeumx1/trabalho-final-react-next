import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { parseCookies } from 'nookies';

import { getAPIClient } from '../services/axios';

import Product from '../components/Product/Product';
import DrawerMenu from '../components/DrawerMenu';

import { makeStyles } from '@mui/styles';

const styles = makeStyles((theme) => ({
  // toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    marginTop: 15,
    padding: 20,
  },
  root: {
    flexGrow: 1,
  },
}));

export default function ProductsFavorite({ data }) {
  const classes = styles();

  const { products } = data;

  useEffect(() => {
    function handleProducts() {

      if (!data) {
        alert('Ocorreu um erro tente novamente mais tarde');
      }
    }

    handleProducts();
  }, []);

  return (
    <div>
      <DrawerMenu />
      <main className={classes.content}>
        <h3>Favoritos</h3>
        <Grid container justify="center" spacing={4}>
          {products.map((product) => (
            <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
              <Product product={product} />
            </Grid>
          ))}
        </Grid>
      </main>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  const { ['next.token']: token } = parseCookies(ctx);

  let error = false;

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    const { data } = await apiClient.get(`/storeProducts/getFavProducts`);

    return {
      props: {
        data,
      },
    };
  } catch (err) {
    error = true;
  }

  return {
    props: { error },
  };
};
