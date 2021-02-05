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
    score INT DEFAULT 0,
    city VARCHAR(255) DEFAULT '',
    latitude FLOAT DEFAULT 0,
    longitude FLOAT DEFAULT 0,
    emailVerify varchar(255) DEFAULT '0',
    profileComplete varchar(255) DEFAULT '0',
    link VARCHAR(255) DEFAULT '',
    picture1 TEXT(32000) DEFAULT NULL,
    picture2 TEXT(32000) DEFAULT NULL,
    picture3 TEXT(32000) DEFAULT NULL,
    picture4 TEXT(32000) DEFAULT NULL,
    picture5 TEXT(32000) DEFAULT NULL,
    picture6 TEXT(32000) DEFAULT NULL,
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

CREATE TABLE users_views
(
    viewed_id VARCHAR(255) NOT NULL,
    views_id VARCHAR(255) NOT NULL
);

CREATE TABLE users_like
(
    liked_id VARCHAR(255) NOT NULL, /*celui qui est liker*/
    like_id VARCHAR(255) NOT NULL /*celui qui like*/
);

INSERT INTO `users` (`lastName`,`firstName`,`email`,`password`,`userName`,`birthDate`,`gender`,`showMe`,`bio`,`nbLikes`,`city`,`latitude`,`longitude`,`emailVerify`,`profileComplete`,`link`,`score`) VALUES ("Harrell","Alvin","non@Namnulla.org","VAT94TRF6EM","Cochran","1942-06-15",2,1,"enim","0","Dhule","-7.22976","-130.62819","1","1","0",33),("Hale","August","amet@quamPellentesquehabitant.edu","QGB03RRJ0UH","Odonnell","1904-11-15",1,2,"eleifend egestas. Sed pharetra, felis","0","Bulzi","-53.87143","-99.31896","1","1","0",41),("Newman","Jelani","malesuada@semperauctorMauris.co.uk","GWU47OPY9OF","Sanders","1900-01-07",2,2,"dictum. Phasellus in","0","Fino Mornasco","-24.10288","-109.49974","1","1","0",28),("Burch","Moses","ipsum@vestibulum.net","KSE13NKX8NT","Keller","2018-06-23",1,1,"eget tincidunt dui augue eu tellus. Phasellus","0","Anzi","38.03288","5.95228","1","1","0",15),("Roy","Timothy","Quisque.tincidunt@Nunclaoreet.net","EUZ88HKV8KX","Shelton","2020-01-28",1,2,"vel arcu eu odio tristique","0","Ballarat","51.84313","24.94001","1","1","0",25),("Diaz","Steel","lacus.Nulla.tincidunt@sedestNunc.ca","QHU93ZTS5MF","Walters","1964-05-19",2,3,"sed dictum eleifend,","0","Lede","22.22713","-59.33479","1","1","0",42),("Villarreal","Wade","scelerisque.sed@mollisIntegertincidunt.net","RON78WJI0FC","Phelps","1956-05-21",2,2,"Integer sem elit, pharetra ut, pharetra sed,","0","Redlands","-77.65124","157.41081","1","1","0",22),("Cline","Omar","sit.amet.risus@morbi.org","CTS83GMI4FF","Rosario","1979-06-08",2,2,"mauris sapien, cursus in, hendrerit consectetuer, cursus et,","0","Norfolk County","-28.47674","125.11113","1","1","0",10),("Mejia","Stuart","id.mollis@iaculisnec.co.uk","VSY70ENV1CB","Slater","1910-11-14",2,1,"libero. Donec consectetuer","0","Saarlouis","60.62312","-169.67733","1","1","0",52),("Bradford","Davis","eu.erat.semper@interdumCurabitur.edu","SSF42IYT3LV","Joseph","1980-01-11",1,2,"Donec tempus, lorem fringilla ornare placerat, orci","0","Thurso","-34.34751","9.74192","1","1","0",85);
INSERT INTO `users` (`lastName`,`firstName`,`email`,`password`,`userName`,`birthDate`,`gender`,`showMe`,`bio`,`nbLikes`,`city`,`latitude`,`longitude`,`emailVerify`,`profileComplete`,`link`,`score`) VALUES ("Cantrell","Ferris","Quisque.imperdiet.erat@accumsan.net","GRQ67YXN7FY","Hatfield","1993-08-25",2,2,"non lorem vitae odio sagittis","0","Freirina","28.20552","12.36078","1","1","0",4),("Justice","Kaseem","vulputate.dui@nullamagna.com","HLC85QOP2PH","Soto","1988-12-15",1,1,"bibendum fermentum metus. Aenean sed","0","Lithgow","87.5311","-176.40864","1","1","0",48),("Cash","Lane","felis.adipiscing.fringilla@nectempus.net","UCW33OLH1TX","Crane","1933-04-30",1,2,"imperdiet","0","Le Havre","-65.66632","-40.26582","1","1","0",78),("Cohen","Lucian","ipsum.Suspendisse.non@tristique.com","CEW24VEO0AS","Rocha","1921-11-22",2,1,"Quisque","0","Dera Bugti","25.91164","125.67325","1","1","0",17),("Harper","Hayes","id@CurabiturmassaVestibulum.net","VSN06LTC8KW","Walls","1938-07-03",2,2,"adipiscing. Mauris molestie pharetra","0","Varendonk","-51.07896","117.24352","1","1","0",66),("Richard","Rooney","augue.scelerisque.mollis@facilisisloremtristique.co.uk","DCN36YXQ8HD","Gregory","1922-10-13",2,2,"ornare placerat, orci lacus vestibulum lorem, sit amet ultricies","0","Lota","7.65301","15.74579","1","1","0",26),("Gregory","James","Aliquam.rutrum@vehiculaet.ca","BPI52FRW4KM","Young","1970-05-29",1,3,"ut cursus luctus,","0","Oria","-87.91738","-83.34405","1","1","0",50),("David","Bradley","enim@vitae.com","LZG34FDO9CN","Pace","1946-11-09",1,1,"malesuada ut,","0","St. Clears","-64.34995","169.7625","1","1","0",26),("Francis","Logan","urna@Fuscealiquet.org","HVF38MDL7QE","Lowe","1996-02-08",2,1,"diam. Proin dolor. Nulla semper tellus id nunc interdum","0","Bastia Umbra","-36.35701","25.56376","1","1","0",72),("Ferrell","Denton","urna.Vivamus@cursus.edu","UVW79LPP3IU","Johns","1959-10-08",1,1,"parturient montes, nascetur ridiculus mus.","0","Saint-Georges","-83.77843","-95.52304","1","1","0",70);
INSERT INTO `users` (`lastName`,`firstName`,`email`,`password`,`userName`,`birthDate`,`gender`,`showMe`,`bio`,`nbLikes`,`city`,`latitude`,`longitude`,`emailVerify`,`profileComplete`,`link`,`score`) VALUES ("Malone","Maxwell","sapien.cursus.in@odioAliquam.edu","ZGM36OKC7ES","Elliott","1915-02-12",1,1,"fringilla, porttitor vulputate, posuere vulputate,","0","Sossano","68.65679","143.822","1","1","0",33),("Branch","Jarrod","vitae.odio.sagittis@egestasAliquam.com","MTP63OJF2NP","Salazar","1986-05-24",2,1,"nunc id enim. Curabitur massa. Vestibulum accumsan neque et nunc.","0","Fraser-Fort George","0.11535","42.4044","1","1","0",58),("Carlson","Kadeem","nulla.Integer.urna@sociisnatoquepenatibus.ca","MOX98DRS9SS","Keller","2000-01-17",2,1,"tortor at","0","Konya","70.4454","-11.51324","1","1","0",5),("Beach","Gabriel","dictum.augue.malesuada@urnaNullamlobortis.org","SCY95KQY8ZJ","Young","1942-08-02",2,3,"magna. Phasellus dolor elit, pellentesque a,","0","Municipal District","-43.81432","-96.7258","1","1","0",15),("Mckinney","Hayes","Cras@sociisnatoque.co.uk","GVC18YFH1OZ","Knight","1943-10-21",1,2,"tristique neque venenatis lacus. Etiam bibendum fermentum metus. Aenean sed","0","Lot","-20.74405","89.54826","1","1","0",80),("Perkins","Cain","Donec.nibh.Quisque@dolorDonec.org","BSE95GSW7VW","Rodriguez","1942-06-16",1,1,"imperdiet","0","Johnstone","-87.75841","146.64379","1","1","0",49),("Fields","Giacomo","dis.parturient.montes@Phasellus.ca","VNU54TET7JJ","Ayala","2004-08-13",1,3,"orci, adipiscing non, luctus sit amet, faucibus ut, nulla.","0","Spormaggiore","-14.02873","126.05832","1","1","0",70),("Gates","Ronan","auctor.Mauris.vel@ultrices.edu","CBI45MHO5DY","Kaufman","1927-08-04",2,3,"nunc.","0","Bhiwani","53.25993","141.93657","1","1","0",58),("Gomez","Noble","at.risus.Nunc@Vestibulum.edu","VNC61LUK1DS","Shepard","1968-05-26",1,3,"vel arcu. Curabitur ut odio vel est tempor bibendum.","0","Wolkrange","-84.15128","-111.94569","1","1","0",82),("Salas","Henry","ornare.sagittis@quis.ca","UJJ47QSE5SF","Stuart","1950-10-16",1,1,"magna. Cras convallis","0","Friedberg","42.52797","-160.02068","1","1","0",75);
INSERT INTO `users` (`lastName`,`firstName`,`email`,`password`,`userName`,`birthDate`,`gender`,`showMe`,`bio`,`nbLikes`,`city`,`latitude`,`longitude`,`emailVerify`,`profileComplete`,`link`,`score`) VALUES ("Griffin","Oleg","elementum.at@Curabituregestas.co.uk","BPI41TGR1MC","Foley","1985-07-02",2,3,"arcu. Sed et","0","Montebello","67.63284","-25.43165","1","1","0",25),("Contreras","Zachary","magna.Sed.eu@orcitinciduntadipiscing.ca","WJI71FVC8HJ","Jensen","1990-05-02",1,1,"magna nec quam. Curabitur vel lectus. Cum sociis natoque penatibus","0","Tywyn","-59.37323","119.6261","1","1","0",68),("Noel","Ali","iaculis.enim@inmolestie.org","KMP21AQI9YT","James","1970-10-04",1,1,"scelerisque","0","Armidale","-21.53104","-34.74621","1","1","0",75),("Cooley","Armando","Aliquam.gravida@sagittisDuis.org","YIX56RMN6VM","Farley","1982-06-18",1,3,"nec, eleifend non, dapibus rutrum, justo. Praesent luctus. Curabitur egestas","0","Cabildo","73.78601","147.25709","1","1","0",17),("Butler","Chadwick","ante@enimEtiamimperdiet.com","JMT55ERU4XV","Preston","1935-07-31",1,1,"vel nisl. Quisque fringilla euismod","0","Hervey Bay","-63.02961","0.67428","1","1","0",91),("Neal","Devin","adipiscing.lobortis.risus@aliquetmetus.com","YNL99LDD5AO","Bradshaw","2018-02-10",1,1,"lectus","0","Groß-Gerau","-4.14771","-74.3194","1","1","0",47),("Shields","Kane","eu.eros.Nam@cubiliaCurae.co.uk","JUB58CWF8PY","Spears","1909-10-04",2,2,"sed libero. Proin sed turpis nec mauris","0","Petrolina","-55.15183","33.08096","1","1","0",75),("Salazar","Keaton","egestas.lacinia.Sed@Suspendisse.co.uk","ERK80XLJ3FB","Patrick","1908-10-24",1,2,"sagittis","0","Malbaie","-45.72524","-44.28723","1","1","0",31),("Jennings","Cyrus","Mauris@consectetuer.com","BGC11SVD5EY","Caldwell","1942-02-04",1,3,"dictum sapien. Aenean massa. Integer vitae nibh.","0","Greater Sudbury","-9.55686","150.95936","1","1","0",86),("Ferguson","Mohammad","sem.Nulla.interdum@sem.edu","GHD79YHU2XY","Coffey","2002-02-08",1,2,"non enim. Mauris quis turpis vitae purus gravida sagittis.","0","Napier","11.06259","88.94919","1","1","0",53);
INSERT INTO `users` (`lastName`,`firstName`,`email`,`password`,`userName`,`birthDate`,`gender`,`showMe`,`bio`,`nbLikes`,`city`,`latitude`,`longitude`,`emailVerify`,`profileComplete`,`link`,`score`) VALUES ("Sims","Martin","dolor@pellentesque.net","DSV45LGX0LN","Ruiz","2005-10-27",1,2,"lorem, vehicula et, rutrum eu, ultrices sit amet, risus. Donec","0","Serrata","-31.11468","-5.50389","1","1","0",5),("Parks","Orlando","sem@ultrices.edu","NJH63OTH8SX","Olsen","1977-12-12",2,1,"non, feugiat nec, diam. Duis mi","0","Sobral","85.31985","-143.9776","1","1","0",46),("Lamb","Drew","arcu.Sed@adipiscing.co.uk","JRR84YZX7TQ","Rich","1989-07-24",1,2,"magna. Nam ligula elit, pretium et, rutrum non, hendrerit id,","0","El Bosque","-34.98238","98.67637","1","1","0",69),("Mosley","Harding","nibh@eunullaat.com","QAA90DRX7KL","Oliver","1980-06-11",1,1,"pede et risus. Quisque libero lacus,","0","Saint-Herblain","-40.36789","120.5507","1","1","0",68),("Garrett","Kato","nec.tellus@facilisisnon.net","JHG06OLA2HZ","Joyce","1940-04-07",1,3,"at, velit. Cras lorem lorem, luctus ut,","0","Filacciano","12.94131","136.00714","1","1","0",83),("Knapp","Richard","Fusce.diam.nunc@arcuMorbi.co.uk","NMP50VJN8RU","Molina","2019-03-30",1,3,"varius orci, in consequat enim diam vel arcu. Curabitur ut","0","Martigues","81.18018","-112.90525","1","1","0",100),("Horton","Cain","Quisque.ac@estNunclaoreet.ca","JYE12HJD4PV","Key","1976-03-01",1,2,"feugiat. Sed nec metus facilisis lorem","0","Sterling Heights","53.37334","169.32704","1","1","0",46),("Francis","Yasir","magna.Cras.convallis@inceptos.net","CRR08LFG5BK","Compton","1969-07-10",1,2,"lectus, a","0","Plymouth","58.17351","5.54387","1","1","0",61),("Waters","Chadwick","ac.turpis.egestas@perconubia.edu","WCM09JBM6UF","Downs","1922-10-26",1,3,"tortor. Nunc commodo auctor velit. Aliquam nisl.","0","Karak","53.21453","-14.91671","1","1","0",1),("Barron","Gage","eu@neceleifendnon.co.uk","WRF74ISB4SP","Chandler","1932-02-24",1,3,"odio vel est tempor bibendum.","0","Petorca","53.3699","-177.31167","1","1","0",18);
INSERT INTO `users` (`lastName`,`firstName`,`email`,`password`,`userName`,`birthDate`,`gender`,`showMe`,`bio`,`nbLikes`,`city`,`latitude`,`longitude`,`emailVerify`,`profileComplete`,`link`,`score`) VALUES ("French","Kasper","Pellentesque.habitant.morbi@eleifend.ca","HYC55UOY4CC","Austin","1913-09-25",2,2,"dolor sit amet, consectetuer adipiscing elit.","0","Mitú","-68.54184","7.44584","1","1","0",95),("Allison","Wade","elit.pharetra.ut@egestas.net","UCN57ZRM8KE","Odonnell","1930-07-10",2,3,"vitae aliquam eros turpis non enim. Mauris quis turpis vitae","0","Spruce Grove","-21.51701","-113.24058","1","1","0",70),("Dorsey","Neil","congue.turpis.In@arcuiaculisenim.co.uk","SAL28HTS0AI","Smith","1985-11-14",1,2,"posuere cubilia Curae; Donec tincidunt.","0","Luton","-22.39491","145.25169","1","1","0",65),("Richardson","Jerry","luctus.aliquet.odio@egestasligula.org","OPU99DOF0CT","Dawson","2009-01-21",1,2,"hendrerit. Donec porttitor tellus non","0","Carstairs","66.10311","-59.81926","1","1","0",49),("Perkins","Hyatt","arcu.eu@inmagna.com","RJF14ODA2SC","Wyatt","1935-07-20",1,2,"massa. Quisque porttitor eros nec tellus. Nunc lectus pede,","0","Habay-la-Vieille","78.76951","50.19485","1","1","0",36),("Peters","Emmanuel","Curabitur@dis.edu","GOY54MGV0XL","Fleming","1965-09-24",1,1,"Suspendisse","0","Dhuy","-22.69576","173.44451","1","1","0",73),("Christensen","Stuart","Nulla.eu@magna.com","GEB57REO7NY","Petersen","1912-01-25",2,2,"et, eros. Proin ultrices. Duis volutpat","0","Armo","62.10206","-59.83014","1","1","0",91),("Cash","Ian","sollicitudin.commodo.ipsum@at.net","JXN63TVB8BJ","Vinson","1957-07-03",1,1,"Sed nec metus","0","Sint-Martens-Lennik","-45.95757","67.90126","1","1","0",2),("Gallegos","Abraham","ac@Integerid.net","RTF90KCZ9WX","Clay","1983-10-05",1,1,"Suspendisse aliquet molestie tellus. Aenean egestas hendrerit neque.","0","Soledad de Graciano Sánchez","-75.28962","-111.80611","1","1","0",39),("Harding","Abel","eleifend.vitae.erat@ultricesposuere.net","ZLM07DMR4PS","Pollard","1925-01-13",1,1,"tellus sem mollis dui, in sodales elit erat","0","Huntsville","43.6336","103.62386","1","1","0",87);
INSERT INTO `users` (`lastName`,`firstName`,`email`,`password`,`userName`,`birthDate`,`gender`,`showMe`,`bio`,`nbLikes`,`city`,`latitude`,`longitude`,`emailVerify`,`profileComplete`,`link`,`score`) VALUES ("Cardenas","Lionel","ullamcorper.velit.in@hymenaeosMaurisut.net","LUK91JRH9IM","Gamble","1925-08-16",1,3,"aptent","0","Coupar Angus","49.45064","113.74447","1","1","0",5),("Gonzales","Lev","Donec.elementum@vehicularisusNulla.edu","MAP95XDY8GW","Cabrera","1919-05-18",2,3,"tristique neque venenatis lacus. Etiam bibendum fermentum metus.","0","Crystal Springs","69.3366","111.43987","1","1","0",19),("Wallace","Xanthus","non.hendrerit@SednequeSed.net","EXF90ORX9FE","Clarke","1959-03-12",1,2,"non, lobortis quis, pede. Suspendisse dui. Fusce diam","0","Metairie","55.04983","79.35037","1","1","0",74),("Leblanc","Camden","ornare@CurabiturmassaVestibulum.ca","MKY86XYV4YZ","Hammond","1997-12-21",2,1,"adipiscing elit. Etiam laoreet, libero et tristique pellentesque, tellus","0","Stroud","49.87695","-93.73373","1","1","0",65),("Nguyen","Yardley","in.hendrerit@cursusnonegestas.co.uk","CVU69TQA0ZB","Clay","1998-10-11",2,1,"ultrices sit amet, risus.","0","Juan Fernández","-10.09371","74.43505","1","1","0",93),("Klein","Kibo","consectetuer.ipsum@sitamet.org","BFB33GRC3QM","Bonner","1928-09-03",1,3,"malesuada vel, venenatis vel, faucibus id, libero. Donec consectetuer mauris","0","Santa Marta","-88.39088","152.55956","1","1","0",3),("Hale","Lionel","purus@convallisin.edu","UYV99RXP8VE","Gibbs","1983-08-13",2,3,"a, malesuada id, erat. Etiam","0","Dongelberg","-27.52689","174.17426","1","1","0",83),("Chang","Alden","vulputate.dui.nec@tempuseuligula.net","KLP80ISC6SE","Larsen","1903-01-05",2,3,"vitae velit egestas lacinia. Sed congue, elit","0","Amlwch","-86.06704","-16.79169","1","1","0",95),("Mayo","Caleb","arcu.Sed@sitametmetus.com","BNX38RYG2FV","Lamb","1922-10-24",2,3,"metus vitae velit egestas lacinia.","0","Bionaz","73.07985","102.82926","1","1","0",12),("Torres","Lars","natoque.penatibus.et@turpisvitae.org","SRH52BJM9TI","Waters","1949-08-02",2,1,"aliquet libero. Integer in magna. Phasellus dolor elit, pellentesque a,","0","Cardedu","64.57974","-42.07745","1","1","0",90);
INSERT INTO `users` (`lastName`,`firstName`,`email`,`password`,`userName`,`birthDate`,`gender`,`showMe`,`bio`,`nbLikes`,`city`,`latitude`,`longitude`,`emailVerify`,`profileComplete`,`link`,`score`) VALUES ("Schwartz","Devin","quam.vel.sapien@massa.ca","RGO04FSB9QO","Lowery","2008-08-13",1,3,"Vivamus non lorem vitae odio sagittis semper. Nam tempor","0","Fürstenwalde","-16.27025","16.1015","1","1","0",39),("Howard","Oscar","ipsum.Phasellus.vitae@tortoratrisus.org","JUK75DJL9KL","Dickerson","1966-05-03",1,1,"Ut","0","Oklahoma City","56.13666","178.356","1","1","0",47),("Berg","Armand","at.arcu@cubiliaCuraePhasellus.ca","HIT07KGT9JZ","Rich","1944-02-21",1,2,"fringilla purus mauris a nunc. In at pede. Cras vulputate","0","Pudahuel","4.47781","101.73336","1","1","0",30),("Nunez","Patrick","orci.lacus@purusactellus.edu","XDJ62VNU2BF","Lott","1946-02-02",2,2,"tristique pharetra. Quisque ac libero nec ligula","0","Pugwash","13.87114","-89.78446","1","1","0",84),("Lane","Vance","Cras@tincidunt.com","JXL81RDO7AQ","Vasquez","1919-09-14",2,3,"lorem vitae odio sagittis semper. Nam tempor","0","Ribeirão Preto","-61.20573","-172.58897","1","1","0",45),("Clayton","Solomon","Curabitur.ut@portaelit.net","AOU38FIX5UU","Guy","1986-03-22",2,2,"mi.","0","Smoky Lake","20.25462","-27.09241","1","1","0",22),("Arnold","Louis","leo.Morbi.neque@placerat.net","FLZ60OEK4QS","Horne","1992-07-10",2,1,"vitae purus gravida sagittis. Duis gravida. Praesent eu nulla","0","Merthyr Tydfil","71.52684","-0.68139","1","1","0",13),("Clark","Abdul","ornare.placerat.orci@euismodindolor.com","CGR83KTU7EG","Jackson","1941-11-03",1,3,"Aliquam","0","Cossignano","-47.02631","50.97706","1","1","0",22),("Mann","Raymond","ante.Maecenas@nec.net","JLT57TMY7AB","Bean","1916-12-06",1,1,"metus. Aliquam erat","0","Spremberg","-32.86287","-28.83666","1","1","0",73),("Bowman","Trevor","Fusce.feugiat.Lorem@acfermentumvel.co.uk","EFT32YQA1GK","Patton","1920-05-23",2,3,"nulla magna, malesuada vel,","0","Casper","-34.86498","37.49489","1","1","0",75);
INSERT INTO `users` (`lastName`,`firstName`,`email`,`password`,`userName`,`birthDate`,`gender`,`showMe`,`bio`,`nbLikes`,`city`,`latitude`,`longitude`,`emailVerify`,`profileComplete`,`link`,`score`) VALUES ("Olson","Abel","odio@eusemPellentesque.ca","XAT50JAI9DO","Williamson","2002-05-27",1,3,"sagittis felis. Donec tempor, est ac mattis","0","Caplan","-73.0629","-103.30456","1","1","0",44),("Rollins","Stewart","imperdiet.nec@velconvallisin.net","HGV40DGL0JP","Mckinney","1904-05-29",1,3,"lorem fringilla ornare placerat, orci lacus","0","Balen","-50.39555","-48.50285","1","1","0",52),("Medina","Mannix","velit.in@nisimagna.net","OIT26BCY4XU","Walton","2009-10-15",1,1,"Ut semper pretium","0","Klagenfurt","52.17062","129.67155","1","1","0",61),("Fischer","Ryan","semper.tellus@Integermollis.ca","YQI84BPK9BR","Hopkins","1907-12-08",2,1,"amet, consectetuer adipiscing elit. Etiam","0","Yegoryevsk","-78.92102","-109.5058","1","1","0",86),("Thomas","Branden","et.commodo@posuere.com","AQI26IIK1NY","Willis","1919-09-14",2,3,"diam eu dolor egestas rhoncus. Proin nisl","0","Bellevue","-58.07258","-43.38321","1","1","0",82),("Joyner","Chaim","id@dolor.org","OKF55YOC8WV","Kidd","1916-06-04",2,1,"Cras interdum. Nunc sollicitudin commodo ipsum.","0","Hamilton","-89.75957","26.83448","1","1","0",12),("Harrison","Brady","ligula.Donec@vulputateeuodio.com","YYW14IYC7SH","Mathews","1927-05-20",1,1,"elit,","0","Drezna","-55.79723","37.48451","1","1","0",57),("Franklin","Silas","non.hendrerit@mollislectuspede.net","CSD15CPN1WA","Neal","1985-05-08",2,3,"Cras interdum. Nunc sollicitudin commodo","0","Vorselaar","80.72942","-146.67729","1","1","0",62),("Kirkland","Demetrius","in@semper.org","QOW51LIT4DO","Butler","1999-01-22",1,2,"libero. Proin sed turpis nec","0","Pizzoferrato","72.58673","131.71531","1","1","0",42),("Kemp","Silas","ipsum@Vestibulum.edu","JCI13QCQ6JC","Elliott","1964-11-07",2,3,"id nunc interdum feugiat. Sed nec","0","Jamshoro","87.76168","-48.89701","1","1","0",34);
INSERT INTO `users` (`lastName`,`firstName`,`email`,`password`,`userName`,`birthDate`,`gender`,`showMe`,`bio`,`nbLikes`,`city`,`latitude`,`longitude`,`emailVerify`,`profileComplete`,`link`,`score`) VALUES ("Keller","Mufutau","tincidunt.congue@eu.edu","PTG14ELP5WK","Carr","1920-12-10",2,3,"in,","0","Ancona","44.36129","-97.82149","1","1","0",28),("Cantu","Reece","penatibus.et.magnis@vitaeorci.ca","JLD84AWD1JX","Schwartz","2009-01-08",1,2,"dictum. Phasellus in felis. Nulla tempor augue","0","Recoleta","-67.89491","-65.69206","1","1","0",46),("Bates","Dalton","dui.quis@massaMaurisvestibulum.edu","DHW79VFW9MT","Patton","1981-03-13",2,1,"eu tellus. Phasellus elit pede, malesuada vel, venenatis","0","Indianapolis","88.22716","129.76992","1","1","0",33),("Stout","Todd","Quisque.ornare.tortor@adipiscing.net","PPM18KGM2FE","Nelson","1927-05-28",1,3,"ultrices posuere cubilia Curae; Donec tincidunt. Donec vitae","0","Louth","-71.03104","-33.91627","1","1","0",21),("Mayo","Tanner","faucibus@massarutrum.org","GAL49XLG2ZE","Brady","1925-05-23",2,3,"euismod urna. Nullam lobortis quam a felis ullamcorper viverra. Maecenas","0","Lexington","-32.51773","-89.47266","1","1","0",58),("Graham","Gannon","tincidunt.Donec.vitae@ac.co.uk","OAH54NYU3GC","Ingram","1986-10-14",1,3,"mauris sapien,","0","Korolyov","-22.61341","102.49241","1","1","0",16),("Robertson","Fritz","facilisis@mattis.org","SPB96RIG6GM","Wooten","1904-06-18",1,2,"Aliquam gravida mauris ut","0","Buin","79.45238","-93.86467","1","1","0",12),("Obrien","Finn","semper@Sedidrisus.net","XYH78IDU1ZP","Keith","1960-12-08",2,1,"in consectetuer ipsum nunc","0","Dalbeattie","-40.23283","-165.20608","1","1","0",84),("Rollins","Silas","nascetur.ridiculus@pede.net","ZVC52KWW2GX","Kidd","1915-06-05",2,1,"Fusce dolor","0","Cajazeiras","-62.37753","167.76141","1","1","0",93),("Hood","Isaac","dolor.Nulla@nonmagnaNam.ca","KZJ99HNI8NX","Goff","1944-05-05",1,3,"ipsum cursus","0","Jaranwala","-41.71001","101.94547","1","1","0",86);