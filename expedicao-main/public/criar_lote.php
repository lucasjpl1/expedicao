<?php
$host = 'localhost';
$database = 'scanner_codigos_barras';
$username = 'root';
$password = "root";

// Conectar ao banco de dados
$conn = new mysqli($host, $username, $password, $database);

// Verificar a conexão
if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

// Obter o nome do lote enviado pelo JavaScript
$nomeLote = $_POST['nome'];

// Preparar e executar a consulta SQL para inserir o lote
$sql = "INSERT INTO lotes (nome) VALUES ('$nomeLote')";
if ($conn->query($sql) === TRUE) {
    http_response_code(201); // Responder com o código de sucesso 201
} else {
    echo "Erro ao criar lote: " . $conn->error;
}

$conn->close();
?>
