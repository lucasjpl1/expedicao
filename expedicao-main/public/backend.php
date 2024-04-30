<?php
// backend.php

// Configurações do banco de dados
$host = '192.168.1.11';
$database = 'scanner_codigos_barras';
$username = 'root';
$password = 'Luc@1081';

// Conectar ao banco de dados
try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("message" => "Erro ao conectar ao banco de dados: " . $e->getMessage()));
    exit();
}

// Manipular requisições POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar se os dados necessários foram recebidos
    if (isset($_POST['nota']) && isset($_POST['rastreio'])) {
        $nota = $_POST['nota'];
        $rastreio = $_POST['rastreio'];

        // Verificar se o código de rastreio já existe na tabela
        $stmt = $conn->prepare("SELECT COUNT(*) AS total FROM codigos WHERE Rastreio = :rastreio");
        $stmt->bindParam(':rastreio', $rastreio);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result['total'] > 0) {
            http_response_code(400); // Bad Request
            echo json_encode(array("message" => "O código de rastreio já existe na tabela."));
        } else {
            // Inserir os dados na tabela 'codigos'
            try {
                $sql = "INSERT INTO codigos (Nota, Rastreio) VALUES (:nota, :rastreio)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':nota', $nota);
                $stmt->bindParam(':rastreio', $rastreio);
                $stmt->execute();

                $lastInsertedId = $conn->lastInsertId(); // Obter o ID do novo código inserido

                http_response_code(201); // Created
                echo json_encode(array("message" => "Código de barras inserido com sucesso.", "id" => $lastInsertedId));
            } catch (PDOException $e) {
                http_response_code(500); // Internal Server Error
                echo json_encode(array("message" => "Erro ao inserir código de barras: " . $e->getMessage()));
            }
        }
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(array("message" => "Parâmetros inválidos."));
    }
}
// Manipular requisições GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Recuperar dados da tabela 'codigos'
    try {
        $sql = "SELECT * FROM codigos";
        $stmt = $conn->query($sql);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200); // OK
        echo json_encode($results);
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(array("message" => "Erro ao recuperar dados: " . $e->getMessage()));
    }
}
try {
    // Seu código PHP aqui
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("message" => "Erro no servidor: " . $e->getMessage()));
}

// Fechar a conexão com o banco de dados
$conn = null;
?>
