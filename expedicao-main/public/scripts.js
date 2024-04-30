// Função para adicionar os dados quando o usuário pressionar "Enter"
function addOnEnter(event) {
    if (event.key === 'Enter') {
        checkAndAdd();
    }
}

// Adicionar evento de "keypress" apenas no campo de nota e rastreio
document.getElementById('notaRastreio').addEventListener('keypress', addOnEnter);

// Adicionar evento de "keypress" no campo de pesquisa
document.getElementById('search').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchBarcode(); // Chamando a função de pesquisa quando "Enter" for pressionado
    }
});

var rastreioPendente = ''; // Variável para armazenar o rastreio pendente

function checkAndAdd() {
    var codigo = document.getElementById('notaRastreio').value.trim();

    // Verifica se o código tem 44 caracteres, considerando-o uma nota
    if (codigo.length === 44) {
        var nota = codigo;
        if (rastreioPendente === '') {
            // Se não houver rastreio pendente, armazena a nota
            rastreioPendente = nota;
            document.getElementById('notaRastreio').value = ''; // Limpa o campo de entrada
        } else {
            // Se já houver um rastreio pendente, adiciona os dados
            addData(nota, rastreioPendente);
            rastreioPendente = ''; // Limpa o rastreio pendente
        }
    } else {
        // Se o código não tiver 44 caracteres, considera-se um rastreio
        var rastreio = codigo;
        if (rastreioPendente === '') {
            // Se não houver rastreio pendente, armazena o rastreio
            rastreioPendente = rastreio;
            document.getElementById('notaRastreio').value = ''; // Limpa o campo de entrada
        } else {
            // Se já houver uma nota pendente, adiciona os dados
            addData(rastreioPendente, rastreio);
            rastreioPendente = ''; // Limpa o rastreio pendente
        }
    }
}

function addData(nota, rastreio) {
    // Enviar os dados para o servidor
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 201) {
                refreshTable();
            } else if (this.status !== 200) {
                console.error('Erro ao adicionar dados:', this.status, JSON.parse(this.responseText));
                playErrorSound(); // Reproduzir som de erro apenas se não for um sucesso
            }
        }
    };
    xhttp.open('POST', 'backend.php', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // Certifique-se de que os parâmetros estejam corretamente codificados
    var params = 'nota=' + encodeURIComponent(nota) + '&rastreio=' + encodeURIComponent(rastreio);
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

// Função para buscar o código na tabela
function searchBarcode() {
    var searchTerm = document.getElementById('search').value.trim().toLowerCase();
    var tableRows = document.querySelectorAll('#barcodeTable tbody tr');

    tableRows.forEach(function(row) {
        var id = row.querySelector('td:nth-child(1)').innerText.toLowerCase();
        var nota = row.querySelector('td:nth-child(2)').innerText.toLowerCase();
        var rastreio = row.querySelector('td:nth-child(3)').innerText.toLowerCase();
        
        if (id.includes(searchTerm) || nota.includes(searchTerm) || rastreio.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
function playErrorSound() {
    var audio = new Audio('error_sound.mp3'); 
    audio.play();
}
