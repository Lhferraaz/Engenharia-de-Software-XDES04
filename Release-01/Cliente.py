# Import das funções
import tkinter as tk
from tkinter import ttk
from tkinter import messagebox
import tksheet

class Mais40Caracteres(Exception):
  pass

class Mais30Caracteres(Exception):
  pass

class Mais50Caracteres(Exception):
  pass

class NaoENumero(Exception):
  pass

class CampoEmBranco(Exception):
  pass


# Classe Endereço
class Endereco:
  # Aqui defino um contador e inicializo como 0
  contador_id = 0
  
  def __init__(self, estado, cidade, bairro, rua_ou_avenida, numero):
    # Aqui eu incremento o contador a cada adição de um novo cliente
    # Como contador_id é um atributo da classe endereco
    # eu preciso usar endereco.contador_id para acessa-lo
    Endereco.contador_id += 1

    # 
    self.__id = Endereco.contador_id
    self.__estado = estado

    if len(cidade) > 30:
      raise Mais30Caracteres("A cidade deve ter no máximo 30 caracteres")
      
    self.__cidade = cidade

    if len(bairro) > 30:
      raise Mais30Caracteres("O bairro deve ter no máximo 30 caracteres")
    
    self.__bairro = bairro

    if len(rua_ou_avenida) > 50:
      raise Mais50Caracteres("A rua ou avenida deve ter no máximo 50 caracteres")
    
    self.__rua_ou_avenida = rua_ou_avenida
    
    if not numero.isdigit():
      raise NaoENumero("O campo número só aceita números")
    
    self.__numero = int(numero)

  @property
  def id(self):
    return self.__id

  @property
  def estado(self):
    return self.__estado
  
  @property
  def cidade(self):
    return self.__cidade
  
  @property
  def bairro(self):
    return self.__bairro
  
  @property
  def rua_ou_avenida(self):
    return self.__rua_ou_avenida
  
  @property
  def numero(self):
    return self.__numero


class Cliente:
  contador_id = 0

  def __init__(self, nome, sobrenome, contato, genero, data_nasc, senha, endereco = None):
    Cliente.contador_id += 1

    self.__id = Cliente.contador_id
    if len(nome) > 40:
      raise Mais40Caracteres("O nome deve ter no máximo 40 caracteres")
    
    self.__nome = nome

    if len(sobrenome) > 40:
      raise Mais40Caracteres("O sobrenome deve ter no máximo 40 caracteres")
    
    self.__sobrenome = sobrenome

    self.__contato = contato
    self.__genero = genero
    self.__data_nasc = data_nasc
    if len(senha) > 40:
      raise Mais40Caracteres("A senha deve ter no máximo 40 caracteres")
    
    self.__senha = senha
    self.__endereco = endereco

  @property
  def id(self):
    return self.__id
  
  @property
  def nome(self):
    return self.__nome
  
  @property
  def sobrenome(self):
    return self.__sobrenome
  
  @property
  def contato(self):
    return self.__contato
  
  @property
  def genero(self):
    return self.__genero
  
  @property
  def data_nasc(self):
    return self.__data_nasc
  
  @property
  def senha(self):
    return self.__senha
  
  @property
  def endereco(self):
    if self.__endereco == None:
      return "Endereço não cadastrado"

    return self.__endereco
  
  @endereco.setter
  def endereco(self, endereco):
    self.__endereco = endereco

