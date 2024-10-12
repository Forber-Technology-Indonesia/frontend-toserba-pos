import subprocess
import os
from datetime import datetime

def run_command(command):
    try:
        result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        if result.returncode != 0:
            print("Error running command: {}".format(command))
            print(result.stderr)
        else:
            print(result.stdout)
    except Exception as e:
        print("Exception running command: {}".format(command))
        print(e)

def install_certbot():
    print("Installing Certbot and Apache plugin...")
    run_command("apt update")
    run_command("a2enmod ssl")
    run_command("apt install -y certbot python3-certbot-apache")

def create_apache_config():
    print("Start create_apache_config")
    config = """
<VirtualHost *:80>
    ServerName tospos.my.id
    ServerAlias www.tospos.my.id

    # Redirect HTTP to HTTPS
    Redirect permanent / https://tospos.my.id/
</VirtualHost>

<VirtualHost *:443>
    ServerName tospos.my.id
    ServerAlias www.tospos.my.id

    ErrorLog ${APACHE_LOG_DIR}/tospos_error.log
    CustomLog ${APACHE_LOG_DIR}/tospos_access.log combined
</VirtualHost>
"""
    with open('/etc/apache2/sites-available/tospos.my.id.conf', 'w') as f:
        f.write(config)
    print("Apache configuration file created for tospos.my.id")

def enable_site_and_reload():
    print("Start enable_site_and_reload")
    
    run_command("a2ensite tospos.my.id.conf")
    run_command("systemctl reload apache2")

def obtain_ssl_certificate():
    print("Obtaining SSL certificate for domain: tospos.my.id...")
    run_command("certbot --apache -d tospos.my.id -d www.tospos.my.id --non-interactive --agree-tos --email integrasolusiit@gmail.com")
    print("SSL certificate obtained for tospos.my.id")

def main():
    # install_certbot()
    # obtain_ssl_certificate()
    create_apache_config()
    enable_site_and_reload()

    run_command("systemctl reload apache2")
    print("Configuration for tospos.my.id has been successfully applied.")

if __name__ == "__main__":
    main()
