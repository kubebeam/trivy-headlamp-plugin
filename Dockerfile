# busybox 1.37.0-glibc
FROM busybox@sha256:dc2d74b28e4cf8984fa52af1f39bc7c3d9c73760b41a74d629f5d11b1ab28616

COPY trivy-plugin /plugins/trivy-plugin/

USER 1001 