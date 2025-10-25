import streamlit as st
import pandas as pd
import os

# =========================
# CONFIGURATION
# =========================
st.set_page_config(page_title="Build Tools MVP", layout="wide")

PASSWORD = "monmotdepasse"  # <-- change ton mot de passe ici
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# =========================
# SESSION STATE INITIALISATION
# =========================
if 'edit_mode' not in st.session_state:
    st.session_state.edit_mode = False
if 'authenticated' not in st.session_state:
    st.session_state.authenticated = False
if 'uploaded_files' not in st.session_state:
    st.session_state.uploaded_files = []

# =========================
# AUTHENTIFICATION
# =========================
def authenticate():
    st.write("🔒 Mode consultatif (édition protégée)")
    password = st.text_input("Mot de passe pour activer l'édition", type="password")
    if st.button("Valider"):
        if password == PASSWORD:
            st.session_state.authenticated = True
            st.success("✅ Authentification réussie")
        else:
            st.error("❌ Mot de passe incorrect")

if not st.session_state.authenticated:
    authenticate()

# =========================
# MODE ÉDITION / CONSULTATIF
# =========================
if st.session_state.authenticated:
    st.title("Build Tools MVP")
    
    # Toggle Mode Édition
    col1, col2 = st.columns([1, 4])
    with col1:
        if st.session_state.edit_mode:
            if st.button("Passer en mode consultatif"):
                st.session_state.edit_mode = False
        else:
            if st.button("Activer le mode édition"):
                st.session_state.edit_mode = True

    if st.session_state.edit_mode:
        st.info("🛠️ Mode ÉDITION activé")

# =========================
# GESTION DES FICHIERS
# =========================
def handle_upload(uploaded_file):
    file_path = os.path.join(UPLOAD_DIR, uploaded_file.name)
    with open(file_path, "wb") as f:
        f.write(uploaded_file.getbuffer())
    st.session_state.uploaded_files.append(file_path)
    st.success(f"✅ Fichier {uploaded_file.name} enregistré")

if st.session_state.edit_mode:
    st.subheader("📂 Chargement / Modification de fichiers")
    uploaded_file = st.file_uploader("Uploader un fichier CSV ou XLSX", type=["csv", "xlsx"])
    if uploaded_file:
        handle_upload(uploaded_file)
    
# =========================
# AFFICHAGE DES DONNÉES
# =========================
st.subheader("📄 Contenu actuel")

if st.session_state.uploaded_files:
    for fpath in st.session_state.uploaded_files:
        st.write(f"**{os.path.basename(fpath)}**")
        try:
            if fpath.endswith(".csv"):
                df = pd.read_csv(fpath)
            else:
                df = pd.read_excel(fpath)
            st.dataframe(df)
        except Exception as e:
            st.error(f"Impossible de lire le fichier: {e}")
else:
    st.write("Aucun fichier chargé pour le moment.")
