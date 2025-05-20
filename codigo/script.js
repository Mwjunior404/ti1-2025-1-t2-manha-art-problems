const filtrosData = {
    "filtros": {
        "palavra_chave": "",
        "preco": {
            "min": 0,
            "max": 500
        },
        "tags": [
            {
                "categoria": "Artes Visuais",
                "subtags": [
                    "Desenhista", "Artista Digital", "Pintor", "Escultor", "Ilustrador",
                    "Gravurista", "Quadrinista", "Tatuador", "Artista de Rua (Grafiteiro, Muralista)",
                    "Cartunista", "Animador (2D, 3D)", "Modelador 3D", "Artista de Instalação",
                    "Artista Conceitual"
                ]
            },
            {
                "categoria": "Audiovisual",
                "subtags": [
                    "Videomaker", "Fotógrafo", "Cineasta", "Diretor de Fotografia",
                    "Editor de Vídeo", "Técnico de Som (Mixagem, Captação)", "Designer de Som",
                    "Produtor Audiovisual", "Roteirista"
                ]
            },
            {
                "categoria": "Artes Performáticas",
                "subtags": [
                    "Ator", "Bailarino", "Músico (Instrumentista, Vocalista)", "Compositor",
                    "DJ", "Palhaço", "Artista Circense", "Dramaturgo", "Regente"
                ]
            },
            {
                "categoria": "Outras Áreas Criativas",
                "subtags": [
                    "Designer Gráfico", "Web Designer", "Designer de Produto", "Designer de Moda",
                    "Arquiteto", "Decorador de Interiores", "Escritor", "Poeta",
                    "Curador de Arte", "Crítico de Arte"
                ]
            }
        ]
    }
};

const tagsFilterDiv = document.getElementById('tags-filter');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const minValueSpan = document.getElementById('min-value');
const maxValueSpan = document.getElementById('max-value');
const resultsContainer = document.getElementById('results-container');
const keywordInput = document.getElementById('keyword-filter');

function gerarFiltrosDeTags() {
    filtrosData.filtros.tags.forEach(categoria => {
        const categoriaDiv = document.createElement('div');
        categoriaDiv.classList.add('categoria-group');

        const categoriaTitulo = document.createElement('div');
        categoriaTitulo.classList.add('categoria-title');
        categoriaTitulo.textContent = categoria.categoria;
        categoriaTitulo.addEventListener('click', () => {
            const subtagsDiv = categoriaDiv.querySelector('.subtags');
            subtagsDiv.classList.toggle('open');
            categoriaTitulo.classList.toggle('active');
        });
        categoriaDiv.appendChild(categoriaTitulo);

        const subtagsDiv = document.createElement('div');
        subtagsDiv.classList.add('subtags');
        categoria.subtags.forEach(subtag => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `tag-${subtag.replace(/ /g, '-')}`;
            checkbox.name = 'tag';
            checkbox.value = subtag;

            const label = document.createElement('label');
            label.htmlFor = `tag-${subtag.replace(/ /g, '-')}`;
            label.textContent = subtag;

            const subtagDiv = document.createElement('div');
            subtagDiv.appendChild(checkbox);
            subtagDiv.appendChild(label);
            subtagsDiv.appendChild(subtagDiv);
        });
        categoriaDiv.appendChild(subtagsDiv);

        tagsFilterDiv.appendChild(categoriaDiv);
    });
}

function atualizarValoresPreco() {
    minValueSpan.textContent = `R$ ${minPriceInput.value}`;
    maxValueSpan.textContent = `R$ ${maxPriceInput.value}`;
}

minPriceInput.addEventListener('input', () => {
    if (parseInt(minPriceInput.value) > parseInt(maxPriceInput.value)) {
        maxPriceInput.value = minPriceInput.value;
    }
    atualizarValoresPreco();
});

maxPriceInput.addEventListener('input', () => {
    if (parseInt(maxPriceInput.value) < parseInt(minPriceInput.value)) {
        minPriceInput.value = maxPriceInput.value;
    }
    atualizarValoresPreco();
});

function mostrarTalentos(listaTalentos) {
    resultsContainer.innerHTML = '';
    if (listaTalentos.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhum talento encontrado com os filtros selecionados.</p>';
        return;
    }

    listaTalentos.forEach(talento => {
        const talentoCard = document.createElement('div');
        talentoCard.classList.add('talento-card');
        talentoCard.innerHTML = `
            <h3>${talento.nome}</h3>
            <p class="descricao">${talento.descricao}</p>
            <p class="preco">Preço: R$ ${talento.preco.toFixed(2)}</p>
            <p class="tags">Tags: ${talento.tags.join(', ')}</p>
        `;
        resultsContainer.appendChild(talentoCard);
    });
}

function filtrarResultados() {
    const keyword = keywordInput.value.toLowerCase();
    const minPrice = parseFloat(minPriceInput.value);
    const maxPrice = parseFloat(maxPriceInput.value);
    const selectedTags = Array.from(document.querySelectorAll('input[name="tag"]:checked')).map(cb => cb.value);

    const resultadosFiltrados = talentos.filter(talento => {
        const nomeLower = talento.nome.toLowerCase();
        const descricaoLower = talento.descricao.toLowerCase();
        const precoValido = talento.preco >= minPrice && talento.preco <= maxPrice;
        const keywordValida = keyword === '' || nomeLower.includes(keyword) || descricaoLower.includes(keyword);
        const tagsValidas = selectedTags.every(tag => talento.tags.includes(tag));

        return precoValido && keywordValida && tagsValidas;
    });

    mostrarTalentos(resultadosFiltrados);
}

// Inicialização
gerarFiltrosDeTags();
atualizarValoresPreco();
mostrarTalentos(talentos); // Mostrar todos os talentos inicialmente

// Adiciona um ouvinte de evento para a busca por palavra-chave em tempo real
keywordInput.addEventListener('input', filtrarResultados);