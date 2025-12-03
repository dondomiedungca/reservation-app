import { Card, Typography } from "@mui/material";
import React from "react";

const Page = () => {
  return (
    <Card style={{ margin: 25, padding: 20 }} elevation={2}>
      <Typography variant="body1" fontWeight={600}>
        This is About page
      </Typography>
      <Typography variant="caption">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Necessitatibus
        libero, aut sed odit similique excepturi vero asperiores aliquid ad in
        delectus, perspiciatis officia! Sapiente ipsum maiores animi omnis!
        Saepe, vel?
      </Typography>
    </Card>
  );
};

export default Page;
