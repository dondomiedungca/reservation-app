"use client";
import { createTheme, ThemeProvider as BaseThemeProvider } from "@mui/material";
import React, { ReactNode } from "react";

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const theme = createTheme({
    typography: { fontFamily: 'Montserrat, "Helvetica Neue", sans-serif' },
    palette: {
      primary: {
        main: "#3C467B",
      },
      secondary: {
        main: "#404040",
      },
    },
  });

  return <BaseThemeProvider theme={theme}>{children}</BaseThemeProvider>;
};

export default ThemeProvider;
