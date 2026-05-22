#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
import_module.py — Maths Trainer
==================================
Ajoute un module JS d'exercice au projet en trois clics.
Permet aussi de créer de nouvelles spécialités et sections.

Prérequis : Python 3 (pré-installé sur Mac/Linux, disponible sur
            python.org pour Windows — choisir « Add to PATH »).
Usage     : double-cliquer sur ce fichier, ou `python import_module.py`.
"""

import os, re, shutil, sys, unicodedata
import tkinter as tk
from tkinter import ttk, filedialog, messagebox

# ── Chemins du projet (ce script doit être à la racine) ───────────────────────
HERE        = os.path.dirname(os.path.abspath(__file__))
REGISTRY    = os.path.join(HERE, 'assets', 'js', 'registry.js')
INDEX_HTML  = os.path.join(HERE, 'index.html')
MODULES_DIR = os.path.join(HERE, 'modules')

# Mapping spec_id → sous-dossier dans /modules (complété dynamiquement)
SPEC_FOLDERS = {
    'spe':             'maths-spe',
    'expertes':        'maths-expertes',
    'complementaires': 'maths-complementaires',
}
DEFAULT_FOLDER = 'maths-spe'


# ══════════════════════════════════════════════════════════════════════════════
#  Utilitaires
# ══════════════════════════════════════════════════════════════════════════════

def _read(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def _write(path, content):
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)

def _slug(text):
    """
    Convertit un texte français en identifiant kebab-case ASCII.
    Ex. : '1ère Spé' → '1ere-spe', 'Tronc Commun' → 'tronc-commun'
    """
    nfd = unicodedata.normalize('NFD', text)
    ascii_str = ''.join(c for c in nfd if unicodedata.category(c) != 'Mn')
    s = ascii_str.lower()
    s = re.sub(r'\s+', '-', s)
    s = re.sub(r'[^a-z0-9-]', '', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-') or 'nouveau'


# ══════════════════════════════════════════════════════════════════════════════
#  Parsing du fichier module JS
# ══════════════════════════════════════════════════════════════════════════════

def parse_module_file(path):
    """
    Extrait id, chapitre et notion d'un fichier de module MathsTrainer.
    Renvoie { 'id', 'chapitre', 'notion' } (valeur None si champ absent).
    """
    txt = _read(path)

    def get(key):
        for q in ("'", '"'):
            m = re.search(rf"{key}:\s*{q}((?:[^{q}\\]|\\.)*){q}", txt)
            if m:
                val = m.group(1)
                return val.replace("\\'", "'").replace('\\"', '"')
        return None

    return {
        'id':       get('id'),
        'chapitre': get('chapitre'),
        'notion':   get('notion'),
    }


# ══════════════════════════════════════════════════════════════════════════════
#  Parsing de registry.js → arborescence spécialités / sections
# ══════════════════════════════════════════════════════════════════════════════

def _close_bracket(txt, start, o, c):
    """Retourne l'index du crochet/accolade fermant·e correspondant au start."""
    depth = 0
    for i in range(start, len(txt)):
        if txt[i] == o:
            depth += 1
        elif txt[i] == c:
            depth -= 1
            if depth == 0:
                return i
    return len(txt) - 1


def _top_objects(txt):
    """Génère chaque bloc {...} de premier niveau dans txt."""
    depth, start = 0, None
    for i, ch in enumerate(txt):
        if ch == '{':
            if depth == 0:
                start = i
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and start is not None:
                yield txt[start:i + 1]
                start = None


def _kv(txt):
    """
    Extrait les paires clé: 'valeur' d'un objet JS.
    Ne lit que la partie plate (avant sections:/chapters:) pour éviter
    de confondre id/label des objets imbriqués avec ceux du niveau courant.
    """
    cutoff = len(txt)
    for pat in (r'sections:\s*\[', r'chapters:\s*\['):
        m = re.search(pat, txt)
        if m:
            cutoff = min(cutoff, m.start())
    flat = txt[:cutoff]

    result = {}
    for m in re.finditer(r"(\w+):\s*['\"]([^'\"\\]*(?:\\.[^'\"\\]*)*)['\"]", flat):
        key = m.group(1)
        if key not in result:
            result[key] = m.group(2).replace("\\'", "'")
    return result


