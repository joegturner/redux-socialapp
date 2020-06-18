import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

import Bark from "../components/bark/Bark";
import Profile from "../components/profile/Profile";
import BarkSkeleton from "../util/BarkSkeleton";
import BarkIcon from "../images/bark-icon.png";

// Redux imports
import { connect } from "react-redux";
import { getBarks } from "../redux/actions/dataActions";

class home extends Component {
  componentDidMount() {
    this.props.getBarks();
  }
  render() {
    const { barks, loading } = this.props.data;
    let recentBarksMarkup = !loading ? (
      barks.map((bark) => <Bark key={bark.barkId} bark={bark} />)
    ) : (
      <BarkSkeleton />
    );

    return (
      <Grid container spacing={10}>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
        <Grid item sm={8} xs={12}>
          {recentBarksMarkup}
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getBarks: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getBarks })(home);
