# -*- mode: python ; coding: utf-8 -*-
app_name = "project+"
script = "main.py"  

a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
   datas=[('Gui/index.html', 'Gui'),
           ('Gui/style.css', 'Gui'),
           ('data_storage.json', '.'),('Gui/god.PNG', 'Gui'),('Gui/cross (1).png', 'Gui')],
    hiddenimports=['eel', 'bottle', 'gevent', 'other_missing_dependencies'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='main',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
