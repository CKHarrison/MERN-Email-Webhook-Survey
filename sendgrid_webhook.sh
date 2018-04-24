function localtunnel {
  lt -s cklinuxhiroemail --port 5000
}
until localtunnel; do
echo "localtunnel server crashed"
sleep 2
done