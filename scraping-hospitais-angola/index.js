const puppeteer = require('puppeteer');
const fs = require('fs');

// Lista de regiões de Angola para segmentar a busca e contornar os limites do Google
const regioesAngola = [
    "Luanda", "Benguela", "Huambo", "Huíla", "Cabinda", 
    "Uíge", "Malanje", "Cuanza Sul", "Cuanza Norte", "Zaire", 
    "Lunda Norte", "Lunda Sul", "Moxico", "Bié", "Namibe", 
    "Cunene", "Cuando Cubango", "Bengo"
];

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            // Seleciona o container lateral de resultados do Google Maps
            const container = document.querySelector('div[role="feed"]');
            
            var timer = setInterval(() => {
                var scrollHeight = container.scrollHeight;
                container.scrollBy(0, distance);
                totalHeight += distance;

                // Se chegou ao fim da lista ou não há mais novos elementos
                if(totalHeight >= scrollHeight - window.innerHeight || document.body.textContent.includes("Chegou ao fim da lista")){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function rasparHospitais() {
    // Inicia o navegador em modo visível para acompanhar o progresso (mude para true se quiser ocultar)
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // Configura uma tela maior para carregar bem os elementos
    await page.setViewport({ width: 1280, height: 800 });

    let todosHospitais = [];
    // Conjunto para evitar duplicados caso um hospital apareça em mais de uma busca
    let linksProcessados = new Set(); 

    console.log("Iniciando a extração de hospitais em Angola...");

    for (const regiao of regioesAngola) {
        console.log(`Buscando em: ${regiao}...`);
        
        // Codifica o termo de busca para a URL
        const termoBusca = encodeURIComponent(`hospitais em ${regiao}, Angola`);
        await page.goto(`https://google.com{termoBusca}`, { waitUntil: 'networkidle2' });

        try {
            // Aguarda o menu lateral de resultados carregar
            await page.waitForSelector('div[role="feed"]', { timeout: 10000 });
            
            // Rola a barra lateral até o final para carregar todos os hospitais da região
            await autoScroll(page);
            await page.waitForTimeout(2000);

            // Coleta os dados básicos e os links de cada hospital carregado na tela
            const hospitaisDaPagina = await page.evaluate(() => {
                const cards = document.querySelectorAll('div[role="feed"] > div');
                let dados = [];

                cards.forEach(card => {
                    const linkElement = card.querySelector('a[href*="/maps/place/"]');
                    if (!linkElement) return;

                    const url = linkElement.getAttribute('href');
                    
                    // Extrai dados visíveis no card lateral
                    const nomeElement = card.querySelector('.qBF1Pd');
                    const nome = nomeElement ? nomeElement.textContent.trim() : "Não informado";
                    
                    // Captura a classificação estrelas e quantidade de avaliações se houver
                    const avaliacaoElement = card.querySelector('.MW4etd');
                    const estrelas = avaliacaoElement ? avaliacaoElement.textContent.trim() : "Sem avaliações";

                    const revisoesElement = card.querySelector('.UY7F9');
                    const totalAvaliacoes = revisoesElement ? revisoesElement.textContent.replace(/[()]/g, '').trim() : "0";

                    // Tenta capturar o endereço/telefone resumido que aparece nas linhas de texto do card
                    const infoLinhas = card.querySelectorAll('.W4v7sc > span');
                    let metadados = [];
                    infoLinhas.forEach(linha => {
                        if(linha.textContent.trim()) metadados.push(linha.textContent.trim());
                    });

                    dados.push({
                        nome,
                        url,
                        estrelas,
                        totalAvaliacoes,
                        detalhesCard: metadados.join(' | ')
                    });
                });

                return dados;
            });

            // Filtra duplicados e adiciona à lista global do MVP
            for (const hosp of hospitaisDaPagina) {
                if (!linksProcessados.has(hosp.url)) {
                    linksProcessados.add(hosp.url);
                    todosHospitais.push(hosp);
                }
            }

            console.log(`Encontrados ${hospitaisDaPagina.length} resultados em ${regiao}. Total acumulado: ${todosHospitais.length}`);

        } catch (e) {
            console.log(`Nenhum resultado encontrado ou erro ao carregar a região: ${regiao}`);
        }
    }

    // Salva a estrutura de dados coletada em um arquivo JSON legível
    fs.writeFileSync('hospitais_angola.json', JSON.stringify(todosHospitais, null, 2), 'utf-8');
    console.log(`\nSucesso! Extração concluída. ${todosHospitais.length} hospitais únicos salvos em 'hospitais_angola.json'.`);

    await browser.close();
}

rasparHospitais();

