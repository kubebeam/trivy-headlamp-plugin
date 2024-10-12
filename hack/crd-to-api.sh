# Generate typescript interface with https://github.com/yaacov/crdtoapi?tab=readme-ov-file

# Steps
# 1. Get CRD into yaml 
# 2. Run crdtoapi to generate openapi file 
# 3. Run crdtotypes to generate typescript files 
# 4. After generation, some interfaces (e.g. ClusterVulnerabilityReport,  ClusterSbomReport) are adapted for better reuse of types.

rm -rf ./crdtoapi 
mkdir -p ./crdtoapi
mkdir -p crdtoapi-generated

# Get CRDs
kubectl get crd clustercompliancereports.aquasecurity.github.io -o yaml > crdtoapi/clustercompliancereports.aquasecurity.github.io.yaml
kubectl get crd clusterconfigauditreports.aquasecurity.github.io -o yaml > crdtoapi/clusterconfigauditreports.aquasecurity.github.io.yaml
kubectl get crd clusterinfraassessmentreports.aquasecurity.github.io -o yaml > crdtoapi/clusterinfraassessmentreports.aquasecurity.github.io.yaml
kubectl get crd clusterrbacassessmentreports.aquasecurity.github.io -o yaml > crdtoapi/clusterrbacassessmentreports.aquasecurity.github.io.yaml
kubectl get crd clustersbomreports.aquasecurity.github.io -o yaml > crdtoapi/clustersbomreports.aquasecurity.github.io.yaml
kubectl get crd clustervulnerabilityreports.aquasecurity.github.io -o yaml > crdtoapi/clustervulnerabilityreports.aquasecurity.github.io.yaml
kubectl get crd configauditreports.aquasecurity.github.io -o yaml > crdtoapi/configauditreports.aquasecurity.github.io.yaml
kubectl get crd exposedsecretreports.aquasecurity.github.io -o yaml > crdtoapi/exposedsecretreports.aquasecurity.github.io.yaml
kubectl get crd infraassessmentreports.aquasecurity.github.io -o yaml > crdtoapi/infraassessmentreports.aquasecurity.github.io.yaml
kubectl get crd rbacassessmentreports.aquasecurity.github.io -o yaml > crdtoapi/rbacassessmentreports.aquasecurity.github.io.yaml
kubectl get crd sbomreports.aquasecurity.github.io -o yaml > crdtoapi/sbomreports.aquasecurity.github.io.yaml
kubectl get crd vulnerabilityreports.aquasecurity.github.io -o yaml > crdtoapi/vulnerabilityreports.aquasecurity.github.io.yaml

# generate OpenAPI 
crdtoapi -i ./crdtoapi -o ./crdtoapi-generated/openapi.yaml --noApiVersionPrefix --apiVersion "v1alpha1"

# generate Typescript interfaces 
crdtotypes -i ./crdtoapi-generated/openapi.yaml -o ./crdtoapi-generated --metadataType ObjectMeta 

crds=( clustercompliancereport clusterconfigauditreport clusterinfraassessmentreport clusterrbacassessmentreport clustersbomreport clustervulnerabilityreport configauditreport exposedsecretreport infraassessmentreport rbacassessmentreport sbomreport vulnerabilityreport)

rm -rf ./crdtoapi-generated/makeCustomResourceClass.ts
for crd in "${crds[@]}"
do 
    echo "export const ${crd}Class = makeCustomResourceClass({ \
    apiInfo: apiAquaGroupVersion, \
    isNamespaced: false, \
    singularName: '$crd', \
    pluralName: '${crd}s', \
    });" >> ./crdtoapi-generated/makeCustomResourceClass.ts
done 