def parse_registry_tree():
    """
    Analyse registry.js et renvoie la liste des spécialités.
    Structure : [{ id, label, sublabel, sections: [{ id, label }] }]
    """
    txt = _read(REGISTRY)

    m = re.search(r'tree:\s*\[', txt)
    if not m:
        return []

    bracket_start = m.end() - 1
    bracket_end   = _close_bracket(txt, bracket_start, '[', ']')
    tree_inner    = txt[bracket_start + 1 : bracket_end]

    specs = []
    for spec_block in _top_objects(tree_inner):
        spec = _kv(spec_block)
        if 'id' not in spec:
            continue

        sm = re.search(r'sections:\s*\[', spec_block)
        if sm:
            sec_start = spec_block.index('[', sm.start())
            sec_end   = _close_bracket(spec_block, sec_start, '[', ']')
            sec_inner = spec_block[sec_start + 1 : sec_end]
            spec['sections'] = []
            for sec_block in _top_objects(sec_inner):
                sec = _kv(sec_block)
                if 'id' in sec:
                    spec['sections'].append(sec)
        else:
            spec['sections'] = []

        specs.append(spec)

    return specs


# ══════════════════════════════════════════════════════════════════════════════
#  Modifications de fichiers
# ══════════════════════════════════════════════════════════════════════════════

def add_to_registry(section_id, module_id, label):
    """
    Insère { id: 'module_id', label: 'label' } à la fin du tableau chapters[]
    de la section `section_id` dans registry.js.
    """
    txt = _read(REGISTRY)

    m = re.search(rf"id:\s*['\"]({re.escape(section_id)})['\"]", txt)
    if not m:
        raise ValueError(f"Section « {section_id} » introuvable dans registry.js")

    search_from = m.end()

    cm = re.search(r'chapters:\s*\[', txt[search_from : search_from + 800])
    if not cm:
        raise ValueError(
            f"Tableau 'chapters' introuvable pour la section « {section_id} »")

    bracket_pos = search_from + cm.end() - 1
    close_pos   = _close_bracket(txt, bracket_pos, '[', ']')

    insert_at = txt.rfind('\n', bracket_pos, close_pos)
    if insert_at == -1:
        insert_at = close_pos

    safe_label = label.replace('\\', '\\\\').replace("'", "\\'")
    new_line = f"\n            {{ id: '{module_id}', label: '{safe_label}' }},"

    _write(REGISTRY, txt[:insert_at] + new_line + txt[insert_at:])


def add_specialty_to_registry(spec_id, label, sublabel, icon):
    """
    Ajoute une nouvelle spécialité (bloc vide) à la fin de tree: [...] dans registry.js.
    """
    txt = _read(REGISTRY)

    m = re.search(r'tree:\s*\[', txt)
    if not m:
        raise ValueError("tree: [...] introuvable dans registry.js")

    bracket_pos = m.end() - 1
    close_pos   = _close_bracket(txt, bracket_pos, '[', ']')

    insert_at = txt.rfind('\n', bracket_pos, close_pos)
    if insert_at == -1:
        insert_at = close_pos

    safe_label    = label.replace("'", "\\'")
    safe_sublabel = sublabel.replace("'", "\\'")

    new_block = (
        f"\n\n    // {'─' * 50}\n"
        f"    //  {label.upper()}\n"
        f"    // {'─' * 50}\n"
        f"    {{\n"
        f"      id: '{spec_id}',\n"
        f"      label: '{safe_label}',\n"
        f"      sublabel: '{safe_sublabel}',\n"
        f"      icon: '{icon}',\n"
        f"      open: false,\n"
        f"      sections: [],\n"
        f"    }},"
    )

    _write(REGISTRY, txt[:insert_at] + new_block + txt[insert_at:])


