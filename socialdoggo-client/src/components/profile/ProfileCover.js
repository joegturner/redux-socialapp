import React, { Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import BarkIcon from "../../images/bark-icon.png";

// MUI imports
import MuiLink from "@material-ui/core/Link";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  ...theme.spreadThis,
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
    padding: 20,
    alignItems: "center",
  },
  barkIcon: {
    maxWidth: 40,
    margin: "0 100px 0 100px",
  },
});

const ProfileCover = (props) => {
  const { classes } = props;

  if (props.profile) {
    const {
      profile: { handle },
    } = props;
  }

  return (
    <Fragment>
      <Card className={classes.card}>
        <img src={BarkIcon} alt="DoggoIcon" className={classes.barkIcon} />
        {props.profile === null ? (
          <Typography variant="h4">loading Barks...</Typography>
        ) : (
          <Typography variant="h4" color="primary">
            {props.profile.handle}'s Barks!
          </Typography>
        )}
      </Card>
    </Fragment>
  );
};

export default withStyles(styles)(ProfileCover);
