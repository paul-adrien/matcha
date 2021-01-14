CREATE TABLE users
(
    id INT NOT NULL AUTO_INCREMENT,
    nom VARCHAR(255) DEFAULT '' NOT NULL,
    prenom VARCHAR(255) DEFAULT '' NOT NULL,
    email VARCHAR(255) DEFAULT '' NOT NULL,
    mdp VARCHAR(255) DEFAULT '' NOT NULL,
    userName VARCHAR(255) DEFAULT '' NOT NULL,
    date_naissance VARCHAR(255) DEFAULT '',
    genre INT(8),
    ori_sex INT (8),
    bio VARCHAR(510) DEFAULT '',
    score INT,
    ville VARCHAR(255) DEFAULT '',
    latitude VARCHAR(255) DEFAULT '',
    longitude VARCHAR(255) DEFAULT '',
    PRIMARY KEY (id)
);

CREATE TABLE tag
(
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
    
CREATE TABLE user_tag
(
    tag_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL
);