import React from 'react';

import api from 'src/helpers/api';
import UsersList from '../usersList';

class Followings extends React.Component {

    state = {
        modelsUploadLimit: 50,
        modelsUploadOffset: 0,
        list: []
    }

    componentDidMount() {
        const { modelsUploadLimit ,modelsUploadOffset } = this.state;
        api("user/followings",{
            skip: modelsUploadOffset, 
            limit: modelsUploadLimit
          }).then((res) => {
            res[0] && this.setState({ list: res[0].followings });
          })    
    }

    render() {
        return (
            <UsersList list={this.state.list} />
        )
    }
}

export default Followings;
