-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 13, 2023 at 07:49 PM
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
CREATE DATABASE IF NOT EXISTS `Robinhood` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `Robinhood`;

-- --------------------------------------------------------

--
-- Table structure for table `change_log`
--

CREATE TABLE `change_log` (
  `change_id` int NOT NULL,
  `t_id` int NOT NULL,
  `old_title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `new_title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `old_detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `new_detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
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
  `t_id` int NOT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_by_uid` int NOT NULL,
  `create_datetime` datetime NOT NULL,
  `update_datetime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `uid` int NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `display_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '1=active,0=inactive',
  `create_datetime` datetime NOT NULL,
  `create_by_uid` int DEFAULT NULL,
  `update_datetime` datetime DEFAULT NULL,
  `update_by_uid` int DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0=not delete,1=delete',
  `delete_datetime` datetime DEFAULT NULL,
  `delete_by_uid` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`uid`, `username`, `password`, `display_name`, `email`, `status`, `create_datetime`, `create_by_uid`, `update_datetime`, `update_by_uid`, `is_delete`, `delete_datetime`, `delete_by_uid`) VALUES
(1, 'robo1', '$2a$10$lh8TqeRVLDcshR88sTjDp.cR/mCnWQ5x7VfKSrS/GiElMb5r6qmna', 'robo', 'Alvis.Hammes@gmail.com', 1, '2023-12-13 12:18:27', 1, NULL, NULL, 0, NULL, NULL),
(2, 'robo2', '$2a$10$iAbsQbTJf97dneK0BOhMGOifok07p/7wQ4/xc766bV5vWHT5nn0nq', 'robo2', 'Corrine16@yahoo.com', 1, '2023-12-13 14:58:22', 1, NULL, NULL, 0, NULL, NULL),
(3, 'robo3', '$2a$10$4ucKKSqvlwxe/v6A.EAiAef21fgzgsnkrF.z9Sfpb7xMFmcj8FzVy', 'robo3', 'Demarco78@hotmail.com', 1, '2023-12-13 14:58:35', 1, NULL, NULL, 0, NULL, NULL),
(4, 'robo4', '$2a$10$8dF6lH20gBJkV40QweAgr.XuQfEY5gF6A/pau7XdvPPkmrg1Vcp.q', 'robo4', 'Ewell60@yahoo.com', 1, '2023-12-13 14:58:40', 1, NULL, NULL, 0, NULL, NULL),
(5, 'robo5', '$2a$10$42j8JZ1X6AxC584Ld71iaOt.bIhP5VLXrH2yME7Rvb09jfNsbxukG', 'robo5', 'Tatyana70@hotmail.com', 1, '2023-12-13 14:58:47', 1, NULL, NULL, 0, NULL, NULL),
(6, 'robo6', '$2a$10$MvRcJcp.UCGZZqltt5q6U.UqOSq4nZEk.S7bLM6QjiuV0hpjNVV3G', 'robo6', 'Clemens_Nader@yahoo.com', 1, '2023-12-13 14:58:54', 1, NULL, NULL, 0, NULL, NULL),
(7, 'robo7', '$2a$10$xDAfZh.Ps5NVUwW4oeXstOJAMV1LfiPto3cp0sBGpOaQKE0JICaOy', 'robo7', 'Viviane_Collier@gmail.com', 1, '2023-12-13 18:32:45', 1, NULL, NULL, 0, NULL, NULL),
(8, 'robo8', '$2a$10$.qA1eKXG6zBsM4n2NRTPm.R/l8SmZjoVXIDfteDdR8T3KFUzLMza6', 'robo8', 'Camryn16@gmail.com', 1, '2023-12-13 19:04:31', 1, NULL, NULL, 0, NULL, NULL);

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
  MODIFY `uid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
