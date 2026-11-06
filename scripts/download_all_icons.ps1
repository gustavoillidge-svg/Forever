$ErrorActionPreference='Stop'
$proj = 'C:\Users\gusta\Desktop\wow-forever-tool'
$namesFile = "$proj\assets\icons\catalog\wowhead-icon-names.txt"
$outDir = "$proj\assets\icons\small"
$logDir = "$proj\assets\icons\catalog"
New-Item -ItemType Directory -Force -Path $outDir,$logDir | Out-Null
$names = @(Get-Content $namesFile | ForEach-Object { $_.Trim().ToLower() } | Where-Object { $_ -and $_ -match '^[a-z0-9_.-]+$' } | Sort-Object -Unique)
$total = $names.Count
$ok=0; $skip=0; $fail=0; $i=0
$failed = New-Object System.Collections.Generic.List[string]
$progressPath = "$logDir\download-all-progress.json"
$failedPath = "$logDir\download-all-failed.txt"
$sw = [Diagnostics.Stopwatch]::StartNew()
$client = New-Object System.Net.WebClient
$client.Headers.Add('User-Agent','Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122')
$client.Headers.Add('Accept','image/*,*/*')
foreach($name in $names){
  $i++
  $dest = Join-Path $outDir "$name.jpg"
  if(Test-Path $dest){
    $len=(Get-Item $dest).Length
    if($len -gt 0){ $skip++; if(($i % 500) -eq 0){ Write-Output "progress $i/$total ok=$ok skip=$skip fail=$fail" }; continue }
    Remove-Item $dest -Force -ErrorAction SilentlyContinue
  }
  $url = "https://wow.zamimg.com/images/wow/icons/small/$name.jpg"
  $done=$false
  for($a=1; $a -le 2 -and -not $done; $a++){
    try {
      $client.DownloadFile($url, $dest)
      if((Test-Path $dest) -and ((Get-Item $dest).Length -gt 0)){ $ok++; $done=$true } else { if(Test-Path $dest){Remove-Item $dest -Force}; throw "empty" }
    } catch {
      if($a -ge 2){ $fail++; $failed.Add($name) }
      else { Start-Sleep -Milliseconds 200 }
    }
  }
  if(($i % 25) -eq 0){ Start-Sleep -Milliseconds 30 }
  if(($i % 250) -eq 0 -or $i -eq $total){
    $status = @{ ts=(Get-Date).ToString('o'); i=$i; total=$total; ok=$ok; skip=$skip; fail=$fail; elapsedSec=[math]::Round($sw.Elapsed.TotalSeconds,1); last=$name }
    [IO.File]::WriteAllText($progressPath, ($status|ConvertTo-Json), [Text.UTF8Encoding]::new($false))
    Write-Output "progress $i/$total ok=$ok skip=$skip fail=$fail elapsed=$([math]::Round($sw.Elapsed.TotalSeconds,1))s"
  }
}
$client.Dispose()
[IO.File]::WriteAllLines($failedPath, $failed)
$final = @{ ts=(Get-Date).ToString('o'); total=$total; ok=$ok; skip=$skip; fail=$fail; elapsedSec=[math]::Round($sw.Elapsed.TotalSeconds,1); outDir='assets/icons/small'; failedList='assets/icons/catalog/download-all-failed.txt' }
[IO.File]::WriteAllText("$logDir\download-all-summary.json", ($final|ConvertTo-Json -Depth 4), [Text.UTF8Encoding]::new($false))
Write-Output "DONE ok=$ok skip=$skip fail=$fail total=$total elapsed=$([math]::Round($sw.Elapsed.TotalSeconds,1))s"
