"use client";

import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import styled from "styled-components";

const drawerWidth = 240;
const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Reservation", to: "/reservation" },
] as const;

const StyledButton = styled(Button)`
  color: #fff;
  text-transform: capitalize;
  margin-left: 10px;

  &.mobile {
    color: #3c467b;
    margin-left: 0;
  }

  &.active {
    background: #3c467b;
  }
`;

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ display: "flex", marginBottom: 10 }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ background: "#636CCB" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Reservation App
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item, i) => (
              <Link href={item.to} key={i}>
                <StyledButton
                  className={
                    pathname.substring(1).toLowerCase() ===
                    item.label.toLowerCase()
                      ? "active"
                      : ""
                  }
                >
                  {item.label}
                </StyledButton>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ my: 2 }}>
              Reservation App
            </Typography>
            <Divider />
            <List>
              {navItems.map((item, i) => (
                <ListItem key={i} disablePadding>
                  <Link href={item.to}>
                    <StyledButton
                      className={
                        pathname.substring(1).toLowerCase() ===
                        item.label.toLowerCase()
                          ? "active"
                          : "mobile"
                      }
                    >
                      {item.label}
                    </StyledButton>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </nav>
    </Box>
  );
};

export default Header;
