import React, { useState } from 'react'
import { Menu, ListItemIcon, Typography, MenuItem } from '@material-ui/core'

const styles = {
  menu: {
    backgroundColor: '#ffffff', 
    color: 'rgb(236, 236, 236)',
    width: '280px'
  },

  icon: { 
    color: 'rgb(236, 236, 236)', 
    fontSize: '1.3rem' 
  },

  title: {
    color: '#d5dedf'
  },

  font: { 
    color: 'black', 
    fontSize: '1.15rem' 
  },
  currfont: { 
    color: 'black', 
    fontSize: '1.15rem',
    fontWeight: 'bold' 
  },
}

export function EpubMenu({
  trigger,
  anchorEl,
  setAnchorEl,
  value,
  handleItemClick,
  items=[],
}) {

  return (
    <>
    {trigger}
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      PaperProps={{style: styles.menu}}
    >
      {items.map( item => (
        <MenuItem
          key={item.text}
          aria-label={item.text}
          onClick={() => handleItemClick(item.value)}
        >
          {/* <ListItemIcon style={styles.icon}>
            <i className={item.icon}></i>
          </ListItemIcon> */}
          <Typography 
            style={item.value === value ? styles.currfont : styles.font}
          >
            {item.text}
          </Typography>
        </MenuItem>
      ))}
    </Menu>
    </>
  )
}