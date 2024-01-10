import os
import tkinter as tk
from tkinter import filedialog, ttk
from threading import Thread
from PIL import Image
from PIL import ImageGrab
import subprocess
import time
import logging
import pandas as pd
from queue import Queue
import csv
from io import BytesIO
from tqdm import tqdm

# Set up logging configuration at the beginning of your script
logging.basicConfig(filename='error.log', level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

icon_files = {
    'folder': 'images/folder_icon.png',
    'file': 'images/text.png',
    'pdf': 'images/pdf.png',
    'xlsx': 'images/xlsx.png',
    'log': 'images/log.png',
    'txt' : 'images/text.png',
    'img' : 'images/img.png'
}

units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

# Check if ttkbootstrap is available, if not, install it
try:
    from ttkbootstrap import Style
except ImportError:
    print("ttkbootstrap not found. Installing...")
    try:
        subprocess.check_call(['pip', 'install', 'ttkbootstrap'])
        from ttkbootstrap import Style
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        # Handle the error, e.g., exit the program or provide a default style

# Check if pyautogui is available, if not, install it
try:
    import pyautogui
    import pygetwindow as gw
except ImportError:
    print("pyautogui not found. Installing...")
    try:
        subprocess.check_call(['pip', 'install', 'pyautogui'])
        import pyautogui
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        # Handle the error, e.g., exit the program or provide alternative functionality

# Check if openpyxl is available, if not, install it
try:
    import openpyxl
except ImportError:
    print("openpyxl not found. Installing...")
    try:
        subprocess.check_call(['pip', 'install', 'openpyxl'])
        import pyautogui
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        # Handle the error, e.g., exit the program or provide alternative functionality

def get_file_extension(filename):
    _, file_extension = os.path.splitext(filename)
    return file_extension

def get_icon_for_file(file_extension):
    # Provide icons based on file extensions
    if file_extension == '.txt':
        return text_file_icon
    elif file_extension == '.pdf':
        return pdf_icon
    elif file_extension == '.xlsx':
        return xlsx_icon
    elif file_extension == '.log':
        return log_icon
    elif file_extension == '.jpg' or file_extension == '.JPG':
        return image_icon
    else:
        return file_icon

def get_folder_size(path):
    total_size = 0
    try:
        for dirpath, _, filenames in os.walk(path):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                total_size += os.path.getsize(fp)
    except Exception as e:
        print(f"Error while traversing directory: {e}")
    return total_size

def process_folder(item_path, tree, progress_bar, folder_info_list):
    try:
        size = get_folder_size(item_path) if os.path.isdir(item_path) else os.path.getsize(item_path)
        size_str = convert_size(size)
        icon = get_icon(item_path)
        tree.insert("", 'end', text=os.path.basename(item_path), values=(size_str, size), open=False, image=icon)

        # Append folder information to the list
        folder_info_list.append({'Name': os.path.basename(item_path), 'Size': size_str, 'IsDirectory': os.path.isdir(item_path)})
        
        # Update progress bar
        progress_bar.step(1)
    except Exception as e:
        error_message = f"Error processing folder {item_path}: {e}"
        print(error_message)
        logging.error(error_message)

def resize_icons(icon_files):
    resized_icons = {}
    for icon_name, icon_path in icon_files.items():
        original_icon = Image.open(icon_path)
        resized_icon = original_icon.resize((16, 16))
        
        # Save the resized icon to a BytesIO object
        icon_data = BytesIO()
        resized_icon.save(icon_data, format="PNG")
        
        # Create PhotoImage from the BytesIO object
        resized_icons[icon_name] = tk.PhotoImage(data=icon_data.getvalue())
        
    return resized_icons

def get_size_for_sorting(item):
    item_path = os.path.join(current_path, item)
    if os.path.isdir(item_path):
        return get_folder_size(item_path)
    return 0

def get_icon(item_path):
    if os.path.isdir(item_path):
        return folder_icon
    else:
        return file_icon


# ... (other parts of your code)

def populate_tree_async(parent="", path="", sort_by_size=False):
    def process_folder(item_path, tree, progress_bar, folder_info_list):
        try:
            size = get_folder_size(item_path) if os.path.isdir(item_path) else os.path.getsize(item_path)
            size_str = convert_size(size)
            icon = get_icon(item_path)
            tree.insert(parent, 'end', text=os.path.basename(item_path), values=(size_str, size), open=False, image=icon)

            # Append folder information to the list
            folder_info_list.append({'Name': os.path.basename(item_path), 'Size': size_str, 'IsDirectory': os.path.isdir(item_path)})

            # Update progress bar
            progress_bar.step(1)
        except Exception as e:
            error_message = f"Error processing folder {item_path}: {e}"
            print(error_message)
            logging.error(error_message)

    def worker():
        folder_info_list = []  # Define folder_info_list in the scope of the worker function
        try:
            folders = os.listdir(path)

            if sort_by_size:
                folders.sort(key=get_size_for_sorting, reverse=True)

            total_folders = len(folders)
            progress_bar['maximum'] = total_folders

            with tqdm(total=total_folders, desc='Populating Tree') as pbar:
                for i, item in enumerate(folders):
                    item_path = os.path.join(path, item)
                    process_folder(item_path, tree, progress_bar, folder_info_list)

                    pbar.update(1)

                    if i % 10 == 0:
                        root.update_idletasks()

            # Return the folder information list after populating the tree
            return folder_info_list

        except (FileNotFoundError, PermissionError):
            return folder_info_list  # Return an empty list in case of exceptions

    def thread_task():
        folder_info_list = worker()
        refresh_tree(folder_info_list)  # Use refresh_tree to populate the tree
        progress_bar.pack_forget()

    progress_bar['value'] = 0
    progress_bar.pack()  # Show progress bar before starting the thread

    Thread(target=thread_task).start()

def take_tkinter_screenshot():

    # Get the Tkinter window
    root_window = gw.getWindowsWithTitle(root.title())[0]

    # Ensure all widgets are properly rendered
    root.update_idletasks()

    # Introduce a small delay before taking the screenshot
    time.sleep(1)

    # Capture the screen region corresponding to the Tkinter window
    screenshot = ImageGrab.grab(bbox=(root_window.left, root_window.top, root_window.right, root_window.bottom))
    screenshot.save("tkinter_screenshot.png")
    print("Tkinter screenshot captured and saved as 'tkinter_screenshot.png'.")


def browse_folder():
    folder_selected = filedialog.askdirectory()
    if folder_selected:
        path_entry.delete(0, tk.END)
        path_entry.insert(0, folder_selected)
        populate_tree_async("", folder_selected, False)

def refresh_tree(folder_info_list):
    # Clear existing data in the tree
    tree.delete(*tree.get_children())
    
    # Populate the tree with the provided folder information list
    for folder_info in folder_info_list:
        name = folder_info['Name']
        size = folder_info['Size']
        is_directory = folder_info['IsDirectory']
        icon = folder_icon if is_directory else file_icon
        tree.insert("", 'end', text=name, values=(size, ""), open=False, image=icon)

def export_to_excel_async():
    # Get the selected folder path from the entry widget
    folder_path = path_entry.get()

    if not folder_path:
        print("Please select a folder before exporting to Excel.")
        return

    # Ask the user for the Excel file path
    excel_file_path = filedialog.asksaveasfilename(defaultextension=".xlsx", filetypes=[("Excel files", "*.xlsx")])

    if excel_file_path:
        # Run the export operation in a separate thread
        Thread(target=export_to_excel_worker, args=(folder_path, excel_file_path)).start()

def export_to_excel_worker(folder_path, excel_file_path):
    try:
        # Get the folder information without populating the tree
        folder_info_list = get_folder_info_list(folder_path)

        if not folder_info_list:
            print("No folder information to export.")
            return

        # Create a DataFrame from the folder information list
        df = pd.DataFrame(folder_info_list)

        # Save the DataFrame to an Excel file
        df.to_excel(excel_file_path, index=False)
        print(f"Folder information exported to {excel_file_path}")
    except Exception as e:
        print(f"Error exporting to Excel: {e}")

def get_folder_info_list(path):
    folder_info_list = []
    try:
        for item in os.listdir(path):
            item_path = os.path.join(path, item)
            size = get_folder_size(item_path) if os.path.isdir(item_path) else os.path.getsize(item_path)
            size_str = convert_size(size)
            is_directory = os.path.isdir(item_path)
            folder_info_list.append({'Name': item, 'Size': size_str, 'IsDirectory': is_directory})
    except (FileNotFoundError, PermissionError) as e:
        print(f"Error while fetching folder information: {e}")
    return folder_info_list

def convert_size(size_bytes):
    if size_bytes == '':
        return "0 bytes"
    
    size_bytes = int(size_bytes)
    units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    
    i = 0
    while size_bytes >= 1024 and i < len(units) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.2f} {units[i]}"

