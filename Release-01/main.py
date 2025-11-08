import tkinter as tk
from tkinter import messagebox
from tkinter import ttk
import Cliente as cli

class LimitePrincipal:
  def __init__(self, root, controle):
    self.controle = controle
    self.root = root
    self.root.geometry('300x250') # largura x altura
    
    nb = ttk.Notebook(self.root)

    frameCliente = ttk.Frame(nb)

    buttonClienteInserir = ttk.Button(frameCliente, text='Insere', command=self.controle.insereClientes)
    buttonClienteMostrar = ttk.Button(frameCliente, text='Mostra', command=self.controle.mostraClientes)

    buttonClienteInserir.pack(pady=10, padx=20)
    buttonClienteMostrar.pack(pady=10, padx=20)

    nb.add(frameCliente, text='Cliente')

    nb.pack(expand=1, fill='both', padx=5, pady=5)


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