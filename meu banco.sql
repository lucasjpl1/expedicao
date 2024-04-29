meu banco



CREATE DATABASE scanner_codigos_barras;

USE scanner_codigos_barras;


CREATE TABLE lotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(20)
);

CREATE TABLE codigos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Nota VARCHAR(50),
    Rastreio VARCHAR(50),
    Date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Lote INT,
    Estado INT,
    FOREIGN KEY (Lote) REFERENCES lotes(id) ON DELETE CASCADE
);


insert into lotes (nome) values ('teste');

insert into codigos (Nota, Rastreio, Lote) values ('adasdasdada', 'adhuiadhhu', 1);
    
SHOW TABLE STATUS LIKE 'lotes';


select * from codigos;

select * from lotes;