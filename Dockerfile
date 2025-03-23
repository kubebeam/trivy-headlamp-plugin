FROM busybox:latest

COPY trivy-plugin /plugins/trivy-plugin/

USER 1001 