import subprocess

def run_command(command):
    """Run a shell command and print its output."""
    result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
    if result.returncode != 0:
        print("Error running command: {}".format(command))
        print(result.stderr)
    else:
        print(result.stdout)
    return result

def main():
    commands = [
        "docker stop jenkins2 ",
        "docker stop jenkins ",
        "docker rm jenkins ",
        "docker rm jenkins2 ",
        "docker run -d --name jenkins2 \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts", 
  "docker exec -u root -it jenkins2 bash",
  "apt-get update",
  "apt-get install -y docker.io",
  "groupadd docker || true",
  "usermod -aG docker jenkins",
  "chown root:docker /var/run/docker.sock"
  ]

    for command in commands:
        run_command(command)

if __name__ == "__main__":
    main()
