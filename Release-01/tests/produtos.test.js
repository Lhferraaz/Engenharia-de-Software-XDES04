import { By, until } from 'selenium-webdriver';
import { createDriver, sleep, BASE_URL } from './setup.js'; // Adicione a extensão .js
import fs from 'fs'; // <-- IMPORTANTE: Adicionado para salvar o arquivo
import path from 'path'; // <-- Adicionado para lidar com caminhos

/**
 * Função de ajuda para esperar robustamente por um elemento.
 * (A mesma do client_tests.js)
 */
async function findAndInteract(driver, locator, timeout = 5000) {
  const description = locator.toString(); // Para logs de erro

  // 1. Espera o elemento ser LOCALIZADO (existir no DOM)
  const element = await driver.wait(
    until.elementLocated(locator),
    timeout,
    `Elemento ${description} não foi localizado no DOM.`
  );
  
  // 2. Espera o elemento estar VISÍVEL
  await driver.wait(
    until.elementIsVisible(element),
    timeout,
    `Elemento ${description} foi localizado, mas não está visível.`
  );

  // 3. Espera o elemento estar HABILITADO (não-desabilitado)
  await driver.wait(
    until.elementIsEnabled(element),
    timeout,
    `Elemento ${description} está visível, mas não está habilitado.`
  );
  
  return element; // Retorna o elemento pronto para interagir
}


async function testProdutosCRUD() {
  const driver = await createDriver();
  
  // O try/catch principal agora está aqui fora
  try {
    await runTestSteps(driver); // Função separada para os passos do teste
  } catch (error) {
    console.error('❌ Erro durante os testes de PRODUTOS:', error.message);
    
    // --- CAPTURA DE TELA NO ERRO ---
    console.log('📸 Tirando screenshot da falha...');
    try {
      const screenshot = await driver.takeScreenshot();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join(process.cwd(), `ERRO_PRODUTOS_${timestamp}.png`);
      
      fs.writeFileSync(screenshotPath, screenshot, 'base64');
      console.log(`✅ Screenshot salvo em: ${screenshotPath}\n`);
    } catch (ssError) {
      console.error('🚨 Falha ao tirar o screenshot:', ssError.message);
    }
    // ---------------------------------
    
    throw error; // Re-lança o erro original para falhar o teste
  } finally {
    console.log('🚪 Fechando o driver...');
    await driver.quit();
  }
}

/**
 * Função separada contendo todos os passos do teste
 */
