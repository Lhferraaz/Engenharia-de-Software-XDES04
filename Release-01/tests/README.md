# Testes de Automação com Selenium

## Pré-requisitos

1. **Node.js** instalado
2. **Google Chrome** instalado
3. **ChromeDriver** instalado e no PATH do sistema
   - Download: https://chromedriver.chromium.org/downloads
   - Ou instale via npm: `npm install -g chromedriver`

## Como Executar

### Certifique-se que o servidor está rodando
```bash
# Na raiz do projeto
npm run dev
```

### Execute os testes

**Teste de Clientes:**
```bash
node tests/clientes.test.js
```

**Teste de Produtos:**
```bash
node tests/produtos.test.js
```

## O que é testado

### Módulo de Clientes (clientes.test.js)
- ✅ Navegação para página de clientes
- ✅ Abertura do dialog de novo cliente
- ✅ Preenchimento do formulário com validações
- ✅ Criação de novo cliente
- ✅ Verificação na lista
- ✅ Aplicação de filtros
- ✅ Edição de cliente existente
- ✅ Exclusão de cliente

### Módulo de Produtos (produtos.test.js)
- ✅ Navegação para página de produtos
- ✅ Abertura do dialog de novo produto
- ✅ Preenchimento do formulário com validações
- ✅ Criação de novo produto
- ✅ Verificação na lista
- ✅ Aplicação de filtros (nome e preço)
- ✅ Edição de produto existente
- ✅ Exclusão de produto

## Configuração

### Modo Headless
Para rodar os testes sem abrir o navegador, edite `tests/setup.js` e descomente a linha:
```javascript
options.addArguments('--headless');
```

### URL Base
Se sua aplicação estiver rodando em outra porta, edite a constante `BASE_URL` em `tests/setup.js`:
```javascript
const BASE_URL = 'http://localhost:SUA_PORTA';
```

## Troubleshooting

### Erro: ChromeDriver não encontrado
```bash
npm install -g chromedriver
```

### Erro: Timeout ao localizar elemento
- Verifique se o servidor está rodando
- Aumente o tempo de espera em `sleep()` ou `until.elementLocated()`

### Erro: Alert não encontrado
- Alguns navegadores podem ter comportamento diferente com alerts
- Ajuste o tempo de espera antes do `alert().accept()`

## Notas

- **Upload de Imagem**: O teste de produtos não inclui upload de imagem automático, pois requer arquivo físico no sistema
- **Dados de Teste**: Os testes criam e removem dados automaticamente
- **Marcas**: O teste de produtos assume que existe pelo menos uma marca cadastrada no sistema
