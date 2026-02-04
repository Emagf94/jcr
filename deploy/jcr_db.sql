-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-02-2026 a las 02:39:31
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `jcr_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) UNSIGNED NOT NULL,
  `sku` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `brand` varchar(50) DEFAULT NULL,
  `quantity` int(11) DEFAULT 0,
  `min_stock` int(11) DEFAULT 5,
  `buy_price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) NOT NULL,
  `location` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventory`
--

INSERT INTO `inventory` (`id`, `sku`, `name`, `category`, `brand`, `quantity`, `min_stock`, `buy_price`, `sale_price`, `location`, `description`, `created_at`, `updated_at`) VALUES
(1, 'PROD-81678', 'aceite motul', 'Aceites & Lubricantes', 'motul', 9, 2, 20000.00, 80000.00, '', '', '2026-02-04 00:35:12', '2026-02-04 01:25:31'),
(2, 'PROD-9314', 'llanta', 'Llantas & Neumáticos', 'PIRELLI', 2, 2, 100000.00, 250000.00, '', '', '2026-02-04 00:36:00', '2026-02-04 00:36:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `maintenance_photos`
--

CREATE TABLE `maintenance_photos` (
  `id` int(11) NOT NULL,
  `maintenance_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `maintenance_photos`
--

INSERT INTO `maintenance_photos` (`id`, `maintenance_id`, `file_path`, `uploaded_at`) VALUES
(1, 3, 'uploads/maintenance/698101ce0d241.png', '2026-02-02 19:58:06'),
(2, 3, 'uploads/maintenance/698101ce0da5c.png', '2026-02-02 19:58:06'),
(3, 4, 'uploads/maintenance/69828abf83ab2.png', '2026-02-03 23:54:39'),
(4, 4, 'uploads/maintenance/69828abf840fd.png', '2026-02-03 23:54:39'),
(5, 5, 'uploads/maintenance/69828f92c7dfe.png', '2026-02-04 00:15:14'),
(6, 6, 'uploads/maintenance/698290b79bcdf.jpg', '2026-02-04 00:20:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `maintenance_records`
--

CREATE TABLE `maintenance_records` (
  `id` int(11) NOT NULL,
  `motorcycle_id` int(11) NOT NULL,
  `service_type` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `mileage` int(11) DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `mechanic_name` varchar(100) DEFAULT NULL,
  `mechanic_notes` text DEFAULT NULL,
  `service_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `maintenance_records`
--

INSERT INTO `maintenance_records` (`id`, `motorcycle_id`, `service_type`, `description`, `mileage`, `cost`, `mechanic_name`, `mechanic_notes`, `service_date`) VALUES
(1, 2, 'Mantenimiento Preventivo', 'estaba podrida', 15000, 200000.00, NULL, 'le falta un tornillo', '2026-02-02 04:48:36'),
(2, 1, 'Mantenimiento Preventivo', 'joa que vaina bonita, la moto quedo 10 de 10 se le hizo un pocoton de cosa', 20000, 150000.00, 'dev', 'le falta una lavadita', '2026-02-02 05:00:00'),
(3, 1, 'Cambio de Aceite', 'casi no llega joa', 120000, 2000000.00, 'johan', 'esa vaina estaba pelua', '2026-02-02 19:58:06'),
(4, 1, 'Cambio de Aceite', 'joa que caina', 15000, 200000.00, 'johan', 'ajasjasjsa', '2026-02-03 23:54:39'),
(5, 1, 'Mantenimiento Preventivo', 'n1', 20000, 12000.00, 'johan', 'n1', '2026-02-04 00:15:14'),
(6, 1, 'Servicios Múltiples', '[{\"service_type\":\"Mantenimiento Preventivo\",\"description\":\"guayas\",\"cost\":\"12000\"},{\"service_type\":\"Cambio de Aceite\",\"description\":\"wd40\",\"cost\":\"58000\"},{\"service_type\":\"Lavado\",\"description\":\"joa que vaina pa sucia\",\"cost\":\"20000\"}]', 150000, 90000.00, 'johan', 'casi no se salva esa vaina', '2026-02-04 00:20:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `motorcycles`
--

CREATE TABLE `motorcycles` (
  `id` int(11) NOT NULL,
  `owner_name` varchar(100) NOT NULL,
  `owner_id` varchar(20) NOT NULL,
  `owner_address` varchar(255) DEFAULT NULL,
  `owner_email` varchar(100) DEFAULT NULL,
  `owner_phone` varchar(20) DEFAULT NULL,
  `owner_mobile` varchar(20) DEFAULT NULL,
  `brand` varchar(50) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `license_plate` varchar(20) NOT NULL,
  `model` varchar(50) DEFAULT NULL,
  `soat_expiry` date DEFAULT NULL,
  `technomechanical_expiry` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `motorcycles`
--

INSERT INTO `motorcycles` (`id`, `owner_name`, `owner_id`, `owner_address`, `owner_email`, `owner_phone`, `owner_mobile`, `brand`, `type`, `license_plate`, `model`, `soat_expiry`, `technomechanical_expiry`, `created_at`, `updated_at`) VALUES
(1, 'Emmanuel Wesly Gutierrez Ferrer', '1022397619', 'Cll 23 # 4-104', 'emagf94@gmail.com', '3184849332', '3184849332', 'Yamaha', 'Sport', 'VNN89G', 'MT15', '2027-02-02', '2027-02-02', '2026-02-02 03:37:09', '2026-02-02 03:37:09'),
(2, 'pepito perez', '1022397619', 'Cll 23 # 4-104', 'emagf94@gmail.com', '6720892', '31848499332', 'Honda', 'Scooter', 'ada54a', 'PCX 160', NULL, NULL, '2026-02-02 04:23:29', '2026-02-02 04:23:29'),
(3, 'juanito pepolis', '1231321321', 'lshna132231', 'ejemplo@ejemplo.com', '3213211234', '321321123', 'Hero', 'Calle', 'jlk52E', 'Eco Deluxe', NULL, NULL, '2026-02-04 00:04:54', '2026-02-04 00:04:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sales`
--

CREATE TABLE `sales` (
  `id` int(11) UNSIGNED NOT NULL,
  `product_id` int(11) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `sold_by` varchar(100) DEFAULT NULL,
  `sale_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sales`
--

INSERT INTO `sales` (`id`, `product_id`, `quantity`, `unit_price`, `total_price`, `sold_by`, `sale_date`) VALUES
(1, 1, 1, 80000.00, 80000.00, 'johan', '2026-02-04 01:25:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('developer','owner','mechanic') DEFAULT 'mechanic',
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `created_at`, `role`, `status`) VALUES
(1, 'dev', '$2y$10$WSvNmOLlhdZhawNv6z6vtefmdu7RYDys0sZqeRzvDaMCUWuFXBSW6', 'Desarrollador Principal', '2026-01-22 13:26:01', 'developer', 1),
(7, 'johan', '$2y$10$Gfje7VMYPCZYLehxEvtRp.IuleWoKLgkg3K5xDq5ERLYIBObt5jBq', 'Johan', '2026-01-22 18:43:49', 'owner', 1),
(8, 'wilber', '$2y$10$csFCZzJsPAo8vTnSKXXauOSE4nn8YKJeYRLABSwDha3tSEWVTNJ0.', 'Wilber', '2026-01-22 18:50:36', 'mechanic', 1),
(10, 'elias', '$2y$10$dDJbhKDtz9zYbV/oODGVxOIoSfs4yiAa6OYXtjc7jeihN/mXAMK1G', 'Elias Garcia', '2026-02-02 03:01:39', 'mechanic', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`);

--
-- Indices de la tabla `maintenance_photos`
--
ALTER TABLE `maintenance_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `maintenance_id` (`maintenance_id`);

--
-- Indices de la tabla `maintenance_records`
--
ALTER TABLE `maintenance_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `motorcycle_id` (`motorcycle_id`);

--
-- Indices de la tabla `motorcycles`
--
ALTER TABLE `motorcycles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `license_plate` (`license_plate`);

--
-- Indices de la tabla `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `maintenance_photos`
--
ALTER TABLE `maintenance_photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `maintenance_records`
--
ALTER TABLE `maintenance_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `motorcycles`
--
ALTER TABLE `motorcycles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `maintenance_photos`
--
ALTER TABLE `maintenance_photos`
  ADD CONSTRAINT `maintenance_photos_ibfk_1` FOREIGN KEY (`maintenance_id`) REFERENCES `maintenance_records` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `maintenance_records`
--
ALTER TABLE `maintenance_records`
  ADD CONSTRAINT `maintenance_records_ibfk_1` FOREIGN KEY (`motorcycle_id`) REFERENCES `motorcycles` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `inventory` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
