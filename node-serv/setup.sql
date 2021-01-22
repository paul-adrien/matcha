CREATE TABLE users
(
    id INT NOT NULL AUTO_INCREMENT,
    lastName VARCHAR(255) DEFAULT '' NOT NULL,
    firstName VARCHAR(255) DEFAULT '' NOT NULL,
    email VARCHAR(255) DEFAULT '' NOT NULL,
    password VARCHAR(255) DEFAULT '' NOT NULL,
    userName VARCHAR(255) DEFAULT '' NOT NULL,
    birthDate VARCHAR(255) DEFAULT '',
    gender INT(8),
    showMe INT (8),
    bio VARCHAR(510) DEFAULT '',
    nbLikes INT,
    city VARCHAR(255) DEFAULT '',
    latitude VARCHAR(255) DEFAULT '',
    longitude VARCHAR(255) DEFAULT '',
    emailVerify BOOLEAN,
    profileComplete BOOLEAN,
    link VARCHAR(255) DEFAULT '',
    PRIMARY KEY (id)
);

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