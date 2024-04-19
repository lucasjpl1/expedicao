<?php
// criar_lote.php

// Conectar ao banco de dados (substitua pelos detalhes do seu banco de dados)
$host = '192.168.1.11';
$database = 'scanner_codigos_barras';
$username = 'root';
$password = 'Luc@1081';

try {
    // Verifica se o nome do lote foi enviado via POST
    if(isset($_POST['nomeLote'])) {
        // Captura o nome do lote do formulário
        $nomeLote = $_POST['nomeLote'];

        // Conecta ao banco de dados
        $conn = new PDO("mysql:host=$host;dbname=$database", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Insere um novo lote na tabela 'lotes' com o nome fornecido
        $stmt = $conn->prepare("INSERT INTO lotes (qtd, nome) VALUES (0, :nomeLote)");
        $stmt->bindParam(':nomeLote', $nomeLote);
        $stmt->execute();

        // Obtenha o ID do lote recém-criado
        $loteId = $conn->lastInsertId();

        // Retorne o ID do lote como resposta
        echo json_encode(array("loteId" => $loteId));
    } else {
        // Se o nome do lote não foi enviado, retorne uma mensagem de erro
        echo json_encode(array("error" => "O nome do lote não foi recebido."));
    }
} catch (PDOException $e) {
    // Em caso de erro, retorne uma mensagem de erro
    echo json_encode(array("error" => "Erro ao criar lote: " . $e->getMessage()));
}

// Feche a conexão com o banco de dados
$conn = null;
?>
