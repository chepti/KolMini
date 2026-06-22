# הטמעת הלוגואים כ-base64 בתוך Index.html
# מריצים מתוך תיקיית catalog-app:  powershell -File inject_logos.ps1
# הסקריפט מחפש את שלושת הלוגואים בתיקיית logos\ ומחליף את ה-placeholders __LOGO_*__ ב-Index.html.
# שימו לב: לאחר הזרקה אחת ה-placeholders נעלמים. כדי להריץ שוב — שחזרו אותם מהגיט (git checkout Index.html).

Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

function Resize-ToDataUri($path, $maxW, $maxH) {
  $img = [System.Drawing.Image]::FromFile((Resolve-Path $path))
  $r = [Math]::Min($maxW / $img.Width, $maxH / $img.Height); if ($r -gt 1) { $r = 1 }
  $w = [int]($img.Width * $r); $h = [int]($img.Height * $r)
  $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($img, 0, 0, $w, $h)
  $ms = New-Object System.IO.MemoryStream
  $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
  $b64 = [Convert]::ToBase64String($ms.ToArray())
  $g.Dispose(); $bmp.Dispose(); $img.Dispose(); $ms.Dispose()
  return "data:image/png;base64,$b64"
}

$akadem = Resize-ToDataUri "logos\לוגו אקדמיזציה ולמידה דיגיטלית.png" 560 200
$moodle = Resize-ToDataUri "logos\MOODLE.jpg" 72 72
$campus = Resize-ToDataUri "logos\CAMPUSIL.jpg" 72 72

$path = "Index.html"
$html = Get-Content $path -Raw -Encoding UTF8
$html = $html.Replace('__LOGO_AKADEM__', $akadem).Replace('__LOGO_MOODLE__', $moodle).Replace('__LOGO_CAMPUS__', $campus)
[System.IO.File]::WriteAllText((Resolve-Path $path), $html, (New-Object System.Text.UTF8Encoding $true))
Write-Output "הוטמעו: אקדמיזציה=$($akadem.Length) | Moodle=$($moodle.Length) | קמפוס=$($campus.Length) תווים"
Write-Output "placeholders שנותרו: $(([regex]::Matches($html,'__LOGO_')).Count)"
