// Função para adicionar os dados quando o usuário pressionar "Enter"
function addOnEnter(event) {
    if (event.key === 'Enter') {
        checkAndAdd();
    }
}

// Adicionar evento de "keypress" apenas no campo de nota e rastreio
document.getElementById('notaRastreio').addEventListener('keypress', addOnEnter);

function checkAndAdd() {
    var notaRastreio = document.getElementById('notaRastreio').value;

    // Verificar se a string tem pelo menos 44 caracteres
    if (notaRastreio.length >= 44) {
        var nota = notaRastreio.substring(0, 44);
        var rastreio = notaRastreio.substring(44).trim();

        if (nota.trim() !== '' && rastreio.trim() !== '') {
            // Verificar se o rastreio já existe na tabela
            var tableRows = document.querySelectorAll('#barcodeTable tbody tr');
            for (var i = 0; i < tableRows.length; i++) {
                var existingRastreio = tableRows[i].querySelector('td:nth-child(3)').innerText;
                if (existingRastreio === rastreio) {
                    alert('Este código já existe na tabela.');
                    return;
                }
            }

            // Se o rastreio não existir na tabela, adicionar os dados
            addData(nota, rastreio);
        }
    } else {
        alert('Por favor, insira um código de barras válido.');
    }
}




// Função para adicionar os dados
function addData(nota, rastreio) {
    // Enviar os dados para o servidor
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                refreshTable();
            } else {
                console.error('Erro ao adicionar dados:', this.status, JSON.parse(this.responseText));
            }
        }
    };
    xhttp.open('POST', 'backend.php', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // Certifique-se de que os parâmetros estejam corretamente codificados
    var params = 'notaRastreio=' + encodeURIComponent(nota + ' ' + rastreio);
    xhttp.send(params);
    
    // Limpar o campo de entrada após adicionar os dados
    document.getElementById('notaRastreio').value = '';
}

// Função para atualizar a tabela
function refreshTable() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            updateTable(JSON.parse(this.responseText));
        }
    };
    xhttp.open('GET', 'backend.php', true);
    xhttp.send();
}

// Função para atualizar a tabela
function updateTable(data) {
    var tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach(function(row) {
        var newRow = '<tr>';
        newRow += '<td>' + row.id + '</td>';
        newRow += '<td>' + row.Nota + '</td>';
        newRow += '<td>' + row.Rastreio + '</td>';
        newRow += '<td>' + row.Date_added + '</td>';
        newRow += '</tr>';
        tableBody.innerHTML += newRow;
    });

    // Adicionar evento de clique para selecionar uma linha da tabela
    var tableRows = document.querySelectorAll('#barcodeTable tbody tr');
    tableRows.forEach(function(row) {
        row.addEventListener('click', function() {
            row.classList.toggle('selected');
        });
    });
}

// Função para exportar os dados para um arquivo Excel
function exportToExcel() {
    window.location.href = 'export.php';
}

// Carregar a tabela ao iniciar a página
window.onload = function() {
    refreshTable();
};
