SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE TABLE IF NOT EXISTS `REGION` (
  `id_region` INT NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_region`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `COMUNA` (
  `id_comuna` INT NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  `id_region` INT NOT NULL,
  PRIMARY KEY (`id_comuna`),
  INDEX `fk_COMUNA_REGION_idx` (`id_region` ASC) VISIBLE,
  CONSTRAINT `fk_COMUNA_REGION`
    FOREIGN KEY (`id_region`)
    REFERENCES `REGION` (`id_region`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `PERFIL` (
  `id_perfil` INT NOT NULL,
  `tipo_perfil` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_perfil`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `AUTENTIFICAR` (
  `id_autentificar` INT NOT NULL AUTO_INCREMENT,
  `nombre_usuario` VARCHAR(45) NOT NULL,
  `contrasena` VARCHAR(45) NOT NULL,
  `id_perfil` INT NOT NULL,
  INDEX `fk_AUTENTIFICAR_PERFIL1_idx` (`id_perfil` ASC) VISIBLE,
  PRIMARY KEY (`id_autentificar`),
  CONSTRAINT `fk_AUTENTIFICAR_PERFIL1`
    FOREIGN KEY (`id_perfil`)
    REFERENCES `PERFIL` (`id_perfil`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `GUARDIA` (
  `rut_guarida` VARCHAR(12) NOT NULL,
  `p_nombre` VARCHAR(50) NOT NULL,
  `s_nombre` VARCHAR(45) NULL,
  `p_apellido` VARCHAR(45) NOT NULL,
  `s_apellido` VARCHAR(45) NOT NULL,
  `fecha_nac` DATE NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `telefono` INT NOT NULL,
  `direccion` VARCHAR(45) NOT NULL,
  `foto_perfil` VARCHAR(300) NOT NULL,
  `id_comuna` INT NOT NULL,
  `id_autentificar` INT NOT NULL,
  PRIMARY KEY (`rut_guarida`),
  INDEX `fk_GUARDIA_COMUNA1_idx` (`id_comuna` ASC) VISIBLE,
  INDEX `fk_GUARDIA_AUTENTIFICAR1_idx` (`id_autentificar` ASC) VISIBLE,
  CONSTRAINT `fk_GUARDIA_COMUNA1`
    FOREIGN KEY (`id_comuna`)
    REFERENCES `COMUNA` (`id_comuna`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_GUARDIA_AUTENTIFICAR1`
    FOREIGN KEY (`id_autentificar`)
    REFERENCES `AUTENTIFICAR` (`id_autentificar`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `TIPO_SOLICITUD` (
  `id_tipo_sol` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_tipo_sol`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `ADMINISTRADOR` (
  `rut_admin` VARCHAR(12) NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
 `id_autentificar` INT NOT NULL,
  PRIMARY KEY (`rut_admin`),
  INDEX `fk_ADMINISTRADOR_AUTENTIFICAR1_idx` (`id_autentificar` ASC) VISIBLE,
  CONSTRAINT `fk_ADMINISTRADOR_AUTENTIFICAR1`
    FOREIGN KEY (`id_autentificar`)
    REFERENCES `AUTENTIFICAR` (`id_autentificar`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `SOLICITUD` (
  `id_solicitud` INT NOT NULL AUTO_INCREMENT,
  `detalle_solicitud` VARCHAR(300) NOT NULL,
  `fecha` DATE NOT NULL,
  `justificacion` VARCHAR(300) DEFAULT 'Sin Justificación',
  `estado` VARCHAR(20) DEFAULT 'En espera',
  `id_tipo_sol` INT NOT NULL,
  `rut_admin` VARCHAR(12) NULL,
  `rut_guarida` VARCHAR(12) NOT NULL,
  PRIMARY KEY (`id_solicitud`),
  INDEX `fk_SOLICITUD_TIPO_SOLICITUD1_idx` (`id_tipo_sol` ASC) VISIBLE,
  INDEX `fk_SOLICITUD_ADMINISTRADOR1_idx` (`rut_admin` ASC) VISIBLE,
  INDEX `fk_SOLICITUD_GUARDIA1_idx` (`rut_guarida` ASC) VISIBLE,
  CONSTRAINT `fk_SOLICITUD_TIPO_SOLICITUD1`
    FOREIGN KEY (`id_tipo_sol`)
    REFERENCES `TIPO_SOLICITUD` (`id_tipo_sol`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_SOLICITUD_ADMINISTRADOR1`
    FOREIGN KEY (`rut_admin`)
    REFERENCES `ADMINISTRADOR` (`rut_admin`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_SOLICITUD_GUARDIA1`
    FOREIGN KEY (`rut_guarida`)
    REFERENCES `GUARDIA` (`rut_guarida`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `SEDE` (
  `id_sede` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `direccion` VARCHAR(200) NOT NULL,
  `telefono` INT NOT NULL,
  `correo` VARCHAR(200) NOT NULL,
  `foto` VARCHAR(300),
  `id_comuna` INT NOT NULL,
  PRIMARY KEY (`id_sede`),
  INDEX `fk_SEDE_COMUNA1_idx` (`id_comuna` ASC) VISIBLE,
  CONSTRAINT `fk_SEDE_COMUNA1`
    FOREIGN KEY (`id_comuna`)
    REFERENCES `COMUNA` (`id_comuna`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `TURNO` (
  `id_turno` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `horario_inicio` VARCHAR(45) NOT NULL,
  `hora_fin` VARCHAR(45) NOT NULL,
  `remuneracion` INT NOT NULL,
  `ctd_guardias` INT NOT NULL,
  `id_sede` INT NOT NULL,
  PRIMARY KEY (`id_turno`),
  INDEX `fk_TURNO_SEDE1_idx` (`id_sede` ASC) VISIBLE,
  CONSTRAINT `fk_TURNO_SEDE1`
    FOREIGN KEY (`id_sede`)
    REFERENCES `SEDE` (`id_sede`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `DESCUENTO` (
  `id_descuento` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(100) NOT NULL,
  `valor_dcto` FLOAT NOT NULL,
  PRIMARY KEY (`id_descuento`))
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `ASIGNACION_TURNO` (
  `id_asignacion` INT NOT NULL AUTO_INCREMENT,
  `rut_guarida` VARCHAR(12) NOT NULL,
  `estado` TINYINT NULL,
  `id_turno` INT NOT NULL,
  PRIMARY KEY (`id_asignacion`),
  INDEX `fk_ASIGNACION_TURNO_GUARDIA1_idx` (`rut_guarida` ASC) VISIBLE,
  INDEX `fk_ASIGNACION_TURNO_TURNO1_idx` (`id_turno` ASC) VISIBLE,
  CONSTRAINT `fk_ASIGNACION_TURNO_GUARDIA1`
    FOREIGN KEY (`rut_guarida`)
    REFERENCES `GUARDIA` (`rut_guarida`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ASIGNACION_TURNO_TURNO1`
    FOREIGN KEY (`id_turno`)
    REFERENCES `TURNO` (`id_turno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `ASISTENCIA` (
  `id_asistencia` INT NOT NULL AUTO_INCREMENT,
  `hora_ini_1` VARCHAR(45) NOT NULL,
  `hora_fin_1` VARCHAR(45),
  `hora_ini_2` VARCHAR(45),
  `hora_fin_2` VARCHAR(45),
  `remuneracion_inicial` INT,
  `remuneracion_final` INT,
  `porc_descuento` INT NULL,
  `id_asignacion` INT NOT NULL,
  PRIMARY KEY (`id_asistencia`),
  INDEX `fk_ASISTENCIA_ASIGNACION_TURNO1_idx` (`id_asignacion` ASC) VISIBLE,
  CONSTRAINT `fk_ASISTENCIA_ASIGNACION_TURNO1`
    FOREIGN KEY (`id_asignacion`)
    REFERENCES `ASIGNACION_TURNO` (`id_asignacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `ASISTENCIA_DESCUENTO` (
  `id_asistencia` INT NOT NULL,
  `id_descuento` INT NOT NULL,
  PRIMARY KEY (`id_asistencia`, `id_descuento`),
  INDEX `fk_ASISTENCIA_DESCUENTO_ASISTENCIA1_idx` (`id_asistencia` ASC) VISIBLE,
  INDEX `fk_ASISTENCIA_DESCUENTO_DESCUENTO1_idx` (`id_descuento` ASC) VISIBLE,
  CONSTRAINT `fk_ASISTENCIA_DESCUENTO_ASISTENCIA1`
    FOREIGN KEY (`id_asistencia`)
    REFERENCES `ASISTENCIA` (`id_asistencia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ASISTENCIA_DESCUENTO_DESCUENTO1`
    FOREIGN KEY (`id_descuento`)
    REFERENCES `DESCUENTO` (`id_descuento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `TIPO_INCIDENCIA` (
  `id_tipo_incidencia` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_tipo_incidencia`))
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `INCIDENCIA` (
  `id_incidencia` INT NOT NULL AUTO_INCREMENT,
  `detalle_incidencia` VARCHAR(200) NOT NULL,
  `id_tipo_incidencia` INT NOT NULL,
  `id_asignacion` INT NOT NULL,
  PRIMARY KEY (`id_incidencia`),
  INDEX `fk_INCIDENCIA_TIPO_INCIDENCIA1_idx` (`id_tipo_incidencia` ASC) VISIBLE,
  INDEX `fk_INCIDENCIA_ASIGNACION_TURNO1_idx` (`id_asignacion` ASC) VISIBLE,
  CONSTRAINT `fk_INCIDENCIA_TIPO_INCIDENCIA1`
    FOREIGN KEY (`id_tipo_incidencia`)
    REFERENCES `TIPO_INCIDENCIA` (`id_tipo_incidencia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_INCIDENCIA_ASIGNACION_TURNO1`
    FOREIGN KEY (`id_asignacion`)
    REFERENCES `ASIGNACION_TURNO` (`id_asignacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `UBICACION_GUARDIA` (
  `id_ubicacion` INT NOT NULL AUTO_INCREMENT,
  `rut_guarida` VARCHAR(12) NOT NULL,
  `id_turno` INT NOT NULL,
  `fecha_hora` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `latitud` DECIMAL(9,6) NOT NULL,
  `longitud` DECIMAL(9,6) NOT NULL,
  PRIMARY KEY (`id_ubicacion`),
  INDEX `fk_UBICACION_GUARDIA_GUARDIA1_idx` (`rut_guarida` ASC) VISIBLE,
  INDEX `fk_UBICACION_GUARDIA_TURNO1_idx` (`id_turno` ASC) VISIBLE,
  CONSTRAINT `fk_UBICACION_GUARDIA_GUARDIA1`
    FOREIGN KEY (`rut_guarida`)
    REFERENCES `GUARDIA` (`rut_guarida`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_UBICACION_GUARDIA_TURNO1`
    FOREIGN KEY (`id_turno`)
    REFERENCES `TURNO` (`id_turno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


--INSERTS

--REGION

INSERT INTO REGION (id_region, descripcion) VALUES (1, 'Region Metropolitana');

--COMUNA

INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (1, 'Cerrillos', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (2, 'Cerro Navia', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (3, 'Conchalí', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (4, 'El Bosque', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (5, 'Estación Central', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (6, 'Huechuraba', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (7, 'Independencia', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (8, 'La Cisterna', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (9, 'La Florida', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (10, 'La Granja', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (11, 'La Pintana', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (12, 'La Reina', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (13, 'Las Condes', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (14, 'Lo Barnechea', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (15, 'Lo Espejo', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (16, 'Lo Prado', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (17, 'Macul', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (18, 'Maipú', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (19, 'Ñuñoa', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (20, 'Pedro Aguirre Cerda', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (21, 'Peñalolén', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (22, 'Providencia', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (23, 'Pudahuel', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (24, 'Quilicura', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (25, 'Quinta Normal', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (26, 'Recoleta', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (27, 'Renca', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (28, 'San Joaquín', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (29, 'San Miguel', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (30, 'San Ramón', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (31, 'Santiago', 1);
INSERT INTO COMUNA (id_comuna, descripcion, id_region) VALUES (32, 'Vitacura', 1);

--SEDES

INSERT INTO SEDE (id_sede, nombre, direccion, telefono, correo, foto, id_comuna) VALUES (1, 'Casino Enjoy Santiago', 'Calle Ficticia 123', 123456789, 'casinoenjoysantiago@gmail.com', '../../../assets/img/sede/sede.png', 13);
INSERT INTO SEDE (id_sede, nombre, direccion, telefono, correo, foto, id_comuna) VALUES (2, 'Hacienda el Poñoncito', 'Avenida Ficticia 456', 987654321, 'haciendaelpoñoncito@gmail.com', '../../../assets/img/sede/sede.png', 14);
INSERT INTO SEDE (id_sede, nombre, direccion, telefono, correo, foto, id_comuna) VALUES (3, 'Restaurante Ficticio', 'Paseo Ficticio 789', 123123123, 'restauranteFicticio@gmail.com', '../../../assets/img/sede/sede.png', 15);
INSERT INTO SEDE (id_sede, nombre, direccion, telefono, correo, foto, id_comuna) VALUES (4, 'Café Ficticio', 'Boulevard Ficticio 321', 456456456, 'cafeFicticio@gmail.com', '../../../assets/img/sede/sede.png', 16);
INSERT INTO SEDE (id_sede, nombre, direccion, telefono, correo, foto, id_comuna) VALUES (5, 'Bar Ficticio', 'Plaza Ficticia 654', 789789789, 'barFicticio@gmail.com', '../../../assets/img/sede/sede.png', 17);
INSERT INTO SEDE (id_sede, nombre, direccion, telefono, correo, foto, id_comuna) VALUES (6, 'Hotel Ficticio', 'Parque Ficticio 987', 321321321, 'hotelFicticio@gmail.com', '../../../assets/img/sede/sede.png', 18);

--TURNOS

INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (1,'2024-06-03', '08:00', '18:00', 60000, 5, 3);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (2,'2024-06-04', '08:00', '18:00', 60000, 5, 4);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (3,'2024-06-05', '08:00', '18:00', 60000, 5, 5);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (4,'2024-06-06', '08:00', '18:00', 60000, 5, 6);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (5,'2024-07-01', '08:00', '18:00', 60000, 5, 1);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (6,'2024-07-02', '08:00', '18:00', 60000, 5, 2);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (7,'2024-06-17', '08:00', '18:00', 60000, 5, 6);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (8,'2024-06-17', '08:00', '10:00', 60000, 5, 1);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (9,'2024-06-17', '10:00', '12:00', 60000, 5, 2);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (10,'2024-06-17', '12:00', '14:00', 60000, 5, 3);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (11,'2024-06-17', '14:00', '16:00', 60000, 5, 4);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (12,'2024-06-17', '16:00', '18:00', 60000, 5, 5);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (13,'2024-06-17', '18:00', '20:00', 60000, 5, 6);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (14,'2024-06-17', '20:00', '22:00', 60000, 5, 6);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (15,'2024-06-12', '20:00', '22:00', 60000, 5, 6);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (16,'2024-06-14', '14:00', '16:00', 60000, 5, 4);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (17,'2024-06-14', '16:00', '18:00', 60000, 5, 5);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (18,'2024-06-14', '18:00', '20:00', 60000, 5, 6);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (19,'2024-06-14', '20:00', '22:00', 60000, 5, 6);
INSERT INTO TURNO (id_turno, fecha, horario_inicio, hora_fin, remuneracion, ctd_guardias, id_sede) VALUES (20,'2024-06-14', '20:00', '22:00', 60000, 5, 6);

--PERFIL

INSERT INTO PERFIL (id_perfil, tipo_perfil) VALUES 
(1, 'Admin'),
(2, 'Guard');

--AUTENTIFICAR

INSERT INTO AUTENTIFICAR (id_autentificar, nombre_usuario, contrasena, id_perfil) VALUES 
(1, 'juan.perez', '12345', 1),
(2, 'maria.lopez', '12345', 2),
(3, 'pedro.rodriguez', '12345', 2),
(4, 'ana.morales', '12345', 2);


-- GUARDIA

INSERT INTO GUARDIA (
    rut_guarida, p_nombre, s_nombre, p_apellido, s_apellido, 
    fecha_nac, correo, telefono, direccion, foto_perfil, 
    id_comuna, id_autentificar
) VALUES (
    '98765432-1', 'Maria', 'Isabel', 'Lopez', 'Martinez', 
    '1985-02-02', 'maria.lopez@gmail.com', 987654321, 'Avenida Ficticia 456', '../../../assets/img/perfil/perfil.png', 
    2, 2
);
INSERT INTO GUARDIA (
    rut_guarida, p_nombre, s_nombre, p_apellido, s_apellido, 
    fecha_nac, correo, telefono, direccion, foto_perfil, 
    id_comuna, id_autentificar
) VALUES (
    '88765432-2', 'Pedro', 'Carlos', 'Rodriguez', 'Martinez', 
    '1985-02-02', 'maria.lopez@gmail.com', 987654321, 'Avenida Ficticia 456', '../../../assets/img/perfil/perfil.png', 
    2, 3
);

--ASIGNACION

INSERT INTO ASIGNACION_TURNO (rut_guarida, id_turno) VALUES ('98765432-1', 1);
INSERT INTO ASIGNACION_TURNO (rut_guarida, id_turno) VALUES ('98765432-1', 2);
INSERT INTO ASIGNACION_TURNO (rut_guarida, id_turno) VALUES ('98765432-1', 3);
INSERT INTO ASIGNACION_TURNO (rut_guarida, id_turno) VALUES ('98765432-1', 4);
INSERT INTO ASIGNACION_TURNO (rut_guarida, id_turno) VALUES ('98765432-1', 5);
INSERT INTO ASIGNACION_TURNO (rut_guarida, id_turno) VALUES ('98765432-1', 6);
INSERT INTO ASIGNACION_TURNO (rut_guarida, estado, id_turno) VALUES ('98765432-1', 1, 7);
INSERT INTO ASIGNACION_TURNO (rut_guarida, estado, id_turno) VALUES ('98765432-1', 1, 8);
INSERT INTO ASIGNACION_TURNO (rut_guarida, estado, id_turno) VALUES ('98765432-1', 1, 9);
INSERT INTO ASIGNACION_TURNO (rut_guarida, id_turno) VALUES ('98765432-1', 15);

--DESCUENTO

INSERT INTO `DESCUENTO` (`id_descuento`, `descripcion`, `valor_dcto`) VALUES (1, 'Sin descuento', 0.0);
INSERT INTO `DESCUENTO` (`id_descuento`, `descripcion`, `valor_dcto`) VALUES (2, 'Atraso Leve', 0.025);
INSERT INTO `DESCUENTO` (`id_descuento`, `descripcion`, `valor_dcto`) VALUES (3, 'Atraso Grave', 0.05);
INSERT INTO `DESCUENTO` (`id_descuento`, `descripcion`, `valor_dcto`) VALUES (4, 'Retiro temprano', 0.05);
INSERT INTO `DESCUENTO` (`id_descuento`, `descripcion`, `valor_dcto`) VALUES (5, 'Otros', 0.1);

--INCIDENCIAS

INSERT INTO `TIPO_INCIDENCIA` (`descripcion`) VALUES ('Robo');
INSERT INTO `TIPO_INCIDENCIA` (`descripcion`) VALUES ('Corte de suministro');
INSERT INTO `TIPO_INCIDENCIA` (`descripcion`) VALUES ('Desastres naturales');
INSERT INTO `TIPO_INCIDENCIA` (`descripcion`) VALUES ('Otros');

---TIPO SOLICITUD

INSERT INTO `TIPO_SOLICITUD` (`descripcion`) VALUES ('Modificacion de Turnos');
INSERT INTO `TIPO_SOLICITUD` (`descripcion`) VALUES ('Modificacion de Información');
INSERT INTO `TIPO_SOLICITUD` (`descripcion`) VALUES ('Revision de turno');

--- ADMIN

INSERT INTO `ADMINISTRADOR` (`rut_admin`, `nombre`, `apellido`, `id_autentificar`) VALUES ('123456789012', 'Juan', 'Perez', 1);

---ASISTENCIA

INSERT INTO ASISTENCIA (hora_ini_1, hora_fin_1, hora_ini_2, hora_fin_2, remuneracion_inicial, remuneracion_final, porc_descuento, id_asignacion) VALUES ('09:00', '12:00', '13:00', '18:00', 60000, 57000, 5, 1);
INSERT INTO ASISTENCIA (hora_ini_1, hora_fin_1, hora_ini_2, hora_fin_2, remuneracion_inicial, remuneracion_final, porc_descuento, id_asignacion) VALUES ('09:00', '12:00', '13:00', '18:00', 60000, 57000, 5, 2);
INSERT INTO ASISTENCIA (hora_ini_1, hora_fin_1, hora_ini_2, hora_fin_2, remuneracion_inicial, remuneracion_final, id_asignacion) VALUES ('08:00', '12:00', '13:00', '18:00', 60000, 60000, 3);
INSERT INTO ASISTENCIA (hora_ini_1, hora_fin_1, hora_ini_2, hora_fin_2, remuneracion_inicial, remuneracion_final, id_asignacion) VALUES ('08:00', '12:00', '13:00', '18:00', 60000, 60000, 4);
INSERT INTO ASISTENCIA (hora_ini_1, hora_fin_1, hora_ini_2, hora_fin_2, remuneracion_inicial, remuneracion_final, porc_descuento, id_asignacion) VALUES ('09:00', '12:00', '13:00', '18:00', 60000, 57000, 5, 7);
INSERT INTO ASISTENCIA (hora_ini_1, hora_fin_1, hora_ini_2, hora_fin_2, remuneracion_inicial, remuneracion_final, porc_descuento, id_asignacion) VALUES ('09:00', '12:00', '13:00', '18:00', 60000, 57000, 5, 8);
INSERT INTO ASISTENCIA (hora_ini_1, hora_fin_1, hora_ini_2, hora_fin_2, remuneracion_inicial, remuneracion_final, id_asignacion) VALUES ('08:00', '12:00', '13:00', '18:00', 60000, 60000, 9);
INSERT INTO ASISTENCIA (hora_ini_1, hora_fin_1, hora_ini_2, hora_fin_2, remuneracion_inicial, remuneracion_final, id_asignacion) VALUES ('08:00', '12:00', '13:00', '18:00', 60000, 60000, 10);

---ASISTENCIA_DESCUENTO

INSERT INTO ASISTENCIA_DESCUENTO (id_asistencia, id_descuento) VALUES (1, 2);
INSERT INTO ASISTENCIA_DESCUENTO (id_asistencia, id_descuento) VALUES (2, 2);