async function runTestSteps(driver) {
  
    console.log('🚀 Iniciando testes de CRUD de Produtos...\n');

    // 1. Navegar para a página de produtos
    console.log('📍 Navegando para página de produtos...');
    await driver.get(`${BASE_URL}/produtos`);
    await sleep(2000);
    console.log('✅ Página carregada\n');

    // 2. Abrir dialog de novo produto
    console.log('➕ Abrindo dialog para novo produto...');
    const btnNovoProduto = await findAndInteract(driver, By.xpath("//button[contains(., 'Novo Produto')]"));
    await btnNovoProduto.click();
    console.log('✅ Dialog aberto\n');

    // --- APLICANDO CORREÇÃO: ESPERA PELA ANIMAÇÃO ---
    console.log('...aguardando 1000ms (1s) para a animação do modal...');
    await sleep(1000); 
    // --------------------------------------------------

    // --- APLICANDO CORREÇÃO: LOCALIZAR MODAL PRIMEIRO ---
    console.log('🔍 Localizando o painel do modal "Novo Produto"...');
    const modalDialog = await driver.wait(
      until.elementLocated(By.xpath("//div[@role='dialog' and .//h2[contains(., 'Novo Produto')]]")),
      5000,
      "Não foi possível localizar o container do modal 'Novo Produto'."
    );
    console.log('✅ Painel do modal localizado.\n');
    
    // 3. Preencher formulário (buscando DENTRO do modal)
    console.log('📝 Preenchendo formulário...');
    
    // --- CORREÇÃO MISTA (FINAL) ---
    // Usamos By.id para campos simples (que provavelmente funcionam)
    await modalDialog.findElement(By.id('nome_produto')).sendKeys('Camiseta Básica');
    await modalDialog.findElement(By.id('tipo')).sendKeys('Camiseta');

    // --- CORREÇÃO DE LÓGICA: CAMPO DE TAGS 'CARACTERÍSTICAS' ---
    console.log("...preenchendo campo de tags 'Características'...");
    
    // 1. Encontrar o container do campo (o 'div' com o input e o botão)
    // Vamos encontrá-lo a partir do label, como vimos no screenshot 'image_87a59c.png'
    const labelCarac = await modalDialog.findElement(By.xpath(".//label[contains(., 'Características do Produto')]"));
    // O screenshot mostra um <div class="flex gap-2"> logo depois do label
    const containerCarac = await labelCarac.findElement(By.xpath("./following-sibling::div[contains(@class, 'flex')]")); 
    
    // 2. Encontrar o input e o botão DENTRO do container
    const inputCarac = await containerCarac.findElement(By.xpath(".//input"));
    const btnCarac = await containerCarac.findElement(By.xpath(".//button[contains(., 'Adicionar')]"));

    // 3. Loop e adiciona as tags (A SUA LÓGICA!)
    const caracteristicas = ['Algodão', 'Confortável', 'Básica'];
    console.log('...adicionando tags:');
    for (const carac of caracteristicas) {
      console.log(`... ${carac}`);
      await inputCarac.sendKeys(carac);
      await sleep(100); // Pausa curta
      await btnCarac.click();
      await sleep(100); // Pausa curta
    }
    console.log('✅ Tags adicionadas.');
    // --------------------------------------------------
    
    // (Combobox 'marca' - APLICANDO A LÓGICA DE LABEL QUE APRENDEMOS)
    console.log("...procurando combobox 'Marca' a partir do label...");
    const marcaSelect = await modalDialog.findElement(By.xpath(".//label[contains(., 'Marca')]/following-sibling::button[@role='combobox']"));
    await marcaSelect.click();
    await sleep(500);
    const primeiramarca = await findAndInteract(driver, By.xpath("//div[@role='option'][1]"));
    await primeiramarca.click();
    await sleep(500);

    await sleep(500);

    await modalDialog.findElement(By.id('tamanho')).sendKeys('M');
    
    // --- CORREÇÃO DE VALIDAÇÃO: 'Cores' ---
    // O screenshot mostra que 'Cores' é um grupo de checkboxes.
    // Vamos clicar no 'Azul' e 'Preto' usando o label.
    // --- CORREÇÃO DE VALIDAÇÃO: 'Cores' ---
    // O screenshot mostra que 'Cores' é um grupo de checkboxes.
    // A tentativa de clicar no 'input' falhou. Vamos clicar no LABEL.
    console.log("...selecionando Cores (clicando no LABEL)...");
    
    const labelAzul = await modalDialog.findElement(By.xpath(".//label[normalize-space()='Azul']"));
    const labelPreto = await modalDialog.findElement(By.xpath(".//label[normalize-space()='Preto']"));
    
    await labelAzul.click();
    await sleep(100); // Pausa curta
    await labelPreto.click();
    await sleep(100); // Pausa curta
    
    console.log("✅ Cores selecionadas.");
    // -----------------------------------------
    
    await modalDialog.findElement(By.id('preco')).sendKeys('49.90');
    await modalDialog.findElement(By.id('quantidade_estoque')).sendKeys('100');
    
    // --- CORREÇÃO DE VALIDAÇÃO: 'Tecido' ---
    console.log("...preenchendo Tecido (apenas letras)...");
    await modalDialog.findElement(By.id('tecido')).sendKeys('Algodao'); // <--- CORRIGIDO
    
    // --- CORREÇÃO DE VALIDAÇÃO: 'URL da Imagem' ---
    // (Assumindo que o ID é 'url_da_imagem' baseado no label)
    console.log("...preenchendo URL da Imagem (obrigatório)...");
  	// O screenshot mostra o label 'URL da Imagem *', vamos usar a lógica de label
  	const inputUrl = await modalDialog.findElement(By.xpath(".//label[contains(., 'URL da Imagem')]/following-sibling::input"));
    await inputUrl.sendKeys('https://placehold.co/600x400/000000/FFFFFF?text=Produto');
    
    console.log('✅ Formulário preenchido (com validação corrigida)\n');
    console.log('⚠️ NOTA: Upload de imagem precisa ser testado manualmente\n');

    // 4. Salvar produto
    console.log('💾 Salvando produto...');
    const btnSalvar = await modalDialog.findElement(By.xpath(".//button[contains(., 'Salvar')]"));
    await btnSalvar.click();
    await sleep(3000);
    console.log('✅ Produto salvo com sucesso\n');

    // 5. Verificar se produto aparece na lista
    console.log('🔍 Verificando se produto aparece na lista...');
    const produtoNaLista = await driver.wait(
      until.elementLocated(By.xpath("//td[contains(., 'Camiseta Básica')]")),
      5000
    );
    console.log('✅ Produto encontrado na lista\n');

    // 6. Testar filtros (Lógica de label já aplicada)
    console.log('🔎 Testando filtros...');
    const xpathFiltroNome = "//label[normalize-space()='Nome do Produto']/following-sibling::input";
    const filtroNome = await findAndInteract(driver, By.xpath(xpathFiltroNome));
    await filtroNome.clear();
    await filtroNome.sendKeys('Camiseta');
    
    const btnBuscar = await findAndInteract(driver, By.xpath("//button[contains(., 'Buscar')]"));
    await btnBuscar.click();
    await sleep(2000); 
    console.log('✅ Filtro de nome aplicado\n');

    // 7. Testar filtro de preço (Lógica de label já aplicada)
    console.log('💰 Testando filtro de preço...');
    const xpathFiltroPrecoMin = "//label[normalize-space()='Preço Mínimo']/following-sibling::input";
    const filtroPrecoMin = await findAndInteract(driver, By.xpath(xpathFiltroPrecoMin));
    await filtroPrecoMin.sendKeys('40');
    
    const xpathFiltroPrecoMax = "//label[normalize-space()='Preço Máximo']/following-sibling::input";
    const filtroPrecoMax = await findAndInteract(driver, By.xpath(xpathFiltroPrecoMax));
    await filtroPrecoMax.sendKeys('60');
    
    await btnBuscar.click();
    
    // --- ESPERA INTELIGENTE PÓS-FILTRO ---
    console.log('...aguardando filtro de preço ser aplicado (esperando por 1 linha)...');
    const singleRowLocator = By.xpath("//tr[.//td[contains(., 'Camiseta Básica')]]");
    
    await driver.wait(async () => {
      const rows = await driver.findElements(singleRowLocator);
      return rows.length === 1; // A condição de sucesso
    }, 5000, "O filtro de preço não resultou em 1 linha.");
    
    console.log('✅ Filtro de preço aplicado\n');

    // 8. Editar produto (LÓGICA ROBUSTA)
    console.log('✏️ Editando produto...');

    // 8.1. Encontrar a linha
    console.log('...localizando a linha (tr) na tabela...');
    const xpathLinha = "//tr[.//td[contains(., 'Camiseta Básica')]]";
    const linhaProduto = await findAndInteract(driver, By.xpath(xpathLinha));
    
    // 8.2. Encontrar o botão (LÓGICA "PARANOICA" DO CHATGPT)
    console.log('...localizando o botão de Editar DENTRO da linha...');
    
    console.log('...localizando a última célula (td) da linha...');
    const acoesCell = await linhaProduto.findElement(By.xpath("./td[last()]"));
    
    console.log('...dando 500ms para os botões da célula renderizarem...');
    await sleep(500);

    // DEBUG
    try {
      const html = await acoesCell.getAttribute('innerHTML');
      console.log('HTML da célula de ações (Editar Produto):', html);
    } catch (e) { console.warn('Falha ao ler innerHTML da célula:', e.message); }

    let btnEditar = null;
    const trySelectorsEdit = [
      "button[aria-label*='Editar']", "button[title*='Editar']", ".//button[contains(., 'Editar')]"
    ];

    for (const sel of trySelectorsEdit) {
      try {
        btnEditar = await acoesCell.findElement(sel.startsWith('.//') ? By.xpath(sel) : By.css(sel));
        if (btnEditar) break;
      } catch (_) {}
    }

    if (!btnEditar) {
      console.log('...fallback: procurando pelo ícone SVG lucide-pencil...');
      try {
        btnEditar = await acoesCell.findElement(By.xpath(".//button[.//*[local-name()='svg' and contains(@class,'lucide-pencil')]]"));
      } catch (e) { /* Falha final */ }
    }

    if (!btnEditar) {
      throw new Error('Botão de EDITAR (Produto) não encontrado.');
    }

    console.log('...garantindo visibilidade e scroll do botão Editar...');
    await driver.wait(until.elementIsVisible(btnEditar), 4000);
    await driver.wait(until.elementIsEnabled(btnEditar), 4000);
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"})', btnEditar);
    await sleep(150);

    try {
      await btnEditar.click();
    } catch (e) {
      console.warn('Click direto no Editar (Produto) falhou, tentando via JS:', e.message);
      await driver.executeScript('arguments[0].click()', btnEditar);
    }

    // --- Fim da lógica do botão ---
    
    console.log('⏳ Esperando modal de edição de produto...');
    await sleep(1000); // Gordura de tempo

    console.log('🔍 Localizando o painel do modal de EDICAO DE PRODUTO...');
    const modalEdicaoDialog = await driver.wait(
      until.elementLocated(By.xpath("//div[@role='dialog' and .//h2[contains(., 'Editar Produto')]]")), // Assumindo o título
      5000,
      "Não foi possível localizar o container do modal 'Editar Produto'."
    );
    
    // --- CORREÇÃO: Revertendo para By.id ---
    const precoInput = await modalEdicaoDialog.findElement(By.id('preco')); 
    await precoInput.clear();
    await precoInput.sendKeys('59.90');
    
    const btnSalvarEdicao = await modalEdicaoDialog.findElement(By.xpath(".//button[contains(., 'Salvar')]"));
    await btnSalvarEdicao.click();
    await sleep(3000);
    console.log('✅ Produto editado\n');

    // 9. Deletar produto (LÓGICA ROBUSTA)
    console.log('🗑️ Deletando produto...');
    
    // 9.1. Encontrar a linha
    console.log('...localizando a linha (tr) atualizada...');
    const xpathLinhaDeletar = "//tr[.//td[contains(., 'Camiseta Básica')]]"; // Usar o nome é mais seguro
    const linhaProdutoDeletar = await findAndInteract(driver, By.xpath(xpathLinhaDeletar));

    // 9.2. Encontrar o botão (LÓGICA "PARANOICA" DO CHATGPT)
    console.log('...localizando o botão de Deletar DENTRO da linha...');
    
    console.log('...localizando a última célula (td) da linha de exclusão...');
    const acoesCellDeletar = await linhaProdutoDeletar.findElement(By.xpath("./td[last()]"));

    console.log('...dando 500ms para os botões da célula renderizarem...');
    await sleep(500);

    // DEBUG
    try {
      const html = await acoesCellDeletar.getAttribute('innerHTML');
      console.log('HTML da célula de ações (Deletar Produto):', html);
    } catch (e) { console.warn('Falha ao ler innerHTML da célula:', e.message); }

    let btnDeletar = null;
    const trySelectorsDelete = [
      "button[aria-label*='Deletar']", "button[aria-label*='Excluir']",
      "button[title*='Deletar']", "button[title*='Excluir']",
      ".//button[contains(., 'Deletar')]", ".//button[contains(., 'Excluir')]"
    ];

    for (const sel of trySelectorsDelete) {
      try {
        btnDeletar = await acoesCellDeletar.findElement(sel.startsWith('.//') ? By.xpath(sel) : By.css(sel));
        if (btnDeletar) break; 
      } catch (_) {}
    }

    if (!btnDeletar) {
      console.log('...fallback: procurando pelo ícone SVG lucide-trash...');
      try {
        btnDeletar = await acoesCellDeletar.findElement(By.xpath(".//button[.//*[local-name()='svg' and contains(@class,'lucide-trash')]]"));
      } catch (e) { /* Falha final */ }
    }

    if (!btnDeletar) {
      throw new Error('Botão de DELETAR (Produto) não encontrado.');
    }

    console.log('...garantindo visibilidade e scroll do botão Deletar...');
    await driver.wait(until.elementIsVisible(btnDeletar), 4000);
    await driver.wait(until.elementIsEnabled(btnDeletar), 4000);
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"})', btnDeletar);
    await sleep(150);

    try {
      await btnDeletar.click();
    } catch (e) {
      console.warn('Click direto no Deletar (Produto) falhou, tentando via JS:', e.message);
      await driver.executeScript('arguments[0].click()', btnDeletar);
    }
    await sleep(500);
    
    // Confirmação
    await driver.switchTo().alert().accept();
    await sleep(2000);
    console.log('✅ Produto deletado\n');

    console.log('🎉 TODOS OS TESTES DE PRODUTOS PASSARAM COM SUCESSO!\n');
}

// Executar os testes
testProdutosCRUD()
  .then(() => {
    console.log('✨ Automação de Produtos finalizada com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Automação de Produtos finalizada com erros!');
    process.exit(1);
  });