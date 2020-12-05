import React from 'react';
import { connect } from 'react-redux';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// import { AST_PrefixedTemplateString } from 'terser';

const renderChatList = () => (
    <div className={`tab-pane`} id="chatRoom" key="chatRoom">
        <div className="chat-body">
            <div className="scrollbar-macosx">
                <ul className="chat-list">
                    <li>
                        <div className="chat-bubble sent">
                            <span className="username"><a href="#">James Owen</a></span>
                            <span className="text">to what countries can I send wires from balance in payoneer?</span>
                            <span className="delivery-status">
                                <time dateTime="22:18" className="sent-time">22:18</time>
                            </span>
                        </div>
                        <div className="chat-bubble sent">
                            <span className="text">because otherwise I wire the extra money to my company and then wire, so its a delay, this would not hurt 	the payees and current payment plans</span>
                            <span className="delivery-status">
                                <time dateTime="22:18" className="sent-time">22:18</time>
                            </span>
                        </div>
                    </li>
                    <li>
                        <time dateTime="2018-03-29" className="date">3/29/2018</time>
                    </li>
                    <li>
                        <div className="tip-bubble bg-pink text-white">
                            <span className="text"><a href="#" className="user">Jonish</a> sent a tip of 2500 coins.</span>
                        </div>
                    </li>
                    <li>
                        <div className="chat-bubble sent">
                            <span className="username"><a href="#">James Owen</a></span>
                            <span className="text">hi Pearl</span>
                            <span className="delivery-status">
                                <time dateTime="22:18" className="sent-time">22:18</time>
                            </span>
                        </div>
                    </li>
                    <li>
                        <div className="chat-bubble received">
                            <span className="username"><a href="#">Taylor Alesia</a></span>
                            <span className="text">Please email client services they would know</span>
                            <span className="delivery-status">
                                <time dateTime="22:18" className="sent-time">22:18</time>
                            </span>
                        </div>
                    </li>
                    <li>
                        <div className="chat-bubble sent">
                            <span className="username"><a href="#">James Owen</a></span>
                            <span className="text">they told me to talk to you</span>
                            <span className="delivery-status">
                                <time dateTime="22:18" className="sent-time">22:18</time>
                            </span>
                        </div>
                    </li>
                    <li>
                        <div className="chat-bubble sent">
                            <span className="username"><a href="#">James Owen</a></span>
                            <span className="text">and I would feel better ifyou help :)</span>
                            <span className="delivery-status">
                                <time dateTime="22:18" className="sent-time">22:18</time>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div className="chat-footer">
        <span className="smiley">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path opacity=".45" fill="#263238" d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"></path></svg>
        </span>
        <div className="form-group">
            <textarea className="form-control" cols="30" rows="10" placeholder="Type a message"></textarea>
        </div>
        <span className="voice">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#263238" fillOpacity=".45" d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"></path></svg>
        </span>
    </div>
    </div>
);

class EventChat extends React.Component {
    render() {
        const { isPrivate } = this.props
        return (
            <div className="tab-content mt-auto" id="myTabContent">
                {!isPrivate ?
                    renderChatList()
                :
                    (<div className={`tab-pane fade ${isPrivate ? "show" : ""}`} id="privateChat"  key="privateChat">
                        <div className="chat-body">
                        <div className="scrollbar-macosx">
                            <ul className="chat-list">
                                <li>
                                    <div className="chat-bubble received">
                                        <span className="username"><a href="#">Taylor Alesia</a></span>
                                        <span className="text">Please email client services they would know</span>
                                        <span className="delivery-status">
                                            <time dateTime="22:18" className="sent-time">22:18</time>
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div className="chat-bubble sent">
                                        <span className="username"><a href="#">James Owen</a></span>
                                        <span className="text">they told me to talk to you</span>
                                        <span className="delivery-status">
                                            <time dateTime="22:18" className="sent-time">22:18</time>
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div className="chat-bubble sent">
                                        <span className="username"><a href="#">James Owen</a></span>
                                        <span className="text">and I would feel better ifyou help :)</span>
                                        <span className="delivery-status">
                                            <time dateTime="22:18" className="sent-time">22:18</time>
                                        </span>
                                    </div>

                                </li>
                                <li>
                                    <div className="chat-bubble sent">
                                        <span className="username"><a href="#">James Owen</a></span>
                                        <span className="text">to what countries can I send wires from balance in payoneer?</span>
                                        <span className="delivery-status">
                                            <time dateTime="22:18" className="sent-time">22:18</time>
                                        </span>
                                    </div>
                                    <div className="chat-bubble sent">
                                        <span className="text">because otherwise I wire the extra money to my company and then wire, so its a delay, this would not hurt 	the payees and current payment plans</span>
                                        <span className="delivery-status">
                                            <time dateTime="22:18" className="sent-time">22:18</time>
                                        </span>
                                    </div>

                                </li>
                                <li>
                                    <time dateTime="2018-03-29" className="date">3/29/2018</time>
                                </li>
                                <li>
                                    <div className="chat-bubble sent">
                                        <span className="username"><a href="#">James Owen</a></span>
                                        <span className="text">hi Pearl</span>
                                        <span className="delivery-status">
                                            <time dateTime="22:18" className="sent-time">22:18</time>
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                        <div className="chat-footer">
                            <span className="smiley">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path opacity=".45" fill="#263238" d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"></path></svg>
                            </span>
                            <div className="form-group">
                                <textarea className="form-control" cols="30" rows="10" placeholder="Type a message"></textarea>
                            </div>
                            <span className="voice">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#263238" fillOpacity=".45" d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"></path></svg>
                            </span>
                        </div>
                    </div>)
                }
            </div>
        )
    }
}

export default EventChat;
