#!/bin/bash

#########################################
echo "Building production version"
#########################################
# mv ./node_modules ./node_modules_old
npm i
./node_modules/.bin/ng build --prod

#########################################
echo "Change directory to dist"
#########################################
cd ./dist/dashboard-app && rm -f ./tpcdashboard.zip && zip -r ./tpcdashboard.zip ./*

#########################################
echo "Compress to tpcdashboard.zip file"
#########################################
# zip -rf tpcdashboard.zip ./*

#########################################
echo "Send tpcdashboard.zip to remote: 198.100.148.47"
#########################################
scp ./tpcdashboard.zip root@198.100.148.47:/home
rm ./tpcdashboard.zip

#########################################
echo "[Remote] Unzip tpcdashboard.zip"
#########################################
ssh root@198.100.148.47 'cp /home/tpcdashboard.zip /var/www/app/ && cd /var/www/app/ && unzip -o /home/tpcdashboard.zip'

#########################################
echo "[Remote] Chmod 777"
#########################################
ssh root@198.100.148.47 'chmod -R 777 /var/www/app/'

#########################################
echo "[Remote] Chown www-data"
#########################################
ssh root@198.100.148.47 'chown -R www-data:www-data /var/www/app/'

ssh root@198.100.148.47 'mv /var/www/app/index.html /var/www/app/index.php'

ssh root@198.100.148.47 'rm -f /var/www/app/tpcdashboard.zip'

#########################################
echo "Clean"
#########################################
rm -rf ./node_modules/
# mv ./node_modules_old ./node_modules
