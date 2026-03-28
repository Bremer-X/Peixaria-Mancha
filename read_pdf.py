
import sys
try:
    import pypdf
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
    import pypdf

pdf_path = r"e:\PROJETOS BREMER\Peixaria Mancha\Informações da Empresa\Delivery\Peixaria Mancha Delivery.pdf"
try:
    reader = pypdf.PdfReader(pdf_path)
    for i, page in enumerate(reader.pages):
        print(f"--- Page {i+1} ---")
        print(page.extract_text())
except Exception as e:
    print(f"Error reading PDF: {e}")
