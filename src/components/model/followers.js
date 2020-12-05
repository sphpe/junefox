import React from 'react';

import api from 'src/helpers/api';
import UsersList from '../usersList';

class Followers extends React.Component {

    state = {
        modelsUploadLimit: 50,
        modelsUploadOffset: 0,
        list: []
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        const { modelsUploadLimit ,modelsUploadOffset } = this.state;
        api("model/followers",{
            skip: modelsUploadOffset, 
            limit: modelsUploadLimit,
            modelId: params.id
          }).then((res) => {    
            res[0] && this.setState({ list: res[0].followers });
          })    
    }

    render() {
        return (
            <UsersList list={this.state.list} />
        )
    }
}

export default Followers;
