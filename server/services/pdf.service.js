import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

export async function convertFolderToPdf(folder) {

    const psFile = path.join(folder, "convertAll.ps1");

    const psScript = `
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

Get-ChildItem -Path "${folder.replace(/\\/g, "\\\\")}" -Recurse -Filter *.docx | ForEach-Object {

    $pdf = $_.FullName.Replace(".docx",".pdf")

    $doc = $word.Documents.Open($_.FullName)

    $doc.SaveAs($pdf,17)

    $doc.Close($false)
}

$word.Quit()

[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null

[GC]::Collect()
[GC]::WaitForPendingFinalizers()
`;

    await fs.writeFile(psFile, psScript);

    await execAsync(
        `powershell -ExecutionPolicy Bypass -File "${psFile}"`
    );

    await fs.unlink(psFile);

    // đợi Windows release file
    await new Promise(r => setTimeout(r, 2000));
}