// Função para adicionar os dados quando o usuário pressionar "Enter"
function addOnEnter(event) {
    if (event.key === 'Enter') {
        checkAndAdd();
    }
}

// Adicionar evento de "keypress" apenas no campo de rastreio
document.getElementById('rastreio').addEventListener('keypress', addOnEnter);

// Função para verificar se ambos os campos estão preenchidos e adicionar automaticamente
function checkAndAdd() {
    var nota = document.getElementById('nota').value;
    var rastreio = document.getElementById('rastreio').value;

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
}

// Função para adicionar os dados
// Função para adicionar os dados
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
    var params = 'Nota=' + encodeURIComponent(nota) + '&Rastreio=' + encodeURIComponent(rastreio);
    xhttp.send(params);
    
    // Limpar os campos de entrada após adicionar os dados
    document.getElementById('nota').value = '';
    document.getElementById('rastreio').value = '';
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
        newRow += '<td>' + row.Lote + '</td>';
        newRow += '<td>' + row.Estado + '</td>';
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

// Função para pesquisar por código de barras
function searchBarcode() {
    var search_text = document.getElementById('search').value;
    if (search_text) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                updateTable(JSON.parse(this.responseText));
            }
        };
        xhttp.open('GET', 'backend.php?search_text=' + encodeURIComponent(search_text), true);
        xhttp.send();
    } else {
        // Se o campo de pesquisa estiver vazio, atualize a tabela com todos os dados
        refreshTable();
    }
}

// Função para exportar os dados para um arquivo Excel
function exportToExcel() {
    window.location.href = 'export.php';
}

// Carregar a tabela ao iniciar a página
window.onload = function() {
    refreshTable();
};

// Função para adicionar os dados quando o usuário pressionar "Enter" e mover o foco para o próximo campo
function addAndMoveToNext(event, nextInputId) {
    if (event.key === 'Enter') {
        checkAndAdd();
        // Mover o foco para o próximo campo de entrada
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    }
}

// Adicionar evento de "keydown" nos campos de nota e rastreio
document.getElementById('nota').addEventListener('keydown', function(event) {
    addAndMoveToNext(event, 'rastreio'); // Defina o ID do próximo campo de entrada aqui
});

// Função para criar um lote
function criarLote() {
    // Exibir o pop-up de nome do lote
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
}

// Obter os elementos do modal
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var btnSaveLote = document.getElementById("btnSalvarLote");

// Fechar o modal quando o usuário clicar no botão fechar (x)
span.onclick = function() {
    modal.style.display = "none";
}

// Fechar o modal quando o usuário clicar fora do modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Salvar o lote quando o usuário clicar no botão "Salvar Lote"
btnSaveLote.onclick = function() {
    var nomeLote = document.getElementById("nomeLote").value;
    // Aqui você pode enviar o nome do lote para o servidor e salvar os códigos sob esse lote
    // Lembre-se de implementar a lógica no backend para salvar os códigos sob o lote fornecido
    alert("Nome do lote: " + nomeLote);
    modal.style.display = "none"; // Fechar o modal após salvar
}
function prosseguirindex() {
    // Substitua 'checkout.html' pelo nome do arquivo da sua página de checkout
    window.location.href = 'lote.html';
}
