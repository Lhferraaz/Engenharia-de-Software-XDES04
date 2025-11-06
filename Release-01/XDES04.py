from abc import ABC, abstractmethod

class endereco:
  def __init__(self, estado, cidade, bairro, rua_ou_avenida, numero):
    self.__estado = estado
    self.__cidade = cidade
    self.__bairro = bairro
    self.__rua_ou_avenida = rua_ou_avenida
    self.__numero = numero

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
    contador_id += 1

    self.__id = contador_id
    self.__nome = nome
    self.__sobrenome = sobrenome
    self.__contato = contato
    self.__genero = genero
    self.__data_nasc = data_nasc
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

class Produto:
  contador_id = 0

  def __init__(self, nome, tipo, caracteristicas, marca, tamanho, cor, preco, quantidade, tecido, imagem = None):
    self.__nome = nome
    self.__tipo = tipo
    self.__caracteristicas = caracteristicas
    self.__marca = marca
    self.__tamanho = tamanho
    self.__cor = cor
    self.__preco = preco
    self.__quantidade = quantidade
    self.__tecido = tecido
    self.__imagem = imagem

  @property
  def id(self):
    return self.__id
  
  @property
  def nome(self):
    return self.__nome
  
  @property
  def tipo(self):
    return self.__tipo
  
  @property
  def caracteristicas(self):
    return self.__caracteristicas
  
  @property
  def marca(self):
    return self.__marca
  
  @property
  def tamanho(self):
    return self.__tamanho
  
  @property
  def cor(self):
    return self.__cor
  
  @property
  def preco(self):
    return self.__preco
  
  @property
  def quantidade(self):
    return self.__quantidade
  
  @property
  def tecido(self):
    return self.__tecido
  
  @property
  def imagem(self):
    return self.__imagem
  
  @imagem.setter
  def imagem(self, imagem):
    self.__imagem = imagem