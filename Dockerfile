# busybox 1.37.0-glibc
FROM busybox@sha256:fd8d9aa63ba2f0982b5304e1ee8d3b90a210bc1ffb5314d980eb6962f1a9715d

COPY trivy-plugin /plugins/trivy-plugin/

USER 1001 