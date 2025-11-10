import { By, until } from 'selenium-webdriver';
import { createDriver, sleep, BASE_URL } from './setup.js'; // Adicione a extensão .js
import fs from 'fs'; // <-- IMPORTANTE: Adicionado para salvar o arquivo
import path from 'path'; // <-- Adicionado para lidar com caminhos

/**
 * Função de ajuda para esperar robustamente por um elemento.
 * Ela espera o elemento ser:
 * 1. Localizado (existir no DOM)
 * 2. Visível (não estar escondido)
 * 3. Habilitado (não estar desabilitado)
 * * Isso resolve 99% dos erros 'element not interactable'.
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


async function testClientesCRUD() {
  const driver = await createDriver();
  
  // O try/catch principal agora está aqui fora
  try {
    await runTestSteps(driver); // Função separada para os passos do teste
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    
    // --- CAPTURA DE TELA NO ERRO ---
    console.log('📸 Tirando screenshot da falha...');
    try {
      const screenshot = await driver.takeScreenshot();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      // Salva na pasta 'tests' (ou onde o script é executado)
      const screenshotPath = path.join(process.cwd(), `ERRO_CLIENTES_${timestamp}.png`);
      
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
  
    console.log('🚀 Iniciando testes de CRUD de Clientes...\n');

    // 1. Navegar para a página de clientes
    console.log('📍 Navegando para página de clientes...');
    await driver.get(`${BASE_URL}/clientes`);
    await sleep(2000);
    console.log('✅ Página carregada\n');

    // 2. Abrir dialog de novo cliente
    console.log('➕ Abrindo dialog para novo cliente...');
    // Usamos a função de ajuda aqui também
    const btnNovoCliente = await findAndInteract(driver, By.xpath("//button[contains(., 'Novo Cliente')]"));
    await btnNovoCliente.click(); // Clique único
    console.log('✅ Dialog aberto\n');

    // --- NOVA CORREÇÃO: ESPERA PELA ANIMAÇÃO DO MODAL ---
    console.log('...aguardando 1000ms (1s) para a animação do modal...');
    await sleep(1000); // AUMENTADO PARA 1 SEGUNDO (gordura de tempo)
    // --------------------------------------------------


    // --- CORREÇÃO DE SELETOR AMBÍGUO ---
    // 1. Encontrar o container do modal primeiro.
    // Usamos o título 'Novo Cliente' como âncora
    console.log('🔍 Localizando o painel do modal...');
    const modalDialog = await driver.wait(
      until.elementLocated(By.xpath("//div[@role='dialog' and .//h2[contains(., 'Novo Cliente')]]")),
      5000,
      "Não foi possível localizar o container do modal 'Novo Cliente'."
    );
    console.log('✅ Painel do modal localizado.\n');
    
    // 2.5. Esperar pelo primeiro campo do formulário
    console.log('⏳ Esperando formulário ficar interativo...');
    // 3. Preencher formulário (procurando os elementos DENTRO do modalDialog)
    console.log('📝 Preenchendo formulário...');

    // Agora usamos modalDialog.findElement()
    const inputNome = await modalDialog.findElement(By.id('nome'));
    await inputNome.sendKeys('João');
    
    const inputSobrenome = await modalDialog.findElement(By.id('sobrenome'));
    await inputSobrenome.sendKeys('Silva');

    const inputEmail = await modalDialog.findElement(By.id('telefone_ou_email'));
    await inputEmail.sendKeys('joao@teste.com');
    
    // Selecionar gênero
    // CORREÇÃO: O seletor By.id('genero') estava errado.
    // Este é um combobox customizado. Vamos encontrar o botão (role=combobox)
    // que é "irmão" (sibling) do label 'Gênero'.
    console.log("🔍 Procurando pelo combobox de Gênero...");
    const generoSelect = await modalDialog.findElement(By.xpath(".//label[contains(., 'Gênero')]/following-sibling::button[@role='combobox']"));
    await generoSelect.click();
    await sleep(500); // Sleep para opções aparecerem
    
    // Espera pela opção (agora também busca DENTRO do contexto do driver, pois o dropdown pode
    // ser renderizado no 'body' e não dentro do modal)
    const masculinoOption = await findAndInteract(driver, By.xpath("//div[@role='option'][contains(., 'Masculino')]"));
    await masculinoOption.click();
    await sleep(500);

    // Data de nascimento
    const inputData = await modalDialog.findElement(By.id('data_nascimento'));
    await inputData.sendKeys('15/03/1990');
    
    // Senha
    const inputSenha = await modalDialog.findElement(By.id('senha'));
    await inputSenha.sendKeys('Senha123!');
    
    // Campos opcionais
    const inputCidade = await modalDialog.findElement(By.id('cidade'));
    await inputCidade.sendKeys('Belo Horizonte');
    
    const inputBairro = await modalDialog.findElement(By.id('bairro'));
    await inputBairro.sendKeys('Centro');
    
    console.log('✅ Formulário preenchido\n');

    // 4. Salvar cliente
    console.log('💾 Salvando cliente...');
    // O botão salvar também deve ser buscado DENTRO do modal
    const btnSalvar = await modalDialog.findElement(By.xpath(".//button[contains(., 'Salvar')]")); // .// para buscar dentro
    await btnSalvar.click();
    await sleep(3000); // Espera salvar e fechar modal
    console.log('✅ Cliente salvo com sucesso\n');

    // 5. Verificar se cliente aparece na lista
    console.log('🔍 Verificando se cliente aparece na lista...');
    // A espera aqui é só "elementLocated" pois é o suficiente
    const clienteNaLista = await driver.wait(
      until.elementLocated(By.xpath("//td[contains(., 'João Silva')]")),
      5000
    );
    console.log('✅ Cliente encontrado na lista\n');

    // 6. Testar filtros
    console.log('🔎 Testando filtros...');
    // Aqui usamos findAndInteract porque queremos o filtro da PÁGINA, não do modal
    
    // --- CORREÇÃO: Aplicando o XPath de label para TODOS os filtros ---
    // O seletor de ID é frágil. Vamos usar o label (sem asterisco)
    const xpathFiltroNome = "//label[normalize-space()='Nome']/following-sibling::input";
    const filtroNome = await findAndInteract(driver, By.xpath(xpathFiltroNome));
    await filtroNome.clear();
    await filtroNome.sendKeys('João'); // Manter sendKeys aqui (não é modal)

    // --- CORREÇÃO: Adicionar filtro de telefone/email para garantir resultado único ---
    console.log('...adicionando filtro de Contato para evitar ambiguidade...');
    
    // CORREÇÃO: O ID 'telefone_ou_email' estava errado.
    // Vamos encontrar o input que é "irmão" (sibling) do label 'Telefone'.
    const xpathFiltroContato = "//label[contains(., 'Telefone')]/following-sibling::input";
    const filtroContato = await findAndInteract(driver, By.xpath(xpathFiltroContato));
    await filtroContato.clear();
    await filtroContato.sendKeys('joao@teste.com');
    // -------------------------------------------------------------------------
    
    const btnBuscar = await findAndInteract(driver, By.xpath("//button[contains(., 'Buscar')]"));
    await btnBuscar.click();
    
    // --- CORREÇÃO: SUBSTITUIR O 'SLEEP' POR UMA ESPERA INTELIGENTE ---
    // await sleep(2000); // <-- REMOVIDO. É ineficaz.

    console.log('...aguardando filtro ser aplicado (esperando por 1 linha)...');
    
    // Este é o XPath que encontra a linha que queremos
    const singleRowLocator = By.xpath("//tr[.//td[contains(., 'João Silva')]]");
    
    // Agora, esperamos até que o findElements para esse XPath retorne um array de tamanho 1
    await driver.wait(async () => {
      const rows = await driver.findElements(singleRowLocator);
      return rows.length === 1; // A condição de sucesso
    }, 5000, "O filtro foi clicado, mas a tabela não foi atualizada para 1 linha.");
    
    console.log('✅ Filtro aplicado\n');

    // 7. Editar cliente
    console.log('✏️ Editando cliente...');

    // --- CORREÇÃO: Lógica de 2 passos para evitar Race Condition ---
    
    // 7.1. PRIMEIRO, espere a LINHA inteira ficar interativa
    console.log('...localizando a linha (tr) na tabela...');
    const xpathLinha = "//tr[.//td[contains(., 'João Silva')]]";
    const linhaCliente = await findAndInteract(driver, By.xpath(xpathLinha));
    
    // 7.2. SEGUNDO, encontre o botão DENTRO da linha
    console.log('...localizando o botão de Editar DENTRO da linha...');
    
    /// --- CORREÇÃO DE XPATH ---
    /// 1. Procure a ÚLTIMA CÉLULA (td) da linha
    console.log('...localizando a última célula (td) da linha...');
    const acoesCell = await linhaCliente.findElement(By.xpath("./td[last()]"));
// após obter acoesCell
console.log('...dando 500ms para os botões da célula renderizarem...');
await sleep(500);

// DEBUG: imprima o HTML da célula se precisar inspecionar (remova depois)
try {
  const html = await acoesCell.getAttribute('innerHTML');
  console.log('HTML da célula de ações:', html);
} catch (e) {
  console.warn('Falha ao ler innerHTML da célula:', e.message);
}

// 1) Tentar o seletor mais direto (aria-label ou title)
let btnEditar = null;
const trySelectors = [
  "button[aria-label*='Editar']",
  "button[title*='Editar']",
  ".//button[contains(., 'Editar')]" // texto dentro do botão
];

for (const sel of trySelectors) {
  try {
    if (sel.startsWith('.//')) {
      btnEditar = await acoesCell.findElement(By.xpath(sel));
    } else {
      btnEditar = await acoesCell.findElement(By.css(sel));
    }
    if (btnEditar) break;
  } catch (_) { /* continua para próximo */ }
}

