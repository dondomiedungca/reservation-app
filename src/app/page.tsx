import { Card, Typography } from "@mui/material";

export default function Home() {
  return (
    <Card style={{ margin: 25, padding: 20 }} elevation={2}>
      <Typography variant="body1" fontWeight={600}>
        This is Home page
      </Typography>
      <Typography variant="caption">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Necessitatibus
        libero, aut sed odit similique excepturi vero asperiores aliquid ad in
        delectus, perspiciatis officia! Sapiente ipsum maiores animi omnis!
        Saepe, vel?
      </Typography>
    </Card>
  );
}
