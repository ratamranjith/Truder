import socket
import threading
import tkinter as tk
from tkinter import scrolledtext, Entry, Button

class ChatClient:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Chat Application")

        self.chat_history = scrolledtext.ScrolledText(self.root, wrap=tk.WORD, width=40, height=20)
        self.chat_history.pack(padx=10, pady=10)

        self.message_entry = Entry(self.root, width=30)
        self.message_entry.pack(padx=10, pady=10)

        self.send_button = Button(self.root, text="Send", command=self.send_message)
        self.send_button.pack(padx=10, pady=10)

        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.client_socket.connect(('127.0.0.1', 5555))

        self.receive_thread = threading.Thread(target=self.receive_messages)
        self.receive_thread.start()

        self.root.protocol("WM_DELETE_WINDOW", self.on_close)
        self.root.mainloop()

    def send_message(self):
        message = self.message_entry.get()
        self.client_socket.send(message.encode('utf-8'))
        self.message_entry.delete(0, tk.END)

    def receive_messages(self):
        while True:
            try:
                message = self.client_socket.recv(1024).decode('utf-8')
                self.chat_history.insert(tk.END, f"{message}\n")
                self.chat_history.see(tk.END)
            except Exception as e:
                print(f"Error receiving message: {e}")
                break

    def on_close(self):
        self.client_socket.close()
        self.root.destroy()

if __name__ == "__main__":
    client_app = ChatClient()