// 2) Fallback: procurar por botão com svg (usando local-name para robustez)
if (!btnEditar) {
  try {
    btnEditar = await acoesCell.findElement(By.xpath(".//button[.//*[local-name()='svg' and (contains(@class,'lucide-pencil') or contains(., 'pencil') )]]"));
  } catch (e) {
    // 3) Último recurso: pegar o primeiro botão visível dentro da célula
    const candidatos = await acoesCell.findElements(By.xpath(".//button"));
    for (const c of candidatos) {
      try {
        if (await c.isDisplayed()) { btnEditar = c; break; }
      } catch(_) {}
    }
  }
}

if (!btnEditar) {
  throw new Error('Botão de editar não encontrado dentro da célula de ações. Veja o innerHTML impresso acima para inspecionar.');
}

// 4) Garantir visibilidade / habilitado / scroll antes do clique
await driver.wait(until.elementIsVisible(btnEditar), 4000, 'Botão de editar não ficou visível');
await driver.wait(until.elementIsEnabled(btnEditar), 4000, 'Botão de editar não ficou habilitado');

// rolar para view (evita overlay/fora da tela)
await driver.executeScript('arguments[0].scrollIntoView({block:"center"})', btnEditar);
await sleep(150);

// clique final
try {
  await btnEditar.click();
} catch (e) {
  // fallback: clicar via JS se o click convencional falhar
  console.warn('Click direto falhou, tentando via JS:', e.message);
  await driver.executeScript('arguments[0].click()', btnEditar);
}
    
    // Espera o modal de edição e o campo cidade
    console.log('⏳ Esperando modal de edição...');

    // --- APLICANDO A MESMA LÓGICA DE JS no modal de EDIÇÃO ---
    console.log('...aguardando 1000ms (1s) para a animação do modal de edição...');
    await sleep(1000); // Gordura de tempo aqui também

    // 1. Encontrar o modal de EDIÇÃO
    console.log('🔍 Localizando o painel do modal de EDICAO...');
    const modalEdicaoDialog = await driver.wait(
      until.elementLocated(By.xpath("//div[@role='dialog' and .//h2[contains(., 'Editar Cliente')]]")), // Assumindo o título
      5000,
      "Não foi possível localizar o container do modal 'Editar Cliente'."
    );

    const cidadeInput = await modalEdicaoDialog.findElement(By.id('cidade'));
    await cidadeInput.clear(); // Limpa o campo
    await cidadeInput.sendKeys('São Paulo');
    
    const btnSalvarEdicao = await modalEdicaoDialog.findElement(By.xpath(".//button[contains(., 'Salvar')]"));
    await btnSalvarEdicao.click();
    await sleep(3000);
    console.log('✅ Cliente editado\n');

    // 8. Deletar cliente
    console.log('🗑️ Deletando cliente...');

    // --- APLICANDO A MESMA LÓGICA ROBUSTA DE 2 PASSOS ---
    
    // 8.1. PRIMEIRO, espere a LINHA
    // (Pode ser uma linha diferente agora, com a cidade "São Paulo")
    console.log('...localizando a linha (tr) atualizada...');
    const xpathLinhaDeletar = "//tr[.//td[contains(., 'São Paulo')]]"; // Mais específico
    const linhaClienteDeletar = await findAndInteract(driver, By.xpath(xpathLinhaDeletar));

    // 8.2. SEGUNDO, encontre o botão DENTRO da linha
    console.log('...localizando o botão de Deletar DENTRO da linha...');
    
    // --- APLICANDO A LÓGICA ROBUSTA DO CHATGPT ---
    
    // 1. Encontrar a célula
    console.log('...localizando a última célula (td) da linha de exclusão...');
    const acoesCellDeletar = await linhaClienteDeletar.findElement(By.xpath("./td[last()]"));

    // 2. Dar tempo para renderizar
    console.log('...dando 500ms para os botões da célula renderizarem...');
    await sleep(500);

    // DEBUG: Imprimir o HTML da célula (opcional, mas útil)
    try {
      const html = await acoesCellDeletar.getAttribute('innerHTML');
      console.log('HTML da célula de ações (Deletar):', html);
    } catch (e) {
      console.warn('Falha ao ler innerHTML da célula:', e.message);
    }

    // 3) Tentar seletores estáveis primeiro
    let btnDeletar = null;
    const trySelectoors = [
      "button[aria-label*='Deletar']",
      "button[aria-label*='Excluir']", // (Comum em PT-BR)
      "button[title*='Deletar']",
      "button[title*='Excluir']",
      ".//button[contains(., 'Deletar')]",
      ".//button[contains(., 'Excluir')]"
    ];

    for (const sel of trySelectors) {
      try {
        if (sel.startsWith('.//')) {
          btnDeletar = await acoesCellDeletar.findElement(By.xpath(sel));
        } else {
          btnDeletar = await acoesCellDeletar.findElement(By.css(sel));
        }
        if (btnDeletar) break; // Encontrou
      } catch (_) { /* continua para próximo */ }
    }

    // 4) Fallback: procurar pelo ícone SVG (nosso velho amigo 'lucide-trash')
    if (!btnDeletar) {
      console.log('...fallback: procurando pelo ícone SVG lucide-trash...');
      try {
        btnDeletar = await acoesCellDeletar.findElement(By.xpath(".//button[.//*[local-name()='svg' and contains(@class,'lucide-trash')]]"));
      } catch (e) {
        console.warn('Fallback de SVG falhou:', e.message);
      }
    }

    // 5) Se NADA funcionou, falhe
    if (!btnDeletar) {
      throw new Error('Botão de DELETAR não encontrado dentro da célula de ações. Veja o innerHTML impresso acima para inspecionar.');
    }

    // 6) Garantir visibilidade / habilitado / scroll antes do clique
    console.log('...garantindo visibilidade e scroll do botão Deletar...');
    await driver.wait(until.elementIsVisible(btnDeletar), 4000, 'Botão de deletar não ficou visível');
    await driver.wait(until.elementIsEnabled(btnDeletar), 4000, 'Botão de deletar não ficou habilitado');
    await driver.executeScript('arguments[0].scrollIntoView({block:"center"})', btnDeletar);
    await sleep(150); // Pausa pós-scroll

    // 7) clique final (com fallback JS)
    try {
      await btnDeletar.click();
    } catch (e) {
      console.warn('Click direto no Deletar falhou, tentando via JS:', e.message);
      await driver.executeScript('arguments[0].click()', btnDeletar);
    }
    await sleep(500); // Manter o sleep que já existia
    
    // Confirmação
    await driver.switchTo().alert().accept();
    await sleep(2000);
    console.log('✅ Cliente deletado\n');

    console.log('🎉 TODOS OS TESTES DE CLIENTES PASSARAM COM SUCESSO!\n');
}

// Executar os testes
testClientesCRUD()
  .then(() => {
    console.log('✨ Automação finalizada com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Automação finalizada com erros!');
    process.exit(1);
  });