def add_section_to_registry(spec_id, section_id, section_label):
    """
    Ajoute une nouvelle section (avec chapters: [] vide) dans la spécialité `spec_id`.
    """
    txt = _read(REGISTRY)

    m = re.search(rf"id:\s*['\"]({re.escape(spec_id)})['\"]", txt)
    if not m:
        raise ValueError(f"Spécialité « {spec_id} » introuvable dans registry.js")

    search_from = m.end()

    sm = re.search(r'sections:\s*\[', txt[search_from : search_from + 800])
    if not sm:
        raise ValueError(
            f"Tableau 'sections' introuvable pour la spécialité « {spec_id} »")

    bracket_pos = search_from + sm.end() - 1
    close_pos   = _close_bracket(txt, bracket_pos, '[', ']')

    insert_at = txt.rfind('\n', bracket_pos, close_pos)
    if insert_at == -1:
        insert_at = close_pos

    safe_label = section_label.replace("'", "\\'")
    new_block = (
        f"\n        {{\n"
        f"          id: '{section_id}',\n"
        f"          label: '{safe_label}',\n"
        f"          open: true,\n"
        f"          chapters: [],\n"
        f"        }},"
    )

    _write(REGISTRY, txt[:insert_at] + new_block + txt[insert_at:])


def add_script_to_html(script_src):
    """
    Ajoute <script src="..."> avant le marqueur <!-- /MODULES --> dans index.html.
    Renvoie True si ajouté, False si déjà présent.
    """
    txt    = _read(INDEX_HTML)
    marker = '<!-- /MODULES -->'

    if script_src in txt:
        return False

    if marker not in txt:
        raise ValueError(
            f"Marqueur '{marker}' introuvable dans index.html.\n"
            "Vérifiez que le fichier index.html n'a pas été modifié manuellement.")

    new_tag = f'  <script src="{script_src}"></script>\n  '
    _write(INDEX_HTML, txt.replace(marker, new_tag + marker, 1))
    return True


# ══════════════════════════════════════════════════════════════════════════════
#  Interface graphique
# ══════════════════════════════════════════════════════════════════════════════

