-- MySQL dump 10.13  Distrib 5.6.25, for Linux (x86_64)
--
-- Host: 10.6.117.151    Database: zeas
-- ------------------------------------------------------
-- Server version	5.1.73

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `PipelineOozieJobMap`
--

DROP TABLE IF EXISTS `PipelineOozieJobMap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PipelineOozieJobMap` (
  `PIPELINEJOBID` int(11) NOT NULL,
  `OOZIEJOBID` varchar(50) NOT NULL,
  UNIQUE KEY `PIPELINEJOBID` (`PIPELINEJOBID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `dataset_write_permission` tinyint(1) NOT NULL,
  `project_write_permission` tinyint(1) NOT NULL,
  `dataset_execute_permission` tinyint(1) NOT NULL,
  `project_execute_permission` tinyint(1) NOT NULL,
  `isDisabled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`name`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=123 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `User_roles`
--

DROP TABLE IF EXISTS `User_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User_roles` (
  `User_id` bigint(20) NOT NULL,
  `roles` varchar(255) DEFAULT NULL,
  `CREATED` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CREATED_BY` varchar(16) DEFAULT NULL,
  `LAST_MODIFIED` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `UPDATED_BY` varchar(16) DEFAULT NULL,
  KEY `FK_9npctppqlup1uag8ek04qpmie` (`User_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `component_key`
--

DROP TABLE IF EXISTS `component_key`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `component_key` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `component_value` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `operation_key`
--

DROP TABLE IF EXISTS `operation_key`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operation_key` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `operation_value` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `job_status`
--

DROP TABLE IF EXISTS `job_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_status` (
  `id` bigint(30) NOT NULL AUTO_INCREMENT,
  `status` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `auth_log`
--

DROP TABLE IF EXISTS `auth_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) DEFAULT NULL,
  `event_type` varchar(255) DEFAULT NULL,
  `client_ip` varchar(255) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
 CONSTRAINT `auth_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=MyISAM AUTO_INCREMENT=1733 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `component`
--

DROP TABLE IF EXISTS `component`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `component` (
  `component_name` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `properties` text,
  `page_link` varchar(1000) DEFAULT NULL,
  `is_runnable` varchar(5) NOT NULL,
  PRIMARY KEY (`component_name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `data_ingestion`
--

DROP TABLE IF EXISTS `data_ingestion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_ingestion` (
  `DATA_INGESTION_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(16) NOT NULL,
  `ARCHIVED_TIME` timestamp NULL DEFAULT NULL,
  `BATCH_START` varchar(16) NOT NULL,
  `BATCH_END` varchar(16) DEFAULT NULL,
  `CURRENT_BATCH` varchar(16) NOT NULL,
  `LAST_BATCH` varchar(16) DEFAULT NULL,
  `CREATED` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `CREATED_BY` varchar(16) DEFAULT NULL,
  `LAST_MODIFIED` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `UPDATED_BY` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`DATA_INGESTION_ID`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COMMENT='This will have entries only for “active” Ingestion Entities ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `data_ingestion_log`
--

DROP TABLE IF EXISTS `data_ingestion_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_ingestion_log` (
  `DATA_INGESTION_LOG_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `DATA_INGESTION_ID` bigint(20) NOT NULL COMMENT 'Foreign Key to DATA_INGESTION table',
  `BATCH` varchar(16) NOT NULL,
  `listOfFiles` varchar(2000) NOT NULL,
  `JOB_START_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `JOB_END_TIME` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `JOB_STATUS` varchar(100) DEFAULT NULL,
  `JOB_MSG` varchar(256) DEFAULT NULL,
  `CREATED` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `CREATED_BY` varchar(16) DEFAULT NULL,
  `LAST_MODIFIED` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `UPDATED_BY` varchar(16) DEFAULT NULL,
  `JOB_STAGE` varchar(30) DEFAULT NULL,
  `log_object` blob,
  PRIMARY KEY (`DATA_INGESTION_LOG_ID`)
) ENGINE=MyISAM AUTO_INCREMENT=1075 DEFAULT CHARSET=latin1 COMMENT='This  table will have one row per batch run (either success ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dataset_events`
--

DROP TABLE IF EXISTS `dataset_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dataset_events` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `entity_id` int(11) NOT NULL,
  `event_type` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `shared_with_group` varchar(255) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `entity_id` (`entity_id`),
  KEY `user` (`user`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dataset_permission`
--

DROP TABLE IF EXISTS `dataset_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dataset_permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` varchar(255) NOT NULL,
  `module_id` bigint(20) NOT NULL,
  `permission` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` varchar(255) NOT NULL,
  `modified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `module_id` (`module_id`),
  KEY `created_by` (`created_by`)
) ENGINE=MyISAM AUTO_INCREMENT=60 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `entity`
--

DROP TABLE IF EXISTS `entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entity` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) DEFAULT NULL,
  `TYPE` varchar(17) NOT NULL,
  `JSON_DATA` text NOT NULL,
  `IS_ACTIVE` tinyint(1) NOT NULL,
  `CREATED` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `CREATED_BY` varchar(16) DEFAULT NULL,
  `LAST_MODIFIED` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `UPDATED_BY` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `NAME` (`NAME`)
) ENGINE=MyISAM AUTO_INCREMENT=8361 DEFAULT CHARSET=latin1 COMMENT='This table will be interface between front-endand the back-e';
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `group_membership`
--

DROP TABLE IF EXISTS `group_membership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_membership` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` varchar(20) NOT NULL,
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `user_permission` int(11) NOT NULL,
  `group_admin` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`)
) ENGINE=MyISAM AUTO_INCREMENT=181 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `id` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` varchar(20) NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_singleuser` tinyint(1) NOT NULL,
  `superuser_group` tinyint(1) NOT NULL,
  `isDisabled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ingestion_run_info`
--

DROP TABLE IF EXISTS `ingestion_run_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ingestion_run_info` (
  `id` bigint(30) NOT NULL,
  `md5` varchar(255) DEFAULT NULL,
  `filename` varchar(100) DEFAULT NULL,
  `schemaname` varchar(100) DEFAULT NULL,
  `noofrecord` bigint(30) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `schemaname` (`schemaname`),
  CONSTRAINT `ingestion_run_info_ibfk_1` FOREIGN KEY (`schemaname`) REFERENCES `entity` (`NAME`) ON DELETE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `ml_analysis`
--

DROP TABLE IF EXISTS `ml_analysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ml_analysis` (
  `ml_id` int(11) NOT NULL AUTO_INCREMENT,
  `training` varchar(50) DEFAULT NULL,
  `testing` varchar(50) DEFAULT NULL,
  `algorithm` varchar(30) DEFAULT NULL,
  `accuracy` int(3) DEFAULT NULL,
  `completion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ml_id`)
) ENGINE=MyISAM AUTO_INCREMENT=38 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `module` (
  `id` bigint(30) NOT NULL,
  `component_type` varchar(100) NOT NULL,
  `properties` text,
  `version` int(11) NOT NULL,
  `project_id` bigint(30) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`,`version`),
  KEY `component_type` (`component_type`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `module_ibfk_1` FOREIGN KEY (`component_type`) REFERENCES `component` (`component_name`) ON DELETE CASCADE,
  CONSTRAINT `module_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `module_history`
--

DROP TABLE IF EXISTS `module_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `module_history` (
  `id` bigint(30) NOT NULL,
  `module_id` bigint(30) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  `oozie_id` varchar(100) DEFAULT NULL,
  `project_run_id` bigint(30) DEFAULT NULL,
  `output_blob` text,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`id`),
  KEY `module_id` (`module_id`),
  KEY `project_run_id` (`project_run_id`),
  CONSTRAINT `module_history_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE CASCADE,
  CONSTRAINT `module_history_ibfk_2` FOREIGN KEY (`project_run_id`) REFERENCES `project_history` (`id`) ON DELETE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `newsentry`
--

DROP TABLE IF EXISTS `newsentry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `newsentry` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;



--
-- Table structure for table `pipeline_stage_log`
--

DROP TABLE IF EXISTS `pipeline_stage_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pipeline_stage_log` (
  `pipeline_run_id` int(11) DEFAULT NULL,
  `stage` varchar(50) DEFAULT NULL,
  `run_start_time` datetime DEFAULT NULL,
  `run_end_time` datetime DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  `msg` varchar(50) DEFAULT NULL,
  `output_data_set` varchar(100) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pipellineooziejobmap`
--

DROP TABLE IF EXISTS `pipellineooziejobmap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pipellineooziejobmap` (
  `PIPELINEJOBID` varchar(255) NOT NULL,
  `OOZIEJOBID` varchar(255) NOT NULL,
  PRIMARY KEY (`PIPELINEJOBID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `processed_pipeline`
--

DROP TABLE IF EXISTS `processed_pipeline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `processed_pipeline` (
  `ppid` int(11) DEFAULT NULL,
  `pipeline_name` varchar(50) DEFAULT NULL,
  `output_dataset` varchar(50) DEFAULT NULL,
  `created` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project` (
  `id` bigint(30) NOT NULL,
  `name` varchar(100) NOT NULL,
  `design` varchar(4000) DEFAULT NULL,
  `version` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(255) DEFAULT NULL,
  `workspace_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`,`version`),
  KEY `workspace_name` (`workspace_name`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`workspace_name`) REFERENCES `workspace` (`name`) ON DELETE CASCADE,
  CONSTRAINT `project_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `user` (`name`) ON DELETE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `project_events`
--

DROP TABLE IF EXISTS `project_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_events` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) NOT NULL,
  `event_type` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `shared_with_group` varchar(255) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `user` (`user`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `project_history`
--

DROP TABLE IF EXISTS `project_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_history` (
  `id` bigint(30) NOT NULL,
  `project_id` bigint(30) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  `oozie_id` varchar(100) DEFAULT NULL,
  `run_mode` varchar(50) DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `run_details` text,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_history_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `project_permission`
--

DROP TABLE IF EXISTS `project_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` varchar(255) NOT NULL,
  `project_id` bigint(20) NOT NULL,
  `permission` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `created_by` varchar(255) NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `project_id` (`project_id`),
  KEY `created_by` (`created_by`)
) ENGINE=MyISAM AUTO_INCREMENT=93 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `projecthistoryid`
--

DROP TABLE IF EXISTS `projecthistoryid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projecthistoryid` (
  `id` bigint(30) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=774 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `run_info`
--

DROP TABLE IF EXISTS `run_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `run_info` (
  `TimeStamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user` varchar(20) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `entityname` varchar(100) DEFAULT NULL,
  `operation` varchar(100) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `runlogdetails`
--

DROP TABLE IF EXISTS `runlogdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `runlogdetails` (
  `id` bigint(30) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(100) DEFAULT NULL,
  `logfilelocation` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=275 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `schema_archive`
--

DROP TABLE IF EXISTS `schema_archive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schema_archive` (
  `SCHEMA_ID` int(11) NOT NULL,
  `SCHEMA_NAME` varchar(50) DEFAULT NULL,
  `SCHEMA_JSON` text NOT NULL,
  `SOURCE_JSON` text NOT NULL,
  `DATASET_JSON` text NOT NULL,
  `SCHEDULAR_JSON` text NOT NULL,
  `USER_NAME` varchar(50) NOT NULL,
  `CREATED_DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`SCHEMA_ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sequenceid`
--

DROP TABLE IF EXISTS `sequenceid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sequenceid` (
  `id` bigint(30) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1319 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_group`
--

DROP TABLE IF EXISTS `user_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_group` (
  `group_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`group_id`,`user_id`),
  KEY `created_by` (`created_by`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `useraction`
--

DROP TABLE IF EXISTS `useraction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `useraction` (
  `id` bigint(30) NOT NULL AUTO_INCREMENT,
  `action_type` varchar(100) DEFAULT NULL,
  `action_id` bigint(30) DEFAULT NULL,
  `action_name` varchar(100) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `useraction_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`name`) ON DELETE CASCADE
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `whitelist_config`
--

DROP TABLE IF EXISTS `whitelist_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `whitelist_config` (
  `ID` bigint(20) NOT NULL,
  `NAME` varchar(32) NOT NULL,
  `DISPLAY_NAME` varchar(32) NOT NULL,
  `CONTAINER` varchar(18) DEFAULT NULL,
  `WIDGET_TYPE` varchar(16) NOT NULL,
  `ENTRY` varchar(16) NOT NULL,
  `CREATED` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CREATED_BY` varchar(16) NOT NULL,
  `LAST_MODIFIED` timestamp NULL DEFAULT NULL,
  `MODIFIED_BY` varchar(16) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COMMENT='This table is used to contain values used to populated list ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `workspace`
--

DROP TABLE IF EXISTS `workspace`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `workspace` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=108 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activities` (
  `id` bigint(30) NOT NULL AUTO_INCREMENT,
  `component_key_id` bigint(30) DEFAULT NULL,
  `operation_key_id` bigint(30) DEFAULT NULL,
  `component_id` bigint(30) DEFAULT NULL,
  `status_messege` varchar(200) DEFAULT NULL,
  `action_user_id` bigint(20) DEFAULT NULL,
  `time_occured` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `activities_ibfk_1` (`component_key_id`),
  KEY `activities_ibfk_2` (`operation_key_id`),
  KEY `activities_ibfk_3` (`action_user_id`),
  CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`component_key_id`) REFERENCES `component_key` (`id`) ON DELETE CASCADE,
  CONSTRAINT `activities_ibfk_2` FOREIGN KEY (`operation_key_id`) REFERENCES `operation_key` (`id`) ON DELETE CASCADE,
  CONSTRAINT `activities_ibfk_3` FOREIGN KEY (`action_user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=MyISAM AUTO_INCREMENT=1675 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;




--
-- Table structure for table `alert_view`
--

DROP TABLE IF EXISTS `alert_view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alert_view` (
  `id` bigint(30) NOT NULL AUTO_INCREMENT,
  `activity_id` bigint(30) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
 KEY `alert_ibfk_1` (`user_id`),
  KEY `alert_ibfk_2` (`activity_id`),
 CONSTRAINT `alert_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `alert_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=MyISAM AUTO_INCREMENT=2181 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `component_execution`
--

DROP TABLE IF EXISTS `component_execution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `component_execution` (
  `id` bigint(30) NOT NULL AUTO_INCREMENT,
  `component_type` bigint(30) DEFAULT NULL,
  `component_id` bigint(30) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
 KEY `component_execution_ibfk_1` (`component_type`),
  KEY `component_execution_ibfk_2` (`user_id`),
  CONSTRAINT `component_execution_ibfk_1` FOREIGN KEY (`component_type`) REFERENCES `component_key` (`id`) ON DELETE CASCADE,
  CONSTRAINT `component_execution_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=MyISAM AUTO_INCREMENT=112 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;



--
-- Table structure for table `comp_exce_status`
--

DROP TABLE IF EXISTS `comp_exce_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comp_exce_status` (
  `id` bigint(30) NOT NULL AUTO_INCREMENT,
  `comp_exce_id` bigint(30) DEFAULT NULL,
  `job_type` bigint(30) DEFAULT NULL,
  `job_id` varchar(100) DEFAULT NULL,
  `job_status_id` bigint(30) DEFAULT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
 KEY `comp_exce_status_ibfk_1` (`comp_exce_id`),
  KEY `comp_exce_status_ibfk_2` (`job_type`),
  KEY `comp_exce_status_ibfk_3` (`job_status_id`),
 CONSTRAINT `comp_exce_status_ibfk_1` FOREIGN KEY (`comp_exce_id`) REFERENCES `component_execution` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comp_exce_status_ibfk_2` FOREIGN KEY (`job_type`) REFERENCES `component_key` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comp_exce_status_ibfk_3` FOREIGN KEY (`job_status_id`) REFERENCES `job_status` (`id`) ON DELETE CASCADE
) ENGINE=MyISAM AUTO_INCREMENT=1161 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;




--
-- Dumping data for table `User_roles`
--

LOCK TABLES `User_roles` WRITE;
/*!40000 ALTER TABLE `User_roles` DISABLE KEYS */;
INSERT INTO `User_roles` VALUES (1,'admin','2016-01-22 12:04:37',NULL,'0000-00-00 00:00:00',NULL),(2,'admin','2014-11-26 04:37:35',NULL,'0000-00-00 00:00:00',NULL);
/*!40000 ALTER TABLE `User_roles` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Dumping data for table `component`
--

LOCK TABLES `component` WRITE;
/*!40000 ALTER TABLE `component` DISABLE KEYS */;
INSERT INTO `component` VALUES ('','test','',NULL,'0'),('Binary Logistic Regression','',NULL,NULL,'0'),('Clean Missing Data','','',NULL,'0'),('Column Filter','','',NULL,'0'),('Compare Model','Compare Model desc',NULL,NULL,''),('DATASET','DATASET','DATASET PROPERTIES','ZEAS.COM','1'),('Decision Tree Classification','Decision Tree Classification',NULL,NULL,'0'),('Decision Tree Regression','Decision Tree Regression',NULL,NULL,'0'),('Group By','',NULL,NULL,''),('Hive','',NULL,NULL,''),('internal dataset','',NULL,NULL,''),('Join','Joins 2 datasets',NULL,NULL,'0'),('KMeans Clustering','',NULL,NULL,'0'),('Linear Regression','',NULL,NULL,'0'),('MapReduce','',NULL,NULL,''),('Multiclass Logistic Regression','',NULL,NULL,'0'),('Naive Bayes Classification','Naive Bayes Classification',NULL,NULL,'0'),('Partition','Splitting given dataset',NULL,NULL,''),('Pig','Pig Transformation',NULL,NULL,''),('Random Forest Classification','',NULL,NULL,'0'),('Random Forest Regression','',NULL,NULL,'0'),('Subset','Subset of data',NULL,NULL,''),('SVM Classification','SVM Classification',NULL,NULL,'0'),('Test','test model',NULL,NULL,'0'),('Train','train model',NULL,NULL,'0');
/*!40000 ALTER TABLE `component` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `component_key`
--

LOCK TABLES `component_key` WRITE;
/*!40000 ALTER TABLE `component_key` DISABLE KEYS */;
INSERT INTO `component_key` VALUES (1,'INGESTION'),(2,'PROJECT'),(3,'STREAMING');
/*!40000 ALTER TABLE `component_key` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Dumping data for table `group_membership`
--

LOCK TABLES `group_membership` WRITE;
/*!40000 ALTER TABLE `group_membership` DISABLE KEYS */;
INSERT INTO `group_membership` VALUES (1,'admin','admin','2016-01-19 04:54:24','admin','0000-00-00 00:00:00',7,0);
/*!40000 ALTER TABLE `group_membership` ENABLE KEYS */;
UNLOCK TABLES;



--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES ('admin','admin group','2016-01-16 08:12:11','system','2016-01-16 08:12:11',0,1,0);
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Dumping data for table `job_status`
--

LOCK TABLES `job_status` WRITE;
/*!40000 ALTER TABLE `job_status` DISABLE KEYS */;
INSERT INTO `job_status` VALUES (1,'COPYING'),(2,'CHECKING DATA QUALITY'),(3,'SCHEDULING'),(4,'RUNNING'),(5,'COMPLETE'),(6,'FAIL'),(7,'TERMINATE'),(8,'IMPORTING');
/*!40000 ALTER TABLE `job_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `operation_key`
--

LOCK TABLES `operation_key` WRITE;
/*!40000 ALTER TABLE `operation_key` DISABLE KEYS */;
INSERT INTO `operation_key` VALUES (1,'CREATE'),(2,'DELETE'),(3,'START'),(4,'FAIL'),(5,'SUCCESS'),(6,'TERMINATE'),(7,'UPDATE');
/*!40000 ALTER TABLE `operation_key` ENABLE KEYS */;
UNLOCK TABLES;



--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','8805e4529d93c6d3b01432d3c44b0719b06f6e84a5721aa01fcc2489a5ab538bfa1f773627e23b78','admin@zeas.com','ZEAS Administrator','2015-06-02 12:11:21',NULL,'2016-01-19 04:54:24','admin','2069-01-01',9987845896,'Male','Blore',1,1,1,1,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Dumping data for table `whitelist_config`
--

LOCK TABLES `whitelist_config` WRITE;
/*!40000 ALTER TABLE `whitelist_config` DISABLE KEYS */;
INSERT INTO `whitelist_config` VALUES (1,'Type','Type','DataSource','list','File','2014-11-18 05:39:28','user','2014-11-18 05:39:28',NULL),(2,'Type','Type','DataSource','list','RDBMS','2014-11-18 05:39:28','user','2014-11-18 05:39:28',NULL),(3,'Format','Format','DataSource','list','CSV','2014-11-18 05:41:54','user','2014-11-18 05:41:54',NULL),(4,'Format','Format','DataSource','list','XML','2014-11-18 05:41:54','user','2014-11-18 05:41:54',NULL),(5,'Type','Type','DataSchema','list','int','2014-11-18 08:43:12','','2014-11-18 08:42:54',NULL),(6,'Type','Type','DataSchema','list','string','2014-11-18 08:43:22','','2014-11-18 08:42:54',NULL),(7,'Type','Type','DataSchema','list','enumeration','2014-12-03 08:29:48','user','2014-12-03 08:29:48',NULL),(8,'Frequency','Frequency','DatapipeWorkbench','list','Hourly','2014-12-24 06:44:11','','2014-12-24 06:44:11',NULL),(9,'Frequency','Frequency','DatapipeWorkbench','list','Daily','2014-12-24 06:44:11','','2014-12-24 06:44:11',NULL),(10,'StageType','StageType','DatapipeWorkbench','list','MapReduce','2014-12-29 18:00:00','user','2014-12-30 04:58:47','user'),(11,'StageType','StageType','DatapipeWorkbench','list','Hive','2014-12-29 18:00:00','user','2014-12-30 04:58:47','user'),(12,'StageType','StageType','DatapipeWorkbench','list','Pig','2014-12-29 18:00:00','user','2014-12-30 05:00:05','user'),(13,'StageType','StageType','DatapipeWorkbench','list','Spark','2014-12-29 18:00:00','user','2014-12-30 05:00:05','user'),(14,'Frequency','Frequency','DatapipeWorkbench','list','One Time','2014-12-03 13:29:48','user','2014-12-03 13:29:48',NULL),(15,'Type','Type','DataSchema','list','float','2014-11-18 13:43:12','','2014-11-18 13:42:54','user'),(16,'Type','Type','DataSchema','list','double','2014-11-18 13:43:12','','2014-11-18 13:42:54','user'),(16,'Type','Type','DataSchema','list','date','2014-11-18 13:43:12','','2014-11-18 13:42:54','user'),(18,'Type','Type','DataSchema','list','time','2014-11-18 13:43:12','','2014-11-18 13:42:54','user'),(19,'Type','Type','DataSchema','list','timestamp','2014-11-18 08:43:12','','2014-11-18 08:42:54',NULL),(20,'Type','Type','DataSchema','list','long','2014-11-18 08:43:12','','2014-11-18 08:42:54',NULL),(21,'Type','Type','DataSource','list','RDBMS','2014-11-18 05:39:28','user','2014-11-18 05:39:28',NULL),(22,'Format','Format','DataSource','list','XLS','2014-11-18 05:41:54','user','2014-11-18 05:41:54',NULL),(23,'Format','Format','DataSource','list','JSON','2014-11-18 05:41:54','user','2014-11-18 05:41:54',NULL),(25,'Format','Format','DataSource','list','Fixed Width','2014-07-29 12:59:48','user','2014-12-03 13:59:48',NULL),(26,'Format','Format','DataSource','list','Delimited','2014-07-29 12:59:48','user','2014-12-03 13:59:48',NULL);
/*!40000 ALTER TABLE `whitelist_config` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

-- Dump completed on 2016-01-27 15:40:19
