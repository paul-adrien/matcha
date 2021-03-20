CREATE TABLE users
(
    id INT NOT NULL AUTO_INCREMENT,
    lastName VARCHAR(255) DEFAULT '' NOT NULL,
    firstName VARCHAR(255) DEFAULT '' NOT NULL,
    email VARCHAR(255) DEFAULT '' NOT NULL,
    password VARCHAR(255) DEFAULT '' NOT NULL,
    userName VARCHAR(255) DEFAULT '' NOT NULL,
    birthDate VARCHAR(255) DEFAULT '',
    gender INT(8) DEFAULT 1,
    showMe INT(8) DEFAULT 3,
    bio VARCHAR(510) DEFAULT '',
    nbLikes INT DEFAULT 0,
    nbViews INT DEFAULT 0,
    score INT DEFAULT 0,
    city VARCHAR(255) DEFAULT '',
    latitude FLOAT DEFAULT 0,
    longitude FLOAT DEFAULT 0,
    emailVerify varchar(255) DEFAULT '0',
    profileComplete varchar(255) DEFAULT '0',
    link VARCHAR(255) DEFAULT '',
    currentPosition varchar(255) DEFAULT "1",
    lastConnection VARCHAR(255) DEFAULT '',
    picture1 TEXT(32000) DEFAULT NULL,
    picture2 TEXT(32000) DEFAULT NULL,
    picture3 TEXT(32000) DEFAULT NULL,
    picture4 TEXT(32000) DEFAULT NULL,
    picture5 TEXT(32000) DEFAULT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE users
ADD lastConnection VARCHAR(255) DEFAULT '';

ALTER TABLE users
ADD currentPosition varchar(255) DEFAULT "1";

CREATE TABLE tag
(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
    
CREATE TABLE user_tag
(
    tag_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL
);

CREATE TABLE users_views
(
    viewed_id VARCHAR(255) NOT NULL,
    views_id VARCHAR(255) NOT NULL
);

ALTER TABLE users_views
ADD viewDate VARCHAR(255) NOT NULL;

CREATE TABLE users_like
(
    liked_id VARCHAR(255) NOT NULL, /*celui qui est liker*/
    like_id VARCHAR(255) NOT NULL /*celui qui like*/
);

ALTER TABLE users_like
ADD likeDate VARCHAR(255) NOT NULL;

CREATE TABLE matched
(
    id INT NOT NULL AUTO_INCREMENT,
    user_id1 VARCHAR(255) NOT NULL,
    user_id2 VARCHAR(255) NOT NULL,
    active INT DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE message
(
    id INT NOT NULL AUTO_INCREMENT,
    conv_id VARCHAR(255) NOT NULL,
    msg VARCHAR(512) NOT NULL,
    sender_id VARCHAR(255) NOT NULL,
    sendingDate VARCHAR(255) NOT NULL,
    see INT DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE notif
(
    sender_id VARCHAR(255) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL,
    see INT DEFAULT 0
);/*like = like, view = visite, msg = message, matched = like en retour d'un like, unMatched = matché plus like*/

CREATE TABLE blocked
(
    userId VARCHAR(255) NOT NULL,
    blockedId VARCHAR(255) NOT NULL
);

CREATE TABLE report
(
    userId VARCHAR(255) NOT NULL,
    reportId VARCHAR(255) NOT NULL
);
