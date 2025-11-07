import tkinter as tk
from tkinter import messagebox

class endereco:
  contador_id = 0
  
  def __init__(self, estado, cidade, bairro, rua_ou_avenida, numero):
    endereco.contador_id += 1

    self.__id = endereco.contador_id
    self.__estado = estado
    if len(cidade) < 40:
      self.__cidade = cidade
    self.__bairro = bairro
    if len(rua_ou_avenida) < 40:
      self.__rua_ou_avenida = rua_ou_avenida
    
    if numero >= 0:
      self.__numero = numero

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
    if len(nome) < 40:
      self.__nome = nome
    if len(sobrenome) < 40:
      self.__sobrenome = sobrenome

    self.__contato = contato
    self.__genero = genero
    self.__data_nasc = data_nasc
    if len(senha) < 40:
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
    self.geometry('400x600')
    self.title("Cadastrar Cliente")

    self.frameNome = tk.Frame(self)
    self.frameSobrenome = tk.Frame(self)
    self.frameContato = tk.Frame(self)
    self.frameGenero = tk.Frame(self)
    self.frameData_nasc = tk.Frame(self)
    self.frameSenha = tk.Frame(self)
    self.frameNome.pack()
    self.frameSobrenome.pack()
    self.frameContato.pack()
    self.frameGenero.pack()
    self.frameData_nasc.pack()
    self.frameSenha.pack()

    self.labelNome = tk.Label(self.frameNome, text="Nome: ")
    self.labelSobrenome = tk.Label(self.frameSobrenome, text="Sobrenome: ")
    self.labelContato = tk.Label(self.frameContato, text="Contato: ")
    self.labelGenero = tk.Label(self.frameGenero, text="Genero: ")
    self.labelData_nasc = tk.Label(self.frameData_nasc, text="Data de Nascimento: ")
    self.labelSenha = tk.Label(self.frameSenha, text="Senha: ")
    self.labelNome.pack(side="left")
    self.labelSobrenome.pack(side="left")
    self.labelContato.pack(side="left")
    self.labelGenero.pack(side="left")
    self.labelData_nasc.pack(side="left")
    self.labelSenha.pack(side="left")

    self.inputNome = tk.Entry(self.frameNome, width=20)
    self.inputSobrenome = tk.Entry(self.frameSobrenome, width=20)
    self.inputContato = tk.Entry(self.frameContato, width=20)
    self.inputGenero = tk.Entry(self.frameGenero, width=20)
    self.inputData_nasc = tk.Entry(self.frameData_nasc, width=20)
    self.inputSenha = tk.Entry(self.frameSenha, width=20)
    self.inputNome.pack(side="left")
    self.inputSobrenome.pack(side="left")
    self.inputContato.pack(side="left")
    self.inputGenero.pack(side="left")
    self.inputData_nasc.pack(side="left")
    self.inputSenha.pack(side="left")

    # ------ Separador ------

    tk.Frame(self, height=2, bd=1, relief=tk.SUNKEN).pack(fill=tk.X, padx=5, pady=10)

    self.checkVar = tk.BooleanVar()
    self.checkVar.set(False)

    self.frameEndereco = tk.Frame(self)

    self.frameCheck = tk.Frame(self)
    self.frameCheck.pack()
    self.checkEndereco = tk.Checkbutton(self.frameCheck, text="Endereço"
                                        , variable=self.checkVar, command=self.mostraCamposEndereco)

    self.checkEndereco.pack()

    self.frameEstado = tk.Frame(self.frameEndereco)
    self.frameEstado.pack(pady=5)
    self.labelEstado = tk.Label(self.frameEstado, text="Estado: ")
    self.labelEstado.pack(side=tk.LEFT)
    self.entryEstado = tk.Entry(self.frameEstado, width=30)
    self.entryEstado.pack(side=tk.LEFT)

    self.frameCidade = tk.Frame(self.frameEndereco)
    self.frameCidade.pack(pady=5)
    self.labelCidade = tk.Label(self.frameCidade, text="Cidade: ")
    self.labelCidade.pack(side=tk.LEFT)
    self.entryCidade = tk.Entry(self.frameCidade, width=30)
    self.entryCidade.pack(side=tk.LEFT)

    self.frameBairro = tk.Frame(self.frameEndereco)
    self.frameBairro.pack(pady=5)
    self.labelBairro = tk.Label(self.frameBairro, text="Bairro: ")
    self.labelBairro.pack(side=tk.LEFT)
    self.entryBairro = tk.Entry(self.frameBairro, width=30)
    self.entryBairro.pack(side=tk.LEFT)

    self.frameRua = tk.Frame(self.frameEndereco)
    self.frameRua.pack(pady=5)
    self.labelRua = tk.Label(self.frameRua, text="Rua: ")
    self.labelRua.pack(side=tk.LEFT)
    self.entryRua = tk.Entry(self.frameRua, width=30)
    self.entryRua.pack(side=tk.LEFT)

    self.frameNro = tk.Frame(self.frameEndereco)
    self.frameNro.pack(pady=5)
    self.labelNro = tk.Label(self.frameNro, text="Número: ")
    self.labelNro.pack(side=tk.LEFT)
    self.entryNro = tk.Entry(self.frameNro, width=30)
    self.entryNro.pack(side=tk.LEFT)

    self.frameBotoes = tk.Frame(self)
    self.frameBotoes.pack(pady=20)
    
    self.buttonSubmit = tk.Button(self, text="Enter")
    self.buttonSubmit.pack(side="left")
    self.buttonSubmit.bind("<Button>", controle.enterHandler)

    self.buttonClear = tk.Button(self, text="Clear")
    self.buttonClear.pack(side="left")
    self.buttonClear.bind("<Button>", controle.clearHandler)

  def mostraCamposEndereco(self):
    if self.checkVar.get() == True: 
      self.frameEndereco.pack(pady=10)
    else:
      self.frameEndereco.pack_forget()

  def mostraJanela(self, titulo, msg):
    messagebox.showinfo(titulo, msg)

class LimiteMostraClientes():
  def __init__(self, str):
    messagebox.showinfo('Lista de alunos', str)

class CtrlEstudante():
  def __init__(self):
    self.listaEstudantes = []

  def insereEstudantes(self):
    self.__limiteIns = LimiteInsereCliente

  def mostraClientes(self):
    str = 'Nome -- Sobrenome -- Contato -- Genero -- Data de Nascimento -- Senha\n'