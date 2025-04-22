//função que cria um elemento HTML com texto e atributos 
export function criarElemento(tag, texto, atributos = {}) {
  //cria um novo elemento HTML usando a tag informada
  const elemento = document.createElement(tag);

  //se o parâmetro "texto" não estiver vazio, adiciona esse texto como conteúdo dentro do elemento
  if (texto) {
    elemento.textContent = texto;
  }
  //percorre o objeto "atributos" e adiciona cada atributo no elemento
  //ex: se atributos for { id: "minhaLista", class: "destaque" }, o elemento criado vai ficar assim: <li id="minhaLista" class="destaque">...</li>
  for (const chave in atributos) {
    elemento.setAttribute(chave, atributos[chave]);
  }
  //retorna o elemento já configurado com o texto e os atributos
  return elemento;
}
