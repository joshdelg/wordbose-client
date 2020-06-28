import React from "react";
import { Typography, Breadcrumbs, Link, makeStyles} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles({
  breadcrumbs: {
    margin: "0.5em 0"
  }
});

function CustomBreadcrumbs(props) {

  const classes = useStyles();

  return (
    <Breadcrumbs className={classes.breadcrumbs}>
      {
        props.steps.map((step, index) => (
          <Link key={index} color="inherit" component={RouterLink} to={step.url}>{step.text}</Link>
        ))
        
      }
      <Typography color="primary">{props.final}</Typography>
    </Breadcrumbs>
  );
}

export default CustomBreadcrumbs;