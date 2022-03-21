import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import FavoriteIcon from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';

import useStyles from './styles';

const Product = ({ product }) => {
  const classes = useStyles();

  const router = useRouter();

  const handleOpenProductDetail = () => {
    router.push({
      pathname: '/productDetail',
      query: { productId: product._id },
    });
  };

  const handleAddToCart = () => {
    // console.log('Clicou em adicionar no carrinho');
  };

  return (
    <Card onClick={handleOpenProductDetail} className={classes.root}>
      <CardActionArea disableRipple={true} disableTouchRipple={true}>
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
                {product.name.length > 30
                  ? `${product.name.substring(0, 30)} ...`
                  : product.name}
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
        </CardContent>
        <CardActions disableSpacing className={classes.cardActions}>
          <IconButton aria-label="Add to Cart" onClick={handleAddToCart}>
            <AddShoppingCart />
          </IconButton>
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

export default Product;
