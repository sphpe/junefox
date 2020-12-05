import React from 'react';
import { connect } from 'react-redux';

import api from 'src/helpers/api';

import Header from '../header';
import EventChat from '../eventChat';
import Footer from '../footer';
import BuyTokens from './modal/buyTokens';

class eventPreview extends React.Component {

    state = {
        privateChat: false,
        showContacts: false,
        showBuyTokens: false
    }

    componentDidMount() {
        this.loadProfile()
        this.loadMessages()
    }

    loadProfile() {
        const { match: { params: { id } }, modelProfileActions } = this.props
        api("model/modelByEvent",{
          id,
          skip: 0, 
          limit: 20
        }).then((res) => {
          modelProfileActions({ data: res, type: "model-profile-loaded" });
        })
    }

    loadMessages = () => {
        const { match: { params: { id } }, modelProfileActions } = this.props
        api("model/chat",{
            id,
            skip: 0, 
            limit: 20
          }).then((res) => {    
            console.log("model/chat", id , res);
            modelProfileActions({ data: res, type: "event-chat-loaded" });
          }) 
    }

    toggleState = (prop) => this.setState(prevState => ({ [prop]: !prevState[prop] }))

    handleSubmit = e => {
        e.preventDefault();
        const amount = e.target.amount.value;
        const {
            model: { urlname: modelUrl },
            match: { params: { id: eventId } } 
        } = this.props;
        api('user/tipModel', {
            amount,
            modelUrl,
            eventId
        }).then((res) => {
            if( res.error && res.error.message === 'Not enough tokens.') {
                this.toggleState('showBuyTokens')
            }
        }).catch(e => console.log(e))
    }

