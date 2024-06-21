<?php
// Conexão com o banco de dados
$host = 'localhost';
$database = 'scanner_codigos_barras';
$username = 'root';
$password = "root";

try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Erro ao conectar ao banco de dados: ' . $e->getMessage();
    exit();
}

// Consulta para obter os dados da tabela 'codigos'
$sql = "SELECT * FROM codigos";
$stmt = $conn->query($sql);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Configuração do cabeçalho para indicar que o conteúdo é um arquivo Excel
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment; filename="export.xls"');

// Início da tabela Excel
echo '<table style="border-collapse: collapse;">';
echo '<tr><th>ID</th><th>Nota</th><th>Rastreio</th><th style="border-right: 1px solid black;">Data</th></tr>';

// Preenchimento da tabela com os dados
foreach ($results as $row) {
    echo '<tr>';
    echo '<td style="border: 1px solid black;">' . $row['id'] . '</td>';
    // Adicionando um apóstrofo antes do valor da nota para forçar o Excel a tratá-la como texto
    echo '<td style="border: 1px solid black;">' . "'" . $row['Nota'] . '</td>';
    echo '<td style="border: 1px solid black;">' . $row['Rastreio'] . '</td>';
    // A última célula (Data) terá uma borda apenas à direita
    echo '<td style="border: 1px solid black; border-right: 1px solid black;">' . $row['Date_added'] . '</td>';
    echo '</tr>';
}

// Fim da tabela Excel
echo '</table>';

// Fechar a conexão com o banco de dados
$conn = null;
?>