class App(tk.Tk):

    C_BLUE   = '#2563eb'
    C_BLUE_D = '#1d4ed8'
    C_HDR    = '#1e3a8a'
    C_BG     = '#f8fafc'
    C_INFO   = '#f0f9ff'
    C_GREEN  = '#15803d'
    C_RED    = '#dc2626'

    def __init__(self):
        super().__init__()
        self.title("Maths Trainer — Import de module")
        self.resizable(False, False)
        self.configure(bg=self.C_BG)

        self.v_path   = tk.StringVar()
        self.v_id     = tk.StringVar(value='—')
        self.v_chap   = tk.StringVar(value='—')
        self.v_notion = tk.StringVar(value='—')
        self.v_spec   = tk.StringVar()
        self.v_sec    = tk.StringVar()

        self._tree     = parse_registry_tree()
        self._spec_map = {s['label']: s for s in self._tree}
        self._sec_map  = {}

        self._build_ui()
        self._center()

    # ── Construction de l'UI ─────────────────────────────────────────────────

    def _build_ui(self):
        hdr = tk.Frame(self, bg=self.C_HDR)
        hdr.pack(fill='x')
        tk.Label(hdr, text="🎓  Maths Trainer",
                 bg=self.C_HDR, fg='white',
                 font=('Segoe UI', 13, 'bold')).pack(padx=18, pady=(12, 2), anchor='w')
        tk.Label(hdr, text="Importateur de module d'exercice",
                 bg=self.C_HDR, fg='#bfdbfe',
                 font=('Segoe UI', 9)).pack(padx=18, pady=(0, 12), anchor='w')

        body = tk.Frame(self, bg=self.C_BG, padx=22, pady=16)
        body.pack(fill='both', expand=True)

        # ── Étape 1 : fichier JS ─────────────────────────────────────────
        self._heading(body, "Étape 1 — Sélectionner le fichier JS du module")

        row = tk.Frame(body, bg=self.C_BG)
        row.pack(fill='x', pady=(6, 0))

        tk.Entry(row, textvariable=self.v_path, width=46,
                 state='readonly', font=('Segoe UI', 9),
                 relief='groove').pack(side='left', padx=(0, 8), ipady=3)

        tk.Button(row, text="Parcourir…", command=self._browse,
                  relief='groove', font=('Segoe UI', 9),
                  cursor='hand2', padx=8, pady=3).pack(side='left')

        info = tk.LabelFrame(body, text=" Informations détectées dans le fichier ",
                             bg=self.C_INFO, fg='#0369a1',
                             font=('Segoe UI', 8), relief='groove', bd=1)
        info.pack(fill='x', pady=12)

        for key, var, wrap in [
            ("ID",        self.v_id,     220),
            ("Chapitre",  self.v_chap,   320),
            ("Notion",    self.v_notion,  320),
        ]:
            r = tk.Frame(info, bg=self.C_INFO)
            r.pack(fill='x', padx=10, pady=3)
            tk.Label(r, text=f"{key} :", width=10, anchor='e',
                     bg=self.C_INFO, fg='#0369a1',
                     font=('Segoe UI', 9)).pack(side='left')
            tk.Label(r, textvariable=var, anchor='w',
                     bg=self.C_INFO, fg='#0f172a',
                     font=('Segoe UI', 9, 'bold'),
                     wraplength=wrap, justify='left').pack(side='left', padx=(6, 0))

        # ── Étape 2 : spécialité ─────────────────────────────────────────
        self._heading(body, "Étape 2 — Choisir la spécialité/la classe")

        spec_row = tk.Frame(body, bg=self.C_BG)
        spec_row.pack(fill='x', pady=(6, 0))

        spec_labels = list(self._spec_map.keys())
        self._spec_combo = ttk.Combobox(
            spec_row, textvariable=self.v_spec,
            values=spec_labels, state='readonly',
            width=36, font=('Segoe UI', 9))
        self._spec_combo.pack(side='left')
        if spec_labels:
            self._spec_combo.set(spec_labels[0])
        self._spec_combo.bind('<<ComboboxSelected>>', lambda _: self._refresh_sections())

        tk.Button(spec_row, text="＋ Nouvelle classe/spécialité",
                  command=self._new_specialty_dialog,
                  relief='groove', font=('Segoe UI', 9),
                  cursor='hand2', padx=8, pady=3,
                  fg=self.C_BLUE).pack(side='left', padx=(8, 0))

        # ── Étape 3 : section ────────────────────────────────────────────
        self._heading(body, "Étape 3 — Choisir la section / le thème")

        sec_row = tk.Frame(body, bg=self.C_BG)
        sec_row.pack(fill='x', pady=(6, 0))

        self._sec_combo = ttk.Combobox(
            sec_row, textvariable=self.v_sec,
            state='readonly', width=36,
            font=('Segoe UI', 9))
        self._sec_combo.pack(side='left')

        tk.Button(sec_row, text="＋ Nouvelle section",
                  command=self._new_section_dialog,
                  relief='groove', font=('Segoe UI', 9),
                  cursor='hand2', padx=8, pady=3,
                  fg=self.C_BLUE).pack(side='left', padx=(8, 0))

        # Initialiser les sections maintenant que _sec_combo existe
        if spec_labels:
            self._refresh_sections()

        # Séparateur
        tk.Frame(body, bg='#e2e8f0', height=1).pack(fill='x', pady=16)

        # ── Bouton principal ─────────────────────────────────────────────
        self._btn = tk.Button(
            body,
            text="⬇   Importer le module dans le projet",
            command=self._do_import,
            bg=self.C_BLUE, fg='white',
            activebackground=self.C_BLUE_D, activeforeground='white',
            font=('Segoe UI', 11, 'bold'),
            relief='flat', cursor='hand2',
            padx=20, pady=10,
        )
        self._btn.pack()

        self._v_status = tk.StringVar()
        self._lbl_status = tk.Label(
            body, textvariable=self._v_status,
            bg=self.C_BG, font=('Segoe UI', 9),
            wraplength=460, justify='left')
        self._lbl_status.pack(pady=(10, 0))

    def _heading(self, parent, text):
        tk.Label(parent, text=text,
                 bg=self.C_BG, fg=self.C_HDR,
                 font=('Segoe UI', 10, 'bold')).pack(anchor='w', pady=(14, 0))

    def _center(self):
        self.update_idletasks()
        w  = self.winfo_width()
        h  = self.winfo_height()
        sw = self.winfo_screenwidth()
        sh = self.winfo_screenheight()
        self.geometry(f"+{(sw - w) // 2}+{(sh - h) // 2}")

    # ── Rafraîchissement de l'arborescence ───────────────────────────────────

    def _reload_tree(self):
        """Relit registry.js et met à jour tous les menus déroulants."""
        self._tree     = parse_registry_tree()
        self._spec_map = {s['label']: s for s in self._tree}
        spec_labels    = list(self._spec_map.keys())
        self._spec_combo['values'] = spec_labels
        if self.v_spec.get() not in spec_labels and spec_labels:
            self._spec_combo.set(spec_labels[0])
        self._refresh_sections()

    def _refresh_sections(self):
        spec  = self._spec_map.get(self.v_spec.get(), {})
        secs  = spec.get('sections', [])
        self._sec_map = {s['label']: s for s in secs}
        labels = list(self._sec_map.keys())
        self._sec_combo['values'] = labels
        self._sec_combo.set(labels[0] if labels else '')

    # ── Dialogues de création ────────────────────────────────────────────────

    def _new_specialty_dialog(self):
        """Ouvre une fenêtre pour créer une nouvelle spécialité."""
        dlg = tk.Toplevel(self)
        dlg.title("Nouvelle classe/spécialité")
        dlg.grab_set()
        dlg.resizable(False, False)
        dlg.configure(bg=self.C_BG)

        pad = dict(padx=18, pady=6)

        tk.Label(dlg, text="Créer une nouvelle classe / spécialité",
                 bg=self.C_BG, fg=self.C_HDR,
                 font=('Segoe UI', 11, 'bold')).pack(padx=18, pady=(16, 4))

        fields_frame = tk.Frame(dlg, bg=self.C_BG)
        fields_frame.pack(**pad)

        v_label    = tk.StringVar()
        v_sublabel = tk.StringVar()
        v_icon     = tk.StringVar(value='📚')

        for row_label, var in [
            ("Nom *",           v_label),
            ("Sous-titre",      v_sublabel),
            ("Icône (emoji)",   v_icon),
        ]:
            r = tk.Frame(fields_frame, bg=self.C_BG)
            r.pack(fill='x', pady=4)
            tk.Label(r, text=row_label, width=16, anchor='e',
                     bg=self.C_BG, font=('Segoe UI', 9)).pack(side='left')
            e = tk.Entry(r, textvariable=var, width=28,
                         font=('Segoe UI', 9), relief='groove')
            e.pack(side='left', padx=(8, 0), ipady=3)
            if row_label == "Nom *":
                e.focus_set()

        def _preview_id(*_):
            slug = _slug(v_label.get())
            lbl_id.config(text=f"ID généré : {slug}" if slug != 'nouveau' else "ID généré : —")

        v_label.trace_add('write', _preview_id)
        lbl_id = tk.Label(fields_frame, text="ID généré : —",
                          bg=self.C_BG, fg='#64748b',
                          font=('Segoe UI', 8, 'italic'))
        lbl_id.pack(anchor='e', pady=(0, 4))

        def _submit():
            label    = v_label.get().strip()
            sublabel = v_sublabel.get().strip()
            icon     = v_icon.get().strip() or '📚'
            if not label:
                messagebox.showwarning("Champ vide", "Le nom est obligatoire.", parent=dlg)
                return
            spec_id = _slug(label)
            existing = [s['id'] for s in self._tree]
            if spec_id in existing:
                messagebox.showwarning(
                    "Doublon",
                    f"Une spécialité avec l'identifiant « {spec_id} » existe déjà.\n"
                    "Choisissez un nom différent.",
                    parent=dlg)
                return
            try:
                add_specialty_to_registry(spec_id, label, sublabel, icon)
                # Mettre à jour le mapping des dossiers en mémoire
                SPEC_FOLDERS[spec_id] = spec_id
            except Exception as ex:
                messagebox.showerror("Erreur", str(ex), parent=dlg)
                return
            dlg.destroy()
            self._reload_tree()
            # Sélectionner la nouvelle spécialité
            self.v_spec.set(label)
            self._refresh_sections()
            messagebox.showinfo(
                "Spécialité créée",
                f"La spécialité « {label} » a été ajoutée.\n\n"
                f"ID : {spec_id}\n\n"
                "Vous pouvez maintenant créer des sections dans cette spécialité.")

        btn_row = tk.Frame(dlg, bg=self.C_BG)
        btn_row.pack(pady=(8, 16))
        tk.Button(btn_row, text="Annuler", command=dlg.destroy,
                  relief='groove', font=('Segoe UI', 9),
                  cursor='hand2', padx=12, pady=5).pack(side='left', padx=(0, 8))
        tk.Button(btn_row, text="✓ Créer la spécialité", command=_submit,
                  bg=self.C_BLUE, fg='white',
                  activebackground=self.C_BLUE_D, activeforeground='white',
                  relief='flat', font=('Segoe UI', 9, 'bold'),
                  cursor='hand2', padx=12, pady=5).pack(side='left')

        dlg.bind('<Return>', lambda _: _submit())
        dlg.bind('<Escape>', lambda _: dlg.destroy())
        self._center_child(dlg)

    def _new_section_dialog(self):
        """Ouvre une fenêtre pour créer une nouvelle section dans la spécialité active."""
        spec_lbl = self.v_spec.get()
        if not spec_lbl:
            messagebox.showwarning(
                "Aucune spécialité",
                "Veuillez d'abord sélectionner ou créer une spécialité (Étape 2).")
            return

        spec = self._spec_map.get(spec_lbl)
        if not spec:
            messagebox.showwarning("Spécialité invalide", "Spécialité non reconnue.")
            return

        dlg = tk.Toplevel(self)
        dlg.title("Nouvelle section")
        dlg.grab_set()
        dlg.resizable(False, False)
        dlg.configure(bg=self.C_BG)

        pad = dict(padx=18, pady=6)

        tk.Label(dlg, text="Créer une nouvelle section",
                 bg=self.C_BG, fg=self.C_HDR,
                 font=('Segoe UI', 11, 'bold')).pack(padx=18, pady=(16, 4))

        tk.Label(dlg,
                 text=f"Spécialité : {spec_lbl}",
                 bg=self.C_BG, fg='#64748b',
                 font=('Segoe UI', 9, 'italic')).pack(padx=18, anchor='w')

        fields_frame = tk.Frame(dlg, bg=self.C_BG)
        fields_frame.pack(**pad)

        v_label = tk.StringVar()

        r = tk.Frame(fields_frame, bg=self.C_BG)
        r.pack(fill='x', pady=4)
        tk.Label(r, text="Nom *", width=16, anchor='e',
                 bg=self.C_BG, font=('Segoe UI', 9)).pack(side='left')
        e = tk.Entry(r, textvariable=v_label, width=28,
                     font=('Segoe UI', 9), relief='groove')
        e.pack(side='left', padx=(8, 0), ipady=3)
        e.focus_set()

        def _preview_id(*_):
            slug = _slug(v_label.get())
            prefix = spec['id']
            full_id = f"{prefix}-{slug}" if slug != 'nouveau' else "—"
            lbl_id.config(text=f"ID généré : {full_id}")

        v_label.trace_add('write', _preview_id)
        lbl_id = tk.Label(fields_frame, text="ID généré : —",
                          bg=self.C_BG, fg='#64748b',
                          font=('Segoe UI', 8, 'italic'))
        lbl_id.pack(anchor='e', pady=(0, 4))

        def _submit():
            label = v_label.get().strip()
            if not label:
                messagebox.showwarning("Champ vide", "Le nom est obligatoire.", parent=dlg)
                return
            section_id = f"{spec['id']}-{_slug(label)}"
            existing = [s['id'] for s in spec.get('sections', [])]
            if section_id in existing:
                messagebox.showwarning(
                    "Doublon",
                    f"Une section avec l'identifiant « {section_id} » existe déjà.\n"
                    "Choisissez un nom différent.",
                    parent=dlg)
                return
            try:
                add_section_to_registry(spec['id'], section_id, label)
            except Exception as ex:
                messagebox.showerror("Erreur", str(ex), parent=dlg)
                return
            dlg.destroy()
            self._reload_tree()
            # Sélectionner la nouvelle section
            self.v_spec.set(spec_lbl)
            self._refresh_sections()
            self.v_sec.set(label)
            messagebox.showinfo(
                "Section créée",
                f"La section « {label} » a été ajoutée dans « {spec_lbl} ».\n\n"
                f"ID : {section_id}\n\n"
                "Vous pouvez maintenant importer des modules dans cette section.")

        btn_row = tk.Frame(dlg, bg=self.C_BG)
        btn_row.pack(pady=(8, 16))
        tk.Button(btn_row, text="Annuler", command=dlg.destroy,
                  relief='groove', font=('Segoe UI', 9),
                  cursor='hand2', padx=12, pady=5).pack(side='left', padx=(0, 8))
        tk.Button(btn_row, text="✓ Créer la section", command=_submit,
                  bg=self.C_BLUE, fg='white',
                  activebackground=self.C_BLUE_D, activeforeground='white',
                  relief='flat', font=('Segoe UI', 9, 'bold'),
                  cursor='hand2', padx=12, pady=5).pack(side='left')

        dlg.bind('<Return>', lambda _: _submit())
        dlg.bind('<Escape>', lambda _: dlg.destroy())
        self._center_child(dlg)

    def _center_child(self, dlg):
        dlg.update_idletasks()
        w  = dlg.winfo_reqwidth()
        h  = dlg.winfo_reqheight()
        pw = self.winfo_x() + self.winfo_width() // 2
        ph = self.winfo_y() + self.winfo_height() // 2
        dlg.geometry(f"{w}x{h}+{pw - w // 2}+{ph - h // 2}")

    # ── Callbacks ────────────────────────────────────────────────────────────

    def _browse(self):
        path = filedialog.askopenfilename(
            title="Sélectionner le fichier JS du module",
            initialdir=HERE,
            filetypes=[("Fichiers JavaScript", "*.js"), ("Tous les fichiers", "*.*")],
        )
        if not path:
            return

        try:
            info = parse_module_file(path)
        except Exception as ex:
            messagebox.showerror("Erreur de lecture", str(ex))
            return

        if not info['id']:
            messagebox.showwarning(
                "Fichier invalide",
                "Impossible de trouver le champ 'id:' dans ce fichier.\n\n"
                "Assurez-vous que c'est bien un module MathsTrainer "
                "(généré avec le mega-prompt du GUIDE_PROF.md).")
            return

        self.v_path.set(path)
        self.v_id.set(info['id'])
        self.v_chap.set(info['chapitre'] or '—')
        self.v_notion.set(info['notion'] or '—')
        self._set_status('')

    def _do_import(self):
        src = self.v_path.get()
        if not src:
            messagebox.showwarning("Aucun fichier",
                                   "Veuillez d'abord sélectionner un fichier JS (Étape 1).")
            return

        mod_id   = self.v_id.get()
        label    = self.v_chap.get()
        spec_lbl = self.v_spec.get()
        sec_lbl  = self.v_sec.get()

        if not spec_lbl or not sec_lbl:
            messagebox.showwarning("Sélection incomplète",
                                   "Veuillez choisir une spécialité et une section.")
            return

        spec = self._spec_map.get(spec_lbl)
        sec  = self._sec_map.get(sec_lbl)
        if not spec or not sec:
            messagebox.showwarning("Sélection invalide",
                                   "Spécialité ou section non reconnue.")
            return

        spec_id    = spec['id']
        section_id = sec['id']
        folder     = SPEC_FOLDERS.get(spec_id, spec_id)
        script_src = f"modules/{folder}/{mod_id}.js"
        dest       = os.path.join(MODULES_DIR, folder, f"{mod_id}.js")

        reg_txt = _read(REGISTRY)
        already = re.search(rf"id:\s*['\"]({re.escape(mod_id)})['\"]", reg_txt)
        if already:
            if not messagebox.askyesno(
                    "Module déjà enregistré",
                    f"L'identifiant « {mod_id} » existe déjà dans registry.js.\n\n"
                    "Continuer quand même risque de créer un doublon.\n"
                    "Voulez-vous continuer ?"):
                return

        preview = (
            f"Le module sera ajouté comme suit :\n\n"
            f"  • Fichier copié  →  {script_src}\n"
            f"  • registry.js    →  section « {sec_lbl} »\n"
            f"  • index.html     →  balise <script> ajoutée\n\n"
            f"Voulez-vous continuer ?"
        )
        if not messagebox.askokcancel("Confirmer l'import", preview):
            return

        errors = []
        done   = []

        try:
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            if os.path.abspath(src) != os.path.abspath(dest):
                shutil.copy2(src, dest)
            done.append(f"✓ Fichier copié → {script_src}")
        except Exception as ex:
            errors.append(f"Copie du fichier : {ex}")

        try:
            add_to_registry(section_id, mod_id, label)
            done.append(f"✓ registry.js  → section « {sec_lbl} »")
        except Exception as ex:
            errors.append(f"registry.js : {ex}")

        try:
            added = add_script_to_html(script_src)
            done.append("✓ index.html   → " +
                        ("balise <script> ajoutée" if added else "balise déjà présente"))
        except Exception as ex:
            errors.append(f"index.html : {ex}")

        if errors:
            self._set_status("⚠ Erreur(s) — voir la fenêtre de détails", self.C_RED)
            messagebox.showerror(
                "Erreurs lors de l'import",
                "Certaines étapes ont échoué :\n\n" +
                "\n".join(f"  • {e}" for e in errors) +
                ("\n\nÉtapes réussies :\n" + "\n".join(f"  {d}" for d in done)
                 if done else ""))
        else:
            self._set_status("  ·  ".join(done), self.C_GREEN)
            messagebox.showinfo(
                "Import réussi ! 🎉",
                f"Le module « {label} » a été ajouté avec succès.\n\n" +
                "\n".join(done) +
                "\n\nOuvrez index.html dans votre navigateur pour tester.")

    def _set_status(self, msg, color=None):
        self._v_status.set(msg)
        if color:
            self._lbl_status.config(fg=color)


# ══════════════════════════════════════════════════════════════════════════════
#  Point d'entrée
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == '__main__':
    missing = [p for p in (REGISTRY, INDEX_HTML) if not os.path.isfile(p)]
    if missing:
        root = tk.Tk()
        root.withdraw()
        messagebox.showerror(
            "Dossier incorrect",
            "Ce script doit se trouver dans le dossier racine du projet Maths Trainer "
            "(là où se trouve index.html).\n\n"
            "Fichier(s) introuvable(s) :\n" +
            "\n".join(f"  • {p}" for p in missing) +
            f"\n\nDossier détecté : {HERE}")
        sys.exit(1)

    App().mainloop()
