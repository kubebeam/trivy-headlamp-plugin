/**
 *
 *
 *
 * The version of the OpenAPI document:
 * Contact Email:
 * License:
 *
 * NOTE: This file is auto generated by crdtotypes (https://github.com/yaacov/crdtoapi/).
 * https://github.com/yaacov/crdtoapi/README.crdtotypes
 */

import { ClusterComplianceReportSpec } from './ClusterComplianceReportSpec';
import { ClusterComplianceReportStatus } from './ClusterComplianceReportStatus';
import { ObjectMeta } from './ObjectMeta';

/**
 * ClusterComplianceReport is a specification for the ClusterComplianceReport resource.
 *
 * @export
 */
export interface ClusterComplianceReport {
  /** apiVersion
   * APIVersion defines the versioned schema of this representation of an object.
Servers should convert recognized schemas to the latest internal value, and
may reject unrecognized values.
More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
   *
   * @required {true}
   */
  apiVersion: string;
  /** kind
   * Kind is a string value representing the REST resource this object represents.
Servers may infer this from the endpoint the client submits requests to.
Cannot be updated.
In CamelCase.
More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
   *
   * @required {true}
   */
  kind: string;
  /** metadata
   *
   * @required {false}
   * @originalType {ClusterComplianceReportMetadata}
   */
  metadata: ObjectMeta;
  /** spec
   * ReportSpec represent the compliance specification
   *
   * @required {false}
   */
  spec?: ClusterComplianceReportSpec;
  /** status
   *
   * @required {false}
   */
  status?: ClusterComplianceReportStatus;
}
