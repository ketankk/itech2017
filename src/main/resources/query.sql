CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `password` varchar(80) NOT NULL,
  `email` varchar(100) NOT NULL,
  `display_name` varchar(200) NOT NULL,
  `CREATED` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `CREATED_BY` varchar(16) DEFAULT NULL,
  `LAST_MODIFIED` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `UPDATED_BY` varchar(16) DEFAULT NULL,
  `dateOfBirth` date NOT NULL,
  `contactNumber` bigint(10) DEFAULT NULL,
  `gender` varchar(6) NOT NULL,
  `address` varchar(200) NOT NULL,
  `isDisabled` tinyint(1) NOT NULL DEFAULT '0',
  `userPreferences` text,
  PRIMARY KEY (`name`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;




CREATE TABLE `User_roles` (
  `User_id` bigint(20) NOT NULL,
  `roles` varchar(255) DEFAULT NULL,
  `CREATED` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CREATED_BY` varchar(16) DEFAULT NULL,
  `LAST_MODIFIED` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `UPDATED_BY` varchar(16) DEFAULT NULL,
  KEY `FK_9npctppqlup1uag8ek04qpmie` (`User_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

