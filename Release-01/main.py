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

    # Widgets para Estética

    self.frame_principal = tk.Frame(self.root, padx = 20, pady = 30)
    self.frame_principal.pack(expand=True, fill=tk.BOTH)

    # Título

    self.label_titulo = tk.Label(self.frame_principal, text = "Bem-vindo a Loja Online",
                                 font=("Helvetica", 14, "bold"))
    self.label_titulo.pack(pady = 10)

    self.label_desc = tk.Label(self.frame_principal,
                               text="Use o menu 'Cliente' para \n" \
                               "cadastrar ou listar clientes.",
                               font = ("Helvetica", 10),
                               justify = tk.LEFT)
    self.label_desc.pack(pady = 5)   
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