import tkinter as tk
from tkinter import messagebox
import Cliente as cli

class LimitePrincipal:
  def __init__(self, root, controle):
    self.controle = controle
    self.root = root
    self.root.geometry('300x250') # largura x altura
    self.menubar = tk.Menu(self.root)
    self.clienteMenu = tk.Menu(self.menubar)

    self.clienteMenu.add_command(label="Insere", \
                command=self.controle.insereClientes)
    self.clienteMenu.add_command(label="Mostra", \
                command=self.controle.mostraClientes)
    self.menubar.add_cascade(label="Cliente", \
                menu=self.clienteMenu)
    
    self.root.config(menu=self.menubar)

class ControlePrincipal():
  def __init__(self):
    self.root = tk.Tk()


    # Passa o self (ControlePrincipal) para o CtrlCliente
    # para que ele possa acessar o root se precisar
    self.ctrlCliente = cli.CtrlCliente()

    self.limite = LimitePrincipal(self.root, self)

    self.root.title("Loja Online")

    self.centralizar_janela(self.root)

    self.root.mainloop()

  # Função para centralizar a janela

  def centralizar_janela(self, janela):
     janela.update_idletasks()
     largura = janela.winfo_width()
     altura = janela.winfo_height()

     x = (janela.winfo_screenwidth() // 2) - (largura // 2)
     y = (janela.winfo_screenheight() // 2) - (altura // 2)

     janela.geometry('{}x{}+{}+{}'.format(largura, altura, x, y))

  def insereClientes(self):
      self.ctrlCliente.insereClientes()

  def mostraClientes(self):
      self.ctrlCliente.mostraClientes()

if __name__ == '__main__':
  c = ControlePrincipal()