def convert_size_to_bytes(size_str):
    size_str = size_str.strip().lower()

    if size_str.endswith('kb'):
        return round(float(size_str[:-2]) * 1024)
    elif size_str.endswith('mb'):
        return round(float(size_str[:-2]) * 1024 * 1024)
    elif size_str.endswith('gb'):
        return round(float(size_str[:-2]) * 1024 * 1024 * 1024)
    elif size_str.endswith('bytes'):
        return round(float(size_str[:-6]))  # Exclude the ' bytes' suffix
    else:
        try:
            return round(float(size_str))
        except ValueError:
            print(f"Error converting size string to bytes: {size_str}")
            return 0  # or handle the error in an appropriate way

def sort_size_column():
    global sort_ascending
    sort_ascending = not sort_ascending

    progress_bar.pack()  # Show progress bar before sorting
    progress_bar['style'] = 'yellow.Horizontal.TProgressbar'

    items = [(convert_size_to_bytes(tree.set(child, 'size')), child) for child in tree.get_children('')]
    total_items = len(items)
    progress_increment = 100 / total_items

    # Sort items based on the current order
    items.sort(reverse=not sort_ascending, key=lambda x: x[0])

    # Move items in the tree and update progress
    for index, (value, child) in enumerate(items):
        tree.move(child, '', index)

        # Update progress bar
        progress_value = (index + 1) * progress_increment
        progress_bar['value'] = progress_value
        root.update_idletasks()

    # Update size column heading to indicate sorting order
    size_heading_text = f"Size {'↑' if sort_ascending else '↓'}"
    tree.heading('size', text=size_heading_text)

    progress_bar['style'] = 'Custom.Horizontal.TProgressbar'
    progress_bar.pack_forget()  # Hide progress bar after sorting

