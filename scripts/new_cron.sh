echo "" >| emptycron
crontab emptycron
rm emptycron

crontab -l > mastercron
echo "* * * * * /home/ubuntu/Projects/Test/refresh_script.sh" > mastercron

crontab mastercron
rm mastercron