class LimiteInsereCliente(tk.Toplevel):
  def __init__(self, controle):
    tk.Toplevel.__init__(self)
    self.geometry('450x650')
    self.title("Cadastrar Cliente")
    self.controle = controle

    self.main_frame = ttk.Frame(self)
    self.main_frame.pack(fill=tk.BOTH, expand = True, padx=15, pady=15)

    self.main_frame.columnconfigure(1, weight=1)

    self.labelNome = ttk.Label(self.main_frame, text="Nome: ")
    self.labelNome.grid(row=0, column=0, sticky=tk.W, pady=5)
    self.inputNome = ttk.Entry(self.main_frame, width=40)
    self.inputNome.grid(row=0, column=1, sticky=tk.EW, pady=5)

    self.labelSobrenome = ttk.Label(self.main_frame, text="Sobrenome: ")
    self.labelSobrenome.grid(row=1, column=0, sticky=tk.W, pady=5)
    self.inputSobrenome = ttk.Entry(self.main_frame, width=40)
    self.inputSobrenome.grid(row=1, column=1, sticky=tk.EW, pady=5)

    self.labelContato = ttk.Label(self.main_frame, text="Contato: ")
    self.labelContato.grid(row=2, column=0, sticky=tk.W, pady=5)
    self.inputContato = ttk.Entry(self.main_frame, width=40)
    self.inputContato.grid(row=2, column=1, sticky=tk.EW, pady=5)

    self.labelGenero = ttk.Label(self.main_frame, text="Genero: ")
    self.labelGenero.grid(row=3, column=0, sticky=tk.W, pady=5)
    self.inputGenero = ttk.Entry(self.main_frame, width=40)
    self.inputGenero.grid(row=3, column=1, sticky=tk.EW, pady=5)

    self.labelData_nasc = ttk.Label(self.main_frame, text="Data de Nascimento: ")
    self.labelData_nasc.grid(row=4, column=0, sticky=tk.W, pady=5)
    self.inputData_nasc = ttk.Entry(self.main_frame, width=40)
    self.inputData_nasc.grid(row=4, column=1, sticky=tk.EW, pady=5)

    self.labelSenha = ttk.Label(self.main_frame, text="Senha: ")
    self.labelSenha.grid(row=5, column=0, sticky=tk.W, pady=5)
    self.inputSenha = ttk.Entry(self.main_frame, width=40)
    self.inputSenha.grid(row=5, column=1, sticky=tk.EW, pady=5)

    # ------ Separador ------

    separator = ttk.Separator(self.main_frame, orient ='horizontal')
    separator.grid(row = 6, column=0, columnspan=2, sticky ='ew', pady=15)

    # ------ Endereço ------

    # Crio um checkvar para o checkbutton
    self.checkVar = tk.BooleanVar()
    # Inicia com o checkbutton desmarcado
    self.checkVar.set(False)
    # Crio o checkbutton
    self.checkEndereco = ttk.Checkbutton(
      self.main_frame, # Pai
      text="Cadastrar Endereço", # Texto
      variable=self.checkVar, # Atribuo o checkvar a ele
      command=self.mostraCamposEndereco # Atribuo o comando de mostrar campos
    )

    self.checkEndereco.grid(row=7, column=0, columnspan=2, sticky=tk.W)

    self.frameEndereco = ttk.Frame(self.main_frame)
    self.frameEndereco.columnconfigure(1, weight=1)

    self.labelEstado = ttk.Label(self.frameEndereco, text="Estado: ")
    self.labelEstado.grid(row = 0, column=0, sticky=tk.W, pady=5)
    self.n = tk.StringVar()
    self.escolhaEstado = ttk.Combobox(self.frameEndereco, width = 27, textvariable=self.n)

    self.escolhaEstado['values'] = ('AM',
                               'SP',
                               'MG')
    self.escolhaEstado.grid(row=0, column=1, sticky=tk.EW, pady=5)

    self.labelCidade = ttk.Label(self.frameEndereco, text="Cidade: ")
    self.labelCidade.grid(row=1, column=0, sticky=tk.W, pady=5)
    self.entryCidade = ttk.Entry(self.frameEndereco, width=40)
    self.entryCidade.grid(row=1, column=1, sticky=tk.EW, pady=5)

    self.labelBairro = ttk.Label(self.frameEndereco, text="Bairro: ")
    self.labelBairro.grid(row=2, column=0, sticky=tk.W, pady=5)
    self.entryBairro = ttk.Entry(self.frameEndereco, width=40)
    self.entryBairro.grid(row=2, column=1, sticky=tk.EW, pady=5)

    self.labelRua = ttk.Label(self.frameEndereco, text="Rua: ")
    self.labelRua.grid(row=3, column=0, sticky=tk.W, pady=5)
    self.entryRua = ttk.Entry(self.frameEndereco, width=40)
    self.entryRua.grid(row=3, column=1, sticky=tk.EW, pady=5)

    self.labelNro = ttk.Label(self.frameEndereco, text="Número: ")
    self.labelNro.grid(row=4, column=0, sticky=tk.W, pady=5)
    self.entryNro = ttk.Entry(self.frameEndereco, width=40)
    self.entryNro.grid(row=4, column=1, sticky=tk.EW, pady=5)

    self.labelPais = ttk.Label(self.frameEndereco, text="País: ")
    self.labelPais.grid(row=5, column=0, sticky=tk.W, pady=5)
    self.n2 = tk.StringVar()
    self.escolhaPais = ttk.Combobox(self.frameEndereco, width = 27, textvariable=self.n2)

    self.escolhaPais['values'] = ('Brasil')
    self.escolhaPais.grid(row=5, column=1, sticky=tk.EW, pady=5)

    self.frameBotoes = ttk.Frame(self.main_frame)
    self.frameBotoes.grid(row=9, column=0, columnspan=2, sticky='e', pady=20)

    self.buttonSubmit = ttk.Button(self.frameBotoes, text="Enter", 
                                   command=self.controle.enterHandler)
    self.buttonSubmit.pack(side="left", padx=5)

    self.buttonClear = ttk.Button(self.frameBotoes, text="Clear",
                                  command=self.controle.clearHandler)
    self.buttonClear.pack(side="left")

  def mostraCamposEndereco(self):
    if self.checkVar.get() == True: 
      self.frameEndereco.grid(row=8, column=0, columnspan=2, sticky='ew', pady=10)
    else:
      self.frameEndereco.grid_forget()

  def mostraJanela(tk.Toplevel):
    def __init__(self, controle, listaClientes):
      tk.Toplevel.__init__(self)
      self.geometry('700x400')
      self.title("Mostrar Clientes")
      self.controle = controle
      self.listaClientes = listaClientes

      self.main_frame = ttk.Frame(self)
      self.main_frame.pack(fill=tk.BOTH, expand = True, padx=15, pady=15)

      columns = ("id", "nome", "sobrenome", "contato", "genero", "data_nasc")

      self.tree = ttk.Treeview(self.main_frame, columns = columns, show = "headings")
      self.tree.pack(fill=tk.BOTH, expand = True)

      self.tree.heading("id", text="ID", anchor = tk.W)
      self.tree.heading("nome", text="Nome", anchor = tk.W)
      self.tree.heading("sobrenome", text="Sobrenome", anchor = tk.W)
      self.tree.heading("contato", text="Contato", anchor = tk.W)
      self.tree.heading("genero", text="Genero", anchor = tk.W)
      self.tree.heading("data_nasc", text="Data de Nascimento", anchor = tk.W)

      self.tree.column("id", width = 100)
      self.tree.column("nome", width = 100)
      self.tree.column("sobrenome", width = 100)
      self.tree.column("contato", width = 100)
      self.tree.column("genero", width = 100)
      self.tree.column("data_nasc", width = 100)

      self.preencheTreeView()
    
    def preencheTreeView(self):
      for cliente in self.listaClientes:

        valores = (
          cliente.
        )
