var rastreioPendente = ''; // Variável para armazenar o rastreio pendente

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

function checkAndAdd() {
    var codigo = document.getElementById('notaRastreio').value.trim();
  
    // Verificar se o código tem exatamente 44 caracteres e é composto apenas por números
    if (codigo.length === 44 && /^[0-9]+$/.test(codigo)) {
      var nota = codigo;
  
      // Verificar se a nota já está presente na tabela
      var notasNaTabela = Array.from(document.querySelectorAll('#barcodeTable tbody tr td:nth-child(2)')).map(td => td.innerText);
      if (notasNaTabela.includes(nota)) {
        console.error('Erro ao adicionar dados: O código já existe na tabela.');
        playErrorSound();
        document.getElementById('notaRastreio').value = ''; // Limpa o campo de entrada
        return; // Retorna sem adicionar os dados
      }
  
      if (rastreioPendente === '') {
        // Se não houver rastreio pendente, armazena a nota
        rastreioPendente = nota;
        document.getElementById('notaRastreio').value = ''; // Limpa o campo de entrada
      } else {
        // Se já houver um rastreio pendente, adiciona os dados
        addData(nota, rastreioPendente);
        rastreioPendente = ''; // Limpa o rastreio pendente
      }
    } else if (codigo.length < 44 && codigo.length !== 8) {
      var rastreio = codigo;
  
      // Verificar se o rastreio já está presente na tabela como nota
      var notasNaTabela = Array.from(document.querySelectorAll('#barcodeTable tbody tr td:nth-child(3)')).map(td => td.innerText);
      if (notasNaTabela.includes(rastreio)) {
        console.error('Erro ao adicionar dados: O código de rastreio já existe na tabela como nota.');
        playErrorSound();
        document.getElementById('notaRastreio').value = ''; // Limpa o campo de entrada
        return; // Retorna sem adicionar os dados
      }
  
      if (rastreioPendente === '') {
        // Se não houver rastreio pendente, armazena o rastreio
        rastreioPendente = rastreio;
        document.getElementById('notaRastreio').value = ''; // Limpa o campo de entrada
      } else {
        // Se já houver uma nota pendente, adiciona os dados
        addData(rastreioPendente, rastreio);
        rastreioPendente = ''; // Limpa o rastreio pendente
      }
    } else {
      console.error('Erro ao adicionar dados: Código inválido.');
      playErrorSound();
      document.getElementById('notaRastreio').value = ''; // Limpa o campo de entrada
      return; // Retorna sem adicionar os dados
    }
  }

function addData(nota, rastreio) {
    // Verificar se o código de rastreio tem 44 caracteres
    if (rastreio.length === 44) {
        console.error('Erro ao adicionar dados: O código de rastreio não pode ter 44 caracteres.');
        playErrorSound();
        document.getElementById('notaRastreio').value = ''; // Limpa o campo de entrada
        return; // Retorna sem adicionar os dados
    }

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
    xhttp.open('POST', 'Dev.php', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // Certifique-se de que os parâmetros estejam corretamente codificados
    var params = 'nota=' + encodeURIComponent(nota) + '&rastreio=' + encodeURIComponent(rastreio);
    xhttp.send(params);
    
    // Limpar o campo de entrada após adicionar os dados
    document.getElementById('notaRastreio').value = '';
}

function refreshTable() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.responseText);
            updateTable(response.data);
        }
    };
    xhttp.open('GET', 'backend.php', true);
    xhttp.send();
}

// Função para exibir o total de linhas
function displayTotalRows(total) {
    var totalRowsContainer = document.getElementById('totalRowsContainer');
    if (totalRowsContainer) {
        totalRowsContainer.textContent = 'Total de Encomendas: ' + total;
        totalRowsContainer.style.fontSize = "24px"; // Aplicar estilo diretamente
    } else {
        console.error('Elemento totalRowsContainer não encontrado.');
    }
}


// Função para atualizar a tabela
function updateTable(data) {
    var table = $('#barcodeTable').DataTable();
    table.clear().draw(); // Limpar a tabela

    data.forEach(function(row) {
        table.row.add([
            row.Nota,
            row.Rastreio,
            row.Date_added
        ]).draw(false); // Adicionar nova linha e desenhar sem redefinir a paginação
    });

    displayTotalRows(data.length); // Atualizar o total de linhas exibidas


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

function searchBarcode() {
    var searchTerm = document.getElementById('search').value.trim();
    
    // Enviar o termo de pesquisa para o servidor
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.responseText);
            updateTable(response.data); // Atualizar a tabela com os resultados da pesquisa
            displayTotalRows(response.total); // Atualizar o total de linhas exibidas
        }
    };
    xhttp.open('GET', 'Dev.php?search=' + encodeURIComponent(searchTerm), true);
    xhttp.send();
}

function playErrorSound() {
    var audio = new Audio('error_sound.mp3'); 
    audio.play();
}
function criarLote() {
    var nomeLote = document.getElementById('nomeLote').value.trim();

    if (nomeLote !== '') {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 201) {
                    alert('Lote criado com sucesso!');
                    refreshTable(); // Atualize a tabela após criar o lote
                    document.getElementById('nomeLote').value = ''; // Limpar o campo de texto
                    atualizarLotes(); // Chama a função para associar os códigos ao lote
                } else if (this.status !== 200) {
                    console.error('Erro ao criar lote:', this.status, JSON.parse(this.responseText));
                    playErrorSound(); // Reproduzir som de erro apenas se não for um sucesso
                }
            }
        };
        xhttp.open('POST', 'criar_lote.php', true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        var params = 'nome=' + encodeURIComponent(nomeLote);
        xhttp.send(params);
    } else {
        alert('Por favor, insira um nome para o lote.');
    }
}

function atualizarLotes() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            //alert('Códigos atualizados com sucesso!');
            // Você pode adicionar aqui alguma outra ação após a atualização dos códigos, se necessário
        } else if (this.readyState === 4 && this.status !== 200) {
            console.error('Erro ao atualizar os códigos:', this.status, JSON.parse(this.responseText));
            playErrorSound(); // Reproduzir som de erro apenas se não for um sucesso
        }
    };
    xhttp.open('POST', 'atualizar_lotes.php', true);
    xhttp.send();
}

function Home() {
    // Redireciona para a página Devolu.html
    window.location.href = 'index.html';
}

$(document).ready(function() {
    $('#barcodeTable').DataTable({
        "pageLength": 100,
        "paging": true,
        "searching": true,
        "ordering": true,
        "language": {
            "lengthMenu": "Exibir _MENU_ linhas por página",
            "zeroRecords": "Nenhum registro encontrado",
            "info": "Mostrando página _PAGE_ de _PAGES_",
            "infoEmpty": "Nenhum registro disponível",
            "infoFiltered": "(filtrado de _MAX_ registros no total)",
            "search": "Pesquisar:",
            "paginate": {
                "first": "Primeiro",
                "last": "Último",
                "next": "Próximo",
                "previous": "Anterior"
            }
        }
    });
});