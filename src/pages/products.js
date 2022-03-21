import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

import { getAPIClient } from '../services/axios';

import Product from '../components/Product/Product';
import Pagination from '@mui/material/Pagination';
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

export default function Products({ data, page, limit }) {
  const classes = styles();

  const router = useRouter();

  useEffect(() => {
    function handleProducts() {

      if (!data) {
        alert('Ocorreu um erro tente novamente mais tarde');
      }
    }

    handleProducts();
  }, []);

  const pageNumClick = (page, limit) => {
    router.push({
      pathname: router.pathname,
      query: { limit: limit, page: page },
    });
  };

  const handleChange = (event, value) => {
    pageNumClick(value, limit);
  };

  const { products } = data;

  return (
    <div>
      <DrawerMenu />
      <main className={classes.content}>
        <Grid container justify="center" spacing={4}>
          {products.map((product) => (
            <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
              <Product product={product} />
            </Grid>
          ))}
        </Grid>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 15,
          }}
        >
          <Pagination count={limit} page={page} onChange={handleChange} />
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  const { ['next.token']: token } = parseCookies(ctx);

  const { query } = ctx;

  const page = query.page || 1;
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
    const { data } = await apiClient.get(`/storeProducts?page=${page}`);

    return {
      props: {
        data,
        page: Number(data.page),
        limit: Math.floor(data.totalItems / data.perPage) + 1,
      },
    };
  } catch (err) {
    error = true;
  }

  return {
    props: { error },
  };
};
