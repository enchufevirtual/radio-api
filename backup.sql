-- MariaDB dump 10.19  Distrib 10.11.3-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: containers-us-west-5.railway.app    Database: railway
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES
('20230405024135-init.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `create_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=182 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES
(1,'Gente estoy nervioso 😱','ev-DWDJuk5B_400x400.jpg',2,'2023-05-22 18:00:01'),
(2,'We are Anonymous. We are Legion. We do not forgive. We do not forget. Expect us. 💀','ev-anonymous.jpeg',3,'2023-05-22 18:22:40'),
(3,'👍😀','ev-DWDJuk5B_400x400.jpg',2,'2023-05-22 20:10:50'),
(4,'no entiendo ','ev-Tres-mujeres-rompiendo-estereotipos-Colombia-02.png',4,'2023-05-22 20:25:19'),
(5,'a ustedes no le salen las imagenes a mi si 🤣','ev-Tres-mujeres-rompiendo-estereotipos-Colombia-02.png',4,'2023-05-22 20:25:35'),
(6,'hola',NULL,6,'2023-05-22 20:46:04'),
(7,'jaja y la imagen jaja','ev-DWDJuk5B_400x400.jpg',2,'2023-05-22 20:46:23'),
(8,'te voy a enviar un ddos',NULL,6,'2023-05-22 15:47:40'),
(9,'ahre',NULL,6,'2023-05-22 15:47:42'),
(10,'Jaja','ev-anonymous.jpeg',3,'2023-05-22 20:47:46'),
(11,'You are crazy ?','ev-anonymous.jpeg',3,'2023-05-22 20:48:02'),
(12,'🤣🤣🤣🤣🤣','ev-DWDJuk5B_400x400.jpg',2,'2023-05-22 20:48:15'),
(13,'xD',NULL,6,'2023-05-22 15:48:29'),
(14,'ahh perro',NULL,7,'2023-05-22 15:52:37'),
(15,'se ponen los ojitos en verde cuando entro al chat',NULL,7,'2023-05-22 15:52:51'),
(16,'ajjajaja','ev-DWDJuk5B_400x400.jpg',2,'2023-05-22 20:53:00'),
(17,'asi es 🙃🙃','ev-DWDJuk5B_400x400.jpg',2,'2023-05-22 20:53:11'),
(18,'está música está buena, ahora que prendo stream me vendrá bien para jugar fornite',NULL,7,'2023-05-22 15:54:12'),
(19,'así saldrá al aire y todos los chavales que me siguen la podrán escuchar',NULL,7,'2023-05-22 15:54:41'),
(20,'es buena idea pero como es de prueba aun no pasen esta url a andie','ev-DWDJuk5B_400x400.jpg',2,'2023-05-22 20:55:24'),
(21,'p8iujyhn[\']\\6yh0-=-85=','ev-DWDJuk5B_400x400.jpg',2,'2023-05-22 20:55:45'),
(22,'👀','ev-anonymous.jpeg',3,'2023-05-22 21:03:35'),
(23,'🤯🤯🤯','ev-avatar.jpg',5,'2023-05-22 21:20:06'),
(24,'Prende pues 🚭','ev-avatar.jpg',5,'2023-05-22 21:37:40'),
(25,'🤘','ev-avatar.jpg',5,'2023-05-22 21:41:06'),
(26,'🤟','ev-avatar.jpg',5,'2023-05-22 21:41:17'),
(27,'se pueden poner una de alci acosta?',NULL,7,'2023-05-22 16:58:13'),
(28,'Esta en autodj','ev-DWDJuk5B_400x400.jpg',2,'2023-05-22 22:17:09'),
(29,'💃','ev-anonymous.jpeg',3,'2023-05-22 22:17:38'),
(30,'Ya luego probamos la transmisión en vivo','ev-DWDJuk5B_400x400.jpg',2,'2023-05-22 22:18:43'),
(31,'por actualizaciones se borraran sus imagenes de perfil, deben actualizarla en su perfil y listo me comunican cualquier error o bug, estamos en prruebas','ev-Tres-mujeres-rompiendo-estereotipos-Colombia-02.png',4,'2023-05-23 22:40:02'),
(32,'no mamen jaja','ev-Tres-mujeres-rompiendo-estereotipos-Colombia-02.png',4,'2023-05-23 23:13:41'),
(34,'😜😜😜',NULL,12,'2023-05-24 12:47:37'),
(36,'mm','ev-unnamed.webp',13,'2023-05-24 20:15:32'),
(37,'Cual error o duda, no duden en escribir','ev-DWDJuk5B_400x400.jpg',2,'2023-05-24 22:59:09'),
(38,'badbunny debes poner 😗',NULL,12,'2023-05-24 18:21:10'),
(39,'💃','ev-DWDJuk5B_400x400.jpg',2,'2023-05-24 23:22:18'),
(40,'men yo quiero transmitir pilas ',NULL,14,'2023-05-24 18:31:50'),
(42,'Esta semana es de prueba, escribeme a whatsapp para mas info','ev-DWDJuk5B_400x400.jpg',2,'2023-05-24 23:34:07'),
(43,'👍pilas',NULL,14,'2023-05-24 18:37:45'),
(44,'nice',NULL,16,'2023-05-25 01:06:12'),
(45,'pon regueton 😁',NULL,12,'2023-05-24 20:14:25'),
(46,'kkk',NULL,18,'2023-05-24 21:52:47'),
(47,'Lo mejor hasta ahora bro✌',NULL,20,'2023-05-24 23:45:03'),
(48,'Pongan Canserbero',NULL,22,'2023-05-25 00:17:47'),
(49,'Bro como pusistes lo iconos😀😀🧭',NULL,20,'2023-05-25 00:35:25'),
(50,'😁','ev-unnamed.webp',13,'2023-05-25 15:42:02'),
(51,'🎶🎵😎',NULL,12,'2023-05-26 18:17:36'),
(52,'Yo también quiero ser del git 🥸','ev-f6a8b3c713e54c3fe3503b1e62eed4ee-b1e1e4f73bbfdb38bbe72f828695cfd5.jpg',42,'2023-05-26 20:06:31'),
(53,'🤪🤪🤪','ev-DWDJuk5B_400x400.jpg',2,'2023-05-27 01:10:44'),
(54,'Los que han tenido problemas para registrar su cuenta, al finalizar el registro deben verificar su correo electrónico, por ello deben colocar un email real, ya que les llegará un mensaje a su  bandeja de entrada o tal vez al spam por primera vez 😉😎','ev-DWDJuk5B_400x400.jpg',2,'2023-05-27 01:15:13'),
(55,'Por favor si tienen algun problema o algun error, no duden es escribirlo, Gracias😁','ev-DWDJuk5B_400x400.jpg',2,'2023-05-27 01:19:34'),
(56,'✌','ev-f6a8b3c713e54c3fe3503b1e62eed4ee-b1e1e4f73bbfdb38bbe72f828695cfd5.jpg',42,'2023-05-26 20:19:59'),
(57,'🤭 This is a test','ev-DWDJuk5B_400x400.jpg',2,'2023-05-28 00:00:18'),
(58,'💀☠','ev-anonymous.jpeg',3,'2023-05-28 00:34:25'),
(59,'jis',NULL,6,'2023-05-28 09:25:55'),
(60,'hello, this is a test\n🤗','ev-DWDJuk5B_400x400.jpg',2,'2023-05-29 15:38:17'),
(61,'ok\n','ev-DWDJuk5B_400x400.jpg',2,'2023-05-29 15:39:43'),
(62,'Olí😎','ev-2E1C80EE-1D3D-407C-B795-3993286DAC74.jpeg',47,'2023-05-29 15:49:34'),
(63,'Ya pude jeje','ev-2E1C80EE-1D3D-407C-B795-3993286DAC74.jpeg',47,'2023-05-29 15:49:41'),
(64,'puedes ver los mensajes\n','ev-DWDJuk5B_400x400.jpg',2,'2023-05-29 15:51:23'),
(65,'Excelente 😈','ev-Rafael_Correa_in_France_(cropped).jpg',12,'2023-05-29 16:07:02'),
(66,'Posi','ev-IMG_20220412_100257_223.jpg',48,'2023-05-30 21:28:58'),
(67,'🥴','ev-DWDJuk5B_400x400.jpg',2,'2023-05-30 21:29:25'),
(68,'Ya pude, befo','ev-IMG_20220412_100257_223.jpg',48,'2023-05-30 21:29:39'),
(69,'Befo','ev-IMG_20220412_100257_223.jpg',48,'2023-05-30 21:29:50'),
(70,'En hora buena','ev-DWDJuk5B_400x400.jpg',2,'2023-05-30 21:30:26'),
(71,'Befoooooo','ev-IMG_20220412_100257_223.jpg',48,'2023-05-30 21:30:49'),
(72,'Befoooooo','ev-IMG_20220412_100257_223.jpg',48,'2023-05-30 21:31:03'),
(73,'Jajajajaja','ev-IMG_20220412_100257_223.jpg',48,'2023-05-30 21:31:09'),
(74,'Jajajaj que te pasa 🤣🤣🤣','ev-DWDJuk5B_400x400.jpg',2,'2023-05-30 21:31:36'),
(89,'This is a test','ev-DWDJuk5B_400x400.jpg',2,'2023-05-31 00:16:44'),
(90,'Success ','ev-DWDJuk5B_400x400.jpg',2,'2023-05-31 00:16:56'),
(91,'hi\n','ev-43916038.jpg',6,'2023-05-31 00:19:03'),
(92,'adios','ev-43916038.jpg',6,'2023-05-31 00:19:09'),
(93,'os','ev-43916038.jpg',6,'2023-05-31 00:19:28'),
(94,'😐','ev-DWDJuk5B_400x400.jpg',2,'2023-05-31 00:19:48'),
(95,'xd','ev-43916038.jpg',6,'2023-05-31 00:20:06'),
(96,'jajajaja',NULL,12,'2023-05-31 09:38:19'),
(97,'🙂',NULL,12,'2023-05-31 09:39:05'),
(98,'bueno creo que hoy empezamos las pruebas de transmisión 😃',NULL,2,'2023-05-31 15:43:50'),
(99,'OEI\n',NULL,49,'2023-05-31 16:47:19'),
(100,'😎 saludos compasdhre\n',NULL,2,'2023-05-31 16:48:51'),
(101,'este es mi avatar, soy guapo',NULL,6,'2023-05-31 17:20:29'),
(102,'soy un bot por si a caso',NULL,6,'2023-05-31 17:20:37'),
(103,'jajajaja',NULL,2,'2023-05-31 17:30:25'),
(104,'ready\n',NULL,49,'2023-05-31 19:36:20'),
(105,'estamos encendidos dj wichy\n',NULL,49,'2023-05-31 19:36:29'),
(106,'😎🎶🎵🎶🎵🎶',NULL,2,'2023-05-31 19:49:02'),
(107,'😎 😎 ',NULL,2,'2023-05-31 19:52:13'),
(108,'Buen proyecto bro, si necesitas ayuda ahi estamos en el grupo',NULL,12,'2023-05-31 20:38:34'),
(109,' esa es bro 🙂',NULL,2,'2023-05-31 20:39:15'),
(110,'😇',NULL,49,'2023-05-31 20:42:45'),
(111,'hi',NULL,6,'2023-05-31 20:47:10'),
(112,'dd',NULL,6,'2023-05-31 20:47:16'),
(113,'helow\n',NULL,49,'2023-05-31 20:55:14'),
(114,'deja el show',NULL,2,'2023-05-31 20:55:49'),
(115,'jjej\npida musica señores oyentes\n',NULL,49,'2023-05-31 20:57:02'),
(116,'🤟',NULL,2,'2023-05-31 20:58:30'),
(117,'💀',NULL,3,'2023-05-31 22:50:30'),
(118,'buenas 🫠',NULL,49,'2023-06-01 15:43:24'),
(119,'🥳🥳🥳🥳',NULL,12,'2023-06-01 16:37:21'),
(120,'Un placer dar los primeros pasos en Radio Enchufe Virtual, sean todos bienvenidos, En la consola Dj Wichy 😎',NULL,2,'2023-06-01 16:38:49'),
(121,'😎',NULL,49,'2023-06-01 16:42:30'),
(122,'Hooliiisss 🥳',NULL,51,'2023-06-01 16:47:53'),
(123,'Pueden poner bad bunny 😃🥳',NULL,12,'2023-06-01 16:50:29'),
(124,'hola hola gente :D dj wichy en la consola\n',NULL,2,'2023-06-01 16:51:11'),
(125,'jejej buenas pidan musica o slaudos',NULL,49,'2023-06-01 16:52:06'),
(126,'Holissss desde Ecuador la tía Wendy 😍',NULL,52,'2023-06-01 16:54:27'),
(127,'Graciaaas djwichy',NULL,12,'2023-06-01 16:54:40'),
(128,'🤯🥸🥳',NULL,12,'2023-06-01 16:54:56'),
(129,'😎',NULL,54,'2023-06-01 16:58:12'),
(130,'🎊🎉🎊🥳👍',NULL,52,'2023-06-01 16:58:47'),
(131,'Ahora jajaja',NULL,54,'2023-06-01 17:02:37'),
(132,'Está chévere la radio para el trabajo ',NULL,54,'2023-06-01 17:02:49'),
(133,'Prendeee pues jaja',NULL,12,'2023-06-01 17:03:01'),
(134,'claro bro pide lo que sea de musica o saludos y compartela\n',NULL,49,'2023-06-01 17:03:07'),
(135,'Pongan ferxxo',NULL,51,'2023-06-01 17:03:21'),
(136,'cual de ferxo?',NULL,49,'2023-06-01 17:03:33'),
(137,'Yandel150',NULL,51,'2023-06-01 17:03:56'),
(138,'vale',NULL,49,'2023-06-01 17:04:06'),
(139,'😘😘',NULL,51,'2023-06-01 17:05:37'),
(140,'🤣🤣',NULL,12,'2023-06-01 17:09:21'),
(141,'pidan musica señores o saludos que se les  complace ',NULL,49,'2023-06-01 17:10:01'),
(142,'Un saludo para mi futura esposa Luisa Espinoza ella aún no lo sabe pero será mi esposa 🤪',NULL,12,'2023-06-01 17:13:17'),
(143,'jeje vale',NULL,49,'2023-06-01 17:14:50'),
(144,'No olviden compartir con sus amigos 😎',NULL,2,'2023-06-01 17:15:58'),
(145,'Saludos para la  familia sornoza moran😘',NULL,50,'2023-06-01 17:19:40'),
(146,'Jajajajaa',NULL,12,'2023-06-01 17:20:48'),
(147,'Hola, pueden mandar saludos al persona de Healthy Bites ',NULL,59,'2023-06-01 17:27:00'),
(148,'claro 😊',NULL,49,'2023-06-01 17:27:30'),
(149,'Jajaja',NULL,12,'2023-06-01 17:29:05'),
(150,'Mandamos a pedir o que 🍻',NULL,12,'2023-06-01 17:30:14'),
(151,'ejjej de una',NULL,49,'2023-06-01 17:30:24'),
(152,'como vamos oyentes ',NULL,49,'2023-06-01 17:44:07'),
(153,'recuerden pedir su musica o saludo k se complace',NULL,49,'2023-06-01 17:44:24'),
(154,'👽',NULL,49,'2023-06-01 17:44:31'),
(155,'😎',NULL,12,'2023-06-01 17:52:09'),
(156,'😎',NULL,49,'2023-06-01 17:58:27'),
(157,'dj wichy se despide nos vemos mañana',NULL,49,'2023-06-01 18:06:58'),
(158,'👽',NULL,49,'2023-06-01 18:07:04'),
(159,'👌',NULL,12,'2023-06-01 18:24:29'),
(160,'Hiba a pedir una Julio jaramillo ',NULL,12,'2023-06-01 18:26:01'),
(161,'Pero ya que jajja',NULL,12,'2023-06-01 18:26:05'),
(162,'No olviden gente que para poder activar su cuenta deben agregar un correo real al registrarse ya que tienen que verificar su cuenta. 😎',NULL,2,'2023-06-01 18:34:23'),
(163,'Radiohead creep esa pon por favor chendo',NULL,64,'2023-06-01 18:36:25'),
(164,'En un rato comienzo transmision bro, ya que estaba transmitiendo Dj Wichy 🤑',NULL,2,'2023-06-01 18:37:10'),
(165,'Pilas soy locogeorge ',NULL,64,'2023-06-01 18:37:32'),
(166,'Pilas en breve empiezo transmisión\nPara que pidan sus musicas favoritas',NULL,2,'2023-06-01 18:38:19'),
(167,'Ah esto sigue jajaja 🥳🥳🥳🥳',NULL,12,'2023-06-01 18:38:36'),
(168,'Las electro estan buenas',NULL,12,'2023-06-01 18:41:24'),
(169,'En breve estamos en vivo',NULL,2,'2023-06-01 18:42:03'),
(170,'Ahoraaaa',NULL,12,'2023-06-01 18:45:01'),
(171,'🤟',NULL,12,'2023-06-01 18:45:10'),
(172,'Alexandra de aventura ',NULL,64,'2023-06-01 18:48:57'),
(173,'😎',NULL,2,'2023-06-01 18:54:52'),
(174,'Gracia mi brother ',NULL,64,'2023-06-01 18:56:11'),
(175,'Te amo Alexandra pero no podemos estar juntos el destino no nos lo permite',NULL,64,'2023-06-01 19:02:03'),
(176,'😎',NULL,2,'2023-06-01 19:15:47'),
(177,'🥸',NULL,12,'2023-06-01 19:33:17'),
(178,'Saludo escuchando desde Canto Pedro Carbo',NULL,70,'2023-06-01 20:24:43'),
(179,'saludos Karina un placer tenerte aqui, ahora la radio está en autodj el día de mañana estaremoc con DJ Wichy saludos 🤠',NULL,2,'2023-06-01 20:25:51'),
(180,'Bueno bendiciones  en su radio muchos éxitos 👏',NULL,70,'2023-06-01 20:29:25'),
(181,'gracias Karina 🤗🤗🤗',NULL,2,'2023-06-01 20:30:56');
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `social`
--

DROP TABLE IF EXISTS `social`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `social` (
  `id` int NOT NULL AUTO_INCREMENT,
  `facebook` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `create_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `social_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social`
--

LOCK TABLES `social` WRITE;
/*!40000 ALTER TABLE `social` DISABLE KEYS */;
INSERT INTO `social` VALUES
(1,'enchufevirtual','chendodev','chendodev','chendodev',2,'2023-05-22 17:57:06'),
(2,'expectusweareclose','expectusweareclose','expectusweareclose','expectusweareclose',3,'2023-05-22 18:22:00'),
(3,NULL,NULL,NULL,NULL,6,'2023-05-22 20:47:25'),
(4,NULL,NULL,NULL,NULL,4,'2023-05-23 22:38:54'),
(5,NULL,NULL,NULL,NULL,5,'2023-05-23 23:16:16'),
(6,NULL,NULL,NULL,NULL,13,'2023-05-24 20:08:29'),
(7,NULL,NULL,NULL,NULL,20,'2023-05-25 04:43:10'),
(8,NULL,NULL,NULL,NULL,12,'2023-05-26 23:16:42'),
(9,NULL,NULL,NULL,NULL,42,'2023-05-27 01:05:54'),
(10,NULL,NULL,NULL,NULL,70,'2023-06-01 20:27:37');
/*!40000 ALTER TABLE `social` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `token` varchar(255) DEFAULT NULL,
  `confirm` varchar(255) DEFAULT '0',
  `create_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(2,'chendodev@gmail.com','Chendo','$2b$10$EpgxlCJ65gfrWVH428XAe.1kIHusx0lJ4FTouAE.B3mm5D9KDbs46','Hola soy chendo y esta es la nueva era','ev-chendo.jpg','user',NULL,'1','2023-05-22 17:53:55'),
(3,'anonymous@gmail.com','anonymous','$2b$10$jtqjSmp2AnD9PV8FwhfeX.c8sGMOSNaPTcxNEsFYu1FN/xJXECsv6','We are Anonymous. We are Legion. We do not forgive. We do not forget. Expect us.','ev-anonymous.jpeg','user',NULL,'1','2023-05-22 18:16:26'),
(4,'sofia@gmail.com','sofia','$2b$10$7trYmbXDu9K.74nK7kxLauWTGFpqoHCJIbglZWBT1IqBAOV2dfQz6','La vida es bella','ev-Tres-mujeres-rompiendo-estereotipos-Colombia-02.png','user',NULL,'1','2023-05-22 20:24:20'),
(5,'avatar@gmail.com','avatar','$2b$10$Vz5APb1FKigzTvylZ1wpwuiMuYOvMQIYUzuq2icPlsMJJ2lBQrvPa','null','ev-avatar.jpg','user',NULL,'1','2023-05-22 20:29:14'),
(6,'daveseva2010@hotmail.es','Dave','$2b$10$KKdZ7pUZaP3yCNjiLukT/.4E1934oi1vbjPk94ces4ecyowzjagL2','null','ev-43916038.jpg','user',NULL,'1','2023-05-22 20:43:48'),
(7,'Christianherrera92@hotmail.com','VEGETTA SIETE SIETE SIETE','$2b$10$k7yhhaK5myOQ2wRs7Q3zSeAaVUaPm37N0q54fkueY2xRXcy2jcfgW',NULL,'ev-805c4591aeeda14a97cbde5bbfb41a70.jpg','user',NULL,'1','2023-05-22 15:44:43'),
(12,'steven@gmail.com','Steven Duarte','$2b$10$GJIABHUt6FfBvBktiMOICukdnZc7BvRtiAwU7TazYrCzliJmtAlre','Soy el mejor','ev-Rafael_Correa_in_France_(cropped).jpg','user',NULL,'1','2023-05-24 12:46:33'),
(13,'chendodiesel@gmail.com','theking','$2b$10$BHH.ub2TwIfg.qga6T3ayO/DcGr4DxO5mfI7TbZsormrGgRifnmlO','Soy la potra que no puedes domar 👩‍🚀','ev-unnamed.webp','user',NULL,'1','2023-05-24 17:49:47'),
(14,'chendoec@gmail.com','masterdjpro','$2b$10$6nY4nOCsh0Vzm2/ooR7PU.vZMe1ukaTtoXHBebkRZdaXWSVw0ga.6',NULL,'ev-hand-1850120_1280.jpg','user',NULL,'1','2023-05-24 23:27:35'),
(15,'test@test.com','Test test','$2b$10$g1iI/seAznmF4uiRAPPToOzEmOA2pSpsUzW/reSzH4CoI2vPqGIXC',NULL,NULL,'user',NULL,'1','2023-05-25 01:04:45'),
(16,'ronemi5811@farebus.com','Test test','$2b$10$ORLMtMYOmwyPEM1QZ9xdu.DulC6Xn.5oV12xzFvpnZfq15XdyaTwS',NULL,NULL,'user',NULL,'1','2023-05-25 01:05:07'),
(17,'cekax68391@mevori.com','SQS SQS SQS','$2b$10$BmrssSNKAXsb4vB7e.ANi.GdJ8Gvhg/00iYjvUghjwlZMIjyqyUce',NULL,NULL,'user',NULL,'1','2023-05-25 02:45:44'),
(18,'rsanchezbaltodano@gmail.com','Rolando','$2b$10$qoM0M4RxtW25eTBF/PBe6ugPgjBvajBCLPavvkyR.p5HRa30J2j.q',NULL,'ev-original.jpg','user',NULL,'1','2023-05-25 02:51:03'),
(19,'correo@correo.com','Mynor','$2b$10$cnaB7mgh9I4W0Gn3mhiVEec6b8goNPdbQ1qLO7l.roNlySznTIdJq',NULL,'ev-inbound3736539217811302241.jpg','user',NULL,'1','2023-05-25 03:36:42'),
(20,'chendodiesel@hotmail.com','Danilo','$2b$10$LKm6flkq.kcY573lbL9dT.KvKghMa5q8qIfdGx7cGGW.2YGvoIRdO','null','ev-6be98c76e7e19a5c0c630b9b999f2e5d--motorcycle-couples.jpg','user',NULL,'1','2023-05-25 04:38:19'),
(21,'pedrito@gmail.com','Pedro','$2b$10$v1fjWx1suKynEnG.oDqra.nByNcXpyiKfP20I1We58usmsv6UE17O',NULL,NULL,'user',NULL,'1','2023-05-25 04:56:11'),
(22,'juanelo@spartanchk.xyz','Juanelo','$2b$10$9r0QtEhX3q2ECxMzoN2zNeY09sVBV1jkf67EcM3O.Kq9v08vwYut.',NULL,'ev-anime-anime-girl.gif','user',NULL,'1','2023-05-25 05:14:08'),
(23,'Chch@ynsh.com','Chch','$2b$10$cj16OIXEAAnYLHkx/W2/IuJW.Qzo9VZ1l4hIuFVNkDvQ0SA.tjVPu',NULL,'ev-inbound4351520493072233402.png','user',NULL,'1','2023-05-25 05:49:31'),
(24,'lugoman58@gmail.com','Kkkk','$2b$10$z52hCFgrK97cil1ODsLkIOVTIVtwCE7Jk8JEpjJJHDqNcnoLq4wUu',NULL,NULL,'user',NULL,'1','2023-05-25 06:52:02'),
(25,'dan10gera10@gmail.com','Gerardo ','$2b$10$eMIvyhxYV/HoZNSMv7R5juIwAj9Pm4c7SUb0RNg0IUTG4NP3K8rOS',NULL,NULL,'user',NULL,'1','2023-05-25 07:59:31'),
(26,'abranzhrl@gmail.com','Abraham Rodríguez Lavado','$2b$10$poFneMIRfCVMi5823FXhE.Bdxxv1QKX9kAExAVK0D/08lM3Kw59RK',NULL,NULL,'user',NULL,'1','2023-05-25 17:07:19'),
(27,'netxrl03@gmail.com','Abraham Rodríguez Lavado','$2b$10$EG/W.o5KsUyJq6EWAHv.ZO/1rvd.3c2rvIFUDKhx19Bg/laDFm1L6',NULL,NULL,'user',NULL,'1','2023-05-25 17:07:29'),
(42,'jorge.delpezo@ug.edu.ec','La Ug','$2b$10$yPdQSjXm9KTdyyTENlivIelYJQv7g3z8EAgzU245G4x9Fqo6DCzMa','null','ev-f6a8b3c713e54c3fe3503b1e62eed4ee-b1e1e4f73bbfdb38bbe72f828695cfd5.jpg','user',NULL,'1','2023-05-27 00:58:15'),
(47,'Meliruizmr8@gmail.com','Nena','$2b$10$T7GxqzkixMkFFXoQlGDGzubhqXGeLZE6Ash/zmbZDDQfVAjkgd8b.',NULL,'ev-2E1C80EE-1D3D-407C-B795-3993286DAC74.jpeg','user',NULL,'1','2023-05-29 15:45:13'),
(48,'denisse_10echeverria@hotmail.com','Vanessa ','$2b$10$v3Njk09/BTIWNEx.aA9TbebSV4uGrd5cQ.7Tp1.G2H5MO0O50GbiK',NULL,'ev-IMG_20220412_100257_223.jpg','user',NULL,'1','2023-05-30 21:22:43'),
(49,'wichyrankeado@gmail.com','luis sornoza','$2b$10$eD34ViJr1MiQibIQRWSbOeow93g8MSd6bcb6Yl4HEhRfxijYgVMji',NULL,'ev-2019_11_15_07_37_IMG_3176.JPG','user',NULL,'1','2023-05-31 16:44:00'),
(50,'yamilethcollazos7@gmail.com','Yamileth ','$2b$10$sXjxK363W45IOWxeESDk1.KnnwQ.5U6hKkFCQADEY0y201t.MuAXG',NULL,NULL,'user',NULL,'1','2023-05-31 19:18:06'),
(51,'rsmmady6@gmail.com','Mady ','$2b$10$NeXzNYUpU1fZcZsm7fEZ9eb8cbriBI2mEmIxO3RVeG00jm0rpbFmO',NULL,'ev-Screenshot_2023-05-25-22-49-29-30_6012fa4d4ddec268fc5c7112cbb265e7.jpg','user',NULL,'1','2023-06-01 16:44:22'),
(52,'wendymaricela789@gmail.com','Wendy','$2b$10$Dzv3Kx7qRnwXSZD9waYIh.85Z2gSavyClQN9y9zOcY7AHm4VvP0vq',NULL,'ev-1685623930779.jpg','user',NULL,'1','2023-06-01 16:51:31'),
(53,'ostinanchundia@gmail.com','Karen','$2b$10$7w37ZWxfGLH6sfWeLmO1wuBtOCWsDasIQAz/.axzG5BpArAA3RzXe',NULL,NULL,'user',NULL,'1','2023-06-01 16:53:49'),
(54,'jipson914@gmail.com','Jipson castro ','$2b$10$Vyk8Q5tsOemmTNMXpmtGHOO2fHptMu.zk0zkE28dFa3fueZxAzkuu',NULL,NULL,'user',NULL,'1','2023-06-01 16:56:42'),
(55,'yamilehtbrinez119@gmail.com','Yami','$2b$10$LORI6GlU/Mfw0ujVzDB9TOPmRvK2aJmB0cve.lyq/tFX6PFuODgmq',NULL,'ev-Screenshot_2023-05-30-11-07-36-30_965bbf4d18d205f782c6b8409c5773a4.jpg','user','1h1runmabo5u3umtmg5g','0','2023-06-01 17:05:25'),
(56,'brinezyami6@gmail.com','Yami','$2b$10$DQRgF6xvEwsA4i2tX.mF6uGbV7xlV2xsQMUcDUXbolTC4sW3wOd3S',NULL,NULL,'user','1h1rup42k73cudap4et8','0','2023-06-01 17:06:12'),
(57,'garsus4-@hotmail.com','Susana','$2b$10$GuZiZOHer9A2xgFSKPeZ5OWmT/FX.zPtmlMriA8TUnN/80S908yV6',NULL,NULL,'user','1h1rv01vl0plijvst36g','0','2023-06-01 17:09:59'),
(58,'garsu4-@hotmail.com','Susana','$2b$10$9su7pin9EJZ7.AaSci.k7eN0eHExebr94MWJsK94J6JSX0YDE7L5q',NULL,NULL,'user','1h1rv9kuji8kg2m9nkag','0','2023-06-01 17:15:13'),
(59,'stefychoez_96@hotmail.com','Stefany','$2b$10$QQvx5AO7ZCKAgchO1HLpG.jWnRCQHB3eZwiJE/tYvz6N5X0apTV16',NULL,NULL,'user',NULL,'1','2023-06-01 17:19:28'),
(60,'patricia15caliz@gmail.com','Patty','$2b$10$FtW5koaMwPj59Z1hXnhioOwFc8NuRyzTRug5E3Fmgsfc9ty0N8.2u',NULL,'ev-IMG-20230601-WA0020.jpg','user',NULL,'1','2023-06-01 17:33:22'),
(61,'jusbriker180501@gmail.com','Paola Choez ','$2b$10$d0uyv8/W1SonbzjsIQhLF.8.2RkgKfd0tokdUwEpqIdTAPkz2P4QO',NULL,NULL,'user',NULL,'1','2023-06-01 17:39:44'),
(62,'jessica_ortiz21014@hotmail.com','Jessica','$2b$10$tCMuYMUd0xzyGZ9tWx.f.OrPsDxED.M5BHR5coQ87bZkXAImsgxxq',NULL,NULL,'user','1h1s2opgmh490ag7gln8','0','2023-06-01 18:15:55'),
(63,'michaelmorla23@gmail.com','MICHAEL MORLA ','$2b$10$bn6R/p7wvGJpdoExCn47O.uo1MZT3B3jeBq/JFbsEThjuf7y6iyPW',NULL,'ev-IMG_1888.jpeg','user',NULL,'1','2023-06-01 18:30:54'),
(64,'quintogeorge12@gmail.com','George','$2b$10$Xc05oWvNShkRvqnjPzBHHeUCjx3B26Xj05MHoiJqDVeAZI5z/K7la',NULL,NULL,'user',NULL,'1','2023-06-01 18:33:22'),
(65,'karogarzon185@gmail.com','Lissette garzon','$2b$10$dvENSsxn9Tj.mBi7uCoGDet8V4xehnt/8ma1vyXXRLgxUUqTScX1u',NULL,NULL,'user',NULL,'1','2023-06-01 18:36:27'),
(66,'jordy_flow15@hotmail.com','Jordy ','$2b$10$1YYecWVdftV6zudrqKHp7uaeW1IYPTRLwKaQjk3OgEy3qDcrfrfE6',NULL,NULL,'user','1h1s4a8moh6tk7qbruv','0','2023-06-01 18:42:56'),
(67,'jordycantos23@hotmail.com','Jordy','$2b$10$k9jH04q5B1DuE1BmCw.tp.3V2UIcgn2MfxrEsHInMEkdcl8GWTpu.',NULL,'ev-IMG_20230530_204928_449.jpg','user','1h1s4d72rsng5esek5d8','0','2023-06-01 18:44:33'),
(68,'andreamoranp5@gmail.com','Andrea','$2b$10$3Nb6E2kosVCqbr5LxSUaSuXT55mzddr3TFYwUNgZ7d1tKQtPS0LY6',NULL,NULL,'user',NULL,'1','2023-06-01 20:04:51'),
(69,'karinabanchon48@gmail.com','Karina banchon ','$2b$10$UldzZk04S2X/48lVIR2jIeX8m8Za/u39rwGn5LW8udlmpEwiyxjua',NULL,NULL,'user','1h1s996ml03kl8lranfg','0','2023-06-01 20:09:44'),
(70,'karinabanchon40@gmail.com','Karina Banchon','$2b$10$l48ZdeCBfzhgA70PFaAewO2TFpRTCeXParMbdXVv2WJ5Oa7ZwRkeq','null','ev-Snapchat-1811256142.jpg','user',NULL,'1','2023-06-01 20:10:40');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-01 17:45:28
