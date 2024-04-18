<?php
// quantidade_codigos.php

// Conectar ao banco de dados (substitua pelos detalhes do seu banco de dados)
$host = '192.168.1.11';
$database = 'scanner_codigos_barras';
$username = 'root';
$password = 'Luc@1081';

try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta para recuperar a quantidade de códigos no lote atual
    $stmt = $conn->query("SELECT qtd FROM lotes ORDER BY id DESC LIMIT 1");
    $quantidade = $stmt->fetch(PDO::FETCH_ASSOC);

    // Retorna a quantidade de códigos como JSON
    echo json_encode(array("quantidade" => $quantidade['qtd']));
} catch (PDOException $e) {
    // Em caso de erro, retorne uma mensagem de erro
    echo json_encode(array("error" => "Erro ao recuperar a quantidade de códigos: " . $e->getMessage()));
}

// Feche a conexão com o banco de dados
$conn = null;
?>
