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
        "docker run -d --name=cadvisor --volume=/:/rootfs:ro --volume=/var/run:/var/run:ro --volume=/sys:/sys:ro   --volume=/var/lib/docker/:/var/lib/docker:ro   --publish=8081:8080  google/cadvisor:latest",
        "docker run -d   --name=prometheus  -p 9090:9090   -v prometheus.yml:/etc/prometheus/prometheus.yml  prom/prometheus",
        "docker run -d   --name=grafana   -p 3030:3000   grafana/grafana"
  ]

    for command in commands:
        run_command(command)

if __name__ == "__main__":
    main()
