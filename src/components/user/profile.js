import React from "react";
import PwdModal from 'src/components/user/editPwd';
import ProfileModal from 'src/components/user/editProfile';

export default class Modal extends React.Component {

  state = {
    isProfileModalShowing: false,
    isPwdModalShowing: false
  }

  componentDidMount() {
    document.body.classList.add('modal-open');
  }

  componentWillUnmount() {
    document.body.classList.remove('modal-open');
  }

  showProfileModal = e => {
    e.stopPropagation();
    this.setState({
      isProfileModalShowing: !this.state.isProfileModalShowing
    });
  };

  showPwdModal = e => {
    e.stopPropagation();
    this.setState({
      isPwdModalShowing: !this.state.isPwdModalShowing
    });
  };

  render() {
    const { isProfileModalShowing, isPwdModalShowing } = this.state;
    return (
      <div>
        <div class="modal-backdrop fade show"></div>
        <div class="modal fade show d-block" id="profileModal" role="dialog" aria-labelledby="profileModalLabel" aria-hidden="true" onClick={this.props.close}>
          <div class="modal-dialog" role="document">
            <div class="modal-content">               
              <div>           
                <ul class="setting-elements">
                  <li onClick={this.showProfileModal}>Edit Profile</li>
                  <li onClick={this.showPwdModal}>Change Password</li>
                  <li>Notifications</li>
                  <li>Privacy and Security</li>
                  <li onClick={this.props.logout}>Log Out</li>
                  <li onClick={this.props.close}>Cancel</li>
                </ul>
              </div>             

              {isProfileModalShowing &&
                <ProfileModal
                  className="modal"              
                  close={this.showProfileModal} />
              }

              {isPwdModalShowing &&
                <PwdModal
                  className="modal"              
                  close={this.showPwdModal} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}