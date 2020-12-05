import React from 'react';
import { Link } from 'react-router-dom';

import Header from './header';
import { getImage } from 'src/helpers/images';

const renderModelsList = list => list.map(({ name, urlname, avatar, photos, videos }) => (
    <li key={name}>
        <div className={`preview preview-ready`}>
            <Link to={`/model/${urlname}`}>
                <img src={getImage(avatar, 'orig')} alt="image description" />
            </Link>
        </div>
        <div className="name">
            <Link to={`/model/${urlname}`}>{name}</Link>
        </div>
    </li>
));

const usersList = ({ list }) => (
    <div>
        <Header page='discover' />
        <main id="main">
            <div className="users-section">
                <div className="container d-flex align-items-start">
                    <ul className="users-list">
                        {renderModelsList(list)}
                    </ul>
                </div>
            </div>
        </main>
    </div>
);

export default usersList;
