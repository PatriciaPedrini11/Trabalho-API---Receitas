//endereço da API pra buscar receitas
const ENDERECO_DA_API = "https://www.themealdb.com/api/json/v1/1/search.php";

//quanto tempo o cache vai valer, só será considerado válido por 5 minutos após a primeira requisição
const TEMPO_DE_CACHE_EM_MS = 5 * 60 * 1000;

//função que busca receitas na API usando uma palavra-chave
export async function buscarReceitas(termoDeBusca) {
  //aqui cria uma chave única pro cache com base no termo de busca,  assegura que cada termo de busca tenha seu próprio cache, evitando sobreposição
  const chaveDoCache = `receitas_${termoDeBusca.toLowerCase()}`;

  try {
    //tenta pegar os dados salvos no cache (se tiver)
    //o uso do`localStorage.getItem` é para buscar o item com a chave gerada para o cache
    const cache = JSON.parse(localStorage.getItem(chaveDoCache));

    //verifica se há dados no cache e se o tempo de validade não expirou, se o cache não tiver expirado, retorna os dados dele diretamente
    if (cache && Date.now() - cache.tempoSalvo < TEMPO_DE_CACHE_EM_MS) {
      //retorna os dados e avisa que veio do cache
      return { dados: cache.resultado, veioDoCache: true };
    }

    //caso o cache não exista ou tenha expirado, fazemos a requisição à API, a função `fetch` busca as receitas da API usando o termo de busca
    const resposta = await fetch(`${ENDERECO_DA_API}?s=${encodeURIComponent(termoDeBusca)}`);

    //se a resposta der erro, exibe uma mensagem
    if (!resposta.ok) throw new Error("Erro ao acessar a API");

    //pega o resultado que veio da API e extrai as receitas
    const json = await resposta.json();
    //caso não existam receitas, define o valor como uma lista vazia
    const receitas = json.meals || [];

    //salva os dados no localStorage
    localStorage.setItem(chaveDoCache, JSON.stringify({
      resultado: receitas, //armazena as receitas
      tempoSalvo: Date.now() //armazena o momento em que os dados foram salvos
    }));

    //retorna os dados e avisa que vieram da API, não do cache
    return { dados: receitas, veioDoCache: false };

  } catch (erro) {
    //se der erro em qualquer parte, mostra no console e retorna uma lista vazia
    console.error("Erro ao buscar receitas:", erro);
    return { dados: [], veioDoCache: false };
  }
}
