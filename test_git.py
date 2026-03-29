import subprocess
import os

def run():
    try:
        print("Checking git status...")
        result = subprocess.run(["git", "status"], capture_output=True, text=True, check=True)
        print("Output:\n", result.stdout)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    run()
