Add-Type -AssemblyName System.Drawing

$files = Get-ChildItem "$PSScriptRoot/pdf/page-*.png" | Sort-Object Name
$groups = 0..4
foreach ($group in $groups) {
  $selected = $files | Select-Object -Skip ($group * 5) -First 5
  $thumbWidth = 420
  $thumbHeight = 420
  $labelHeight = 34
  $canvas = New-Object System.Drawing.Bitmap (($thumbWidth * 5), ($thumbHeight + $labelHeight))
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  $graphics.Clear([System.Drawing.Color]::White)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $font = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)
  for ($index = 0; $index -lt $selected.Count; $index++) {
    $image = [System.Drawing.Image]::FromFile($selected[$index].FullName)
    $scale = [Math]::Min($thumbWidth / $image.Width, $thumbHeight / $image.Height)
    $width = [int]($image.Width * $scale)
    $height = [int]($image.Height * $scale)
    $x = ($index * $thumbWidth) + [int](($thumbWidth - $width) / 2)
    $y = $labelHeight + [int](($thumbHeight - $height) / 2)
    $graphics.DrawString($selected[$index].BaseName, $font, [System.Drawing.Brushes]::Black, ($index * $thumbWidth + 8), 5)
    $graphics.DrawImage($image, $x, $y, $width, $height)
    $image.Dispose()
  }
  $output = Join-Path $PSScriptRoot ("contact-{0}.jpg" -f ($group + 1))
  $canvas.Save($output, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $font.Dispose()
  $graphics.Dispose()
  $canvas.Dispose()
}
