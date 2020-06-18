import React, { Component } from "react";
import MyButton from "../../util/MyButton";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Icons

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

import { connect } from "react-redux";
import { likeBark, unlikeBark } from "../../redux/actions/dataActions";

class LikeButton extends Component {
  likedBark = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find((like) => like.barkId === this.props.barkId)
    )
      return true;
    else return false;
  };

  likeBark = () => {
    this.props.likeBark(this.props.barkId);
  };

  unlikeBark = () => {
    this.props.unlikeBark(this.props.barkId);
  };

  render() {
    const { authenticated } = this.props.user;

    const likeButton = !authenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorder color="primary" />
        </MyButton>
      </Link>
    ) : this.likedBark() ? (
      <MyButton tip="Unlike" onClick={this.unlikeBark}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeBark}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );
    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  barkId: PropTypes.string.isRequired,
  likeBark: PropTypes.func.isRequired,
  unlikeBark: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeBark,
  unlikeBark,
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
