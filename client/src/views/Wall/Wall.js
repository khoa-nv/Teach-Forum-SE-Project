import React, { Component } from 'react';
import axios from 'axios/instance';
import 'react-notifications-component/dist/theme.css';
import { getUser, isLogin } from 'utils/session';
import history from 'utils/history';

import NavBar from '../../components/NavBar';
import Header from './viewComponent/Header';
import ReactNotification from 'react-notifications-component';
import MainSection from './viewComponent/MainSection';

class Wall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: sessionStorage.user ? true : false,
      permission: 'view',
      userId: null,
    };
    // Have to be the same name with fetchPosts in room
    window.fetchPosts = this.fetchProfile.bind(this);
  }
  componentDidMount() {
    this.fetchProfile();
    history.listen(location => {
      if (location.pathname.startsWith('/wall')) {
        // Reset data before refetching
        this.setState({ data: null });
        this.fetchProfile();
      }
    });
  }

  fetchProfile = () => {
    let queryID = window.location.pathname.split('/')[2];
    if (!queryID || (isLogin() && queryID == getUser()._id)) {
      this.setState({
        permission: 'edit',
      });
    }

    if (!queryID && isLogin()) {
      queryID = getUser()._id;
    }

    this.setState({
      userId: queryID,
      data: null,
    });
    axios
      .get(`/profile/${queryID}`)
      .then(response => {
        let res = response.data.user;
        console.log(response)
        this.setState({
          data: {
            avatar: res.avatar,
            createOn: res.created_at,
            displayName: res.display_name,
            status: res.status,
            job: response.data.user.profile?.overview.job,
            posts: res.posts,
          },
        });
      })
      .catch(err => history.push('/404', { errorCode: 404 }));
  };

  render() {
    return (
      <div>
        <ReactNotification />
        <NavBar isLogin={state => this.setState({ isLogin: state })} />
        <Header
          data={this.state.data ? this.state.data : null}
          permission={this.state.permission}
        />

        <MainSection
          permission={this.state.permission}
          userId={this.state.userId}
          userPosts={this.state.data ? this.state.data.posts : null}
        />
      </div>
    );
  }
}

export default Wall;
