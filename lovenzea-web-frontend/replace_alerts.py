import os
import re

directory = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src'

for root, dirs, files in os.walk(directory):
    for file in files:
        if not file.endswith('.jsx'): continue
        filepath = os.path.join(root, file)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        needs_swal = False

        # Replace confirm
        if 'window.confirm(' in content:
            needs_swal = True
            def confirm_repl(m):
                msg = m.group(1)
                return f"(await Swal.fire({{ title: 'Are you sure?', text: {msg}, icon: 'warning', showCancelButton: true, confirmButtonColor: '#8C6D39', cancelButtonColor: '#d33', confirmButtonText: 'Yes' }}).then(r => r.isConfirmed))"
            content = re.sub(r'window\.confirm\((.*?)\)', confirm_repl, content)

        # Replace alert 
        if 'alert(' in content:
            needs_swal = True
            def alert_repl(m):
                msg = m.group(1)
                if not msg.strip(): return 'alert()' # empty alert
                return f"Swal.fire({{ text: {msg}, confirmButtonColor: '#8C6D39' }})"
            content = re.sub(r'\balert\((.*?)\)', alert_repl, content)

        if needs_swal and 'import Swal from' not in content:
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if line.startswith('import '):
                    lines.insert(i + 1, "import Swal from 'sweetalert2';")
                    break
            else:
                lines.insert(0, "import Swal from 'sweetalert2';")
            content = '\n'.join(lines)

        if needs_swal:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated {filepath}')
print('Done!')