class LimiteMostraClientes():
  def __init__(self, str):
    messagebox.showinfo('Lista de alunos', str)

class CtrlCliente():
  def __init__(self):
    self.listaClientes = []

  def insereClientes(self):
    self.limiteIns = LimiteInsereCliente(self)

  def mostraClientes(self):
    str = 'Nome -- Sobrenome -- Contato -- Genero -- Data de Nascimento\n'
    for cli in self.listaClientes:
      str += cli.nome + ' -- ' + cli.sobrenome + ' -- ' + cli.contato + ' -- ' + cli.genero + ' -- ' + cli.data_nasc + '\n'
    self.limiteLista = LimiteMostraClientes(str)

  def enterHandler(self):
    endereco_cli = None

    try:
        nome = self.limiteIns.inputNome.get().strip()
        sobrenome = self.limiteIns.inputSobrenome.get().strip()
        contato = self.limiteIns.inputContato.get().strip()
        genero = self.limiteIns.inputGenero.get().strip()
        data_nasc = self.limiteIns.inputData_nasc.get().strip()
        senha = self.limiteIns.inputSenha.get().strip()

        if nome == '' or sobrenome == '' or contato == '' or genero == '' or data_nasc == '' or senha == '': 
          raise CampoEmBranco('Preencha todos os campos')
        
        estado = self.limiteIns.escolhaEstado.get().strip()
        cidade = self.limiteIns.entryCidade.get().strip()
        bairro = self.limiteIns.entryBairro.get().strip()
        pais = self.limiteIns.escolhaPais.get().strip()
        rua_ou_avenida = self.limiteIns.entryRua.get()
        nro = self.limiteIns.entryNro.get().strip()

        if cidade != '' or bairro != '' or pais != '' or rua_ou_avenida != '' or nro != '':
          endereco_cli = Endereco(cidade, bairro, pais, rua_ou_avenida, nro)
    
        cliente = Cliente(nome, sobrenome, contato, genero, data_nasc, senha, endereco_cli)
        self.listaClientes.append(cliente)
        self.limiteIns.mostraJanela('Sucesso', 'Cliente cadastrado com sucesso')
        self.clearHandler()
    except(CampoEmBranco, Mais40Caracteres, Mais30Caracteres, Mais50Caracteres)  as e:
      print(f'Erro: {e}')

  def clearHandler(self):
    self.limiteIns.inputNome.delete(0, len(self.limiteIns.inputNome.get()))
    self.limiteIns.inputSobrenome.delete(0, len(self.limiteIns.inputSobrenome.get()))
    self.limiteIns.inputContato.delete(0, len(self.limiteIns.inputContato.get()))
    self.limiteIns.inputGenero.delete(0, len(self.limiteIns.inputGenero.get()))
    self.limiteIns.inputData_nasc.delete(0, len(self.limiteIns.inputData_nasc.get()))
    self.limiteIns.inputSenha.delete(0, len(self.limiteIns.inputSenha.get()))
    self.limiteIns.escolhaEstado.delete(0, len(self.limiteIns.escolhaEstado.get()))
    self.limiteIns.entryCidade.delete(0, len(self.limiteIns.entryCidade.get()))
    self.limiteIns.entryBairro.delete(0, len(self.limiteIns.entryBairro.get()))
    self.limiteIns.entryRua.delete(0, len(self.limiteIns.entryRua.get()))
    self.limiteIns.entryNro.delete(0, len(self.limiteIns.entryNro.get()))
    self.limiteIns.escolhaPais.delete(0, len(self.limiteIns.escolhaPais.get()))

  def fechaHandler(self):
    self.limiteIns.destroy()