# Function to handle the button click event
def on_screenshot_button_click():
    take_tkinter_screenshot()

def export_to_excel_async():
    # Get the selected folder path from the entry widget
    folder_path = path_entry.get()

    if not folder_path:
        print("Please select a folder before exporting to Excel.")
        return

    # Ask the user for the Excel file path
    excel_file_path = filedialog.asksaveasfilename(defaultextension=".xlsx", filetypes=[("Excel files", "*.xlsx")])

    if excel_file_path:
        # Run the export operation in a separate thread
        Thread(target=export_to_excel_worker, args=(folder_path, excel_file_path)).start()

# Initialize the sorting order variable
sort_ascending = True

# ... (rest of your code)


root = tk.Tk()
root.title("Folder Size Explorer")
root.geometry("600x600")
root.iconbitmap('images/favicon.ico')

style = Style(theme='litera')
style.configure('Custom.TFrame', background='#7ac6ff')
style.configure("Custom.Treeview.Heading", borderwidth=5, relief="solid")


title_bar = ttk.Frame(root, style='Custom.TFrame', height=25)
title_bar.pack(side='top', fill='x')

path_frame = ttk.Frame(root)
path_frame.pack(padx=10, pady=10, fill=tk.X)

path_label = ttk.Label(path_frame, text="Selected Path:")
path_label.pack(side=tk.LEFT)

path_entry = ttk.Entry(path_frame, width=50)
path_entry.pack(side=tk.LEFT, padx=5)

browse_button = ttk.Button(path_frame, text="Browse", command=browse_folder)
browse_button.pack(side=tk.LEFT)

style.configure("Custom.Horizontal.TProgressbar", troughcolor='blue', bordercolor='black', background='green', lightcolor='yellow', darkcolor='red')

progress_bar = ttk.Progressbar(root, orient=tk.HORIZONTAL, length=400, mode='determinate', style="Custom.Horizontal.TProgressbar")
progress_bar.pack(pady=10)

screenshot_button = ttk.Button(root, text="Take Screenshot", command=on_screenshot_button_click)
screenshot_button.pack(pady=10)

export_button = ttk.Button(root, text="Export to Excel", command=export_to_excel_async)
export_button.pack(pady=10)

folder_file_counts_label = ttk.Label(root, text="")
folder_file_counts_label.pack(pady=5)

resized_icons = resize_icons(icon_files)
text_file_icon = resized_icons.get('txt')
pdf_icon = resized_icons.get('pdf')
file_icon = resized_icons.get('file')
folder_icon = resized_icons.get('folder')
xlsx_icon = resized_icons.get('xlsx')
log_icon = resized_icons.get('log')
image_icon = resized_icons.get('img')
# Create treeview
tree = ttk.Treeview(root, columns=('size',))
style.configure("Custom.Treeview.Heading", foreground="red", font=('Arial', 10, 'bold'))
tree.heading('#0', text='Name', anchor='w')
tree.heading('size', text='Size', command=sort_size_column)  # Corrected heading for the size column
tree.column('#0', width=80, anchor='w')
tree.column('size', width=20, anchor='center')
tree.pack(side=tk.LEFT, expand=True, fill=tk.BOTH)
style = ttk.Style()
style.configure("Custom.Treeview.Heading", foreground="red", font=('Arial', 10, 'bold'))
style.configure("Custom.Treeview", background='#f0f0f0')  # Set a background color to simulate a border
scrollbar = ttk.Scrollbar(root, orient=tk.VERTICAL, command=tree.yview)
scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
tree.configure(yscrollcommand=scrollbar.set)
tree.tag_configure('folder', image=folder_icon)
root.mainloop()
