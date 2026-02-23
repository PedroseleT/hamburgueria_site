import os
from datetime import datetime

output_file = "IA_EXPORT_PROJETO.txt"

ignored_dirs = {
    "node_modules", ".git", "__pycache__",
    "venv", ".venv", "dist", "build"
}

ignored_files = {
    output_file,
    ".env", ".env.local", ".env.production"
}

allowed_extensions = {
    ".py", ".js", ".ts", ".tsx", ".jsx",
    ".html", ".css", ".json", ".md",
    ".sql"
}

max_file_size_kb = 200  # evita arquivos gigantes

def generate_tree():
    tree = []
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in ignored_dirs]

        level = root.count(os.sep)
        indent = "  " * level
        tree.append(f"{indent}{os.path.basename(root)}/")

        sub_indent = "  " * (level + 1)
        for file in files:
            if file not in ignored_files:
                tree.append(f"{sub_indent}{file}")
    return "\n".join(tree)

def file_is_valid(path):
    if any(ignored in path for ignored in ignored_dirs):
        return False
    if os.path.basename(path) in ignored_files:
        return False
    if os.path.splitext(path)[1].lower() not in allowed_extensions:
        return False
    if os.path.getsize(path) > max_file_size_kb * 1024:
        return False
    return True

file_count = 0
line_count = 0

with open(output_file, "w", encoding="utf-8") as outfile:

    outfile.write("="*80 + "\n")
    outfile.write("1️⃣ INFORMAÇÕES DO PROJETO\n")
    outfile.write("="*80 + "\n\n")
    outfile.write(f"Data da exportação: {datetime.now()}\n\n")

    outfile.write("="*80 + "\n")
    outfile.write("2️⃣ ESTRUTURA DE PASTAS\n")
    outfile.write("="*80 + "\n\n")
    outfile.write(generate_tree())
    outfile.write("\n\n")

    outfile.write("="*80 + "\n")
    outfile.write("3️⃣ CÓDIGO FONTE\n")
    outfile.write("="*80 + "\n\n")

    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in ignored_dirs]

        for file in files:
            file_path = os.path.join(root, file)

            if file_is_valid(file_path):
                file_count += 1

                outfile.write("\n" + "-"*80 + "\n")
                outfile.write(f"ARQUIVO: {file_path}\n")
                outfile.write("-"*80 + "\n\n")

                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    line_count += content.count("\n")
                    outfile.write(content)
                    outfile.write("\n\n")

    outfile.write("="*80 + "\n")
    outfile.write("4️⃣ RESUMO DO PROJETO\n")
    outfile.write("="*80 + "\n\n")
    outfile.write(f"Total de arquivos exportados: {file_count}\n")
    outfile.write(f"Total de linhas de código: {line_count}\n")

print("✅ Exportação PRO concluída.")