    render() {
        const { model: profile, model: { urlname: id } } = this.props;
        const { privateChat, showContacts, showBuyTokens } = this.state;
        return (
            <div>
                <Header page='model' id={id} />
                <main id="main">
                    <div className="banner">
                        <div className="video-block d-flex flex-column">
                            <span className="video-title text-center">Today I will start stripping slowly and get joggling.</span>
                            <div className="d-flex video-wrap">
                                <div className="video-sidebar-scroll scrollbar-macosx">
                                    <div className="video-sidebar">
                                        <div className="user">
                                            <span className="avatar">
                                                <a href="#"><img src="images/img17.jpg" alt="image description" /></a>
                                            </span>
                                            <span className="name"><a href="#">{model.name} 24</a></span>
                                            <span className="address">{model.address.country}</span>
                                            <span className="token-rec">184</span>
                                        </div>
                                        <div className="goal-section">
                                            <span className="statement">Have fun with me :)</span>
                                            <div className="goal-block">
                                                <svg className="circles" height="140" preserveAspectRatio="none" viewBox="0 0 140 140" width="140" xmlns="http://www.w3.org/2000/svg">
                                                    <circle className="background-circle" cx="70" cy="70" fill="none" r="60" strokeDasharray="376.99111843077515" />
                                                    <circle className="foreground-circle" cx="70" cy="70" fill="none" r="60" strokeDasharray="376.99111843077515" strokeDashoffset="275.20351645446584" />
                                                </svg>
                                                <div className="goal-data">
                                                    <span className="rem-token">620</span>
                                                    <span className="rem-text">remaining of</span>
                                                    <span className="total-token">850 <span className="unit">tks</span></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="token-remaining text-center">
                                            <span className="title">Tokens Remaining</span>
                                            <span className="amount">0</span>
                                            <a href="#" className="btn btn-pink">Buy Tokens</a>
                                        </div>
                                        <div className="live-users">
                                            <span className="title">Live users:</span>
                                            <span className="data">1200</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="live-video-holder">
                                    <iframe width="560" height="315" src="https://www.youtube.com/embed/668nUCeBHyY?rel=0&amp;showinfo=0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                                </div>
                            </div>
                            <div className="bottom-bar">
                                <div className="high-tip text-center">
                                    <div className="name">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div className="avatar"><a href="#"><img src="images/img18.jpg" alt="image description" /></a></div>
                                            <span className="name-title">King Tipper:</span>
                                        </div>
                                        <span className="d-block">Roolmarcus: 2500</span>
                                    </div>
                                </div>
                                <div className="high-tip pb-0 text-center">
                                    <div className="name">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div className="avatar"><a href="#"><img src="images/img19.jpg" alt="image description" /></a></div>
                                            <span className="name-title">Last Tipper:</span>
                                        </div>
                                        <span className="d-block">Johnish: 2500</span>
                                    </div>
                                </div>
                                <div className="bottom-bar-holder">
                                    <div className="tip-stat">
                                        <ul className="stat-list">
                                            <li>
                                                <span className="title">Live for:</span>
                                                <span className="value">23mins, 30secs</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="action-list">
                                        <div className="input-group">
                                            <form onSubmit={this.handleSubmit}>
                                                <input type="text" name="amount" className="form-control" defaultValue="150" aria-label="Recipient's username" />
                                                <div className="input-group-append">
                                                    <button className="btn btn-danger bg-pink" id="tipBtn">Send Tip</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="chat-block event-chat">
                            <div className="chat-bg" />
                            <div className="chat-header">
                                <div className="d-flex justify-content-between align-items-end">
                                    <ul className="tab-list nav" id="myTab" role="tablist">
                                        <li
                                            className={!privateChat ? "active show" : ""}
                                            id="chatRoom-tab"
                                            onClick={() => this.toggleState('privateChat')}
                                        >
                                            Chat Room
                                        </li>
                                        <li
                                            className={`nav-link ${privateChat ? "active show" : ""}`}
                                            id="privateChat-tab"
                                            onClick={() => this.toggleState('privateChat')}
                                        >
                                            Private Chat
                                        </li>
                                    </ul>
                                    <button
                                        className="btn-contact contact-opener"
                                        onClick={() => this.toggleState('showContacts')}
                                    >
                                        Contacts
                                    </button>
                                </div>
                            </div>
                            {showContacts && (<div className="contact-list scrollbar-macosx">
                                <ul>
                                    <li className="unread">
                                        <a href="#">
                                            <div className="avatar">
                                                <img src="images/img15.jpg" alt="image description" />
                                                <span className="status online">online</span>
                                            </div>
                                            <div className="contact-info">
                                                <span className="counter">4</span>
                                                <span className="name">Brittany Jordan</span>
                                                <span className="last-msg"><span className="msg">Brittany sent a photo.</span><time dateTime="19:29" className="sent-time">19:29</time></span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="avatar">
                                                <img src="images/img19.jpg" alt="image description" />
                                            </div>
                                            <div className="contact-info">
                                                <span className="name">John Wayne</span>
                                                <span className="last-msg"><span className="msg">You: morning baby.</span><time dateTime="19:29" className="sent-time">19:29</time></span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="avatar">
                                                <img src="images/img13.jpg" alt="image description" />
                                                <span className="status offline">online</span>
                                            </div>
                                            <div className="contact-info">
                                                <span className="name">Anne Brown</span>
                                                <span className="last-msg"><span className="msg">How are you today?</span><span className="sent-time">Mon</span></span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="avatar">
                                                <img src="images/img16.jpg" alt="image description" />
                                            </div>
                                            <div className="contact-info">
                                                <span className="name">Dorothy Angel</span>
                                                <span className="last-msg"><span className="msg">I forgot to mention that there was</span><span className="sent-time">Sat</span></span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="avatar">
                                                <img src="images/img17.jpg" alt="image description" />
                                                <span className="status online">online</span>
                                            </div>
                                            <div className="contact-info">
                                                <span className="name">Beatrice Johnson</span>
                                                <span className="last-msg"><span className="msg">Kiss you</span><time dateTime="02-16" className="sent-time">16 Feb</time></span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="avatar">
                                                <img src="images/img18.jpg" alt="image description" />
                                            </div>
                                            <div className="contact-info">
                                                <span className="name">Chris Tyson</span>
                                                <span className="last-msg"><span className="msg">I am leaving. Byee</span><time dateTime="02-09" className="sent-time">9 Feb</time></span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="avatar">
                                                <img src="images/img17.jpg" alt="image description" />
                                                <span className="status online">online</span>
                                            </div>
                                            <div className="contact-info">
                                                <span className="name">Beatrice Johnson</span>
                                                <span className="last-msg"><span className="msg">Kiss you</span><time dateTime="02-16" className="sent-time">16 Feb</time></span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="avatar">
                                                <img src="images/img18.jpg" alt="image description" />
                                            </div>
                                            <div className="contact-info">
                                                <span className="name">Chris Tyson</span>
                                                <span className="last-msg"><span className="msg">I am leaving. Byee</span><time dateTime="02-09" className="sent-time">9 Feb</time></span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="avatar">
                                                <img src="images/img17.jpg" alt="image description" />
                                                <span className="status online">online</span>
                                            </div>
                                            <div className="contact-info">
                                                <span className="name">Beatrice Johnson</span>
                                                <span className="last-msg"><span className="msg">Kiss you</span><time dateTime="02-16" className="sent-time">16 Feb</time></span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="avatar">
                                                <img src="images/img18.jpg" alt="image description" />
                                            </div>
                                            <div className="contact-info">
                                                <span className="name">Chris Tyson</span>
                                                <span className="last-msg"><span className="msg">I am leaving. Byee</span><time dateTime="02-09" className="sent-time">9 Feb</time></span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="avatar">
                                                <img src="images/img17.jpg" alt="image description" />
                                                <span className="status online">online</span>
                                            </div>
                                            <div className="contact-info">
                                                <span className="name">Beatrice Johnson</span>
                                                <span className="last-msg"><span className="msg">Kiss you</span><time dateTime="02-16" className="sent-time">16 Feb</time></span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div className="avatar">
                                                <img src="images/img18.jpg" alt="image description" />
                                            </div>
                                            <div className="contact-info">
                                                <span className="name">Chris Tyson</span>
                                                <span className="last-msg"><span className="msg">I am leaving. Byee</span><time dateTime="02-09" className="sent-time">9 Feb</time></span>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>)}
                            <EventChat isPrivate={privateChat} />
                        </div>
                    </div>
                    <div className="content-block">
                        <div className="container">
                            <div className="bio-block">
                                <div className="d-flex align-items-center bio-holder">
                                    <div className="profile-picture">
                                        <a href="#"><img className="img-fluid" src="images/profile-picture.jpg" alt="image description" /></a>
                                    </div>
                                    <div className="follow-holder">
                                        <div className="bio-header d-none d-lg-flex align-items-lg-center">
                                            <h2>tayloralesia <span className="verified"><i className="icon-star"></i></span></h2>
                                            <a href="#" className="btn btn-secondary">Following</a>
                                            <span className="price">$ 9.97</span>
                                        </div>
                                        <ul className="follow-info">
                                            <li>
                                                <span className="number">259</span>
                                                <span className="text">posts</span>
                                            </li>
                                            <li>
                                                <span className="number">2.1m</span>
                                                <span className="text">followers</span>
                                            </li>
                                            <li>
                                                <span className="number">40</span>
                                                <span className="text">following</span>
                                            </li>
                                        </ul>
                                        <div className="action-field d-lg-none">
                                            <a href="#" className="btn btn-secondary">Following</a>
                                        </div>
                                        <p className="d-none d-lg-block"><span className="name">Taylor Alesia</span> trying to uncover the secret chik fil a sauce formula so i can rule the world</p>
                                        <ul className="button-list d-none d-lg-flex">
                                            <li><a href="timeline.html" className="btn btn-secondary">line</a></li>
                                            <li><a href="#" className="btn btn-secondary">photo</a></li>
                                            <li><a href="#" className="btn btn-secondary">video</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bio-header d-lg-none">
                                    <h2>Taylor Alesia <span className="verified"><i className="icon-star"></i></span></h2>
                                    <p>trying to uncover the secret chik fil a sauce formula so i can rule the world</p>
                                </div>
                            </div>
                            <div className="gallery-block">
                                <nav className="gallery-menu d-lg-none">
                                    <ul>
                                        <li><a href="#">line <i className="icon-add" /></a></li>
                                        <li><a href="#">photo</a></li>
                                        <li><a href="#">video</a></li>
                                        <li><a href="#">go live <span className="online" /></a></li>
                                    </ul>
                                </nav>
                                <ul className="gallery-list">
                                    <li><a href="images/img4.jpg" data-fancybox="lightbox"><img className="img-fluid" src="images/thumb4.jpg" alt="image description" />></a></li>
                                    <li className="secret"><a href="images/img5.jpg" data-fancybox="lightbox"><img className="img-fluid" src="images/thumb5.jpg" alt="image description" /></a></li>
                                    <li><a href="images/img1.jpg" data-fancybox="lightbox"><img className="img-fluid" src="images/thumb1.jpg" alt="image description" /></a></li>
                                    <li><a href="images/img3.jpg" data-fancybox="lightbox"><img className="img-fluid" src="images/thumb3.jpg" alt="image description" /></a></li>
                                    <li><a href="images/img6.jpg" data-fancybox="lightbox"><img className="img-fluid" src="images/thumb6.jpg" alt="image description" /></a></li>
                                    <li><a href="images/img7.jpg" data-fancybox="lightbox"><img className="img-fluid" src="images/thumb7.jpg" alt="image description" /></a></li>
                                    <li><a href="images/img3.jpg" data-fancybox="lightbox"><img className="img-fluid" src="images/thumb3.jpg" alt="image description" /></a></li>
                                    <li><a href="images/img8.jpg" data-fancybox="lightbox"><img className="img-fluid" src="images/thumb8.jpg" alt="image description" /></a></li>
                                    <li><a href="images/img2.jpg" data-fancybox="lightbox"><img className="img-fluid" src="images/thumb2.jpg" alt="image description" /></a></li>
                                    <li><a href="images/img9.jpg" data-fancybox="lightbox"><img className="img-fluid" src="images/thumb9.jpg" alt="image description" /></a></li>
                                    <li><a href="images/img10.jpg" data-fancybox="lightbox"><img className="img-fluid" src="images/thumb10.jpg" alt="image description" /></a></li>
                                    <li><a href="images/img1.jpg" data-fancybox="lightbox"><img className="img-fluid" src="images/thumb1.jpg" alt="image description" /></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
                {
                    showBuyTokens && 
                        <BuyTokens
                            title="You are out of tokens, please choose amount you want to buy!"
                            close={() => this.toggleState('showBuyTokens')}
                            match={this.props.match}
                        />
                }
            </div>
        )
    }

}

export default connect(
    ({ currentModel, userData }) =>({
        model: currentModel.profile,
        userData
    }), { modelProfileActions: ({ data, type }) => ({ type, data }) }
)(eventPreview);