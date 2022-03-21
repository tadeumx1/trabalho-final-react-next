import React, { useEffect, useRef, useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import FavoriteIcon from '@mui/icons-material/Star';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { getAPIClient } from '../services/axios';
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';

import { parseCookies } from 'nookies';

import DrawerMenu from '../components/DrawerMenu';

import { makeStyles } from '@mui/styles';

const styles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    // maxWidth: 345
    // maxWidth: 345, original width style
    flex: 1,
    marginTop: '5vh',
    marginBottom: '5vh',
    maxWidth: '90vh',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    marginRight: '5%',
    marginLeft: '5%',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

export default function ProductDetail({ data }) {
  const classes = styles();

  const [map, setMap] = useState(null);
  const [productButtonText, setProductButtonText] = useState('');
  const [latitudeLongitude, setLatitudeLongitude] = useState(null);

  const [product, setProduct] = useState({});

  const mapNode = useRef(null);

  useEffect(() => {
    const node = mapNode.current;
    // Window object is not found, that means
    // the component is rendered on the server
    // or the dom node is not initialized, then return early
    if (typeof window === 'undefined' || node === null) return;

    // Otherwise, create a map instance
    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken:
        'pk.eyJ1IjoibWF0aGV1c3F1ZXJpbm8iLCJhIjoiY2wwdnEyeXc0MHhhZTNkbXU0anI3dGpjciJ9.87Lsz1MFWJxhz921AIrH9g',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-46.625, -23.533],
      zoom: 9,
    });

    function handleProduct() {
      if (!data) {
        alert('Ocorreu um erro tente novamente mais tarde');
      } else {
        const { product } = data;

        setProduct(product);
      }
    }

    // Save the map object to useState
    setMap(mapboxMap);

    const location = 'geolocation' in navigator;

    if (!location) {
      alert('Não foi possível obter a localização do usuário');
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setLatitudeLongitude({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });

    handleProduct();

    return () => {
      mapboxMap.remove();
    };
  }, []);

  useEffect(() => {
    if (product.stores) {
      product.stores.map((storeProduct) => {
        const longitude = parseFloat(storeProduct.longitude);
        const latitude = parseFloat(storeProduct.latitude);

        new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
      });
    }

    if (!product.favorite) {
      setProductButtonText('Marcar Favorito');
    } else {
      setProductButtonText('Remover Favorito');
    }
  }, [product]);

  useEffect(() => {
    if (latitudeLongitude) {
      const { latitude, longitude } = latitudeLongitude;

      const messageUser = new mapboxgl.Popup().setText(
        'Localização do usuário'
      );

      new mapboxgl.Marker({ color: '#808080' })
        .setLngLat([longitude, latitude])
        .setPopup(messageUser)
        .addTo(map);
    }
  }, [latitudeLongitude]);

  const handleGetUpdateProduct = async (productId) => {
    const apiClient = getAPIClient();

    try {
      const { data } = await apiClient.get(
        `/storeProducts/product/${productId}`
      );

      const { product } = data;

      setProduct(product);
    } catch (err) {
      alert('Ocorreu um erro ' + err);
    }
  };

  const handleProductFavorite = async () => {
    const apiClient = getAPIClient();

    const productId = product._id;

    const requestBody = {
      productID: productId,
    };

    try {
      await apiClient.post('/storeProducts/manageFavorite', requestBody);

      if (!product.favorite) {
        alert('O produto foi marcado como favorito');
      } else {
        alert('O produto foi desmarcado como favorito');
      }

      await handleGetUpdateProduct(productId);
    } catch (err) {
      alert('Ocorreu um erro ' + err);
    }
  };

  return (
    <div>
      <DrawerMenu />
      <main className={classes.content}>
        <Card className={classes.root}>
          <CardMedia
            className={classes.media}
            image={
              'https://www.pontofrio-imagens.com.br/tv-video/DVDeBluRayPlayers/DVDPlayer/3439272/244380798/dvd-player-lg-dp132-com-entrada-usb-3439272.jpg'
            }
            height={400}
            title={product.name}
          />
          <CardContent>
            <div className={classes.cardContent}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Typography gutterBottom variant="subtitle1" component="h3">
                  {product.name}
                </Typography>
                {product.favorite && <FavoriteIcon />}
              </div>
              <Typography gutterBottom component="h3">
                R$ {product.price}
              </Typography>
            </div>
            <Typography
              dangerouslySetInnerHTML={{ __html: 'Descrição Produto' }}
              variant="body2"
              color="textSecondary"
              component="p"
            />
            <Button
              style={{ marginTop: 30 }}
              variant="contained"
              onClick={handleProductFavorite}
            >
              {productButtonText}
            </Button>
            <div
              ref={mapNode}
              style={{
                marginTop: 10,
                marginBottom: 10,
                width: 500,
                height: 300,
              }}
            />
          </CardContent>
          <CardActions disableSpacing className={classes.cardActions}>
            <IconButton aria-label="Add to Cart" onClick={() => {}}>
              <AddShoppingCart />
            </IconButton>
          </CardActions>
        </Card>
      </main>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  const { ['next.token']: token } = parseCookies(ctx);

  const { query } = ctx;

  const productId = query.productId;
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
    const { data } = await apiClient.get(`/storeProducts/product/${productId}`);

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
