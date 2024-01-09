import tkinter as tk
from tkinter import filedialog
from tkinter import messagebox
from tkinter.ttk import Progressbar
import requests
import threading

class DownloadManager:
    def __init__(self, root):
        self.root = root
        self.root.title("Download Manager")

        self.url_label = tk.Label(root, text="URL:")
        self.url_label.pack()
        self.url_entry = tk.Entry(root)
        self.url_entry.pack()

        self.select_folder_button = tk.Button(root, text="Select Folder", command=self.select_folder)
        self.select_folder_button.pack()

        self.progress_label = tk.Label(root, text="")
        self.progress_label.pack()

        self.progress_bar = Progressbar(root, orient="horizontal", length=300, mode="determinate")
        self.progress_bar.pack()

        self.start_button = tk.Button(root, text="Start Download", command=self.start_download)
        self.start_button.pack()

        self.resume_button = tk.Button(root, text="Resume Download", command=self.resume_download, state=tk.DISABLED)
        self.resume_button.pack()

        self.cancel_button = tk.Button(root, text="Cancel Download", command=self.cancel_download, state=tk.DISABLED)
        self.cancel_button.pack()

        self.file_size = 0
        self.downloaded = 0
        self.file_path = ""

        self.download_thread = None

    def select_folder(self):
        self.file_path = filedialog.asksaveasfilename(defaultextension="*.*")
        if self.file_path:
            self.resume_button.config(state=tk.NORMAL)

    def start_download(self):
        self.url = self.url_entry.get()
        if not self.url:
            messagebox.showerror("Error", "Please enter a valid URL.")
            return

        self.start_button.config(state=tk.DISABLED)
        self.cancel_button.config(state=tk.NORMAL)

        self.download_thread = threading.Thread(target=self.download_file)
        self.download_thread.start()

    def download_file(self):
        try:
            response = requests.head(self.url)
            if "accept-ranges" in response.headers:
                self.file_size = int(response.headers["content-length"])
                if self.file_path:
                    self.resume_download()
            else:
                messagebox.showinfo("Resume Not Supported", "The server does not support resumable downloads.")
                self.file_size = 0
                self.file_path = ""

        except requests.exceptions.RequestException:
            messagebox.showerror("Error", "An error occurred while trying to download the file.")
            self.file_size = 0
            self.file_path = ""

    def resume_download(self):
        headers = {}
        if self.downloaded > 0:
            headers = {"Range": "bytes={}-".format(self.downloaded)}

        try:
            response = requests.get(self.url, headers=headers, stream=True)

            with open(self.file_path, "ab") as file:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        file.write(chunk)
                        self.downloaded += len(chunk)
                        self.update_progress()

            messagebox.showinfo("Download Complete", "The file has been downloaded successfully.")
            self.reset_download()

        except requests.exceptions.RequestException:
            messagebox.showerror("Error", "An error occurred while trying to download the file.")
            self.reset_download()

    def cancel_download(self):
        if self.download_thread and self.download_thread.is_alive():
            self.download_thread.join()
        self.reset_download

    def update_progress(self):
        percentage = int((self.downloaded / self.file_size) * 100)
        self.progress_bar["value"] = percentage

# Main program
if __name__ == "__main__":
    root = tk.Tk()
    download_manager = DownloadManager(root)
    root.mainloop()
