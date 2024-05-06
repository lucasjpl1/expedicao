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

        // Verificar se a nota contém exatamente 8 caracteres
        if (strlen($nota) === 8) {
            http_response_code(400); // Bad Request
            echo json_encode(array("message" => "A nota não pode ter exatamente 8 caracteres."));
            exit(); // Encerrar o script
        }

        // Verificar se o código de rastreio contém exatamente 8 caracteres
        if (strlen($rastreio) === 8) {
            http_response_code(400); // Bad Request
            echo json_encode(array("message" => "O código de rastreio não pode ter exatamente 8 caracteres."));
            exit(); // Encerrar o script
        }

        // Verificar se a nota contém exatamente 44 caracteres
        if (strlen($nota) !== 44) {
            http_response_code(400); // Bad Request
            echo json_encode(array("message" => "A nota deve conter exatamente 44 caracteres."));
            exit(); // Encerrar o script
        }

        // Verificar se o código de rastreio tem 44 caracteres
        if (strlen($rastreio) >= 44 || strlen($rastreio) < 1) {
            http_response_code(400); // Bad Request
            echo json_encode(array("message" => "O código de rastreio deve conter entre 1 e 43 caracteres."));
            exit(); // Encerrar o script
        }

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
    // Verificar se há um termo de pesquisa fornecido
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $searchTerm = $_GET['search'];

        // Recuperar dados da tabela 'codigos' que correspondem ao termo de pesquisa
        try {
            $sql = "SELECT c.* FROM codigos c LEFT JOIN lotes l ON c.Lote = l.id WHERE (c.Rastreio LIKE :search OR c.Nota LIKE :search OR c.Date_added LIKE :search OR l.nome LIKE :search)";
            $stmt = $conn->prepare($sql);
            $searchTerm = "%$searchTerm%"; // Adicionar wildcards para pesquisar parcialmente
            $stmt->bindParam(':search', $searchTerm, PDO::PARAM_STR);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Contar o número total de linhas na tabela
            $rowCount = $stmt->rowCount();

            http_response_code(200); // OK
            echo json_encode(array("total" => $rowCount, "data" => $results));
        } catch (PDOException $e) {
            http_response_code(500); // Internal Server Error
            echo json_encode(array("message" => "Erro ao recuperar dados: " . $e->getMessage()));
        }
    } else {
        // Recuperar todos os dados da tabela 'codigos' onde o campo 'Lote' é nulo
        try {
            $sql = "SELECT * FROM codigos WHERE Lote IS NULL";
            $stmt = $conn->query($sql);
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Contar o número total de linhas na tabela
            $rowCount = $stmt->rowCount();

            http_response_code(200); // OK
            echo json_encode(array("total" => $rowCount, "data" => $results));
        } catch (PDOException $e) {
            http_response_code(500); // Internal Server Error
            echo json_encode(array("message" => "Erro ao recuperar dados: " . $e->getMessage()));
        }
    }
}

// Fechar a conexão com o banco de dados
$conn = null;
?>
