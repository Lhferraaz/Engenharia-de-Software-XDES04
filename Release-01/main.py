import tkinter as tk
from tkinter import messagebox
import Cliente as cli

class LimitePrincipal:
  def __init__(self, root, controle):
    self.controle = controle
    self.root = root
    self.root.geometry('300x200')
    self.menubar = tk.Menu(self.root)
    self.clienteMenu = tk.Menu(self.menubar)

    self.clienteMenu.add_command(label="Insere", \
                command=self.controle.insereClientes)
    self.clienteMenu.add_command(label="Mostra", \
                command=self.controle.mostraClientes)
    self.menubar.add_cascade(label="Estudante", \
                menu=self.clienteMenu)
    
    self.root.config(menu=self.menubar)

class ControlePrincipal():
  def __init__(self):
    self.root = tk.Tk()

    self.ctrlCliente = cli.CtrlCliente()

    self.limite = LimitePrincipal(self.root, self)

    self.root.title("Loja Online")
    self.root.mainloop()

  def insereClientes(self):
      self.ctrlCliente.insereClientes()

  def mostraClientes(self):
      self.ctrlCliente.mostraClientes()

if __name__ == '__main__':
  c = ControlePrincipal()