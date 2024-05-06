<?php
$host = '192.168.1.11';
$database = 'scanner_codigos_barras';
$username = 'root';
$password = 'Luc@1081';

// Conectar ao banco de dados
$conn = new mysqli($host, $username, $password, $database);

// Verificar a conexão
if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

// Executar o SQL para atualizar os códigos associando-os ao lote recém-criado
$sql = "UPDATE codigos SET Lote = (SELECT MAX(id) FROM lotes) WHERE Lote IS NULL";
if ($conn->query($sql) === TRUE) {
    http_response_code(200); // Responder com o código de sucesso 200
} else {
    echo "Erro ao atualizar os códigos: " . $conn->error;
}

$conn->close();
?>
