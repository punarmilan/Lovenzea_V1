$json = '{"fullName":"Sakshi Singh", "bloodGroup":"O+"}'
$headers = @{ "Content-Type" = "application/json" }
Invoke-WebRequest -Uri "http://localhost:8085/api/profiles/me" -Method PATCH -Headers $headers -Body $json
