import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import Header from '../Header/Header';

export default function DrawerMenu() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleClose}
      onKeyDown={handleClose}
    >
      <List>
        <Link href="/products">
          <ListItem button>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary={'Produtos'} />
          </ListItem>
        </Link>
        <Link href="/productsFavorite">
          <ListItem button>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary={'Favoritos'} />
          </ListItem>
        </Link>
        <ListItem button>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary={'Sobre'} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div style={{ marginBottom: 10 }}>
      <Header handleDrawerOpen={handleOpen} />
      <Drawer open={open} onClose={handleClose}>
        {list()}
      </Drawer>
    </div>
  );
}
