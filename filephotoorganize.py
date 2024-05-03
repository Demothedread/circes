import os
import subprocess
from datetime import datetime

def organize_and_rename_files(folder_path):
    for file in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file)
        
        # Check if the file is a regular file
        if os.path.isfile(file_path):
            # Determine the file type (Raw or JPEG)
            file_extension = os.path.splitext(file)[-1].lower()
            file_type = "Raw" if file_extension == ".raw" else "JPEG" if file_extension in [".jpg", ".jpeg"] else "Other"
            
            # Get creation time of the file using ExifTool
            creation_date_output = subprocess.run(["exiftool", "-s", "-s", "-s", "-CreateDate", file_path], capture_output=True, text=True)
            creation_date = creation_date_output.stdout.strip()
            
            if creation_date:
                # Parse creation date
                creation_date_obj = datetime.strptime(creation_date, "%Y:%m:%d %H:%M:%S")
                
                # Rename the file with specific format
                new_name = f"Matisen_LosAngeles_SMPier_[{creation_date_obj.strftime('%m%Y_%H%M%S')}]"
                new_file_path = os.path.join(folder_path, f"{new_name}{file_extension}")
                os.rename(file_path, new_file_path)
                
                print(f"File {file} renamed to {new_name}{file_extension} and organized as {file_type}")
            else:
                print(f"Error: Unable to extract creation date for file {file}")
            
# Example usage:
folder_path = "/path/to/folder"
organize_and_rename_files(folder_path)
