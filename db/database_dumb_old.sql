-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 13, 2023 at 08:19 AM
-- Server version: 8.2.0
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Robinhood`
--
CREATE DATABASE IF NOT EXISTS `Robinhood` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `Robinhood`;

-- --------------------------------------------------------

--
-- Table structure for table `change_log`
--

CREATE TABLE `change_log` (
  `change_id` int NOT NULL,
  `old_title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `new_title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `old_detail` text COLLATE utf8mb4_general_ci NOT NULL,
  `new_detail` text COLLATE utf8mb4_general_ci NOT NULL,
  `old_status` int NOT NULL,
  `new_status` int NOT NULL,
  `change_by_uid` int NOT NULL,
  `change_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `t_id` int NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL,
  `archive` tinyint NOT NULL DEFAULT '0' COMMENT '0=not archive,1=archive',
  `create_by_uid` int NOT NULL,
  `create_datetime` datetime NOT NULL,
  `update_by_uid` int DEFAULT NULL,
  `update_datetime` datetime DEFAULT NULL,
  `archive_datetime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_comment`
--

CREATE TABLE `task_comment` (
  `tc_id` int NOT NULL,
  `comment` text COLLATE utf8mb4_general_ci NOT NULL,
  `create_by_uid` int NOT NULL,
  `create_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `uid` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `display_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '1=active,0=inactive',
  `create_datetime` datetime NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `gender` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `update_datetime` datetime DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0=not delete,1=delete',
  `delete_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `change_log`
--
ALTER TABLE `change_log`
  ADD PRIMARY KEY (`change_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`t_id`);

--
-- Indexes for table `task_comment`
--
ALTER TABLE `task_comment`
  ADD PRIMARY KEY (`tc_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uid`),
  ADD KEY `username` (`username`),
  ADD KEY `display_name` (`display_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `change_log`
--
ALTER TABLE `change_log`
  MODIFY `change_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `t_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_comment`
--
ALTER TABLE `task_comment`
  MODIFY `tc_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `uid` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
