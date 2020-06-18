import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Bark from "../components/bark/Bark";
import StaticProfile from "../components/profile/StaticProfile";
import BarkSkeleton from "../util/BarkSkeleton";
import ProfileSkeleton from "../util/ProfileSkeleton";
import ProfileCover from "../components/profile/ProfileCover";

// MUI imports
import Grid from "@material-ui/core/Grid";

// redux imports
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

export class user extends Component {
  state = {
    profile: null,
    barkIdParam: null,
  };

  componentDidMount() {
    const handle = this.props.match.params.handle;
    const barkId = this.props.match.params.barkId;

    if (barkId) this.setState({ barkIdParam: barkId });

    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({ profile: res.data.user });
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { barks, loading } = this.props.data;
    const { barkIdParam } = this.state;

    const barksMarkup = loading ? (
      <BarkSkeleton />
    ) : barks === null ? (
      <p>No barks from this user</p>
    ) : !barkIdParam ? (
      barks.map((bark) => <Bark key={bark.barkId} bark={bark} />)
    ) : (
      barks.map((bark) => {
        if (bark.barkId !== barkIdParam)
          return <Bark key={bark.barkId} bark={bark} />;
        else {
          console.log(bark.barkId);
          console.log(barkIdParam);
          return <Bark key={bark.barkId} bark={bark} openDialog />;
        }
      })
    );
    return (
      <Grid container spacing={10}>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
        <Grid item sm={8} xs={12}>
          <ProfileCover profile={this.state.profile} />
          {barksMarkup}
        </Grid>
      </Grid>
      // <Grid container spacing={10}>
      //   <Grid item sm={8} xs={12}>
      //     {barksMarkup}
      //   </Grid>
      //   <Grid item sm={4} xs={12}>
      //     {this.state.profile === null ? (
      //       <ProfileSkeleton />
      //     ) : (
      //       <StaticProfile profile={this.state.profile} />
      //     )}
      //   </Grid>
      // </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getUserData })(user);
