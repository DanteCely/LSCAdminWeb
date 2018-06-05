sudo systemctl daemon-reload
sudo systemctl start apache-tomcat
sudo systemctl enable tomcat
ng build --prod --base-href=/Admin-LSC/
sudo rm -rf /opt/tomcat/webapps/Admin-LSC
sudo mv dist/Admin-LSC /opt/tomcat/webapps/