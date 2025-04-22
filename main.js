//importando as funções necessárias
//a função buscarReceitas é importada de api.js para buscar as receitas através da API
//a função criarElemento é importada de utils.js para criar elementos HTML 
import { buscarReceitas } from "./api.js";
import { criarElemento } from "./utils.js";

//pegando os elementos do HTML pelos seus IDs
const campoBusca = document.getElementById("busca");
const botaoBusca = document.getElementById("botao-buscar");
const lista = document.getElementById("lista-resultados");
const carregando = document.getElementById("carregando");
const infoCache = document.getElementById("info-cache");
const botaoAnterior = document.getElementById("anterior");
const botaoProximo = document.getElementById("proximo");
const infoPagina = document.getElementById("info-pagina");


//"todasReceitas" armazena todas as receitas obtidas da busca
//"paginaAtual" mantém a página atual para exibição da lista paginada
//"receitasPorPagina" define quantas receitas serão exibidas por página
let todasReceitas = [];
let paginaAtual = 1;
const receitasPorPagina = 5;

//função para mostrar ou esconder o aviso de "Carregando..."
//o parâmetro "mostrar" é um booleano que define se o aviso de carregamento será exibido ou não
function mostrarCarregando(mostrar) {
  carregando.style.display = mostrar ? "block" : "none";  //se mostrar for true, exibe o "carregando", senão esconde
}

//função para exibir a lista de receitas na tela
//"dados" é uma lista de receitas que será mostrado na página
function mostrarLista(dados) {
  lista.innerHTML = "";  //limpa a lista existente

  //calcula qual parte da lista de receitas será exibida com base na página atual
  const inicio = (paginaAtual - 1) * receitasPorPagina;  //indice inicial da página atual
  const receitasDaPagina = dados.slice(inicio, inicio + receitasPorPagina);  //pega as receitas da página atual de acordo com os indices calculados

  //se não houver receitas para mostrar
  if (receitasDaPagina.length === 0) {
    lista.appendChild(criarElemento("li", "Nenhuma receita encontrada."));  //exibe uma mensagem de "nenhuma receita encontrada"
    infoPagina.textContent = "";  //limpa as informações de paginação
    botaoAnterior.disabled = true;  //desabilita o botão de "anterior", pois não há mais páginas para trás
    botaoProximo.disabled = true;  //desabilita o botão de "próximo", pois não há mais páginas para frente
    return;  //sai da função, pois não há receitas para mostrar.
  }

  //para cada receita da página atual, cria um item de lista
  receitasDaPagina.forEach(receita => {
    const li = document.createElement("li");  // Cria um novo item de lista <li>.

    //cria e adiciona o título da receita
    const titulo = document.createElement("p");
    titulo.innerHTML = `<strong>Nome da Receita:</strong> ${receita.strMeal}`;
    li.appendChild(titulo);  //adiciona o título na lista

    //cria e adiciona a origem da receita
    const origem = document.createElement("p");
    origem.innerHTML = `<strong>Origem:</strong> ${receita.strArea}`;
    li.appendChild(origem);  // Adiciona a origem na lista

    //cria e adiciona a categoria da receita
    const categoria = document.createElement("p");
    categoria.innerHTML = `<strong>Categoria:</strong> ${receita.strCategory}`;
    li.appendChild(categoria);  //adiciona a categoria na lista

    //cria e adiciona as instruções da receita
    const instrucoes = document.createElement("p");
    instrucoes.innerHTML = `<strong>Instruções:</strong> ${receita.strInstructions}`;
    li.appendChild(instrucoes);  //adiciona as instruções na lista

    //cria e adiciona a imagem da receita
    const imagem = document.createElement("img");
    imagem.src = receita.strMealThumb;  //URL da imagem da receita
    imagem.alt = receita.strMeal;  //nome da receita como texto alternativo da imagem.
    imagem.width = 250;  //tamanho da imagem.
    li.appendChild(imagem);  //adiciona a imagem na lista.

    lista.appendChild(li);  //adiciona o item completo na lista de receitas.
  });

  //atualiza as informações de paginação
  //exibe a página atual e o número total de páginas
  infoPagina.textContent = `Página ${paginaAtual} de ${Math.ceil(dados.length / receitasPorPagina)}`;
  
  //desabilita os botões de navegação se necessário
  botaoAnterior.disabled = paginaAtual === 1;  //desabilita o botão "anterior" na primeira página
  botaoProximo.disabled = paginaAtual * receitasPorPagina >= dados.length;  //desabilita o botão "próximo" se não houver mais receitas
}

//função para realizar a busca de receitas com base no termo digitado pelo usuário
function executarBusca() {
  const termo = campoBusca.value.trim();  //pega o termo de busca, removendo espaços extras no início e no fim
  
  //se o campo de busca estiver vazio, exibe um alerta para o usuário 
  if (!termo) return alert("Digite o nome de uma receita!");

  mostrarCarregando(true);  //exibe o aviso de "Carregando..."  enquanto os dados estão sendo buscados


  //chama a função buscarReceitas, que retorna uma Promise
  //após a resposta da API, os dados das receitas e a origem dos dados (cache ou API) são processados
  buscarReceitas(termo).then(({ dados, veioDoCache }) => {
    mostrarCarregando(false);  //esconde o aviso de "Carregando..." quando a busca é concluída

    todasReceitas = dados;  //armazena as receitas retornadas pela busca
    paginaAtual = 1;  //reseta a página atual para 1 sempre que uma nova busca for feita

    //exibe de onde os dados foram obtidos (cache ou API)
    infoCache.textContent = veioDoCache ? "(dados do cache)" : "(dados da API)";
    
    // Exibe a lista de receitas
    mostrarLista(todasReceitas);
  });
}

//adiciona o evento de clique no botão de busca para executar a função de busca
botaoBusca.addEventListener("click", executarBusca);

//evento para o botão de "anterior" que navega para a página anterior
botaoAnterior.addEventListener("click", () => {
  paginaAtual--;  //decrementa o número da página atual
  mostrarLista(todasReceitas);  //stualiza a exibição da lista de receitas da nova página
});

//evento para o botão de "próximo" que navega para a próxima página
botaoProximo.addEventListener("click", () => {
  paginaAtual++;  //incrementa o número da página atual
  mostrarLista(todasReceitas);  // Atualiza a exibição da lista de receitas da nova página
});
